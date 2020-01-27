from typing import List, Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmDocumentDefinition
from cdm.persistence.cdmfolder.import_persistence import ImportPersistence as CdmImportPersistence
from cdm.utilities import logger

from .entity_persistence import EntityPersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmManifestDefinition, CdmTraitDefinition
    from cdm.utilities import CopyOptions, ResolveOptions

    from .types import LocalEntity


class DocumentPersistence:
    @staticmethod
    async def from_data(ctx: 'CdmCorpusContext', data_obj: 'LocalEntity', extension_trait_def_list: List['CdmTraitDefinition'],
                        local_extension_trait_def_list: List['CdmTraitDefinition']) -> Optional['CdmDocumentDefinition']:
        doc = ctx.corpus.make_object(CdmObjectType.DOCUMENT_DEF, '{}.cdm.json'.format(data_obj.name))

        # import at least foundations
        doc.imports.append('cdm:/foundations.cdm.json')

        entity_dec = await EntityPersistence.from_data(ctx, data_obj, extension_trait_def_list, local_extension_trait_def_list)

        if not entity_dec:
            logger.error(DocumentPersistence.__name__, ctx, 'There was an error while trying to convert a model.json entity to the CDM entity.')
            return None

        if data_obj.get('imports'):
            for element in data_obj.imports:
                if element.corpusPath == 'cdm:/foundations.cdm.json':
                    # don't add foundations twice
                    continue

                doc.imports.append(CdmImportPersistence.from_data(ctx, element))

        doc.definitions.append(entity_dec)

        return doc

    @staticmethod
    async def to_data(document_object_or_path: Union[CdmDocumentDefinition, str], manifest: 'CdmManifestDefinition', res_opt: 'ResolveOptions', options: 'CopyOptions',
                      ctx: 'CdmCorpusContext') -> Optional['LocalEntity']:
        if isinstance(document_object_or_path, str):
            # Fetch the document from entity schema.
            cdm_entity = await ctx.corpus.fetch_object_async(document_object_or_path, manifest)

            if not cdm_entity:
                logger.error(DocumentPersistence.__name__, ctx, 'There was an error while trying to fetch cdm entity doc.')
                return None

            entity = await EntityPersistence.to_data(cdm_entity, res_opt, options, ctx)
            if cdm_entity.owner and cdm_entity.owner.object_type == CdmObjectType.DOCUMENT_DEF:
                document = cdm_entity.owner  # type: CdmDocumentDefinition
                for element in document.imports:
                    imp = CdmImportPersistence.to_data(element, res_opt, options)
                    # the corpus path in the imports are relative to the document where it was defined.
                    # when saving in model.json the documents are flattened to the manifest level
                    # so it is necessary to recalculate the path to be relative to the manifest.
                    absolute_path = ctx.corpus.storage.create_absolute_corpus_path(imp.corpusPath, document)

                    if document.namespace and absolute_path.startswith(document.namespace + ':'):
                        absolute_path = absolute_path[len(document.namespace) + 1:]

                    imp.corpusPath = ctx.corpus.storage.create_relative_corpus_path(absolute_path, manifest)
                    entity.imports.append(imp)
            else:
                logger.warning(DocumentPersistence.__name__, ctx, 'Entity {} is not inside a document or its owner is not a document.'.format(
                    cdm_entity.get_name()))
            return entity
        else:
            # TODO: Do something else when document_object_or_path is an object.
            pass
