namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;

    class EntityAttributePersistence
    {
        public static CdmEntityAttributeDefinition FromData(CdmCorpusContext ctx, JToken obj)
        {
            var entityAttribute = ctx.Corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, (string)obj["name"]);

            if (obj["explanation"] != null)
                entityAttribute.Explanation = (string)obj["explanation"];

            entityAttribute.Entity = EntityReferencePersistence.FromData(ctx, obj["entity"]);

            entityAttribute.Purpose = PurposeReferencePersistence.FromData(ctx, obj["purpose"]);
            Utils.AddListToCdmCollection(entityAttribute.AppliedTraits, Utils.CreateTraitReferenceList(ctx, obj["appliedTraits"]));
            entityAttribute.ResolutionGuidance = AttributeResolutionGuidancePersistence.FromData(ctx, obj["resolutionGuidance"]);
            return entityAttribute;
        }

        public static EntityAttribute ToData(CdmEntityAttributeDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            return new EntityAttribute
            {
                Explanation = instance.Explanation,
                Name = instance.Name,
                Entity = Utils.JsonForm(instance.Entity, resOpt, options),
                Purpose = Utils.JsonForm(instance.Purpose, resOpt, options),
                AppliedTraits = Utils.ListCopyData(resOpt, instance.AppliedTraits, options),
                ResolutionGuidance = Utils.JsonForm(instance.ResolutionGuidance, resOpt, options)
            };
        }
    }
}
