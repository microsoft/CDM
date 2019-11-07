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
        public static async Task<CdmDocumentDefinition> FromData(CdmCorpusContext ctx, LocalEntity obj, CdmCollection<CdmTraitDefinition> extensionTraitDefList)
        {
            var docName = $"{obj.Name}.cdm.json";
            var document = ctx.Corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, docName);

            // import at least foundations
            var foundationsImport = ctx.Corpus.MakeObject<CdmImport>(CdmObjectType.Import);
            foundationsImport.CorpusPath = "cdm:/foundations.cdm.json";
            document.Imports.Add(foundationsImport);

            var entity = await EntityPersistence.FromData(ctx, obj, extensionTraitDefList);
 
            if (entity == null)
            {
                Logger.Error(nameof(DocumentPersistence), ctx, "There was an error while trying to convert a model.json entity to the CDM entity.");
                return null;
            }

            if (obj.Imports != null)
            {
                foreach (var import in obj.Imports)
                {
                    if (import.CorpusPath?.Equals("cdm:/foundations.cdm.json") == true)
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

        public static async Task<LocalEntity> ToData(dynamic documentObjectOrPath, ResolveOptions resOpt, CopyOptions options, CdmCorpusContext ctx)
        {
            if (documentObjectOrPath is string)
            {
                string absCorpusPath = ctx.Corpus.Storage.CreateAbsoluteCorpusPath(documentObjectOrPath);

                if (await ctx.Corpus.FetchObjectAsync<CdmEntityDefinition>(absCorpusPath) is CdmEntityDefinition cdmEntity)
                {
                    var entity = await EntityPersistence.ToData(cdmEntity, resOpt, options, ctx);
                    if (cdmEntity.Owner != null && cdmEntity.Owner is CdmDocumentDefinition document)
                    {
                        if (document.Imports.Count > 0)
                        {
                            entity.Imports = new List<Import>();
                            foreach (var element in document.Imports)
                            {
                                entity.Imports.Add(CdmFolder.ImportPersistence.ToData(element, resOpt, options));
                            }
                        }
                    }
                    else
                    {
                        Logger.Warning(nameof(DocumentPersistence), ctx, $"Entity {cdmEntity.GetName()} is not inside a document or its owner is not a document.");
                    }
                    return entity;
                }
                else
                {
                    Logger.Error(nameof(DocumentPersistence), ctx, "There was an error while trying to fetch cdm entity doc.");
                    return null;
                }
            }

            return null;
        }
    }
}
