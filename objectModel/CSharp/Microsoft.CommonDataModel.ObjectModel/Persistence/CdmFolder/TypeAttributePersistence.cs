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
    using System;
    using System.Collections.Generic;
    using System.Linq;

    class TypeAttributePersistence
    {
        public static CdmTypeAttributeDefinition FromData(CdmCorpusContext ctx, JToken obj, string entityName = null)
        {
            if (obj == null)
            {
                return null;
            }

            var typeAttribute = ctx.Corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, (string)obj["name"]);

            typeAttribute.Purpose = PurposeReferencePersistence.FromData(ctx, obj["purpose"]);
            typeAttribute.DataType = DataTypeReferencePersistence.FromData(ctx, obj["dataType"]);
            if (obj["cardinality"] != null)
            {
                string minCardinality = null;
                if (obj["cardinality"]["minimum"] != null)
                    minCardinality = (string)obj["cardinality"]["minimum"];

                string maxCardinality = null;
                if (obj["cardinality"]["maximum"] != null)
                    maxCardinality = (string)obj["cardinality"]["maximum"];

                if (string.IsNullOrWhiteSpace(minCardinality) || string.IsNullOrWhiteSpace(maxCardinality))
                    Logger.Error(nameof(TypeAttributePersistence), ctx, $"Both minimum and maximum are required for the Cardinality property.", nameof(FromData));

                if (!CardinalitySettings.IsMinimumValid(minCardinality))
                    Logger.Error(nameof(TypeAttributePersistence), ctx, $"Invalid minimum cardinality {minCardinality}.", nameof(FromData));

                if (!CardinalitySettings.IsMaximumValid(maxCardinality))
                    Logger.Error(nameof(TypeAttributePersistence), ctx, $"Invalid maximum cardinality {maxCardinality}.", nameof(FromData));

                if (!string.IsNullOrWhiteSpace(minCardinality) &&
                    !string.IsNullOrWhiteSpace(maxCardinality) &&
                    CardinalitySettings.IsMinimumValid(minCardinality) &&
                    CardinalitySettings.IsMinimumValid(maxCardinality))
                {
                    typeAttribute.Cardinality = new CardinalitySettings(typeAttribute)
                    {
                        Minimum = minCardinality,
                        Maximum = maxCardinality
                    };
                }
            }
            typeAttribute.AttributeContext = AttributeContextReferencePersistence.FromData(ctx, obj["attributeContext"]);
            Utils.AddListToCdmCollection(typeAttribute.AppliedTraits, Utils.CreateTraitReferenceList(ctx, obj["appliedTraits"]));
            typeAttribute.ResolutionGuidance = AttributeResolutionGuidancePersistence.FromData(ctx, obj["resolutionGuidance"]);

            if (obj["isPrimaryKey"] != null && (bool)obj["isPrimaryKey"] && entityName != null)
            {
                TraitToPropertyMap t2pMap = new TraitToPropertyMap(typeAttribute);
                t2pMap.UpdatePropertyValue("isPrimaryKey", entityName + "/(resolvedAttributes)/" + typeAttribute.Name);
            }

            typeAttribute.Explanation = Utils.PropertyFromDataToString(obj["explanation"]);
            typeAttribute.Description = Utils.PropertyFromDataToString(obj["description"]);
            typeAttribute.IsReadOnly = Utils.PropertyFromDataToBool(obj["isReadOnly"]);
            typeAttribute.IsNullable = Utils.PropertyFromDataToBool(obj["isNullable"]);
            typeAttribute.SourceName = Utils.PropertyFromDataToString(obj["sourceName"]);
            typeAttribute.SourceOrdering = Utils.PropertyFromDataToInt(obj["sourceOrdering"]);
            typeAttribute.DisplayName = Utils.PropertyFromDataToString(obj["displayName"]);
            typeAttribute.ValueConstrainedToList = Utils.PropertyFromDataToBool(obj["valueConstrainedToList"]);
            typeAttribute.MaximumLength = Utils.PropertyFromDataToInt(obj["maximumLength"]);
            typeAttribute.MaximumValue = Utils.PropertyFromDataToString(obj["maximumValue"]);
            typeAttribute.MinimumValue = Utils.PropertyFromDataToString(obj["minimumValue"]);
            typeAttribute.DefaultValue = obj["defaultValue"];

            var dataFormat = Utils.PropertyFromDataToString(obj["dataFormat"]);
            if (dataFormat != null)
            {
                bool success = Enum.TryParse(dataFormat, true, out CdmDataFormat cdmDataFormat);
                if (success)
                {
                    typeAttribute.DataFormat = cdmDataFormat;
                }
                else
                {
                    Logger.Warning(nameof(TypeAttributePersistence), ctx, $"Couldn't find an enum value for {dataFormat}.", nameof(FromData));
                }
            }

            return typeAttribute;
        }

        public static TypeAttribute ToData(CdmTypeAttributeDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            TypeAttribute obj = new TypeAttribute
            {
                Explanation = instance.Explanation,
                Description = instance.GetProperty("description"),
                Name = instance.Name,
                Purpose = Utils.JsonForm(instance.Purpose, resOpt, options),
                DataType = Utils.JsonForm(instance.DataType, resOpt, options),
                AppliedTraits = CopyDataUtils.ListCopyData(resOpt, instance.AppliedTraits?.Where(trait => !trait.IsFromProperty), options),
                AttributeContext = Utils.JsonForm(instance.AttributeContext, resOpt, options),
                ResolutionGuidance = Utils.JsonForm(instance.ResolutionGuidance, resOpt, options)
            };

            var isReadOnly = instance.GetProperty("isReadOnly");
            obj.IsReadOnly = isReadOnly ? isReadOnly : null;

            var isNullable = instance.GetProperty("isNullable");
            obj.IsNullable = isNullable ? isNullable : null;

            obj.SourceName = instance.GetProperty("sourceName");

            var sourceOrdering = instance.GetProperty("sourceOrdering");
            obj.SourceOrdering = sourceOrdering != 0 ? sourceOrdering : null;

            obj.DisplayName = instance.GetProperty("displayName");
            obj.Description = instance.GetProperty("description");

            var valueConstrainedToList = instance.GetProperty("valueConstrainedToList");
            obj.ValueConstrainedToList = valueConstrainedToList ? valueConstrainedToList : null;

            var isPrimaryKey = instance.GetProperty("isPrimaryKey");
            obj.IsPrimaryKey = isPrimaryKey ? isPrimaryKey : null;

            obj.MaximumLength = instance.GetProperty("maximumLength");
            obj.MaximumValue = instance.GetProperty("maximumValue");
            obj.MinimumValue = instance.GetProperty("minimumValue");

            var dataFormat = instance.GetProperty("dataFormat");
            obj.DataFormat = dataFormat != CdmDataFormat.Unknown ? dataFormat.ToString() : null;

            var defaultValue = instance.GetProperty("defaultValue");

            var defValue = instance.GetProperty("defaultValue");
            if (defValue is List<object>)
            {
                obj.DefaultValue = defValue.Count > 0 ? JToken.FromObject(defValue) : null;
            }
            else
            {
                obj.DefaultValue = defValue;
            }

            return obj;
        }

    }
}
