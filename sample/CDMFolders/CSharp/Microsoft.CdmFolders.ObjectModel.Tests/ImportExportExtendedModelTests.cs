// <copyright file="ImportExportExtendedModelTests.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.Tests
{
    using System;
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
    [TestCategory(nameof(ImportExportExtendedModelTests))]
    public class ImportExportExtendedModelTests
    {
        /// <summary>
        /// CdsaObjectModel - Serialization
        /// </summary>
        [TestMethod]
        public void ExtendedModel_Serialization()
        {
            var model = CdmFolderTestsHelper.GenerateExtendedModel();
            var modelJson = model.ToString();
            CdmFolderTestsHelper.VerifyExtendedModelSerialization(model, modelJson);
        }

        /// <summary>
        /// CdsaObjectModel - Serialization order
        /// </summary>
        [TestMethod]
        public void ExtendedModel_SerializationOrder()
        {
            var model = CdmFolderTestsHelper.GenerateExtendedModel();
            var modelJson = model.Export();
            CdmFolderTestsHelper.VerifyPropertiesOrder(modelJson);
        }

        /// <summary>
        /// CdsaObjectModel - Serialization order
        /// </summary>
        [TestMethod]
        public void ExtendedModel_SerializationDefaults()
        {
            var model = CdmFolderTestsHelper.GenerateExtendedModel();
            foreach (var entity in model.Entities.WhereLocal())
            {
                foreach (var attribute in entity.Attributes)
                {
                    attribute.DataType = default;
                }
            }

            var modelJson = model.Export();
            CdmFolderTestsHelper.VerifyExtendedModelSerialization(model, modelJson);
        }

        /// <summary>
        /// CdsaObjectModel - De-serialization
        /// </summary>
        [TestMethod]
        public void ExtendedModel_Deserialization()
        {
            var deserialized = Model.Import<ModelExtensions.ExtendedModel>(ModelSamples.ExtendedModelJson);

            CdmFolderTestsHelper.VerifyExtendedModelDeserialization(ModelSamples.ExtendedModelJson, deserialized);

            var imported = Model.Import<ModelExtensions.ExtendedModel>(JObject.Parse(ModelSamples.ExtendedModelJson));

            CdmFolderTestsHelper.VerifyExtendedModelDeserialization(ModelSamples.ExtendedModelJson, imported);
        }

        /// <summary>
        /// CdsaObjectModel - De-Serialize Empty Model Json
        /// </summary>
        [TestMethod]
        public void ExtendedModel_DeserializeEmptyModelJson()
        {
            var emptyModel = " { }  ";

            Action import = () => Model.Import<ModelExtensions.ExtendedModel>(emptyModel);
            import.Should().NotThrow();

            try
            {
                var imported = Model.Import<ModelExtensions.ExtendedModel>(JObject.Parse(emptyModel));
            }
            catch (Exception)
            {
                Assert.Fail("failed to import empty model");
            }
        }

        /// <summary>
        /// CdsaObjectModel - Serialize and then de-serialize
        /// </summary>
        [TestMethod]
        public void ExtendedModel_SerializeDeserializeSanity()
        {
            var model = CdmFolderTestsHelper.GenerateExtendedModel();
            string s = model.ToString();
            var deserialized = Model.Import<ModelExtensions.ExtendedModel>(s);

            model.Application.Should().Be(deserialized.Application);
            model.Name.Should().Be(deserialized.Name);
            model.Culture.Should().Be(deserialized.Culture);
            model.Description.Should().Be(deserialized.Description);
            model.IsHidden.Should().Be(deserialized.IsHidden);
            model.IsHidden.Should().Be(deserialized.IsHidden);
            model.ExtendedAttribute.Should().Be(deserialized.ExtendedAttribute);
            model.Entities.Count.Should().Be(deserialized.Entities.Count);
            CdmFolderTestsHelper.VerifyAnnotations(model.Annotations, deserialized.Annotations);

            for (int i = 0; i < model.ReferenceModels.Count; i++)
            {
                var oReferenceModel = (ModelExtensions.ReferenceModel) model.ReferenceModels.ElementAt(i);
                var dReferenceModel = (ModelExtensions.ReferenceModel)deserialized.ReferenceModels.ElementAt(i);

                oReferenceModel.Location.Should().Be(dReferenceModel.Location);
                oReferenceModel.Id.Should().Be(dReferenceModel.Id);
                oReferenceModel.ExtendedReferenceModelAttribute.Should().Be(dReferenceModel.ExtendedReferenceModelAttribute);
            }

            for (int i = 0; i < model.Entities.Count; i++)
            {
                var oEntity = model.Entities.ElementAt(i);
                var dEntity = deserialized.Entities.ElementAt(i);

                oEntity.Name.Should().Be(dEntity.Name);
                oEntity.Description.Should().Be(dEntity.Description);
                oEntity.IsHidden.Should().Be(dEntity.IsHidden);

                if (oEntity is ModelExtensions.ReferenceEntity refEntity)
                {
                    Assert.IsNotNull(dEntity as ReferenceEntity);

                    refEntity.Source.Should().Be(((ModelExtensions.ReferenceEntity)dEntity).Source);
                    refEntity.ModelId.Should().Be(((ModelExtensions.ReferenceEntity)dEntity).ModelId);
                    refEntity.ExtendedReferenceEntityAttribute.Should().Be(((ModelExtensions.ReferenceEntity)dEntity).ExtendedReferenceEntityAttribute);
                }
                else
                {
                    Assert.IsNotNull(dEntity as ModelExtensions.LocalEntity);
                    var olEntity = (ModelExtensions.LocalEntity)oEntity;
                    var dlEntity = (ModelExtensions.LocalEntity)dEntity;
                    olEntity.ExtendedLocalEntityAttribute.Should().Be(dlEntity.ExtendedLocalEntityAttribute);

                    olEntity.Complex.Attribute1.Should().Be(dlEntity.Complex.Attribute1);
                    olEntity.Complex.Attribute2.Should().Be(dlEntity.Complex.Attribute2);

                    if (olEntity.Complex is ModelExtensions.Complex1 complex1)
                    {
                        complex1.Attribute3.Should().Be(((ModelExtensions.Complex1)dlEntity.Complex).Attribute3);
                        complex1.Attribute4.Should().Be(((ModelExtensions.Complex1)dlEntity.Complex).Attribute4);
                    }
                    else if (olEntity.Complex is ModelExtensions.Complex2 complex2)
                    {
                        complex2.Attribute5.Should().Be(((ModelExtensions.Complex2)dlEntity.Complex).Attribute5);
                        complex2.Attribute6.Should().Be(((ModelExtensions.Complex2)dlEntity.Complex).Attribute6);
                    }
                    else
                    {
                        Assert.Fail("Invalid complex type");
                    }

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
        /// CdsaObjectModel - Serialize with empty collections
        /// </summary>
        [TestMethod]
        public void ExtendedModel_SerializeWithEmptyCollections()
        {
            Model model = new ModelExtensions.ExtendedModel();
            var json = model.ToString();
            var deserialized = JObject.Parse(json);

            deserialized["entities"].Should().BeNull();
            deserialized["relationships"].Should().BeNull();

            model = new ModelExtensions.ExtendedModel();
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
        public async Task ExtendedModel_DeserializeEmptyCollectionsAsync()
        {
            await Task.Yield();

            var emptyJson = "{}";
            var model = Model.Import<ModelExtensions.ExtendedModel>(emptyJson);

            model.Entities.Should().NotBeNull();
            model.Annotations.Should().NotBeNull();
            model.Relationships.Should().NotBeNull();
            var emptyAttributesJson = "{'name': 'Model', 'entities':[{ '$type':'LocalEntity', 'name':'entity'}]}";
            model = Model.Import<ModelExtensions.ExtendedModel>(emptyAttributesJson);
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
        public void ExtendedModel_Export()
        {
            var m = CdmFolderTestsHelper.GenerateExtendedModel();
            var jObjectModel = m.Export();
            CdmFolderTestsHelper.VerifyExtendedModelSerialization(m, jObjectModel);
        }
    }
}
