// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Models;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class DocumentPersistence
    {
        private static readonly string Tag = nameof(DocumentPersistence);

        public static CdmDocumentDefinition FromObject(CdmCorpusContext ctx, string nameSpace, string path, TableEntity table)
        {
            if (table == null || table.Type != SASEntityType.TABLE)
                return null;

            TableProperties teProperties = ((JToken)table.Properties).ToObject<TableProperties>();
            var doc = ctx.Corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, table.Name);
            doc.FolderPath = path;
            doc.Namespace = nameSpace;

            if (teProperties.Properties != null)
            {
                if (teProperties.Properties.ContainsKey("cdm:imports"))
                {
                    foreach (var importObj in teProperties.Properties["cdm:imports"].ToObject<List<Import>>())
                    {
                        doc.Imports.Add(ImportPersistence.FromData(ctx, importObj));
                    }
                }
            }

            doc.Definitions.Add(EntityPersistence.FromData(ctx, table.Name, table));
            return doc;
        }

        public static TableEntity ToData(CdmCorpusContext ctx, CdmDocumentDefinition doc, TableProperties currentTableProperties, ResolveOptions resOpt, CopyOptions options)
        {
            if (currentTableProperties == null)
                return null;

            if (doc .Definitions.Count == 0 || doc.Definitions.Count > 1)
            {
                Logger.Error((ResolveContext)ctx, Tag, nameof(ToData), doc.AtCorpusPath, CdmLogCode.ErrPersistSymsMultipleOrZeroTableDefinition, doc.Name);
                return null;
            }
            if (doc.Definitions[0] is CdmEntityDefinition cdmEntity)
            {
                var tableEntity = EntityPersistence.ToData(cdmEntity, ctx, resOpt, options);
                TableProperties teProperties = (TableProperties)tableEntity.Properties;
                
                if (cdmEntity.Owner != null && cdmEntity.Owner is CdmDocumentDefinition document)
                {
                    if (document.Imports.Count > 0)
                    {
                        var Imports = Utils.ListCopyData<Import>(resOpt, document.Imports, options);
                        teProperties.Properties["cdm:imports"] = JToken.FromObject(Imports);
                    }
                }

                teProperties.NamespaceProperty = currentTableProperties.NamespaceProperty;
                teProperties.StorageDescriptor.Source = currentTableProperties.StorageDescriptor.Source;
                teProperties.StorageDescriptor.Format = currentTableProperties.StorageDescriptor.Format;
                teProperties.Partitioning = currentTableProperties.Partitioning;

                tableEntity.Properties = teProperties;
                return tableEntity;
            }
            return null;
        }

        public static async Task<TableEntity> ToDataAsync(dynamic documentObjectOrPath, CdmManifestDefinition manifest, CdmCorpusContext ctx,
             ResolveOptions resOpt, CopyOptions options)
        {
            if (documentObjectOrPath is string)
            {
                dynamic obje = await ctx.Corpus.FetchObjectAsync<CdmEntityDefinition>(documentObjectOrPath, manifest);
                if (obje is CdmEntityDefinition cdmEntity)
                {
                    var tableEntity = EntityPersistence.ToData(cdmEntity, ctx, resOpt, options);
                    TableProperties teProperties = (TableProperties)tableEntity.Properties;
                    teProperties.NamespaceProperty = new TableNamespace
                    {
                        DatabaseName = manifest.ManifestName
                    };

                    if (cdmEntity.Owner != null && cdmEntity.Owner is CdmDocumentDefinition document)
                    {
                        if (document.Imports.Count > 0)
                        {
                            var Imports = Utils.ListCopyData<Import>(resOpt, document.Imports, options);
                            teProperties.Properties["cdm:imports"] = JToken.FromObject(Imports);
                        }
                    }
                    else
                    {
                        Logger.Warning(ctx, Tag, nameof(ToDataAsync), manifest.AtCorpusPath, CdmLogCode.WarnPersistSymsEntityMissing, cdmEntity.GetName());
                    }
                    return tableEntity;
                }
                else
                {
                    Logger.Error(ctx, Tag, nameof(ToDataAsync), manifest.AtCorpusPath, CdmLogCode.ErrPersistSymsEntityFetchError, documentObjectOrPath);
                    return null;
                }
            }
            return null;
        }
    }
}
