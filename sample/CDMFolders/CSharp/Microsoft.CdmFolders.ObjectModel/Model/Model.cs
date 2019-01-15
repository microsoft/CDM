// <copyright file="Model.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using Microsoft.CdmFolders.ObjectModel.SerializationHelpers;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Represents the data in the CDM folder, metadata and location, 
    /// as well as how it was generated and by which data producer.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class Model : DataObject
    {
        /// <summary>
        /// the model file extension
        /// </summary>
        public const string ModelFileExtension = ".json";

        /// <summary>
        /// the model file name
        /// </summary>
        public const string ModelFileName = "model" + ModelFileExtension;

        /// <summary>
        /// The current model schema version
        /// </summary>
        private const string CurrentSchemaVersion = "1.0";

        public JsonSerializerSettings SerializeSettings { get; }

        public JsonSerializerSettings DeserializeSettings { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Model"/> class.
        /// </summary>
        public Model()
        {
            this.SerializeSettings = new JsonSerializerSettings()
            {
                SerializationBinder = new TypeNameSerializationBinder(this.GetType().Assembly, this.GetType().Namespace),
                Formatting = Formatting.None,
                ContractResolver = new CollectionsContractResolver(),
            };
            this.DeserializeSettings = new JsonSerializerSettings()
            {
                SerializationBinder = new TypeNameSerializationBinder(this.GetType().Assembly, this.GetType().Namespace),
                Converters = new [] { new ExtensionsConverter<ReferenceModel>(this.GetType().Assembly, this.GetType().Namespace) },
            };

            this.Version = CurrentSchemaVersion;
            this.Entities = new EntityCollection();
            this.Relationships = new RelationshipCollection();
            this.ReferenceModels = new ReferenceModelCollection();
        }

        /// <summary>
        /// Gets or sets the a string the producer uses to identify model.json files it created
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Application { get; set; }

        /// <summary>
        /// Gets or sets the schema version
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Include)]
        public string Version { get; set; }

        /// <summary>
        /// Gets the Entities
        /// </summary>
        [JsonProperty(Order = SerializationOrderConstants.CollectionSerializationOrder)]
        public EntityCollection Entities { get; private set; }

        /// <summary>
        /// Gets the Relationships
        /// </summary>
        [JsonProperty(Order = SerializationOrderConstants.CollectionSerializationOrder)]
        public RelationshipCollection Relationships { get; private set; }

        /// <summary>
        /// Gets the Relationships
        /// </summary>
        [JsonProperty(Order = SerializationOrderConstants.CollectionSerializationOrder)]
        public ReferenceModelCollection ReferenceModels { get; private set; }

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
        public static T Import<T>(JObject jObject) where T : Model
        {
            if (jObject == null)
            {
                return null;
            }

            Type modelType = typeof(T);
            var serializer = JsonSerializer.Create(
                new JsonSerializerSettings()
                {
                    SerializationBinder = new TypeNameSerializationBinder(modelType.Assembly, modelType.Namespace),
                    Converters = new[] { new ExtensionsConverter<ReferenceModel>(modelType.Assembly, modelType.Namespace) },
                });

            return jObject.ToObject<T>(serializer);
        }

        /// <summary>
        /// Returns a model from a json string
        /// </summary>
        /// <param name="modelJson">The string representation of the Json</param>
        public static T Import<T>(string modelJson) where T : Model, new()
        {
            var model = new T();
            model.Import(modelJson);

            return model;
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
        /// Serializes the model as json string
        /// </summary>
        /// <returns>string of the model</returns>
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this, SerializeSettings);
        }

        /// <inheritdoc/>
        public override object Clone()
        {
            var clone = (Model)base.Clone();
            clone.Entities = (EntityCollection)this.Entities.Clone();
            clone.ReferenceModels = (ReferenceModelCollection)this.ReferenceModels.Clone();
            clone.Relationships = (RelationshipCollection)this.Relationships.Clone();

            return clone;
        }

        /// <summary>
        /// Validates that loaded <see cref="Model"/> is correct and can function.
        /// </summary>
        /// <param name="allowUnresolvedModelReferences">indicates whether the method should check that the model references are valid</param>
        public void Validate(bool allowUnresolvedModelReferences = true)
        {
            this.InternalValidate();
            if (!allowUnresolvedModelReferences)
            {
                IEnumerable<ReferenceEntity> entitiesNotInRefModel = this.Entities
                    .OfType<ReferenceEntity>()
                    .Where(referenceEntity => !this.ReferenceModels.Any(referenceModel => referenceModel.Id == referenceEntity.ModelId));

                if(entitiesNotInRefModel.Any())
                {
                    throw new InvalidDataException($"No reference model for {nameof(ReferenceEntity)} {string.Join(",", entitiesNotInRefModel)}.");
                }
            }
        }

        /// <inheritdoc/>
        internal override void Validate()
        {
            this.InternalValidate();
        }

        private void InternalValidate()
        {
            // TODO: revisit when supporting multiple versions
            if (this.Version != CurrentSchemaVersion)
            {
                throw new InvalidDataException($"Invalid model version: {this.Version}");
            }

            base.Validate();

            this.ReferenceModels.Validate();
            this.Entities.Validate();
            this.Relationships.Validate();
        }

        /// <summary>
        /// Populates the current model from a json string
        /// </summary>
        /// <param name="modelJson">The string representation of the Json</param>
        private void Import(string modelJson)
        {
            this.Version = null;
            JsonConvert.PopulateObject(modelJson, this, DeserializeSettings);
        }
    }
}