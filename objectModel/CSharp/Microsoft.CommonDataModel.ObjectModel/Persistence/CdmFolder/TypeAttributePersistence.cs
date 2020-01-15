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
        public static CdmTypeAttributeDefinition FromData(CdmCorpusContext ctx, JToken obj)
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

            typeAttribute.Explanation = (string)obj["explanation"];
            typeAttribute.Description = (string)obj["description"];
            typeAttribute.IsReadOnly = (bool?)obj["isReadOnly"];
            typeAttribute.IsNullable = (bool?)obj["isNullable"];
            typeAttribute.SourceName = (string)obj["sourceName"];
            typeAttribute.SourceOrdering = (int?)obj["sourceOrdering"];
            typeAttribute.DisplayName = (string)obj["displayName"];
            typeAttribute.Description = (string)obj["description"];
            typeAttribute.ValueConstrainedToList = (bool?)obj["valueConstrainedToList"];
            typeAttribute.MaximumLength = (int?)obj["maximumLength"];
            typeAttribute.MaximumValue = (string)obj["maximumValue"];
            typeAttribute.MinimumValue = (string)obj["minimumValue"];
            var dataFormat = (string)obj["dataFormat"];
            if (dataFormat != null)
            {
                bool success = Enum.TryParse(dataFormat, out CdmDataFormat cdmDataFormat);
                if (success)
                {
                    typeAttribute.DataFormat = cdmDataFormat;
                } else
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
                AppliedTraits = Utils.ListCopyData(resOpt, instance.AppliedTraits?.Where(trait => !trait.IsFromProperty)?.ToList(), options),
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
                obj.DefaultValue = JToken.FromObject(defValue);
            }
            else
            {
                obj.DefaultValue = defValue;
            }

            return obj;
        }
    }
}
