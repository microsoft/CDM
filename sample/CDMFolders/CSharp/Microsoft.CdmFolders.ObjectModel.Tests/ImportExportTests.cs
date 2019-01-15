// <copyright file="ImportExport.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.Tests
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using FluentAssertions;
    using Microsoft.CdmFolders.ObjectModel.Tests.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Tests for importing and exporting (serializing/deserializing)
    /// </summary>
    [TestClass]
    [TestCategory(nameof(ImportExportTests))]
    public class ImportExportTests
    {
        /// <summary>
        /// CdsaObjectModel - Serialization
        /// </summary>
        [TestMethod]
        public void ObjectModel_Serialization()
        {
            var model = CdmFolderTestsHelper.GenerateModel();
            var modelJson = model.ToString();
            CdmFolderTestsHelper.VerifyModelSerialization(model, modelJson);
        }

        /// <summary>
        /// CdsaObjectModel - Serialization order
        /// </summary>
        [TestMethod]
        public void ObjectModel_SerializationOrder()
        {
            var model = CdmFolderTestsHelper.GenerateModel();
            var modelJson = model.Export();
            CdmFolderTestsHelper.VerifyPropertiesOrder(modelJson);
        }

        /// <summary>
        /// CdsaObjectModel - Serialization order
        /// </summary>
        [TestMethod]
        public void ObjectModel_SerializationDefaults()
        {
            var model = CdmFolderTestsHelper.GenerateModel();
            foreach (var entity in model.Entities.WhereLocal())
            {
                foreach (var attribute in entity.Attributes)
                {
                    attribute.DataType = default;
                }
            }

            var modelJson = model.Export();
            CdmFolderTestsHelper.VerifyModelSerialization(model, modelJson);
        }

        /// <summary>
        /// CdsaObjectModel - De-serialization
        /// </summary>
        [TestMethod]
        public void ObjectModel_Deserialization()
        {
            var deserialized = Model.Import<ModelExtensions.ExtendedModel>(ModelSamples.ModelJson);

            CdmFolderTestsHelper.VerifyModelDeserialization(ModelSamples.ModelJson, deserialized);

            var imported = Model.Import<Model>(JObject.Parse(ModelSamples.ModelJson));

            CdmFolderTestsHelper.VerifyModelDeserialization(ModelSamples.ModelJson, imported);
        }

        /// <summary>
        /// CdsaObjectModel - Deserialization with invalid version
        /// </summary>
        [TestMethod]
        public void ObjectModel_DeserializationInvalidVersion()
        {
            var model = Model.Import<Model>(ModelSamples.ModelJsonNoVersion);
            model.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("version is null");

            var model2 = Model.Import<Model>(model.Export());
            model2.Version.Should().BeNull();

            model = Model.Import<Model>(ModelSamples.ModelJsonInvalidVersion);
            model.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("version is invalid");
        }

        /// <summary>
        /// CdsaObjectModel - De-Serialize Empty Model Json
        /// </summary>
        [TestMethod]
        public void ObjectModel_DeserializeEmptyModelJson()
        {
            var emptyModel = " { }  ";

            Action import = () => Model.Import<Model>(emptyModel);
            import.Should().NotThrow();

            import = () => Model.Import<Model>(JObject.Parse(emptyModel));
            import.Should().NotThrow();
        }

        /// <summary>
        /// CdsaObjectModel - Serialize and then de-serialize
        /// </summary>
        [TestMethod]
        public void ObjectModel_SerializeDeserializeSanity()
        {
            var model = CdmFolderTestsHelper.GenerateModel();
            string s = model.ToString();
            var deserialized = Model.Import<Model>(s);

            model.Name.Should().Be(deserialized.Name);
            model.Culture.Should().Be(deserialized.Culture);
            model.Description.Should().Be(deserialized.Description);
            model.IsHidden.Should().Be(deserialized.IsHidden);
            model.ModifiedTime.Should().Be(deserialized.ModifiedTime);
            model.Entities.Count.Should().Be(deserialized.Entities.Count);
            CdmFolderTestsHelper.VerifyAnnotations(model.Annotations, deserialized.Annotations);

            for (int i = 0; i < model.ReferenceModels.Count; i++)
            {
                var oReferenceModel = model.ReferenceModels.ElementAt(i);
                var dReferenceModel = deserialized.ReferenceModels.ElementAt(i);

                oReferenceModel.Location.Should().Be(dReferenceModel.Location);
                oReferenceModel.Id.Should().Be(dReferenceModel.Id);
            }

            for (int i = 0; i < model.Entities.Count; i++)
            {
                var oEntity = model.Entities.ElementAt(i);
                var dEntity = deserialized.Entities.ElementAt(i);

                oEntity.Name.Should().Be(dEntity.Name);
                oEntity.Description.Should().Be(dEntity.Description);
                oEntity.IsHidden.Should().Be(dEntity.IsHidden);

                if (oEntity is ReferenceEntity)
                {
                    Assert.IsNotNull(dEntity as ReferenceEntity);

                    ((ReferenceEntity)oEntity).Source.Should().Be(((ReferenceEntity)dEntity).Source);
                    ((ReferenceEntity)oEntity).ModelId.Should().Be(((ReferenceEntity)dEntity).ModelId);
                }
                else
                {
                    Assert.IsNotNull(dEntity as LocalEntity);
                    var olEntity = oEntity.AsLocal();
                    var dlEntity = dEntity.AsLocal();

                    CdmFolderTestsHelper.VerifyAnnotations(oEntity.Annotations, dEntity.Annotations);

                    olEntity.Attributes.Count.Should().Be(dlEntity.Attributes.Count);
                    for (int j = 0; j < olEntity.Attributes.Count; j++)
                    {
                        var oAttr = olEntity.Attributes.ElementAt(j);
                        var dAttr = dlEntity.Attributes.ElementAt(j);

                        oAttr.Name.Should().Be(dAttr.Name);
                        oAttr.Description.Should().Be(dAttr.Description);
                        oAttr.DataType.Should().Be(dAttr.DataType);
                        CdmFolderTestsHelper.VerifyAnnotations(oAttr.Annotations, dAttr.Annotations);
                    }

                    olEntity.Partitions.Count.Should().Be(dlEntity.Partitions.Count);
                    for (int j = 0; j < olEntity.Partitions.Count; j++)
                    {
                        var oPartition = olEntity.Partitions.ElementAt(j);
                        var dPartition = dlEntity.Partitions.ElementAt(j);
                        oPartition.Description.Should().Be(dPartition.Description);
                        oPartition.Location.Should().Be(dPartition.Location);
                        oPartition.Name.Should().Be(dPartition.Name);
                        CdmFolderTestsHelper.VerifyAnnotations(oPartition.Annotations, dPartition.Annotations);
                    }
                }
            }

            model.Relationships.Count.Should().Be(deserialized.Relationships.Count());
            for (int i = 0; i < model.Relationships.Count; i++)
            {
                var oRelationship = model.Relationships.ElementAt(i) as SingleKeyRelationship;
                var dRelationship = deserialized.Relationships.ElementAt(i) as SingleKeyRelationship;
                Assert.IsNotNull(oRelationship);
                Assert.IsNotNull(oRelationship);
                oRelationship.Description.Should().Be(dRelationship.Description);
                oRelationship.Name.Should().Be(dRelationship.Name);
                CdmFolderTestsHelper.VerifyAnnotations(oRelationship.Annotations, dRelationship.Annotations);
                Assert.IsNotNull(oRelationship.FromAttribute);
                Assert.IsNotNull(dRelationship.FromAttribute);
                Assert.IsNotNull(oRelationship.ToAttribute);
                Assert.IsNotNull(dRelationship.ToAttribute);
            }
        }

        /// <summary>
        /// CdsaObjectModel - De-serialize unknown type
        /// </summary>
        [TestMethod]
        public void ObjectModel_DeserializeUnknownType()
        {
            // Entities[0].Attributes[0].dataType : strangeType
            string rawDlx = "{'name':'0AEC3T','collation':'Ordinal','culture':'he','isHidden':true,'entities':[{'$type': 'LocalEntity', 'name':'QNBPA5','description':'A05V1Z','annotations':[{'name':'H7IO1X','value':'XYRM8E'},{'name':'FPB70S','value':'9VS78V'}],'culture':'he','isHidden':true,'attributes':[{'name':'STBQE3','description':'33VRVZ','annotations':[{'name':'SYFO48','value':'3ED2E8'},{'name':'J8WHJD','value':'VHNSK1'}],'culture':'he','isHidden':false,'dataType':'strangeType'}]}]}";

            Action import = () => Model.Import<Model>(rawDlx);
            import.Should().Throw<JsonSerializationException>();
        }

        /// <summary>
        /// CdsaObjectModel - Serialize with empty collections
        /// </summary>
        [TestMethod]
        public void ObjectModel_SerializeWithEmptyCollections()
        {
            Model model = new Model();
            var json = model.ToString();
            var deserialized = JObject.Parse(json);

            deserialized["entities"].Should().BeNull();
            deserialized["relationships"].Should().BeNull();

            model = new Model();
            Entity entity = new LocalEntity();
            model.Entities.Add(entity);
            json = model.ToString();

            deserialized = JObject.Parse(json);

            deserialized["entities"][0]["attributes"].Should().BeNull();
            deserialized["entities"][0]["partitions"].Should().BeNull();
            deserialized["entities"][0]["schemas"].Should().BeNull();
        }

        /// <summary>
        /// CdsaObjectModel - Serialize with empty collections
        /// </summary>
        /// <returns>A <see cref="Task"/> representing the asynchronous unit test.</returns>
        [TestMethod]
        public async Task ObjectModel_DeserializeEmptyCollectionsAsync()
        {
            await Task.Yield();

            var emptyJson = "{}";
            var model = Model.Import<Model>(emptyJson);

            model.Entities.Should().NotBeNull();
            model.Annotations.Should().NotBeNull();
            model.Relationships.Should().NotBeNull();
            var emptyAttributesJson = "{'name': 'Model', 'entities':[{ '$type':'LocalEntity', 'name':'entity'}]}";
            model = Model.Import<Model>(emptyAttributesJson);
            model.Entities.Should().NotBeNull();
            model.Annotations.Should().NotBeNull();
            model.Relationships.Should().NotBeNull();
            model.Entities.WhereLocal().First().Attributes.Should().NotBeNull();
            model.Entities.WhereLocal().First().Annotations.Should().NotBeNull();
            model.Entities.WhereLocal().First().Partitions.Should().NotBeNull();
            model.Entities.WhereLocal().First().Schemas.Should().NotBeNull();
        }

        /// <summary>
        /// CdsaObjectModel - Verify export flow
        /// </summary>
        [TestMethod]
        public void ObjectModel_Export()
        {
            var m = CdmFolderTestsHelper.GenerateModel();
            var jObjectModel = m.Export();
            CdmFolderTestsHelper.VerifyModelSerialization(m, jObjectModel);
        }
    }
}
