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
            typeAttribute.AttributeContext = AttributeContextReferencePersistence.FromData(ctx, obj["attributeContext"]);
            Utils.AddListToCdmCollection(typeAttribute.AppliedTraits, Utils.CreateTraitReferenceList(ctx, obj["appliedTraits"]));
            typeAttribute.ResolutionGuidance = AttributeResolutionGuidancePersistence.FromData(ctx, obj["resolutionGuidance"]);

            if (obj["isPrimaryKey"] != null && (bool)obj["isPrimaryKey"] && entityName != null)
            {
                TraitToPropertyMap t2pMap = new TraitToPropertyMap(typeAttribute);
                t2pMap.UpdatePropertyValue("isPrimaryKey", entityName + "/(resolvedAttributes)/" + typeAttribute.Name);
            }

            typeAttribute.Explanation = PropertyFromDataToString(obj["explanation"]);
            typeAttribute.Description = PropertyFromDataToString(obj["description"]);
            typeAttribute.IsReadOnly = PropertyFromDataToBool(obj["isReadOnly"]);
            typeAttribute.IsNullable = PropertyFromDataToBool(obj["isNullable"]);
            typeAttribute.SourceName = PropertyFromDataToString(obj["sourceName"]);
            typeAttribute.SourceOrdering = PropertyFromDataToInt(obj["sourceOrdering"]);
            typeAttribute.DisplayName = PropertyFromDataToString(obj["displayName"]);
            typeAttribute.ValueConstrainedToList = PropertyFromDataToBool(obj["valueConstrainedToList"]);
            typeAttribute.MaximumLength = PropertyFromDataToInt(obj["maximumLength"]);
            typeAttribute.MaximumValue = PropertyFromDataToString(obj["maximumValue"]);
            typeAttribute.MinimumValue = PropertyFromDataToString(obj["minimumValue"]);
            var dataFormat = PropertyFromDataToString(obj["dataFormat"]);
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

            typeAttribute.DefaultValue = obj["defaultValue"];

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
                AppliedTraits = CopyDataUtils.ListCopyData(resOpt, instance.AppliedTraits?.Where(trait => !trait.IsFromProperty)?.ToList(), options),
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

        /// <summary>
        /// Converts dynamic input into a string for a property (ints are converted to string)
        /// </summary>
        /// <param name="value">The value that should be converted to a string.</param>
        private static string PropertyFromDataToString(dynamic value)
        {
            string stringValue = (string)value;
            if (!string.IsNullOrWhiteSpace(stringValue))
            {
                return stringValue;
            }
            else if (value is int)
            {
                return value.ToString();
            }
            return null;
        }

        /// <summary>
        /// Converts dynamic input into an int for a property (numbers represented as strings are converted to int)
        /// </summary>
        /// <param name="value">The value that should be converted to an int.</param>
        private static int? PropertyFromDataToInt(dynamic value)
        {
            if (value is int)
            {
                return value;
            }
            string stringValue = (string)value;
            if (!string.IsNullOrWhiteSpace(stringValue) && Int32.TryParse(stringValue, out int intValue))
            {
                return intValue;
            }
            return null;
        }

        /// <summary>
        /// Converts dynamic input into a boolean for a property (booleans represented as strings are converted to boolean)
        /// </summary>
        /// <param name="value">The value that should be converted to a boolean.</param>
        private static bool? PropertyFromDataToBool(dynamic value)
        {
            if (value is bool)
                return value;
            if (bool.TryParse((string)value, out bool boolValue))
                return boolValue;
            return null;
        }
    }
}
