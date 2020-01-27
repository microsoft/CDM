namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    class AttributeResolutionGuidancePersistence
    {
        public static CdmAttributeResolutionGuidance FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }
            var attributeResolution = ctx.Corpus.MakeObject<CdmAttributeResolutionGuidance>(CdmObjectType.AttributeResolutionGuidanceDef);

            attributeResolution.removeAttribute = (bool?)obj["removeAttribute"];
            attributeResolution.imposedDirectives = obj["imposedDirectives"]?.ToObject<List<string>>();
            attributeResolution.removedDirectives = obj["removedDirectives"]?.ToObject<List<string>>();
            attributeResolution.cardinality = (string)obj["cardinality"];
            attributeResolution.renameFormat = (string)obj["renameFormat"];
            if (obj["addSupportingAttribute"] != null)
                attributeResolution.addSupportingAttribute = Utils.CreateAttribute(ctx, obj["addSupportingAttribute"]) as CdmTypeAttributeDefinition;
            if (obj["expansion"] != null)
            {
                attributeResolution.expansion = attributeResolution.makeExpansion();
                attributeResolution.expansion.startingOrdinal = (int?)obj["expansion"]["startingOrdinal"];
                attributeResolution.expansion.maximumExpansion = (int?)obj["expansion"]["maximumExpansion"];
                if (obj["expansion"]["countAttribute"] != null)
                    attributeResolution.expansion.countAttribute = Utils.CreateAttribute(ctx, obj["expansion"]["countAttribute"]) as CdmTypeAttributeDefinition;
            }
            if (obj["entityByReference"] != null)
            {
                attributeResolution.entityByReference = attributeResolution.makeEntityByReference();
                attributeResolution.entityByReference.allowReference = (bool?)obj["entityByReference"]["allowReference"];
                attributeResolution.entityByReference.alwaysIncludeForeignKey = (bool?)obj["entityByReference"]["alwaysIncludeForeignKey"];
                attributeResolution.entityByReference.referenceOnlyAfterDepth = (int?)obj["entityByReference"]["referenceOnlyAfterDepth"];
                if (obj["entityByReference"]["foreignKeyAttribute"] != null)
                    attributeResolution.entityByReference.foreignKeyAttribute = Utils.CreateAttribute(ctx, obj["entityByReference"]["foreignKeyAttribute"]) as CdmTypeAttributeDefinition;
            }
            if (obj["selectsSubAttribute"] != null)
            {
                attributeResolution.selectsSubAttribute = attributeResolution.makeSelectsSubAttribute();
                attributeResolution.selectsSubAttribute.selects = (obj["selectsSubAttribute"]["selects"] != null) ? obj["selectsSubAttribute"]["selects"].ToString() : null;
                if (obj["selectsSubAttribute"]["selectedTypeAttribute"] != null)
                    attributeResolution.selectsSubAttribute.selectedTypeAttribute = Utils.CreateAttribute(ctx, obj["selectsSubAttribute"]["selectedTypeAttribute"]) as CdmTypeAttributeDefinition;
                if (obj["selectsSubAttribute"]["selectsSomeTakeNames"] != null)
                    attributeResolution.selectsSubAttribute.selectsSomeTakeNames = obj["selectsSubAttribute"]["selectsSomeTakeNames"]?.ToObject<List<string>>();
                if (obj["selectsSubAttribute"]["selectsSomeAvoidNames"] != null)
                    attributeResolution.selectsSubAttribute.selectsSomeAvoidNames = obj["selectsSubAttribute"]["selectsSomeAvoidNames"]?.ToObject<List<string>>();

            }

            return attributeResolution;
        }

        public static AttributeResolutionGuidance ToData(CdmAttributeResolutionGuidance instance, ResolveOptions resOpt, CopyOptions options)
        {
            AttributeResolutionGuidance obj = new AttributeResolutionGuidance
            {
                removeAttribute = instance.removeAttribute,
                imposedDirectives = instance.imposedDirectives,
                removedDirectives = instance.removedDirectives,
                addSupportingAttribute = Utils.JsonForm(instance.addSupportingAttribute, resOpt, options),
                cardinality = instance.cardinality,
                renameFormat = instance.renameFormat
            };
            if (instance.expansion != null)
            {
                obj.expansion = new AttributeResolutionGuidance.Expansion()
                {
                    startingOrdinal = instance.expansion.startingOrdinal,
                    maximumExpansion = instance.expansion.maximumExpansion,
                    countAttribute = Utils.JsonForm(instance.expansion.countAttribute, resOpt, options)
                };
            }
            if (instance.entityByReference != null)
            {
                obj.entityByReference = new AttributeResolutionGuidance.CdmAttributeResolutionGuidance_EntityByReference()
                {
                    alwaysIncludeForeignKey = instance.entityByReference.alwaysIncludeForeignKey,
                    referenceOnlyAfterDepth = instance.entityByReference.referenceOnlyAfterDepth,
                    allowReference = instance.entityByReference.allowReference,
                    foreignKeyAttribute = Utils.JsonForm(instance.entityByReference.foreignKeyAttribute, resOpt, options)
                };
            }
            if (instance.selectsSubAttribute != null)
            {
                obj.selectsSubAttribute = new AttributeResolutionGuidance.CdmAttributeResolutionGuidance_SelectsSubAttribute()
                {
                    selects = instance.selectsSubAttribute.selects,
                    selectedTypeAttribute = Utils.JsonForm(instance.selectsSubAttribute.selectedTypeAttribute, resOpt, options),
                    selectsSomeTakeNames = instance.selectsSubAttribute.selectsSomeTakeNames,
                    selectsSomeAvoidNames = instance.selectsSubAttribute.selectsSomeAvoidNames
                };
            }
            return obj;
        }
    }
}
