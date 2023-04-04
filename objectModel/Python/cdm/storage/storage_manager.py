# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from collections import OrderedDict
import importlib
import json
import os
import sys
from typing import List, Optional, Set, TYPE_CHECKING

from cdm.storage import CdmStandardsAdapter, LocalAdapter, ResourceAdapter, StorageAdapterBase
from cdm.utilities import logger, StorageUtils
from cdm.enums import CdmLogCode

if TYPE_CHECKING:
    from cdm.objectmodel import CdmContainerDefinition, CdmCorpusDefinition, CdmFolderDefinition


class StorageManager:
    def __init__(self, corpus: 'CdmCorpusDefinition'):
        self._TAG = StorageManager.__name__

        # the default namespace to be used when not specified.
        self.default_namespace = None  # type: Optional[str]
        self.namespace_adapters = OrderedDict()  # type: Dict[str, StorageAdapterBase]

        # Internal

        self._corpus = corpus
        self._namespace_folders = OrderedDict()  # type: Dict[str, CdmFolderDefinition]
        self._registered_adapter_types = {
            'cdm-standards': 'CdmStandardsAdapter',
            'local': 'LocalAdapter',
            'adls': 'ADLSAdapter',
            'remote': 'RemoteAdapter',
            'github': 'GithubAdapter',
            'syms' : 'SymsAdapter'
        }

        # The namespaces that have default adapters defined by the program and not by a user.
        self._system_defined_namespaces = set()  # type: Set

        # set up default adapters.
        self.mount('local', LocalAdapter(root=os.getcwd()))
        self._system_defined_namespaces.add('local')

        if 'commondatamodel_objectmodel_cdmstandards' in sys.modules:
            self.mount('cdm', CdmStandardsAdapter())
            self._system_defined_namespaces.add('cdm')
        else:
            logger.error(self._ctx, self._TAG, 'StorageManager', None, CdmLogCode.ERR_STORAGE_CDM_STANDARDS_MISSING, 'commondatamodel_objectmodel_cdmstandards')

    @property
    def _ctx(self):
        return self._corpus.ctx

    @property
    def max_concurrent_reads(self) -> Optional[int]:
        """Maximum number of documents read concurrently when loading imports."""
        return self._corpus._document_library._concurrent_read_lock.permits

    @max_concurrent_reads.setter
    def max_concurrent_reads(self, max_concurrent_reads: Optional[int]) -> None:
        """Maximum number of documents read concurrently when loading imports."""
        self._corpus._document_library._concurrent_read_lock.permits = max_concurrent_reads

    def adapter_path_to_corpus_path(self, adapter_path: str) -> Optional[str]:
        """Takes a storage adapter domain path, figures out the right adapter to use
        and then return a corpus path"""
        with logger._enter_scope(self._TAG, self._ctx, self.adapter_path_to_corpus_path.__name__):
            result = None

            # Keep trying adapters until one of them likes what it sees
            if self.namespace_adapters:
                for key, value in self.namespace_adapters.items():
                    result = value.create_corpus_path(adapter_path)
                    if result is not None:
                        # Got one, add the prefix
                        if result == '':
                            result = '/'
                        result = '{}:{}'.format(key, result)
                        break

            if not result:
                logger.error(self._ctx, self._TAG, StorageManager.adapter_path_to_corpus_path.__name__, None, CdmLogCode.ERR_STORAGE_INVALID_ADAPTER_PATH, adapter_path)
            return result

    def corpus_path_to_adapter_path(self, corpus_path: str) -> Optional[str]:
        """Takes a corpus path, figures out the right adapter to use and then return
        an adapter domain path"""
        with logger._enter_scope(self._TAG, self._ctx, self.corpus_path_to_adapter_path.__name__):
            if not corpus_path:
                logger.error(self._ctx, self._TAG, StorageManager.corpus_path_to_adapter_path.__name__, None, CdmLogCode.ERR_STORAGE_NULL_CORPUS_PATH)
                return None

            result = None

            # Break the corpus path into namespace and ... path
            path_tuple = StorageUtils.split_namespace_path(corpus_path)
            if not path_tuple:
                logger.error(self._ctx, self._TAG, self.corpus_path_to_adapter_path.__name__, None, CdmLogCode.ERR_STORAGE_NULL_CORPUS_PATH)
                return None
            namespace = path_tuple[0] or self.default_namespace

            # Get the adapter registered for this namespace
            namespace_adapter = self.fetch_adapter(namespace)
            if not namespace_adapter:
                logger.error(self._ctx, self._TAG, StorageManager.corpus_path_to_adapter_path.__name__, None, CdmLogCode.ERR_STORAGE_NAMESPACE_NOT_REGISTERED, namespace)
            else:
                # Ask the storage adapter to 'adapt' this path
                result = namespace_adapter.create_adapter_path(path_tuple[1])

            return result

    def fetch_adapter(self, namespace: str) -> 'StorageAdapterBase':
        if not namespace:
            logger.error(self._ctx, self._TAG, StorageManager.fetch_adapter.__name__, None, CdmLogCode.ERR_STORAGE_NULL_NAMESPACE)
            return None

        if namespace in self.namespace_adapters:
            return self.namespace_adapters[namespace]

        logger.error(self._ctx, self._TAG, StorageManager.fetch_adapter.__name__, None, CdmLogCode.ERR_STORAGE_ADAPTER_NOT_FOUND, namespace)
        return None

    def fetch_root_folder(self, namespace: str) -> 'CdmFolderDefinition':
        """Given the namespace of a registered storage adapter, return the root
        folder containing the sub-folders and documents"""
        with logger._enter_scope(self._TAG, self._ctx, self.fetch_root_folder.__name__):
            if not namespace:
                logger.error(self._ctx, self._TAG, StorageManager.fetch_root_folder.__name__, None, CdmLogCode.ERR_STORAGE_NULL_NAMESPACE)
                return None

            if namespace in self._namespace_folders:
                return self._namespace_folders[namespace]
            elif self.default_namespace in self._namespace_folders:
                return self._namespace_folders[self.default_namespace]

            logger.error(self._ctx, self._TAG, StorageManager.fetch_root_folder.__name__, None, CdmLogCode.ERR_STORAGE_ADAPTER_NOT_FOUND, namespace)
            return None

    def fetch_config(self) -> str:
        """Generates the full adapters config."""
        adapters_array = []

        # Construct the JObject for each adapter.
        for namespace, adapter in self.namespace_adapters.items():
            # Skip system-defined adapters and resource adapters.
            if adapter._type == 'resource' or namespace in self._system_defined_namespaces:
                continue

            config = adapter.fetch_config()
            if not config:
                logger.error(self._ctx, self._TAG, StorageManager.fetch_config.__name__, None, CdmLogCode.ERR_STORAGE_NULL_ADAPTER)
                continue

            json_config = json.loads(config)
            json_config['namespace'] = namespace

            adapters_array.append(json_config)

        result_config = {}

        # App ID might not be set.
        if self._corpus.app_id:
            result_config['appId'] = self._corpus.app_id

        result_config['defaultNamespace'] = self.default_namespace
        result_config['adapters'] = adapters_array

        return json.dumps(result_config)

    async def save_adapters_config_async(self, name: str, adapter: 'StorageAdapter') -> None:
        """Saves adapters config into a file."""
        await adapter.write_async(name, self.fetch_config())

    def create_absolute_corpus_path(self, object_path: str, obj: 'CdmObject' = None) -> Optional[str]:
        """Takes a corpus path (relative or absolute) and creates a valid absolute
        path with namespace"""
        with logger._enter_scope(self._TAG, self._ctx, self.create_absolute_corpus_path.__name__):
            if not object_path:
                logger.error(self._ctx, self._TAG, StorageManager.create_absolute_corpus_path.__name__, None, CdmLogCode.ERR_PATH_NULL_OBJECT_PATH)
                return None

            if self._contains_unsupported_path_format(object_path):
                # Already called status_rpt when checking for unsupported path format.
                return None

            path_tuple = StorageUtils.split_namespace_path(object_path)
            if not path_tuple:
                logger.error(self._ctx, self._TAG, StorageManager.create_absolute_corpus_path.__name__, None, CdmLogCode.ERR_PATH_NULL_OBJECT_PATH)
                return None
            final_namespace = ''

            prefix = None
            namespace_from_obj = None

            if obj and hasattr(obj, 'namespace') and hasattr(obj, 'folder_path'):
                prefix = obj._folder_path
                namespace_from_obj = obj._namespace
            elif obj and obj.in_document:
                prefix = obj.in_document._folder_path
                namespace_from_obj = obj.in_document._namespace

            if prefix and self._contains_unsupported_path_format(prefix):
                # Already called status_rpt when checking for unsupported path format.
                return None

            if prefix and prefix[-1] != '/':
                logger.warning(self._ctx, self._TAG, StorageManager.create_absolute_corpus_path.__name__, None,
                               CdmLogCode.WARN_STORAGE_EXPECTED_PATH_PREFIX, prefix)
                prefix += '/'

            # check if this is a relative path
            if path_tuple[1][0] != '/':
                if not obj:
                    # relative path and no other info given, assume default and root
                    prefix = '/'

                if path_tuple[0] and path_tuple[0] != namespace_from_obj:
                    logger.error(self._ctx, self._TAG, StorageManager.create_absolute_corpus_path.__name__, None,
                                 CdmLogCode.ERR_STORAGE_NAMESPACE_MISMATCH, path_tuple[0])
                    return None

                path_tuple = (path_tuple[0], prefix + path_tuple[1])
                final_namespace = namespace_from_obj or path_tuple[0] or self.default_namespace
            else:
                final_namespace = path_tuple[0] or namespace_from_obj or self.default_namespace

            return '{}:{}'.format(final_namespace, path_tuple[1]) if final_namespace else path_tuple[1]

    def create_relative_corpus_path(self, object_path: str, relative_to: Optional['CdmContainerDefinition'] = None):
        """Takes a corpus path (relative or absolute) and creates a valid relative corpus path with namespace.
            object_path: The path that should be made relative, if possible
            relative_to: The object that the path should be made relative with respect to."""
        with logger._enter_scope(self._TAG, self._ctx, self.create_relative_corpus_path.__name__):
            new_path = self.create_absolute_corpus_path(object_path, relative_to)

            namespace_string = relative_to._namespace + ':' if relative_to and relative_to._namespace else ''
            if namespace_string and new_path.startswith(namespace_string):
                new_path = new_path[len(namespace_string):]

                if relative_to and relative_to._folder_path and new_path.startswith(relative_to._folder_path):
                    new_path = new_path[len(relative_to._folder_path):]
            return new_path

    def mount(self, namespace: str, adapter: 'StorageAdapterBase') -> None:
        """registers a namespace and assigns creates a storage adapter for that namespace"""
        with logger._enter_scope(self._TAG, self._ctx, self.mount.__name__):
            if not namespace:
                logger.error(self._ctx, self._TAG, StorageManager.mount.__name__, None, CdmLogCode.ERR_STORAGE_NULL_NAMESPACE)
                return None

            from cdm.objectmodel import CdmFolderDefinition

            if adapter:
                adapter.ctx = self._ctx
                self.namespace_adapters[namespace] = adapter
                fd = CdmFolderDefinition(self._ctx, '')
                fd._corpus = self._corpus
                fd._namespace = namespace
                fd._folder_path = '/'
                self._namespace_folders[namespace] = fd
                if namespace in self._system_defined_namespaces:
                    self._system_defined_namespaces.remove(namespace)
            else:
                logger.error(self._ctx, self._TAG, StorageManager.mount.__name__, None, CdmLogCode.ERR_STORAGE_NULL_ADAPTER)

    def mount_from_config(self, adapter_config: str, does_return_error_list: bool = False) -> List['StorageAdapter']:
        if not adapter_config:
            logger.error(self._ctx, self._TAG, StorageManager.mount_from_config.__name__, None, CdmLogCode.ERR_STORAGE_NULL_ADAPTER_CONFIG)
            return None

        adapter_config_json = json.loads(adapter_config)
        adapers_module = importlib.import_module('cdm.storage')

        if adapter_config_json.get('appId'):
            self._corpus.app_id = adapter_config_json['appId']

        if adapter_config_json.get('defaultNamespace'):
            self.default_namespace = adapter_config_json['defaultNamespace']

        unrecognized_adapters = []

        for item in adapter_config_json['adapters']:
            namespace = None
            # Check whether the namespace exists.
            if item.get('namespace'):
                namespace = item['namespace']
            else:
                logger.error(self._ctx, self._TAG, StorageManager.mount_from_config.__name__, None, CdmLogCode.ERR_STORAGE_MISSING_NAMESPACE)
                continue

            configs = None
            # Check whether the config exists.
            if item.get('config'):
                configs = item['config']
            else:
                logger.error(self._ctx, self._TAG, StorageManager.mount_from_config.__name__, None, CdmLogCode.ERR_STORAGE_MISSING_JSON_CONFIG, namespace)
                continue

            if not item.get('type'):
                logger.error(self._ctx, self._TAG, StorageManager.mount_from_config.__name__, None, CdmLogCode.ERR_STORAGE_MISSING_TYPE_JSON_CONFIG, namespace)
                continue

            adapter_type = self._registered_adapter_types.get(item['type'], None)

            if adapter_type is None:
                unrecognized_adapters.append(json.dumps(item))
            else:
                adapter = getattr(adapers_module, adapter_type)()
                adapter.update_config(json.dumps(configs))
                self.mount(namespace, adapter)

        return unrecognized_adapters if does_return_error_list else None

    def unmount(self, namespace: str) -> None:
        """unregisters a storage adapter and its root folder"""
        with logger._enter_scope(self._TAG, self._ctx, self.unmount.__name__):
            if not namespace:
                logger.error(self._ctx, self._TAG, StorageManager.unmount.__name__, None, CdmLogCode.ERR_STORAGE_NULL_NAMESPACE)
                return None

            if namespace in self.namespace_adapters:
                self.namespace_adapters.pop(namespace, None)
                self._namespace_folders.pop(namespace, None)
                if namespace in self._system_defined_namespaces:
                    self._system_defined_namespaces.remove(namespace)

                # The special case, use Resource adapter.
                if namespace == 'cdm':
                    self.mount(namespace, ResourceAdapter())
                    logger.warning(self._ctx, self._TAG, StorageManager.unmount.__name__, None, CdmLogCode.WARN_UN_MOUNT_CDM_NAMESPACE)
            else:
                logger.warning(self._ctx, self._TAG, StorageManager.unmount.__name__, None, CdmLogCode.WARN_STORAGE_REMOVE_ADAPTER_FAILED)

    def _contains_unsupported_path_format(self, path: str) -> bool:
        """Checks whether the paths has an unsupported format, such as starting with ./ or containing ../ or /./
        In case unsupported path format is found, function calls status_rpt and returns True.
        Returns False if path seems OK.
        """
        if path.startswith('./') or path.startswith('.\\') or '../' in path or '..\\' in path or '/./' in path or '\\.\\' in path:
            logger.error(self._ctx, self._TAG, '_contains_unsupported_path_format', None, CdmLogCode.ERR_STORAGE_INVALID_PATH_FORMAT)
            return True
        else:
            return False

    def _set_adapter(self, namespace: str, adapter: 'StorageAdapterBase') -> None:
        if adapter:
            self.namespace_adapters[namespace] = adapter
