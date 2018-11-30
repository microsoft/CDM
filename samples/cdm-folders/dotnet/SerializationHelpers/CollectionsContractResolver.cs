
namespace Microsoft.CdmFolders.SampleLibraries.SerializationHelpers
{
    using System;
    using System.Collections;
    using System.Linq;
    using System.Reflection;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    /// <summary>
    /// This resolver overrides the property serialization so that
    /// the property that is an empty collection is not serialized
    /// </summary>
    public class CollectionsContractResolver : CamelCasePropertyNamesContractResolver
    {
        /// <inheritdoc/>
        protected override JsonDictionaryContract CreateDictionaryContract(Type objectType)
        {
            JsonDictionaryContract contract = base.CreateDictionaryContract(objectType);

            contract.DictionaryKeyResolver = propertyName => propertyName;

            return contract;
        }

        /// <inheritdoc/>
        protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
        {
            JsonProperty property = base.CreateProperty(member, memberSerialization);
            Predicate<object> shouldSerializePredicates = property.ShouldSerialize;

            if (property.PropertyType != typeof(string) && property.PropertyType.GetInterfaces().Contains(typeof(IEnumerable)))
            {
                property.ShouldSerialize = sourceObj => (shouldSerializePredicates == null || shouldSerializePredicates(sourceObj))
                            && this.ShouldSerializeCollection(property, sourceObj);
            }

            return property;
        }

        private bool ShouldSerializeCollection(JsonProperty property, object sourceObj)
        {
            var enumerable = property.ValueProvider.GetValue(sourceObj) as IEnumerable;
            if (enumerable != null)
            {
                return enumerable.GetEnumerator().MoveNext();
            }

            return false;
        }
    }
}
