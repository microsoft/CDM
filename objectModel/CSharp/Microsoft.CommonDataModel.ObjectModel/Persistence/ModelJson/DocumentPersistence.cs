// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    /// <summary>
    /// The document persistence.
    /// </summary>
    public class DocumentPersistence
    {
        private static readonly string Tag = nameof(DocumentPersistence);

        public static async Task<CdmDocumentDefinition> FromData(CdmCorpusContext ctx, LocalEntity obj, List<CdmTraitDefinition> extensionTraitDefList, List<CdmTraitDefinition> localExtensionTraitDefList)
        {
            var docName = $"{obj.Name}.cdm.json";
            var document = ctx.Corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, docName);

            // import at least foundations
            document.Imports.Add(Constants.FoundationsCorpusPath);

            var entity = await EntityPersistence.FromData(ctx, obj, extensionTraitDefList, localExtensionTraitDefList);

            if (entity == null)
            {
                Logger.Error(ctx, Tag, nameof(FromData), null, CdmLogCode.ErrPersistModelJsonEntityConversionError, obj.Name);
                return null;
            }

            if (obj.Imports != null)
            {
                foreach (var import in obj.Imports)
                {
                    if (import.CorpusPath?.Equals(Constants.FoundationsCorpusPath) == true)
                    {
                        // don't add foundations twice
                        continue;
                    }
                    document.Imports.Add(CdmFolder.ImportPersistence.FromData(ctx, import));
                }
            }

            document.Definitions.Add(entity);

            return document;
        }

        public static async Task<LocalEntity> ToData(dynamic documentObjectOrPath, CdmManifestDefinition manifest, ResolveOptions resOpt, CopyOptions options, CdmCorpusContext ctx)
        {
            if (documentObjectOrPath is string)
            {
                if (await ctx.Corpus.FetchObjectAsync<CdmEntityDefinition>(documentObjectOrPath, manifest) is CdmEntityDefinition cdmEntity)
                {
                    var entity = await EntityPersistence.ToData(cdmEntity, resOpt, options, ctx);
                    if (cdmEntity.Owner != null && cdmEntity.Owner is CdmDocumentDefinition document)
                    {
                        if (document.Imports.Count > 0)
                        {
                            entity.Imports = new List<Import>();
                            foreach (var element in document.Imports)
                            {
                                var import = CdmFolder.ImportPersistence.ToData(element, resOpt, options);
                                // the corpus path in the imports are relative to the document where it was defined.
                                // when saving in model.json the documents are flattened to the manifest level
                                // so it is necessary to recalculate the path to be relative to the manifest.
                                var absolutePath = ctx.Corpus.Storage.CreateAbsoluteCorpusPath(import.CorpusPath, document);

                                if (!StringUtils.IsBlankByCdmStandard(document.Namespace) && absolutePath.StartsWith(document.Namespace + ":"))
                                {
                                    absolutePath = absolutePath.Substring(document.Namespace.Length + 1);
                                }
                                import.CorpusPath = ctx.Corpus.Storage.CreateRelativeCorpusPath(absolutePath, manifest);
                                entity.Imports.Add(import);
                            }
                        }
                    }
                    else
                    {
                        Logger.Warning(ctx, Tag, nameof(ToData), manifest.AtCorpusPath, CdmLogCode.WarnPersistEntityMissing, cdmEntity.GetName());
                    }
                    return entity;
                }
                else
                {
                    Logger.Error(ctx, Tag, nameof(ToData), manifest.AtCorpusPath, CdmLogCode.ErrPersistCdmEntityFetchError);
                    return null;
                }
            }

            return null;
        }
    }
}
