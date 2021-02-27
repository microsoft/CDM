// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json.Linq;
    using System.Linq;

    class EntityAttributePersistence
    {
        public static CdmEntityAttributeDefinition FromData(CdmCorpusContext ctx, JToken obj)
        {
            var entityAttribute = ctx.Corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, (string)obj["name"]);

            entityAttribute.Description = Utils.PropertyFromDataToString(obj["description"]);
            entityAttribute.DisplayName = Utils.PropertyFromDataToString(obj["displayName"]);
            entityAttribute.Explanation = Utils.PropertyFromDataToString(obj["explanation"]);

            if (obj["cardinality"] != null)
            {
                string minCardinality = null;
                if (obj["cardinality"]["minimum"] != null)
                    minCardinality = (string)obj["cardinality"]["minimum"];

                string maxCardinality = null;
                if (obj["cardinality"]["maximum"] != null)
                    maxCardinality = (string)obj["cardinality"]["maximum"];

                if (string.IsNullOrWhiteSpace(minCardinality) || string.IsNullOrWhiteSpace(maxCardinality))
                    Logger.Error(nameof(EntityAttributePersistence), ctx, $"Both minimum and maximum are required for the Cardinality property.", nameof(FromData));

                if (!CardinalitySettings.IsMinimumValid(minCardinality))
                    Logger.Error(nameof(EntityAttributePersistence), ctx, $"Invalid minimum cardinality {minCardinality}.", nameof(FromData));

                if (!CardinalitySettings.IsMaximumValid(maxCardinality))
                    Logger.Error(nameof(EntityAttributePersistence), ctx, $"Invalid maximum cardinality {maxCardinality}.", nameof(FromData));

                if (!string.IsNullOrWhiteSpace(minCardinality) &&
                    !string.IsNullOrWhiteSpace(maxCardinality) &&
                    CardinalitySettings.IsMinimumValid(minCardinality) &&
                    CardinalitySettings.IsMinimumValid(maxCardinality))
                {
                    entityAttribute.Cardinality = new CardinalitySettings(entityAttribute)
                    {
                        Minimum = minCardinality,
                        Maximum = maxCardinality
                    };
                }
            }

            entityAttribute.IsPolymorphicSource = (bool?)obj["isPolymorphicSource"];

            bool isProjection = obj["entity"] != null &&
                !(obj["entity"] is JValue) &&
                obj["entity"]["source"] != null;
            if (isProjection)
            {
                CdmEntityReference inlineEntityRef = ctx.Corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
                inlineEntityRef.ExplicitReference = ProjectionPersistence.FromData(ctx, obj["entity"]);
                entityAttribute.Entity = inlineEntityRef;
            }
            else
            {
                entityAttribute.Entity = EntityReferencePersistence.FromData(ctx, obj["entity"]);
            }

            entityAttribute.Purpose = PurposeReferencePersistence.FromData(ctx, obj["purpose"]);
            Utils.AddListToCdmCollection(entityAttribute.AppliedTraits, Utils.CreateTraitReferenceList(ctx, obj["appliedTraits"]));
            // ignore resolution guidance if the entity is a projection
            if (obj["resolutionGuidance"] != null && isProjection)
            {
                Logger.Error(nameof(EntityAttributePersistence), ctx, $"The EntityAttribute {entityAttribute.Name} is projection based. Resolution guidance is not supported with a projection.");
            }
            else
            {
                entityAttribute.ResolutionGuidance = AttributeResolutionGuidancePersistence.FromData(ctx, obj["resolutionGuidance"]);
            }
            return entityAttribute;
        }

        public static EntityAttribute ToData(CdmEntityAttributeDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            return new EntityAttribute
            {
                Explanation = instance.Explanation,
                Name = instance.Name,
                IsPolymorphicSource = instance.IsPolymorphicSource,
                Entity = Utils.JsonForm(instance.Entity, resOpt, options),
                Purpose = Utils.JsonForm(instance.Purpose, resOpt, options),
                AppliedTraits = CopyDataUtils.ListCopyData(resOpt, instance.AppliedTraits?.Where(trait => !trait.IsFromProperty), options),
                ResolutionGuidance = Utils.JsonForm(instance.ResolutionGuidance, resOpt, options),
                DisplayName = instance.GetProperty("displayName"),
                Description = instance.GetProperty("description")
            };
        }
    }
}
