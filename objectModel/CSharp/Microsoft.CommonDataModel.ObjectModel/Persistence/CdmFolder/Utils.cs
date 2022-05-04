// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types.Projections;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;

    public static class Utils
    {
        /// <summary>
        /// Create a copy of the reference object
        /// </summary>
        public static dynamic CopyIdentifierRef(CdmObjectReference objRef, ResolveOptions resOpt, CopyOptions options)
        {
            string identifier = objRef.NamedReference;
            if (options == null || options.StringRefs == null || options.StringRefs == false)
                return identifier;

            CdmObjectDefinition resolved = objRef.FetchObjectDefinition<CdmObjectDefinition>(resOpt);
            if (resolved == null)
                return identifier;

            return new { AtCorpusPath = resolved.AtCorpusPath, Identifier = identifier };
        }

        /// <summary>
        /// Creates a JSON object in the correct shape given an instance of a CDM object
        /// </summary>
        public static dynamic JsonForm(dynamic instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
                return null;
            dynamic dataForm = instance.CopyData(resOpt, options);
            if (dataForm == null)
                return "serializationError";
            if (dataForm is string)
                return dataForm as string;
            return JToken.FromObject(dataForm, JsonSerializationUtil.JsonSerializer);
        }

        /// <summary>
        /// Converts a JSON object to an Attribute object
        /// </summary>
        public static CdmAttributeItem CreateAttribute(CdmCorpusContext ctx, dynamic obj, string entityName = null)
        {
            if (obj == null)
                return null;

            if (obj is JValue)
                return AttributeGroupReferencePersistence.FromData(ctx, obj);
            else
            {
                if (obj["attributeGroupReference"] != null)
                    return AttributeGroupReferencePersistence.FromData(ctx, obj, entityName);
                else if (obj["entity"] != null)
                    return EntityAttributePersistence.FromData(ctx, obj);
                else if (obj["name"] != null)
                    return TypeAttributePersistence.FromData(ctx, obj, entityName);
            }
            return null;
        }

        /// <summary>
        /// Converts a JSON object to a CdmCollection of attributes
        /// </summary>
        public static List<CdmAttributeItem> CreateAttributeList(CdmCorpusContext ctx, dynamic obj, string entityName = null)
        {
            if (obj == null)
                return null;

            List<CdmAttributeItem> result = new List<CdmAttributeItem>();

            for (int i = 0; i < obj.Count; i++)
            {
                dynamic ea = obj[i];
                result.Add(CreateAttribute(ctx, ea, entityName));
            }
            return result;
        }

        /// <summary>
        /// Creates a CDM object from a JSON object
        /// </summary>
        public static dynamic CreateConstant(CdmCorpusContext ctx, dynamic obj)
        {
            if (obj == null)
                return null;
            if (obj is JValue)
            {
                return obj.Value;
            }
            else if (obj is JObject)
            {
                if (obj["purpose"] != null || obj["dataType"] != null || obj["entity"] != null)
                {
                    if (obj["dataType"] != null)
                        return TypeAttributePersistence.FromData(ctx, obj);
                    else if (obj["entity"] != null)
                        return EntityAttributePersistence.FromData(ctx, obj);
                    else
                        return null;
                }
                else if (obj["purposeReference"] != null)
                    return PurposeReferencePersistence.FromData(ctx, obj);
                else if (obj["traitReference"] != null)
                    return TraitReferencePersistence.FromData(ctx, obj);
                else if (obj["traitGroupReference"] != null)
                    return TraitGroupReferencePersistence.FromData(ctx, obj);
                else if (obj["dataTypeReference"] != null)
                    return DataTypeReferencePersistence.FromData(ctx, obj);
                else if (obj["entityReference"] != null)
                    return EntityReferencePersistence.FromData(ctx, obj);
                else if (obj["attributeGroupReference"] != null)
                    return AttributeGroupReferencePersistence.FromData(ctx, obj);
                else
                    return obj;
            }
            else
            {
                return obj;
            }
        }

        /// <summary>
        /// Converts a JSON object to a CdmCollection of TraitReferences and TraitGroupReferences
        /// </summary>
        public static List<CdmTraitReferenceBase> CreateTraitReferenceList(CdmCorpusContext ctx, dynamic obj)
        {
            if (obj == null)
                return null;

            List<CdmTraitReferenceBase> result = new List<CdmTraitReferenceBase>();
            JArray traitRefObj = null;
            if (obj.GetType() == typeof(List<JToken>))
            {
                traitRefObj = JArray.FromObject(obj);
            }
            else if (obj.GetType() != typeof(JArray) && obj["value"] != null && obj["value"].GetType() == typeof(JArray))
            {
                traitRefObj = obj["value"];
            }
            else
            {
                traitRefObj = obj;
            }

            if (traitRefObj != null)
            {
                for (int i = 0; i < traitRefObj.Count; i++)
                {
                    dynamic tr = traitRefObj[i];

                    if (!(tr is JValue) && tr["traitGroupReference"] != null)
                    {
                        result.Add(TraitGroupReferencePersistence.FromData(ctx, tr));
                    }
                    else
                    {
                        result.Add(TraitReferencePersistence.FromData(ctx, tr));
                    }
                }
            }

            return result;
        }

        /// <summary>
        /// Adds all elements of a list to a CdmCollection
        /// </summary>
        public static void AddListToCdmCollection<T>(CdmCollection<T> cdmCollection, List<T> list) where T : CdmObject
        {
            if (cdmCollection != null && list != null)
            {
                foreach (var element in list)
                {
                    cdmCollection.Add(element);
                }
            }
        }

        /// <summary>
        /// Creates a list object that is a copy of the input IEnumerable object
        /// </summary>
        public static List<T> ListCopyData<T>(ResolveOptions resOpt, IEnumerable<dynamic> source, CopyOptions options, Func<dynamic, bool> condition = null)
        {
            if (source == null)
                return null;
            List<T> casted = new List<T>();
            foreach (var element in source)
            {
                if (condition == null || (condition != null && condition(element))) {
                    T newElement = ((CdmObject)element)?.CopyData(resOpt, options);
                    casted.Add(newElement);
                }
            }
            if (casted.Count == 0)
                return null;
            return casted;
        }

        /// <summary>
        /// Converts dynamic input into a string for a property (ints are converted to string)
        /// </summary>
        /// <param name="value">The value that should be converted to a string.</param>
        internal static string PropertyFromDataToString(dynamic value)
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
        internal static int? PropertyFromDataToInt(dynamic value)
        {
            if (value is int)
            {
                return value;
            }
            string stringValue = (string)value;
            if (!string.IsNullOrWhiteSpace(stringValue) && int.TryParse(stringValue, out int intValue))
            {
                return intValue;
            }
            return null;
        }

        /// <summary>
        /// Converts dynamic input into a boolean for a property (booleans represented as strings are converted to boolean)
        /// </summary>
        /// <param name="value">The value that should be converted to a boolean.</param>
        internal static bool? PropertyFromDataToBool(dynamic value)
        {
            if (value is bool)
                return value;
            if (bool.TryParse((string)value, out bool boolValue))
                return boolValue;
            return null;
        }

        /// <summary>
        /// Converts cardinality data in JToken form into a CardinalitySettings object
        /// </summary>
        /// <param name="obj">The JToken representation of CardinalitySettings.</param>
        /// <param name="attribute">The attribute object where the cardinality object belongs.</param>
        internal static CardinalitySettings CardinalitySettingsFromData(JToken obj, CdmAttribute attribute)
        {
            if (obj == null)
                return null;

            CardinalitySettings cardinality = new CardinalitySettings(attribute)
            {
                Minimum = obj["minimum"]?.ToString(),
                Maximum = obj["maximum"]?.ToString()
            };

            return cardinality.Minimum != null && cardinality.Maximum != null ? cardinality : null;
        }

        /// <summary>
        /// Converts CardinalitySettings into a JToken object
        /// </summary>
        /// <param name="instance">The CardinalitySettings object.</param>
        internal static dynamic CardinalitySettingsToData(CardinalitySettings instance)
        {
            if (instance == null || instance.Minimum == null || instance.Maximum == null)
                return null;

            return new CardinalitySettingsData
            {
                Minimum = instance.Minimum,
                Maximum = instance.Maximum
            };
        }
    }
}
