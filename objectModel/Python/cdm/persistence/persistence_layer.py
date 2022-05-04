# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import importlib
import json
from collections import OrderedDict
from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import AttributeResolutionDirectiveSet, CdmError, logger, ResolveOptions, StorageUtils
from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmObject
    from cdm.utilities import CopyOptions, JObject


class PersistenceLayer:
    CDM_EXTENSION = '.cdm.json'
    FOLIO_EXTENSION = '.folio.cdm.json'
    MANIFEST_EXTENSION = '.manifest.cdm.json'
    MODEL_JSON_EXTENSION = 'model.json'
    CDM_FOLDER = 'CdmFolder'
    MODEL_JSON = 'ModelJson'
    SYMS = 'Syms'
    SYMS_DATABASES = 'databases.manifest.cdm.json'

    def __init__(self, corpus: 'CdmCorpusDefinition'):
        self._TAG = PersistenceLayer.__name__

        self._corpus = corpus

        self._registered_persistence_formats = OrderedDict()  # type: Dictionary[str, object]
        self._is_registered_persistence_async = OrderedDict()  # type: Dictionary[object, bool]

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
        return cls.fetch_persistence_class(object_type, persistence_type).from_data(*arglist)

    @classmethod
    def to_data(cls, instance: 'CdmObject', res_opt: 'ResolveOptions', copy_options: 'CopyOptions',
                persistence_type: str) -> 'JObject':
        """
        * @param instance the instance that is going to be serialized.
        * @param res_opt information about how to resolve the instance.
        * @param copy_options set of options to specify how the output format.
        * @param persistence_type a type supported by the persistence layer. Can by any of PersistenceTypes.
        """
        return cls.fetch_persistence_class(instance.object_type, persistence_type).to_data(instance, res_opt,
                                                                                           copy_options)

    async def _load_document_from_path_async(self, folder: 'CdmFolderDefinition', doc_name: str,
                                             doc_container: 'CdmDocumentDefinition',
                                             res_opt: Optional[ResolveOptions] = None) \
            -> 'CdmDocumentDefinition':
        #  go get the doc
        doc_content = None  # type: Optional[CdmDocumentDefinition]
        json_data = None
        fs_modified_time = None
        doc_path = folder._folder_path + doc_name
        adapter = self._ctx.corpus.storage.fetch_adapter(folder._namespace)  # type: StorageAdapter

        try:
            if adapter.can_read():
                # log message used by navigator, do not change or remove
                logger.debug(self._ctx, self._TAG, self._load_document_from_path_async.__name__, doc_path,
                             'request file: {}'.format(doc_path))
                json_data = await adapter.read_async(doc_path)
                if StringUtils.is_blank_by_cdm_standard(json_data):
                    error_msg = "Json Data is null or empty."
                    logger.error(self._ctx, self._TAG, self._load_document_from_path_async.__name__, doc_path,
                             CdmLogCode.ERR_PERSIST_FILE_READ_FAILURE, doc_path, folder._namespace, error_msg)
                    return None
                # log message used by navigator, do not change or remove
                logger.debug(self._ctx, self._TAG, self._load_document_from_path_async.__name__, doc_path,
                             'received file: {}'.format(doc_path))
            else:
                raise Exception('Storage Adapter is not enabled to read.')
        except Exception as e:
            # log message used by navigator, do not change or remove
            logger.debug(self._ctx, self._TAG, self._load_document_from_path_async.__name__, doc_path,
                         'fail file: {}'.format(doc_path))

            # when shallow validation is enabled, log messages about being unable to find referenced documents as warnings instead of errors.
            if res_opt and res_opt.shallow_validation:
                logger.warning(self._ctx, self._TAG, PersistenceLayer._load_document_from_path_async.__name__, doc_path,
                               CdmLogCode.WARN_PERSIST_FILE_READ_FAILURE, doc_path, folder._namespace, e)
            else:
                logger.error(self._ctx, self._TAG, self._load_document_from_path_async.__name__, doc_path,
                             CdmLogCode.ERR_PERSIST_FILE_READ_FAILURE, doc_path, folder._namespace, e)
            return None

        try:
            fs_modified_time = await adapter.compute_last_modified_time_async(doc_path)
        except Exception as e:
            logger.warning(self._ctx, self._TAG, PersistenceLayer._load_document_from_path_async.__name__, doc_path,
                           CdmLogCode.WARN_PERSIST_FILE_MOD_COMPUTE_FAILED, e.Message)

        if StringUtils.is_blank_by_cdm_standard(doc_name):
            logger.error(self._ctx, self._TAG, self._load_document_from_path_async.__name__, doc_path,
                         CdmLogCode.ERR_PERSIST_NULL_DOC_NAME)
            return None

        doc_name_lower = doc_name.lower()

        # If loading an model.json file, check that it is named correctly.
        if doc_name_lower.endswith(self.MODEL_JSON_EXTENSION) and not doc_name.lower() == self.MODEL_JSON_EXTENSION:
            logger.error(self._ctx, self._TAG, self._load_document_from_path_async.__name__, doc_path,
                         CdmLogCode.ERR_PERSIST_DOC_NAME_LOAD_FAILURE, doc_name, self.MODEL_JSON_EXTENSION)
            return None

        try:
            from cdm.persistence.syms import utils
            if utils.check_if_syms_adapter(adapter):
                from cdm.persistence.syms import ManifestDatabasesPersistence
                from cdm.persistence.syms.types import SymsDatabasesResponse
                if doc_name_lower == self.SYMS_DATABASES:
                    from cdm.persistence.syms.models.query_artifacts_response import QueryArtifactsResponse
                    databases = QueryArtifactsResponse()
                    databases = databases.deserialize(json.loads(json_data))

                    doc_content = ManifestDatabasesPersistence.from_object(self._ctx, doc_name, folder._namespace,
                                                                  folder._folder_path,
                                                                  databases)
                elif self.MANIFEST_EXTENSION in doc_name_lower:
                    from cdm.persistence.syms import ManifestPersistence
                    manifest_content = await utils.get_syms_model(adapter, json_data, doc_path)
                    doc_content = ManifestPersistence.from_object(self._ctx, doc_name, folder._namespace,
                                                                           folder._folder_path,
                                                                           manifest_content)
                elif self.CDM_EXTENSION in doc_name_lower:
                    from cdm.persistence.syms.models import TableEntity
                    from cdm.persistence.syms import DocumentPersistence
                    table = TableEntity(None, None).deserialize(json.loads(json_data))
                    doc_content = DocumentPersistence.from_object(self._ctx, doc_name, folder._namespace,
                                                                           folder._folder_path,
                                                                           table)

            elif doc_name_lower.endswith(PersistenceLayer.MANIFEST_EXTENSION) or doc_name_lower.endswith(
                    PersistenceLayer.FOLIO_EXTENSION):
                from cdm.persistence.cdmfolder import ManifestPersistence
                from cdm.persistence.cdmfolder.types import ManifestContent
                manifest = ManifestContent()
                manifest.decode(json_data)
                doc_content = ManifestPersistence.from_object(self._ctx, doc_name, folder._namespace, folder._folder_path,
                                                              manifest)
            elif doc_name_lower.endswith(PersistenceLayer.MODEL_JSON_EXTENSION):
                from cdm.persistence.modeljson import ManifestPersistence
                from cdm.persistence.modeljson.types import Model
                model = Model()
                model.decode(json_data)
                doc_content = await ManifestPersistence.from_object(self._ctx, model, folder)
            elif doc_name_lower.endswith(PersistenceLayer.CDM_EXTENSION):
                from cdm.persistence.cdmfolder import DocumentPersistence
                from cdm.persistence.cdmfolder.types import DocumentContent
                document = DocumentContent()
                document.decode(json_data)
                doc_content = DocumentPersistence.from_object(self._ctx, doc_name, folder._namespace, folder._folder_path,
                                                              document)
            else:
                # Could not find a registered persistence class to handle this document type.
                logger.error(self._ctx, self._TAG, self._load_document_from_path_async.__name__, doc_path,
                             CdmLogCode.ERR_PERSIST_CLASS_MISSING, doc_name)
                return None
        except Exception as e:
            error_msg = str(e)
            if e.__context__ is not None:
                error_msg += ' Implicitly chained exception: '.format(str(e.__context__))
            if e.__cause__ is not None:
                error_msg += ' Explicitly chained exception: '.format(str(e.__cause__))

            logger.error(self._ctx, self._TAG, self._load_document_from_path_async.__name__, doc_path,
                         CdmLogCode.ERR_PERSIST_DOC_CONVERSION_FAILURE, doc_path, error_msg)
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
                doc_content = doc_content.copy(
                    ResolveOptions(wrt_doc=doc_container, directives=self._ctx.corpus.default_resolution_directives),
                    doc_container)

            exist_id_list = [x for x in folder.documents if x.id == doc_content.id]
            if not exist_id_list:
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

        if persistence_class_name == 'ProjectionPersistence':
            # Projection persistence class is in a nested folder
            persistence_module = importlib.import_module(
                'cdm.persistence.{}.projections.{}'.format(persistence_type.lower(), persistence_module_name))
        else:
            persistence_module = importlib.import_module(
                'cdm.persistence.{}.{}'.format(persistence_type.lower(), persistence_module_name))
        PersistenceClass = getattr(persistence_module, persistence_class_name, None)

        if not PersistenceClass:
            raise CdmError('Persistence class for {} is not implemented in type {}.'.format(persistence_class_name,
                                                                                            persistence_type))

        instance = PersistenceClass()
        return instance

    def _fetch_registered_persistence_format(self, doc_name: str) -> 'object':
        for registered_persistence_format in self._registered_persistence_formats:
            # find the persistence class to use for this document.
            if doc_name.lower().endswith(registered_persistence_format):
                return self._registered_persistence_formats[registered_persistence_format]
        return None

    async def _save_document_as_async(self, doc: 'CdmDocumentDefinition', options: 'CopyOptions', new_name: str,
                                      save_referenced: bool) -> bool:
        """a manifest or document can be saved with a new or exisitng name. This function on the corpus does all the actual work
        because the corpus knows about persistence types and about the storage adapters
        if saved with the same name, then consider this document 'clean' from changes. if saved with a back compat model or
        to a different name, then the source object is still 'dirty'
        an option will cause us to also save any linked documents."""

        # find out if the storage adapter is able to write.
        namespace = StorageUtils.split_namespace_path(new_name)[0]
        if StringUtils.is_blank_by_cdm_standard(namespace):
            namespace = doc._namespace
            if not namespace:
                namespace = self._corpus.storage.default_namespace

        adapter = self._corpus.storage.fetch_adapter(namespace)
        if adapter is None:
            logger.error(self._ctx, self._TAG, self._save_document_as_async.__name__, doc.at_corpus_path,
                         CdmLogCode.ERR_PERSIST_ADAPTER_NOT_FOUND_FOR_NAMESPACE, namespace)
            return False
        if not adapter.can_write():
            logger.error(self._ctx, self._TAG, self._save_document_as_async.__name__, doc.at_corpus_path,
                         CdmLogCode.ERR_PERSIST_ADAPTER_WRITE_FAILURE, namespace)
            return False

        if StringUtils.is_blank_by_cdm_standard(new_name):
            logger.error(self._ctx, self._TAG, self._save_document_as_async.__name__, doc.at_corpus_path,
                         CdmLogCode.ERR_PERSIST_NULL_DOC_NAME)
            return None

        # what kind of document is requested?
        persistence_type = ''
        from cdm.persistence.syms import utils
        if utils.check_if_syms_adapter(adapter):
            if new_name == self.SYMS_DATABASES:
                logger.error(self._ctx, self._TAG, self._save_document_as_async.__name__, doc.at_corpus_path,
                             CdmLogCode.ERR_PERSIST_SYMS_UNSUPPORTED_MANIFEST, new_name)
                return False
            elif not new_name.lower().endswith(self.MANIFEST_EXTENSION) and new_name.lower().endswith(self.CDM_EXTENSION):
                logger.error(self._ctx, self._TAG, self._save_document_as_async.__name__, doc.at_corpus_path,
                             CdmLogCode.ERR_PERSIST_SYMS_UNSUPPORTED_CDM_CONVERSION, new_name)
                return False
            persistence_type = self.SYMS
        else:
            if new_name.lower().endswith(self.MODEL_JSON_EXTENSION):
                persistence_type = self.MODEL_JSON
            else:
                persistence_type = self.CDM_FOLDER

        if persistence_type == self.MODEL_JSON and new_name.lower() != self.MODEL_JSON_EXTENSION:
            logger.error(self._ctx, self._TAG, self._save_document_as_async.__name__, doc.at_corpus_path, CdmLogCode.ERR_PERSIST_FAILURE,
                         new_name, self.MODEL_JSON_EXTENSION)
            return False

        # save the object into a json blob
        res_opt = {'wrt_doc': doc, 'directives': AttributeResolutionDirectiveSet()}
        persisted_doc = None

        try:
            if new_name.lower().endswith(PersistenceLayer.MODEL_JSON_EXTENSION) or new_name.lower().endswith(
                    PersistenceLayer.MANIFEST_EXTENSION) or new_name.lower().endswith(PersistenceLayer.FOLIO_EXTENSION):
                if persistence_type == self.CDM_FOLDER:
                    from cdm.persistence.cdmfolder import ManifestPersistence
                    persisted_doc = ManifestPersistence.to_data(doc, res_opt, options)
                elif persistence_type == self.SYMS:
                    from cdm.persistence.syms.manifest_persistence import ManifestPersistence
                    persisted_doc = await ManifestPersistence.convert_manifest_to_syms(doc, adapter, new_name, res_opt, options)
                else:
                    if new_name != self.MODEL_JSON_EXTENSION:
                        logger.error(self._ctx, self._TAG, self._save_document_as_async.__name__, doc.at_corpus_path,
                                     CdmLogCode.ERR_PERSIST_FAILURE, new_name)
                        return False
                    from cdm.persistence.modeljson import ManifestPersistence
                    persisted_doc = await ManifestPersistence.to_data(doc, res_opt, options)
            elif new_name.lower().endswith(PersistenceLayer.CDM_EXTENSION):
                if persistence_type == self.CDM_FOLDER:
                    from cdm.persistence.cdmfolder import DocumentPersistence
                    persisted_doc = DocumentPersistence.to_data(doc, res_opt, options)
                elif persistence_type == self.SYMS:
                    from cdm.persistence.syms.document_persistence import DocumentPersistence
                    persisted_doc = await DocumentPersistence.convert_doc_to_syms_table(self._ctx, doc, adapter, new_name, res_opt, options)
            else:
                # Could not find a registered persistence class to handle this document type.
                logger.error(self._ctx, self._TAG, self._save_document_as_async.__name__, doc.at_corpus_path,
                             CdmLogCode.ERR_PERSIST_CLASS_MISSING, new_name)
                return False
        except Exception as e:
            logger.error(self._ctx, self._TAG, self._save_document_as_async.__name__, doc.at_corpus_path,
                         CdmLogCode.ERR_PERSIST_FILE_PERSIST_ERROR, new_name, e)
            return False

        if not persisted_doc:
            logger.error(self._ctx, self._TAG, self._save_document_as_async.__name__, doc.at_corpus_path,
                         CdmLogCode.ERR_PERSIST_FILE_PERSIST_FAILED, new_name)
            return False

        # turn the name into a path
        new_path = '{}{}'.format(doc._folder_path, new_name)
        new_path = self._ctx.corpus.storage.create_absolute_corpus_path(new_path, doc)
        if new_path.startswith(namespace + ':'):
            new_path = new_path[len(namespace) + 1:]

        # ask the adapter to make it happen
        try:
            if persistence_type == self.SYMS:
                from cdm.persistence.syms import utils
                if new_name.lower().endswith(self.MANIFEST_EXTENSION):
                    await utils.create_or_update_syms_entities(persisted_doc, adapter)
                elif new_name.lower().endswith(self.CDM_EXTENSION):
                    await utils.create_or_update_table_entity(persisted_doc, adapter)
            else:
                content = persisted_doc.encode()
                await adapter.write_async(new_path, content)

            doc._file_system_modified_time = await adapter.compute_last_modified_time_async(new_path)

            # Write the adapter's config.
            if options.save_config_file is not False and options._is_top_level_document and persistence_type != self.SYMS:
                await self._corpus.storage.save_adapters_config_async('/config.json', adapter)

                # The next document won't be top level, so reset the flag.
                options._is_top_level_document = False
        except Exception as e:
            logger.error(self._ctx, self._TAG, self._save_document_as_async.__name__, doc.at_corpus_path,
                         CdmLogCode.ERR_PERSIST_FILE_WRITE_FAILURE, new_name, e)
            return False

        # if we also want to save referenced docs, then it depends on what kind of thing just got saved
        # if a model.json there are none. If a manifest or definition doc then ask the docs to do the right things
        # definition will save imports, manifests will save imports, schemas, sub manifests
        if save_referenced and persistence_type == self.CDM_FOLDER:
            saved_linked_docs = await doc._save_linked_documents_async(options)
            if not saved_linked_docs:
                logger.error(self._ctx, self._TAG, self._save_document_as_async.__name__, doc.at_corpus_path,
                             CdmLogCode.ERR_PERSIST_SAVE_LINK_DOCS, new_name)
                return False
        return True
