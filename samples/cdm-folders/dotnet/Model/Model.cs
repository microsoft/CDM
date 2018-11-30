
namespace Microsoft.CdmFolders.SampleLibraries
{
    using System;
    using System.Globalization;
    using System.IO;
    using Microsoft.CdmFolders.SampleLibraries.SerializationHelpers;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// The Model object represents an entity-relationship model with some extra metadata
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class Model : DataObject
    {
        /// <summary>
        /// The model file extension
        /// </summary>
        public const string ModelFileExtension = ".json";

        /// <summary>
        /// The model file name
        /// </summary>
        public const string ModelFileName = "model" + ModelFileExtension;

        /// <summary>
        /// The current model schema version
        /// </summary>
        private const string CurrentSchemaVersion = "1.0";

        private static readonly JsonSerializerSettings SerializeSettings = new JsonSerializerSettings()
        {
            SerializationBinder = new TypeNameSerializationBinder(),
            Formatting = Formatting.None,
            ContractResolver = new CollectionsContractResolver(),
        };

        private static readonly JsonSerializerSettings DeserializeSettings = new JsonSerializerSettings()
        {
            SerializationBinder = new TypeNameSerializationBinder(),
        };

        /// <summary>
        /// Initializes a new instance of the <see cref="Model"/> class.
        /// </summary>
        public Model()
        {
            this.Version = CurrentSchemaVersion;
            this.Entities = new EntityCollection(this);
            this.Relationships = new RelationshipCollection(this);
            this.ReferenceModels = new ReferenceModelCollection();
        }

        /// <summary>
        /// Gets or sets the schema version
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Include)]
        public string Version { get; set; }

        /// <summary>
        /// Gets the Entities
        /// </summary>
        [JsonProperty(Order = SerializationOrderConstants.CollectionSerializationOrder)]
        public EntityCollection Entities { get; }

        /// <summary>
        /// Gets the Relationships
        /// </summary>
        [JsonProperty(Order = SerializationOrderConstants.CollectionSerializationOrder)]
        public RelationshipCollection Relationships { get; }

        /// <summary>
        /// Gets the Reference Models
        /// </summary>
        [JsonProperty(Order = SerializationOrderConstants.CollectionSerializationOrder)]
        public ReferenceModelCollection ReferenceModels { get; }

        /// <summary>
        /// Gets or sets the Culture
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public CultureInfo Culture { get; set; }

        /// <summary>
        /// Gets or sets the modified time
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? ModifiedTime { get; set; }

        /// <summary>
        /// Deserializes a model from JObject
        /// </summary>
        /// <param name="jObject">The JObject of the model</param>
        /// <returns>JObject of the model</returns>
        public static Model Import(JObject jObject)
        {
            if (jObject == null)
            {
                return null;
            }

            var serializer = JsonSerializer.Create(DeserializeSettings);
            return jObject.ToObject<Model>(serializer);
        }

        /// <summary>
        /// FromJson
        /// </summary>
        /// <param name="modelJson">The string representation of the Json</param>
        public void FromJson(string modelJson)
        {
            this.Version = null;
            JsonConvert.PopulateObject(modelJson, this, DeserializeSettings);
        }

        /// <summary>
        /// Serializes the model as JObject
        /// </summary>
        /// <returns>JObject of the model</returns>
        public JObject Export()
        {
            var serializer = JsonSerializer.Create(SerializeSettings);
            return JObject.FromObject(this, serializer);
        }

        /// <summary>
        /// Serializes the model as string
        /// </summary>
        /// <returns>String of the model</returns>
        public string ToJson()
        {
            return JsonConvert.SerializeObject(this, SerializeSettings);
        }

        /// <summary>
        /// Validates that loaded model is correct and can function
        /// </summary>
        public void ValidateModel()
        {
            this.Validate();
        }

        /// <inheritdoc/>
        internal override void Validate(bool allowUnresolvedModelReferences = true)
        {
            if (this.Version != CurrentSchemaVersion)
            {
                throw new InvalidDataException($"Invalid model version: {this.Version}");
            }

            base.Validate(allowUnresolvedModelReferences);

            this.ReferenceModels.Validate();
            this.Entities.Validate(allowUnresolvedModelReferences);
            this.Relationships.Validate(allowUnresolvedModelReferences);
        }
    }
}