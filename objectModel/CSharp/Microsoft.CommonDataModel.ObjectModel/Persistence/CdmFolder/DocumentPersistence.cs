// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json;
    using System.Linq;

    public class DocumentPersistence
    {
        private static readonly string Tag = nameof(DocumentPersistence);

        /// <summary>
        /// Whether this persistence class has async methods.
        /// </summary>
        public static readonly bool IsPersistenceAsync = false;

        /// <summary>
        /// The file format/extension types this persistence class supports.
        /// </summary>
        public static readonly string[] Formats = { PersistenceLayer.CdmExtension };

        /// <summary>
        /// The maximum json semantic version supported by this ObjectModel version.
        /// </summary>
        public static readonly string JsonSemanticVersion = CdmDocumentDefinition.CurrentJsonSchemaSemanticVersion;

        public static CdmDocumentDefinition FromObject(CdmCorpusContext ctx, string name, string nameSpace, string path, DocumentContent obj)
        {
            var doc = ctx.Corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, name);
            doc.FolderPath = path;
            doc.Namespace = nameSpace;

            if (!StringUtils.IsBlankByCdmStandard(obj.Schema))
            {
                doc.Schema = obj.Schema;
            }

            if (!StringUtils.IsBlankByCdmStandard(obj.DocumentVersion))
            {
                doc.DocumentVersion = obj.DocumentVersion;
            }

            if (obj.Imports != null)
            {
                foreach (var importObj in obj.Imports)
                {
                    doc.Imports.Add(ImportPersistence.FromData(ctx, importObj));
                }
            }

            if (obj.Definitions != null)
            {
                for (int i = 0; i < obj.Definitions.Count; i++)
                {
                    dynamic d = obj.Definitions[i];
                    if (d["dataTypeName"] != null)
                    {
                        doc.Definitions.Add(DataTypePersistence.FromData(ctx, d));
                    }
                    else if (d["purposeName"] != null)
                    {
                        doc.Definitions.Add(PurposePersistence.FromData(ctx, d));
                    }
                    else if (d["attributeGroupName"] != null)
                    {
                        doc.Definitions.Add(AttributeGroupPersistence.FromData(ctx, d));
                    }
                    else if (d["traitName"] != null)
                    {
                        doc.Definitions.Add(TraitPersistence.FromData(ctx, d));
                    }
                    else if (d["traitGroupName"] != null)
                    {
                        doc.Definitions.Add(TraitGroupPersistence.FromData(ctx, d));
                    }
                    else if (d["entityShape"] != null)
                    {
                        doc.Definitions.Add(ConstantEntityPersistence.FromData(ctx, d));
                    }
                    else if (d["entityName"] != null)
                    {
                        doc.Definitions.Add(EntityPersistence.FromData(ctx, d));
                    }
                }
            }

            var isResolvedDoc = false;
            if (doc.Definitions.Count == 1 && doc.Definitions[0] is CdmEntityDefinition entity)
            {
                var resolvedTrait = entity.ExhibitsTraits.Item("has.entitySchemaAbstractionLevel");
                // Tries to figure out if the document is in resolved form by looking for the schema abstraction trait
                // or the presence of the attribute context.
                isResolvedDoc = resolvedTrait != null && string.Equals((resolvedTrait as CdmTraitReference).Arguments[0].Value, "resolved");
                isResolvedDoc = isResolvedDoc || entity.AttributeContext != null;
            }

            if (!StringUtils.IsBlankByCdmStandard(obj.JsonSchemaSemanticVersion))
            {
                doc.JsonSchemaSemanticVersion = obj.JsonSchemaSemanticVersion;
                if (CompareJsonSemanticVersion(ctx, doc.JsonSchemaSemanticVersion) > 0)
                {
                    if (isResolvedDoc)
                    {
                        Logger.Warning(ctx, Tag, nameof(FromObject), null, CdmLogCode.WarnPersistUnsupportedJsonSemVer, JsonSemanticVersion, doc.JsonSchemaSemanticVersion);
                    }
                    else
                    {
                        Logger.Error(ctx, Tag, nameof(FromObject), null, CdmLogCode.ErrPersistUnsupportedJsonSemVer, JsonSemanticVersion, doc.JsonSchemaSemanticVersion);
                    }
                }
            }
            else
            {
                Logger.Warning(ctx, Tag, nameof(FromObject), null, CdmLogCode.WarnPersistJsonSemVerMandatory);
            }

            return doc;
        }

        public static CdmDocumentDefinition FromData(CdmCorpusContext ctx, string docName, string jsonData, CdmFolderDefinition folder)
        {
            var obj = JsonConvert.DeserializeObject<DocumentContent>(jsonData, PersistenceLayer.SerializerSettings);
            return FromObject(ctx, docName, folder.Namespace, folder.FolderPath, obj);
        }

        public static DocumentContent ToData(CdmDocumentDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            return new DocumentContent
            {
                Schema = instance.Schema,
                JsonSchemaSemanticVersion = instance.JsonSchemaSemanticVersion,
                Imports = Utils.ListCopyData<Import>(resOpt, instance.Imports, options),
                Definitions = CopyDataUtils.ListCopyData(resOpt, instance.Definitions, options),
                DocumentVersion = instance.DocumentVersion
            };
        }

        /// <summary>
        /// Compares the document version with the json semantic version supported.
        /// </summary>
        /// <param name="documentSemanticVersion"></param>
        /// <returns>
        /// 1 => if documentSemanticVersion > JsonSemanticVersion
        /// 0 => if documentSemanticVersion == JsonSemanticVersion or if documentSemanticVersion is invalid
        /// -1 => if documentSemanticVersion < JsonSemanticVersion
        /// </returns>
        private static int CompareJsonSemanticVersion(CdmCorpusContext ctx, string documentSemanticVersion)
        {
            var docSemanticVersionSplit = documentSemanticVersion.Split('.');
            var currSemanticVersionSplit = JsonSemanticVersion.Split('.').Select(value => int.Parse(value)).ToList();

            if (docSemanticVersionSplit.Length != 3)
            {
                Logger.Warning(ctx, Tag, nameof(CompareJsonSemanticVersion), null, CdmLogCode.WarnPersistJsonSemVerInvalidFormat);
                return 0;
            }

            for (var i = 0; i < 3; ++i)
            {
                if (!int.TryParse(docSemanticVersionSplit[i], out int version))
                {
                    Logger.Warning(ctx, Tag, nameof(CompareJsonSemanticVersion), null, CdmLogCode.WarnPersistJsonSemVerInvalidFormat);
                    return 0;
                }

                if (version != currSemanticVersionSplit[i])
                {
                    return version < currSemanticVersionSplit[i] ? -1 : 1;
                }
            }

            return 0;
        }
    }
}
