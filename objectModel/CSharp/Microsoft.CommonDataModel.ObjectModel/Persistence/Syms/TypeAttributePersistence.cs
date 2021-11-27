// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Models;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Newtonsoft.Json.Serialization;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    class TypeAttributePersistence
    {
        private static readonly string Tag = nameof(TypeAttributePersistence);

        public static CdmTypeAttributeDefinition FromData(CdmCorpusContext ctx, DataColumn obj, string entityName = null)
        {
            var typeAttribute = ctx.Corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, obj.Name);
            var properties = obj.OriginDataTypeName.Properties;

            typeAttribute.DataFormat = Utils.SymsDataTypeToCDMDataFormat(obj.OriginDataTypeName);

            if (obj.OriginDataTypeName.Length > 0 && typeAttribute.DataFormat == CdmDataFormat.String)
            {
                typeAttribute.DataFormat = CdmDataFormat.Guid;
            }

            if (obj.OriginDataTypeName.Scale != 0 || obj.OriginDataTypeName.Precision != 0)
            {
                var numericTraits = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "is.dataFormat.numeric.shaped", true);

                var scaleTraitsArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "scale");
                scaleTraitsArg.Value = obj.OriginDataTypeName.Scale;
                numericTraits.Arguments.Add(scaleTraitsArg);

                var precisionTraitsArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "scale");
                precisionTraitsArg.Value = obj.OriginDataTypeName.Scale;
                numericTraits.Arguments.Add(precisionTraitsArg);
            }

            if (properties != null)
            {
                if (properties.ContainsKey("cdm:purpose"))
                {
                    typeAttribute.Purpose = properties["cdm:purpose"].ToObject<CdmPurposeReference>();
                }
                if (properties.ContainsKey("cdm:dataType"))
                {
                    typeAttribute.DataType = properties["cdm:dataType"].ToObject<CdmDataTypeReference> ();
                }
                if (properties.ContainsKey("cdm:cardinality"))
                {
                    string minCardinality = null;
                    if (properties["cdm:minimum"] != null)
                        minCardinality = properties["cdm:minimum"].ToObject<string>();

                    string maxCardinality = null;
                    if (properties["cdm:maximum"] != null)
                        maxCardinality = properties["cdm:maximum"].ToObject<string>();

                    if (string.IsNullOrWhiteSpace(minCardinality) || string.IsNullOrWhiteSpace(maxCardinality))
                    {
                        Logger.Error((ResolveContext)ctx, Tag, nameof(FromData), null, CdmLogCode.ErrPersistCardinalityPropMissing);
                    }

                    if (!CardinalitySettings.IsMinimumValid(minCardinality))
                    {
                        Logger.Error((ResolveContext)ctx, Tag, nameof(FromData), null, CdmLogCode.ErrValdnInvalidMinCardinality, minCardinality);
                    }

                    if (!CardinalitySettings.IsMaximumValid(maxCardinality))
                    {
                        Logger.Error((ResolveContext)ctx, Tag, nameof(FromData), null, CdmLogCode.ErrValdnInvalidMaxCardinality, maxCardinality);
                    }

                    if (!string.IsNullOrWhiteSpace(minCardinality) && !string.IsNullOrWhiteSpace(maxCardinality) &&
                        CardinalitySettings.IsMinimumValid(minCardinality) && CardinalitySettings.IsMinimumValid(maxCardinality))
                    {
                        typeAttribute.Cardinality = new CardinalitySettings(typeAttribute)
                        {
                            Minimum = minCardinality,
                            Maximum = maxCardinality
                        };
                    }
                }
                if (properties.ContainsKey("cdm:traits"))
                {
                    Utils.AddListToCdmCollection(typeAttribute.AppliedTraits, Utils.CreateTraitReferenceList(ctx, properties["cdm:traits"]));
                }
                if (properties.ContainsKey("cdm:isPrimaryKey") &&
                    properties["cdm:isPrimaryKey"].ToObject<bool>())
                {
                    TraitToPropertyMap t2pMap = new TraitToPropertyMap(typeAttribute);
                    t2pMap.UpdatePropertyValue("isPrimaryKey", entityName + "/(resolvedAttributes)/" + typeAttribute.Name);
                }
                if (properties.ContainsKey("cdm:isReadOnly"))
                {
                    typeAttribute.IsReadOnly = properties["cdm:isReadOnly"].ToObject<bool>();
                }
                if (properties.ContainsKey("cdm:sourceName"))
                {
                    typeAttribute.SourceName = properties["cdm:sourceName"].ToObject<string>();
                }
                if (properties.ContainsKey("cdm:sourceOrdering"))
                {
                    typeAttribute.SourceOrdering = properties["cdm:sourceOrdering"].ToObject<int>();
                }
                if (properties.ContainsKey("cdm:valueConstrainedToList"))
                {
                    typeAttribute.ValueConstrainedToList = properties["cdm:valueConstrainedToList"].ToObject<bool>();
                }
                if (properties.ContainsKey("cdm:maximumLength"))
                {
                    typeAttribute.MaximumLength = properties["cdm:maximumLength"].ToObject<int>();
                }
                if (properties.ContainsKey("cdm:maximumValue"))
                {
                    typeAttribute.MaximumValue = properties["cdm:maximumValue"].ToObject<string>();
                }
                if (properties.ContainsKey("cdm:minimumValue"))
                {
                    typeAttribute.MinimumValue = properties["cdm:minimumValue"].ToObject<string>();
                }
                if (properties.ContainsKey("cdm:defaultValue"))
                {
                    typeAttribute.DefaultValue = properties["cdm:defaultValue"];
                }
            }
            
            return typeAttribute;
        }

        public static DataColumn ToData(CdmTypeAttributeDefinition instance, CdmCorpusContext ctx, ResolveOptions resOpt, CopyOptions options)
        {
            var properties = CreateProperties(instance, resOpt, options);
            
            var originDataTypeName = new TypeInfo
            {
                Properties = properties,
                IsComplexType = false,
                IsNullable = instance.GetProperty("isNullable"),
                TypeFamily = "cdm"
            };

            var t2pm = new TraitToPropertyMap(instance); ;
            var numericTraits = t2pm.FetchTraitReference("is.dataFormat.numeric.shaped");
            if (numericTraits != null)
            {
                foreach (var numericTraitsArg in numericTraits.Arguments)
                {
                    if (numericTraitsArg.Name == "precision")
                    {
                        originDataTypeName.Precision = (int)numericTraitsArg.Value;
                    }
                    if (numericTraitsArg.Name == "scale")
                    {
                        originDataTypeName.Scale = (int)numericTraitsArg.Value;
                    }
                }
            }

            var dataFormat = instance.GetProperty("dataFormat");
            originDataTypeName = Utils.CDMDataFormatToSymsDataType(dataFormat, originDataTypeName);
            if (originDataTypeName.TypeName == null)
            {
                Logger.Error(ctx, Tag, nameof(ToData), instance.AtCorpusPath, CdmLogCode.ErrPersistSymsUnknownDataFormat, instance.DisplayName);
                return null;
            }

            return new DataColumn
            {
                OriginDataTypeName = originDataTypeName,
                Name = instance.Name
            };
        }

        private static Dictionary<string, JToken> CreateProperties(CdmTypeAttributeDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            var properties = new Dictionary<string, JToken>();

            var displayName = instance.GetProperty("displayName");
            var sourceName = instance.GetProperty("sourceName");
            var description = instance.GetProperty("description");
            var isReadOnly = instance.GetProperty("isReadOnly");
            var maximumLength = instance.GetProperty("maximumLength");
            var maximumValue = instance.GetProperty("maximumValue");
            var minimumValue = instance.GetProperty("minimumValue");
            var sourceOrdering = instance.GetProperty("sourceOrdering");
            var valueConstrainedToList = instance.GetProperty("valueConstrainedToList");
            var isPrimaryKey = instance.GetProperty("isPrimaryKey");
            var defValue = instance.GetProperty("defaultValue");

            if (displayName != null)
            {
                properties["cdm:displayName"] = JToken.FromObject(displayName);
            }

            if (instance.Explanation != null)
            {
                properties["cdm:explanation"] = JToken.FromObject(instance.Explanation);
            }

            if (sourceName != null)
            {
                properties["cdm:sourceName"] = JToken.FromObject(sourceName);
            }

            if (description != null)
            {
                properties["cdm:description"] = JToken.FromObject(description);
            }

            if (instance.AppliedTraits != null && instance.AppliedTraits.Count > 0)
            {
                properties["cdm:traits"] = JToken.FromObject(CopyDataUtils.ListCopyData(resOpt, instance.AppliedTraits?
                .Where(trait => trait is CdmTraitGroupReference || !(trait as CdmTraitReference).IsFromProperty), options),
                    new JsonSerializer { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() });
            }

            if (isReadOnly != null)
            {
                properties["cdm:isReadOnly"] = JToken.FromObject(isReadOnly);
            }

            if (maximumLength != null)
            {
                properties["cdm:maximumLength"] = JToken.FromObject(maximumLength);
            }

            if (maximumValue != null)
            {
                properties["cdm:maximumValue"] = JToken.FromObject(maximumValue);
            }

            if (minimumValue != null)
            {
                properties["cdm:minimumValue"] = JToken.FromObject(minimumValue);
            }

            if (sourceOrdering != null && sourceOrdering != 0)
            {
                properties["cdm:sourceOrdering"] = JToken.FromObject(sourceOrdering);
            }

            if (valueConstrainedToList != null)
            {
                properties["cdm:valueConstrainedToList"] = JToken.FromObject(valueConstrainedToList);
            }

            if (isPrimaryKey != null)
            {
                properties["cdm:isPrimaryKey"] = JToken.FromObject(isPrimaryKey);
            }

            if (defValue != null)
            {
                properties["cdm:defaultValue"] = JToken.FromObject(defValue);
            }

            return properties;
        }
    }
}
