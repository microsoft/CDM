import importlib
from collections import OrderedDict
from typing import Any, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition
from cdm.utilities import AttributeResolutionDirectiveSet, CdmError, logger, ResolveOptions

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmObject
    from cdm.utilities import CopyOptions, JObject


CDM_FOLDER = 'CdmFolder'
MODEL_JSON = 'ModelJson'
ODI = 'Odi'


class PersistenceLayer:
    _CDM_EXTENSION = CdmCorpusDefinition._CDM_EXTENSION
    _FOLIO_EXTENSION = '.folio.' + CdmCorpusDefinition._CDM_EXTENSION
    _MANIFEST_EXTENSION = '.manifest.' + CdmCorpusDefinition._CDM_EXTENSION
    _MODEL_JSON_EXTENSION = 'model.json'
    _ODI_EXTENSION = 'odi.json'

    def __init__(self, corpus: 'CdmCorpusDefinition'):
        self._corpus = corpus

        self._registered_persistence_formats = OrderedDict()  # type: Dictionary[str, object]
        self._is_registered_persistence_async = OrderedDict()  # type: Dictionary[object, bool]

        # Register known persistence classes.
        self.register_format('cdm.persistence.cdmfolder.ManifestPersistence')
        self.register_format('cdm.persistence.modeljson.ManifestPersistence')
        self.register_format('cdm.persistence.cdmfolder.DocumentPersistence')

        # TODO: re-add with ODI
        # self.register_format('cdm.persistence.odi.ManifestPersistence')

        self._TAG = PersistenceLayer.__name__

    @property
    def _ctx(self) -> 'CdmCorpusContext':
        return self._corpus.ctx

    @classmethod
    def from_data(cls, *args) -> 'CdmObject':
        """
        * @param args arguments passed to the persistence class.
        * @param objectType any of cdmObjectType.
        * @param persistence_type a type supported by the persistence layer. Can by any of PersistenceTypes.
        """
        arglist = list(args)
        persistence_type = arglist.pop()
        object_type = arglist.pop()
        return cls.fetch_persistence_class(object_type, persistence_type).from_data(arglist)

    @classmethod
    def to_data(cls, instance: 'CdmObject', res_opt: 'ResolveOptions', persistence_type: str, copy_options: 'CopyOptions') -> 'JObject':
        """
        * @param instance the instance that is going to be serialized.
        * @param res_opt Rnformation about how to resolve the instance.
        * @param persistence_type a type supported by the persistence layer. Can by any of PersistenceTypes.
        * @param copy_options set of options to specify how the output format.
        """
        return cls.fetch_persistence_class(instance.object_type, persistence_type).to_data(instance, res_opt, copy_options)

    async def _load_document_from_path_async(self, folder: 'CdmFolderDefinition', doc_name: str, doc_container: 'CdmDocumentDefinition') \
            -> 'CdmDocumentDefinition':
        #  go get the doc
        doc_content = None  # type: Optional[CdmDocumentDefinition]
        json_data = None
        fs_modified_time = None
        doc_path = folder.folder_path + doc_name
        adapter = self._ctx.corpus.storage.fetch_adapter(folder.namespace)  # type: StorageAdapter

        try:
            if adapter.can_read():
                json_data = await adapter.read_async(doc_path)
                fs_modified_time = await adapter.compute_last_modified_time_async(adapter.create_adapter_path(doc_path))
                logger.info(self._TAG, self._ctx, 'read file: {}'.format(doc_path), self._load_document_from_path_async.__name__)
        except Exception as e:
            logger.error(self._TAG, self._ctx, 'could not read {} from the \'{}\' namespace.\n Reason: \n{}'.format(
                doc_path, folder.namespace, e), self._load_document_from_path_async.__name__)
            return None

        if not doc_name:
            logger.error(self._TAG, self._ctx, 'Document name cannot be null or empty.', self._load_document_from_path_async.__name__)
            return None

        # If loading an odi.json/model.json file, check that it is named correctly.
        if doc_name.lower().endswith(self._ODI_EXTENSION) and not doc_name.lower() == self._ODI_EXTENSION:
            logger.error(self._TAG, self._ctx, 'Failed to load \'{}\', as it\'s not an acceptable file name. It must be {}.'.format(
                doc_name, self._ODI_EXTENSION), self._load_document_from_path_async.__name__)
            return None

        if doc_name.lower().endswith(self._MODEL_JSON_EXTENSION) and not doc_name.lower() == self._MODEL_JSON_EXTENSION:
            logger.error(self._TAG, self._ctx, 'Failed to load \'{}\', as it\'s not an acceptable file name. It must be {}.'.format(
                doc_name, self._MODEL_JSON_EXTENSION), self._load_document_from_path_async.__name__)
            return None

        # Fetch the correct persistence class to use.
        persistence_class = self._fetch_registered_persistence_format(doc_name)
        if persistence_class:
            try:
                method = persistence_class.from_data
                parameters = [self._ctx, doc_name, json_data, folder]

                # check if from_data() is asynchronous for this persistence class.
                if persistence_class not in self._is_registered_persistence_async:
                    # Cache whether this persistence class has async methods.
                    self._is_registered_persistence_async[persistence_class] = persistence_class.is_persistence_async

                if self._is_registered_persistence_async[persistence_class]:
                    doc_content = await method(*parameters)
                else:
                    doc_content = method(*parameters)
            except Exception as e:
                logger.error(self._TAG, self._ctx, 'Could not convert \'{}\'. Reason \'{}\''.format(doc_name, e), self._load_document_from_path_async.__name__)
                return None
        else:
            # could not find a registered persistence class to handle this document type.
            logger.error(self._TAG, self._ctx, 'Could not find a persistence class to handle the file \'{}\''.format(
                doc_name), self._load_document_from_path_async.__name__)
            return None

        # add document to the folder, this sets all the folder/path things, caches name to content association and may trigger indexing on content
        if doc_content is not None:
            if doc_container:
                # there are situations where a previously loaded document must be re-loaded.
                # the end of that chain of work is here where the old version of the document has been removed from
                # the corpus and we have created a new document and loaded it from storage and after this call we will probably
                # add it to the corpus and index it, etc.
                # it would be really rude to just kill that old object and replace it with this replicant, especially because
                # the caller has no idea this happened. so... sigh ... instead of returning the new object return the one that
                # was just killed off but make it contain everything the new document loaded.
                doc_content = doc_content.copy(ResolveOptions(wrt_doc=doc_container), doc_container)

            folder.documents.append(doc_content, doc_name)
            doc_content._file_system_modified_time = fs_modified_time
            doc_content._is_dirty = False

        return doc_content

    @classmethod
    def fetch_persistence_class(cls, object_type: CdmObjectType, persistence_type: str) -> 'object':
        object_name = object_type.name.lower()  # CdmObjectType[object_type]

        if object_name.endswith('def'):
            object_name = object_name[0:-4]
        elif object_name.endswith('ref'):
            object_name += 'erence'

        persistence_module_name = '{}_persistence'.format(object_name)
        persistence_class_name = ''.join([x.title() for x in persistence_module_name.split('_')])
        persistence_module = importlib.import_module('cdm.persistence.{}.{}'.format(persistence_type.lower(), persistence_module_name))
        PersistenceClass = getattr(persistence_module, persistence_class_name, None)

        if not PersistenceClass:
            raise CdmError('Persistence class for {} is not implemented in type {}.'.format(persistence_class_name, persistence_type))

        instance = PersistenceClass()
        return instance

    def _fetch_registered_persistence_format(self, doc_name: str) -> 'object':
        for registered_persistence_format in self._registered_persistence_formats:
            # find the persistence class to use for this document.
            if doc_name.lower().endswith(registered_persistence_format):
                return self._registered_persistence_formats[registered_persistence_format]
        return None

    async def _save_document_as_async(self, doc: 'CdmDocumentDefinition', options: 'CopyOptions', new_name: str, save_referenced: bool) -> bool:
        """a manifest or document can be saved with a new or exisitng name. This function on the corpus does all the actual work
        because the corpus knows about persistence types and about the storage adapters
        if saved with the same name, then consider this document 'clean' from changes. if saved with a back compat model or
        to a different name, then the source object is still 'dirty'
        an option will cause us to also save any linked documents."""

        # find out if the storage adapter is able to write.
        namespace = doc.namespace
        if namespace is None:
            namespace = self._corpus.storage.default_namespace

        adapter = self._corpus.storage.fetch_adapter(namespace)
        if adapter is None:
            logger.error(self._TAG, self._ctx, 'Couldn\'t find a storage adapter registered for the namespace \'{}\''.format(
                namespace), self._save_document_as_async.__name__)
            return False
        if not adapter.can_write():
            logger.error(self._TAG, self._ctx, 'The storage adapter \'{}\' claims it is unable to write files.'.format(
                namespace), self._save_document_as_async.__name__)
            return False

        if not new_name:
            logger.error(self._TAG, self._ctx, 'Document name cannot be null or empty.', self._save_document_as_async.__name__)
            return None

        # what kind of document is requested?
        # check file extensions using a case-insensitive ordinal string comparison.
        persistence_type = MODEL_JSON if new_name.lower().endswith(self._MODEL_JSON_EXTENSION) else \
            (ODI if new_name.lower().endswith(self._ODI_EXTENSION) else CDM_FOLDER)

        if persistence_type == ODI and new_name.lower() != self._ODI_EXTENSION:
            logger.error(self._TAG, self._ctx, 'Failed to persist \'{}\', as it\'s not an acceptable filename. It must be {}'.format(
                new_name, self._ODI_EXTENSION), self._save_document_as_async.__name__)
            return False

        if persistence_type == MODEL_JSON and new_name.lower() != self._MODEL_JSON_EXTENSION:
            logger.error(self._TAG, self._ctx, 'Failed to persist \'{}\', as it\'s not an acceptable filename. It must be {}'.format(
                new_name, self._MODEL_JSON_EXTENSION), self._save_document_as_async.__name__)
            return False

        # save the object into a json blob
        res_opt = {'wrt_doc': doc, 'directives': AttributeResolutionDirectiveSet()}
        persisted_doc = None

        persistence_class = self._fetch_registered_persistence_format(new_name)

        if persistence_class:
            try:
                method = persistence_class.to_data
                parameters = [doc, res_opt, options]

                # Check if to_data() is asynchronous for this persistence class.
                if not persistence_class in self._is_registered_persistence_async:
                    # Cache whether this persistence class has async methods.
                    self._is_registered_persistence_async[persistence_class] = persistence_class.is_persistence_async

                if self._is_registered_persistence_async[persistence_class]:
                    # We don't know what the return type of ToData() is going to be and Task<T> is not covariant,
                    # so we can't use Task<dynamic> here. Instead, we just await on a Task object without a return value
                    # and fetch the Result property from it, which will have the result of ToData().
                    persisted_doc = await method(*parameters)
                else:
                    persisted_doc = method(*parameters)
            except Exception as e:
                logger.error(self._TAG, self._ctx, 'Could not persist file \'{}\'. Reason \'{}\'.'.format(new_name, e), self._save_document_as_async.__name__)
                return False
        else:
            # Could not find a registered persistence class to handle this document type.
            logger.error(self._TAG, self._ctx, 'Could not find a persistence class to handle the file \'{}\'.'.format(
                new_name), self._save_document_as_async.__name__)
            return False
        if not persisted_doc:
            logger.error(self._TAG, self._ctx, 'Failed to persist \'{}\''.format(new_name), self._save_document_as_async.__name__)
            return False

        if persistence_type == ODI:
            await self._save_odi_documents(persisted_doc, adapter, new_name)
            return True

        # turn the name into a path
        new_path = '{}{}'.format(doc.folder_path, new_name)
        new_path = self._ctx.corpus.storage.create_absolute_corpus_path(new_path, doc)
        if new_path.startswith(namespace + ':'):
            new_path = new_path[len(namespace)+1:]

        # ask the adapter to make it happen
        try:
            content = persisted_doc.encode()
            await adapter.write_async(new_path, content)

            # Write the adapter's config.
            if options.is_top_level_document:
                await self._corpus.storage.save_adapters_config_async('/config.json', adapter)

                # The next document won't be top level, so reset the flag.
                options.is_top_level_document = False
        except Exception as e:
            logger.error(self._TAG, self._ctx, 'Failed to write to the file \'{}\' for reason \'{}\''.format(new_name, e),
                         self._save_document_as_async.__name__)
            return False

        # if we also want to save referenced docs, then it depends on what kind of thing just got saved
        # if a model.json there are none. If a manifest or definition doc then ask the docs to do the right things
        # definition will save imports, manifests will save imports, schemas, sub manifests
        if save_referenced and persistence_type == CDM_FOLDER:
            saved_linked_docs = await doc._save_linked_documents_async(options)
            if not saved_linked_docs:
                logger.error(self._TAG, self._ctx, 'Failed to save linked documents for file \'{}\''.format(new_name), self._save_document_as_async.__name__)
                return False
        return True

    def register_format(self, persistence_class_name: str, assembly_name: Optional[str] = None) -> None:
        try:
            path_split = persistence_class_name.split('.')
            class_path = '.'.join(path_split[:-1])
            class_name = path_split[-1]
            persistence_module = importlib.import_module(class_path)

            persistence_class = getattr(persistence_module, class_name)
            formats = persistence_class.formats  # type: List[str]

            for form in formats:
                self._registered_persistence_formats[form] = persistence_class

        except Exception as e:
            logger.info(self._TAG, self._ctx, 'Unable to register persistence class {}. Reason: {}.'.format(persistence_class_name, e))

    async def _save_odi_documents(self, doc: Any, adapter: 'StorageAdapter', new_name: str) -> None:
        if doc is None:
            raise Exception('Failed to persist document because doc is null.')

        # ask the adapter to make it happen.
        try:
            old_document_path = doc.documentPath
            new_document_path = old_document_path[0: len(old_document_path) - len(self._ODI_EXTENSION)] + new_name
            content = doc.encode()
            await adapter.write_async(new_document_path, content)
        except Exception as e:
            logger.error(self._TAG, self._ctx, 'Failed to write to the file \'{}\' for reason {}.'.format(
                doc.documentPath, e), self._save_odi_documents.__name__)

        # Save linked documents.
        if doc.get('linkedDocuments') is not None:
            for linked_doc in doc.linkedDocuments:
                await self._save_odi_documents(linked_doc, adapter, new_name)
