namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    public class DocumentPersistence
    {
        /// <summary>
        /// Whether this persistence class has async methods.
        /// </summary>
        public static readonly bool IsPersistenceAsync = false;

        /// <summary>
        /// The file format/extension types this persistence class supports.
        /// </summary>
        public static readonly string[] Formats = { ".cdm.json" };

        public static CdmDocumentDefinition FromObject(CdmCorpusContext ctx, string name, string nameSpace, string path, DocumentContent obj)
        {
            var doc = ctx.Corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, name);
            doc.FolderPath = path;
            doc.Namespace = nameSpace;

            if (!string.IsNullOrEmpty(obj.Schema))
                doc.Schema = obj.Schema;
            if (DynamicObjectExtensions.HasProperty(obj, "JsonSchemaSemanticVersion") && !string.IsNullOrEmpty(obj.JsonSchemaSemanticVersion))
                doc.JsonSchemaSemanticVersion = obj.JsonSchemaSemanticVersion;
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
                        doc.Definitions.Add(DataTypePersistence.FromData(ctx, d));
                    else if (d["purposeName"] != null)
                        doc.Definitions.Add(PurposePersistence.FromData(ctx, d));
                    else if (d["attributeGroupName"] != null)
                        doc.Definitions.Add(AttributeGroupPersistence.FromData(ctx, d));
                    else if (d["traitName"] != null)
                        doc.Definitions.Add(TraitPersistence.FromData(ctx, d));
                    else if (d["entityShape"] != null)
                        doc.Definitions.Add(ConstantEntityPersistence.FromData(ctx, d));
                    else if (d["entityName"] != null)
                        doc.Definitions.Add(EntityPersistence.FromData(ctx, d));
                }
            }

            return doc;
        }

        public static CdmDocumentDefinition FromData(CdmCorpusContext ctx, string docName, string jsonData, CdmFolderDefinition folder)
        {
            var obj = JsonConvert.DeserializeObject<DocumentContent>(jsonData);
            return FromObject(ctx, docName, folder.Namespace, folder.FolderPath, obj);
        }

        public static DocumentContent ToData(CdmDocumentDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            return new DocumentContent
            {
                Schema = instance.Schema,
                JsonSchemaSemanticVersion = instance.JsonSchemaSemanticVersion,
                Imports = Utils.ListCopyData<Import>(resOpt, instance.Imports, options),
                Definitions = Utils.ListCopyData(resOpt, instance.Definitions, options)
            };
        }
    }
}
