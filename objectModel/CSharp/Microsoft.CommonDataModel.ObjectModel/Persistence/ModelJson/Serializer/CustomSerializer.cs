// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types.Serializer;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    /// <summary>
    /// Custom serializer is needed because "model.json" files can have extensibility properties.
    /// These properties are stored in a JObject that is a property of MetadataObject class,
    /// and should be serialized /deserialized as if they were properties of MetadataObject class.
    /// </summary>
    class CustomSerializer : JsonConverter
    {
        /// <inheritdoc />
        public override bool CanConvert(Type objectType)
        {
            return objectType.IsSubclassOf(typeof(MetadataObject));
        }

        /// <summary>
        /// An object is deserialized into a given type. Fields of the object that are not present in the given type will be placed in <see cref="MetadataObject.ExtensionFields"/>
        /// </summary>        
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var readJtoken = reader.Value;
            var jObject = JObject.Load(reader);

            var ret = Activator.CreateInstance(objectType);

            var nameToPropertyDictionary = SerializerHelper.GetTypeInfo(objectType).NameToPropertyDictionary;

            JObject extensions = null;

            var objectChildren = jObject.Children();

            foreach (JProperty foundProperty in objectChildren)
            {
                string propertyName = foundProperty.Name;
                if (nameToPropertyDictionary.ContainsKey(propertyName))
                {
                    var targetProperty = nameToPropertyDictionary[propertyName];
                    var targetJToken = foundProperty.Value;
                    var targetObject = targetJToken.ToObject(targetProperty.Type);
                    targetProperty.SetValue(ret, targetObject);
                }
                else
                {
                    if (extensions == null) { extensions = new JObject(); }
                    extensions.Add(foundProperty.Name, foundProperty.Value);
                }
            }

            if (extensions != null)
            {
                (ret as MetadataObject).ExtensionFields = extensions;
            }

            return ret;
        }

        /// <summary>
        /// Serializes an object of type <see cref="MetadataObject"/>.
        /// Everything that is found in <see cref="MetadataObject.ExtensionFields"/> will be serialized as if it was a direct property of the object to be serialized.
        /// </summary>        
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var objectType = value.GetType();

            var destinationProperties = SerializerHelper.GetTypeInfo(objectType).ListOfProperties;
            writer.WriteStartObject();
            int destinationPropertiesIndex;
            for (destinationPropertiesIndex = 0; destinationPropertiesIndex < destinationProperties.Count; destinationPropertiesIndex++)
            {
                var property = destinationProperties[destinationPropertiesIndex];

                // Extensions have to be inserted amnog defined properties as if they had default order.
                // (this ensures we are able to enforce a property to be serialized first or last)
                // Properties that have Order > -1, will have to be serialized after extensions. They should not be handled in this for.
                if (property.Order > -1)
                {
                    break;
                }
                WriteProperty(writer, value, serializer, property);
            }

            var extensions = (value as MetadataObject)?.ExtensionFields;

            if (extensions != null)
            {
                foreach (var extension in extensions)
                {
                    writer.WritePropertyName(extension.Key);
                    serializer.Serialize(writer, extension.Value);
                }
            }

            for (; destinationPropertiesIndex < destinationProperties.Count; destinationPropertiesIndex++)
            {
                var property = destinationProperties[destinationPropertiesIndex];
                WriteProperty(writer, value, serializer, property);
            }
            writer.WriteEndObject();
        }

        private void WriteProperty(JsonWriter writer, object value, JsonSerializer serializer, PropertyInfoPreprocessed property)
        {
            var propertyValue = property.FetchValueAtIndex(value);

            if (propertyValue == null)
            {
                return;
            }

            writer.WritePropertyName(property.Name);
            serializer.Serialize(writer, propertyValue);
        }
    }
}
