import importlib

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusDefinition
from cdm.utilities import CdmError, CopyOptions, JObject, ResolveOptions

if TYPE_CHECKING:
    from cdm.objectmodel import CdmObject


def from_data(*args) -> 'CdmObject':
    """
    * @param args arguments passed to the persistence class.
    * @param objectType any of cdmObjectType.
    * @param persistence_type a type supported by the persistence layer. Can by any of PersistenceTypes.
    """
    arglist = list(args)
    persistence_type = arglist.pop()
    object_type = arglist.pop()
    return _get_persistence_class(object_type, persistence_type).from_data(arglist)


def to_data(instance: 'CdmObject', res_opt: ResolveOptions, persistence_type: str, options: Optional[CopyOptions]) -> JObject:
    """
    * @param instance the instance that is going to be serialized.
    * @param res_opt Rnformation about how to resolve the instance.
    * @param persistence_type a type supported by the persistence layer. Can by any of PersistenceTypes.
    * @param options set of options to specify how the output format.
    """
    return _get_persistence_class(instance.object_type, persistence_type).to_data(instance, res_opt, options)


async def load_document_from_path_async(folder: 'CdmFolderDefinition', doc_name: str, doc_container: 'CdmDocumentDefinition') -> 'CdmDocumentDefinition':
    is_cdm_folder = doc_name.lower().endswith(CdmCorpusDefinition._FOLIO_EXTENSION) or doc_name.lower().endswith(CdmCorpusDefinition._MANIFEST_EXTENSION)
    is_model_json = doc_name.lower().endswith(CdmCorpusDefinition._MODEL_JSON_EXTENSION)

    #  go get the doc
    doc_content = None  # type: Optional[CdmDocumentDefinition]
    json_data = None
    fs_modified_time = None
    ctx = folder.ctx
    doc_path = folder.folder_path + doc_name
    adapter = ctx.corpus.storage.fetch_adapter(folder.namespace)  # type: StorageAdapter

    try:
        if adapter.can_read():
            json_data = await adapter.read_async(doc_path)
            fs_modified_time = await adapter.compute_last_modified_time_async(adapter.create_adapter_path(doc_path))
            ctx.logger.info('read file: {}'.format(doc_path))
    except Exception as e:
        ctx.logger.error('could not read %s from the \'%s\' namespace.\n Reason: \n%s', doc_path, folder.namespace, e)
        return None

    try:
        if is_cdm_folder:
            from cdm.persistence.cdmfolder import ManifestPersistence
            from cdm.persistence.cdmfolder.types import ManifestContent
            manifest = ManifestContent()
            manifest.decode(json_data)
            doc_content = await ManifestPersistence.from_data(ctx, doc_name, folder.namespace, folder.folder_path, manifest)
        elif is_model_json:
            if doc_name.lower() != CdmCorpusDefinition._MODEL_JSON_EXTENSION:
                ctx.logger.error('Failed to load \'{}\', as it\'s not an acceptable filename. It must be model.json'.format(doc_name))
                return None
            from cdm.persistence.modeljson import ManifestPersistence
            from cdm.persistence.modeljson.types import Model
            model = Model()
            model.decode(json_data)
            doc_content = await ManifestPersistence.from_data(ctx, model, folder)
        else:
            from cdm.persistence.cdmfolder import DocumentPersistence
            from cdm.persistence.cdmfolder.types import DocumentContent
            document = DocumentContent()
            document.decode(json_data)
            doc_content = await DocumentPersistence.from_data(ctx, doc_name, folder.namespace, folder.folder_path, document)
    except Exception as e:
        ctx.logger.error('Could not convert \'{}\'. Reason \'{}\''.format(doc_path, e))
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


def _get_persistence_class(object_type: CdmObjectType, persistence_type: str) -> object:
    # persistence_layer: { [id: string]: IPersistence } = PersistenceTypes[persistence_type] as { [id: string]: IPersistence }
    # if persistence_layer:
    object_name = object_type.name.lower()  # CdmObjectType[object_type]

    if object_name.endswith('def'):
        object_name = object_name[0:-4]
    elif object_name.endswith('ref'):
        object_name += 'erence'

    persistence_module_name = '{}_persistence'.format(object_name)
    persistence_class_name = ''.join([x.title() for x in persistence_module_name.split('_')])
    TargetClass = getattr(importlib.import_module('cdm.persistence.{}.{}'.format(persistence_type.lower(), persistence_module_name)), persistence_class_name)
    instance = TargetClass()

    if not instance:
        raise CdmError('Persistence class {} not implemented for type {}'.format(persistence_class_name, persistence_type))

    return instance
    # else:
    # raise CdmError(f'Persistence type {persistence_type} not implemented.')
