# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmLogCode
from cdm.objectmodel import CdmDocumentDefinition
from cdm.persistence.cdmfolder.import_persistence import ImportPersistence as CdmImportPersistence
from cdm.utilities import logger, Constants
from cdm.utilities.string_utils import StringUtils

from .entity_persistence import EntityPersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmManifestDefinition, CdmTraitDefinition
    from cdm.utilities import CopyOptions, ResolveOptions

    from .types import LocalEntity

_TAG = 'DocumentPersistence'


class DocumentPersistence:
    @staticmethod
    async def from_data(ctx: 'CdmCorpusContext', data_obj: 'LocalEntity', extension_trait_def_list: List['CdmTraitDefinition'],
                        local_extension_trait_def_list: List['CdmTraitDefinition']) -> Optional['CdmDocumentDefinition']:
        doc = ctx.corpus.make_object(CdmObjectType.DOCUMENT_DEF, '{}.cdm.json'.format(data_obj.name))

        # import at least foundations
        doc.imports.append(Constants._FOUNDATIONS_CORPUS_PATH)

        entity_dec = await EntityPersistence.from_data(ctx, data_obj, extension_trait_def_list, local_extension_trait_def_list)

        if not entity_dec:
            logger.error(ctx, DocumentPersistence.__name__, DocumentPersistence.from_data.__name__, None, CdmLogCode.ERR_PERSIST_MODELJSON_ENTITY_CONVERSION_ERROR, data_obj.name)
            return None

        if data_obj.get('imports'):
            for element in data_obj.imports:
                if element.corpusPath == Constants._FOUNDATIONS_CORPUS_PATH:
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
                logger.error(ctx, DocumentPersistence.__name__, DocumentPersistence.to_data.__name__, manifest.at_corpus_path, CdmLogCode.ERR_PERSIST_CDM_ENTITY_FETCH_ERROR)
                return None

            entity = await EntityPersistence.to_data(cdm_entity, res_opt, options, ctx)
            if cdm_entity.owner and cdm_entity.owner.object_type == CdmObjectType.DOCUMENT_DEF:
                document = cdm_entity.owner  # type: CdmDocumentDefinition
                entity.imports = []
                for element in document.imports:
                    imp = CdmImportPersistence.to_data(element, res_opt, options)
                    # the corpus path in the imports are relative to the document where it was defined.
                    # when saving in model.json the documents are flattened to the manifest level
                    # so it is necessary to recalculate the path to be relative to the manifest.
                    absolute_path = ctx.corpus.storage.create_absolute_corpus_path(imp.corpusPath, document)

                    if not StringUtils.is_blank_by_cdm_standard(document._namespace) and absolute_path.startswith(document._namespace + ':'):
                        absolute_path = absolute_path[len(document._namespace) + 1:]

                    imp.corpusPath = ctx.corpus.storage.create_relative_corpus_path(absolute_path, manifest)
                    entity.imports.append(imp)
            else:
                logger.warning(ctx, _TAG, DocumentPersistence.to_data.__name__, manifest.at_corpus_path, CdmLogCode.WARN_PERSIST_ENTITY_MISSING, cdm_entity.get_name())
            return entity
        else:
            # TODO: Do something else when document_object_or_path is an object.
            pass
