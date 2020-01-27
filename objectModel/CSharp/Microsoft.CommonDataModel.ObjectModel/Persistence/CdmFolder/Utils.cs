namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;
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
        public static CdmAttributeItem CreateAttribute(CdmCorpusContext ctx, dynamic obj)
        {
            if (obj == null)
                return null;

            if (obj is JValue)
                return AttributeGroupReferencePersistence.FromData(ctx, obj);
            else
            {
                if (obj["attributeGroupReference"] != null)
                    return AttributeGroupReferencePersistence.FromData(ctx, obj);
                else if (obj["entity"] != null)
                    return EntityAttributePersistence.FromData(ctx, obj);
                else if (obj["name"] != null)
                    return TypeAttributePersistence.FromData(ctx, obj);
            }
            return null;
        }

        /// <summary>
        /// Converts a JSON object to a CdmCollection of attributes
        /// </summary>
        public static List<CdmAttributeItem> CreateAttributeList(CdmCorpusContext ctx, dynamic obj)
        {
            if (obj == null)
                return null;

            List<CdmAttributeItem> result = new List<CdmAttributeItem>();

            for (int i = 0; i < obj.Count; i++)
            {
                dynamic ea = obj[i];
                result.Add(CreateAttribute(ctx, ea));
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
        /// Converts a JSON object to a CdmCollection of TraitReferences
        /// </summary>
        public static List<CdmTraitReference> CreateTraitReferenceList(CdmCorpusContext ctx, dynamic obj)
        {
            if (obj == null)
                return null;

            List<CdmTraitReference> result = new List<CdmTraitReference>();
            JArray traitRefObj = null;
            if (obj.GetType() != typeof(JArray) && obj["value"] != null && obj["value"].GetType() == typeof(JArray))
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
                    result.Add(TraitReferencePersistence.FromData(ctx, tr));
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
        public static List<T> ListCopyData<T>(ResolveOptions resOpt, IEnumerable<dynamic> source, CopyOptions options)
        {
            if (source == null)
                return null;
            List<T> casted = new List<T>();
            foreach (var element in source)
            {
                T newElement = ((CdmObject)element)?.CopyData(resOpt, options);
                casted.Add(newElement);
            }
            if (casted.Count == 0)
                return null;
            return casted;
        }

        /// <summary>
        /// Creates a list of JSON objects that is a copy of the input IEnumerable object
        /// </summary>
        public static List<JToken> ListCopyData(ResolveOptions resOpt, IEnumerable<dynamic> source, CopyOptions options)
        {
            if (source == null)
                return null;
            List<JToken> casted = new List<JToken>();
            foreach (var element in source)
            {
                casted.Add(JToken.FromObject(element?.CopyData(resOpt, options), JsonSerializationUtil.JsonSerializer));
            }
            if (casted.Count == 0)
                return null;
            return casted;
        }

    }
}
