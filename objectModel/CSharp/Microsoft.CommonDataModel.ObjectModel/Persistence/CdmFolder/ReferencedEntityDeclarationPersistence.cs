namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Globalization;

    class ReferencedEntityDeclarationPersistence
    {
        public static CdmReferencedEntityDeclarationDefinition FromData(CdmCorpusContext ctx, string prefixPath, JToken obj)
        {
            var newRef = ctx.Corpus.MakeObject<CdmReferencedEntityDeclarationDefinition>(
                CdmObjectType.ReferencedEntityDeclarationDef,
                (string)obj["entityName"]);

            var entityPath = (string)(obj["entityPath"] != null ? obj["entityPath"] :  obj["entityDeclaration"]);

            if (entityPath == null)
            {
                Logger.Error(nameof(ReferencedEntityDeclarationPersistence), ctx, "Couldn't find entity path or similar.", "FromData");
            }

            if (entityPath != null && entityPath.IndexOf(":") == -1)
            {
                entityPath = $"{prefixPath}{entityPath}";
            }

            newRef.EntityPath = entityPath;

            if (obj["lastFileStatusCheckTime"] != null)
            {
                newRef.LastFileStatusCheckTime = DateTimeOffset.Parse(obj.Value<string>("lastFileStatusCheckTime"));
            }

            if (obj["lastFileModifiedTime"] != null)
            {
                newRef.LastFileModifiedTime = DateTimeOffset.Parse(obj.Value<string>("lastFileModifiedTime"));
            }

            if (obj["explanation"] != null)
            {
                newRef.Explanation = (string)obj["explanation"];
            }

            if (obj["exhibitsTraits"] != null)
            {
                Utils.AddListToCdmCollection(newRef.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, obj["exhibitsTraits"]));
            }

            return newRef;
        }

        public static EntityDeclarationDefinition ToData(CdmReferencedEntityDeclarationDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            var result = new EntityDeclarationDefinition
            {
                Type = EntityDeclarationDefinitionType.ReferencedEntity,
                LastFileStatusCheckTime = TimeUtils.GetFormattedDateString(instance.LastFileStatusCheckTime),
                LastFileModifiedTime = TimeUtils.GetFormattedDateString(instance.LastFileModifiedTime),
                Explanation = instance.Explanation,
                EntityName = instance.EntityName,
                EntityPath = instance.EntityPath,
                ExhibitsTraits = Utils.ListCopyData(resOpt, instance.ExhibitsTraits, options)
            };

            return result;
        }
    }
}
