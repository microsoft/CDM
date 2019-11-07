namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.ModelJson
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    using System.IO;

    /// <summary>
    /// Base class for ModelJson tests.
    /// </summary>
    [TestClass]
    public class ModelJsonTestsBase
    {
        private const string SchemaDocsRoot = "../../../../../../CDM.SchemaDocuments";

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
        /// Gets local corpus.
        /// </summary>
        /// <returns>The <see cref="CdmCorpusDef"/>. </returns>
        protected CdmCorpusDefinition GetLocalCorpus(string testFilesRoot)
        {
            Assert.IsTrue(Directory.Exists(Path.GetFullPath(SchemaDocsRoot)), "SchemaDocsRoot not found!!!");

            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.DefaultNamespace = "local";

            cdmCorpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);

            cdmCorpus.Storage.Mount("local", new LocalAdapter(testFilesRoot));
            cdmCorpus.Storage.Mount("cdm", new LocalAdapter(SchemaDocsRoot));
            var hosts = new Dictionary<string, string>();
            hosts.Add("contoso", "http://contoso.com");
            cdmCorpus.Storage.Mount("remote", new RemoteAdapter()
            {
                Hosts = hosts
            });

            return cdmCorpus;
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
