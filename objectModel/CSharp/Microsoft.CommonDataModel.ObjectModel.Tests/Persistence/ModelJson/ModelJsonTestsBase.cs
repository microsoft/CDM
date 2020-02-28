// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.ModelJson
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;

    /// <summary>
    /// Base class for ModelJson tests.
    /// </summary>
    [TestClass]
    public class ModelJsonTestsBase
    {
        [TestInitialize]
        public void InitializeTests()
        {
            JsonConvert.DefaultSettings = () => GetSerializerSettings();
        }

        /// <summary>
        /// Uses predefined settings to serialize an object.
        /// </summary>
        /// <param name="data">The object to be serialized</param>
        /// <returns>A string containing the serialized object.</returns>
        public string Serialize(object data)
        {
            var serializerSettings = GetSerializerSettings();
            return JsonConvert.SerializeObject(data, serializerSettings);
        }

        /// <summary>
        /// Use predefined settings to deserialize an object.
        /// </summary>
        /// <typeparam name="T">The type of the object to be deserialized</typeparam>
        /// <param name="data">String to be deserialized into an object</param>
        /// <returns>The deserialized object.</returns>
        public T Deserialize<T>(string data)
        {
            var serializerSettings = GetSerializerSettings();
            return JsonConvert.DeserializeObject<T>(data, serializerSettings);
        }


        /// <summary>
        /// Creates serializer settings that will serialize DateTime in UTC and will use indentation.
        /// </summary>
        /// <returns>Serializer settings that handle TimeZone and indentation..</returns>
        private JsonSerializerSettings GetSerializerSettings()
        {
            return new JsonSerializerSettings()
            {
                Formatting = Formatting.Indented,
                DateTimeZoneHandling = DateTimeZoneHandling.Utc,
                DateParseHandling = DateParseHandling.DateTime,
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
                DateFormatString = "yyyy'-'MM'-'dd'T'HH':'mm':'ss.FFFFFFFK",
                NullValueHandling = NullValueHandling.Ignore
            };
        }
    }
}
