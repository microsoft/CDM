// <copyright file="AttributeValidationTests.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.Tests
{
    using System;
    using System.Diagnostics;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Text;
    using FluentAssertions;
    using Microsoft.CdmFolders.ObjectModel.Tests.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Tests for attribute validations
    /// </summary>
    [TestClass]
    [TestCategory(nameof(AttributeValidationTests))]
    public class AttributeValidationTests
    {
        /// <summary>
        /// CdsaObjectModel - Verify comparison values according to Collation and Culture
        /// </summary>
        [TestMethod]
        public void ObjectModel_VerifyNamesComparison()
        {
            var names = new[] { "case", "encyclopædia", "encyclopædia", "Archæology" };

            // Culture: en-US
            var model = new Model
            {
                Culture = new CultureInfo("en-US"),
            };
            var entity = new LocalEntity();
            model.Entities.AddRange(names.Select(name => new LocalEntity { Name = name }));

            Assert.IsNotNull(model.Entities["Case"]);
            Assert.IsNull(model.Entities["encyclopaedia"]);
            Assert.IsNull(model.Entities["encyclopedia"]);
            Assert.IsNotNull(model.Entities["ARCHÆOLOGY"]);

            // Culture: se-SE
            model = new Model
            {
                Culture = new CultureInfo("se-SE"),
            };
            entity = new LocalEntity();
            model.Entities.AddRange(names.Select(name => new LocalEntity { Name = name }));

            Assert.IsNotNull(model.Entities["Case"]);
            Assert.IsNull(model.Entities["encyclopaedia"]);
            Assert.IsNull(model.Entities["encyclopedia"]);
            Assert.IsNotNull(model.Entities["ARCHÆOLOGY"]);
        }

        /// <summary>
        /// CdsaObjectModel - Ensure all Attributes in relationships are referenced
        /// </summary>
        [TestMethod]
        public void ObjectModel_EnsureAllAttributesInRelationshipsAreReference()
        {
            var deserialized = Model.Import<Model>(ModelSamples.ModelJson);

            var relationshipsCollection = deserialized.Relationships;
            foreach (var relationship in relationshipsCollection)
            {
                if (relationship is SingleKeyRelationship)
                {
                    var singleRelationship = relationship as SingleKeyRelationship;
                    CdmFolderTestsHelper.VerifyAttributeReference(singleRelationship.FromAttribute, deserialized);
                    CdmFolderTestsHelper.VerifyAttributeReference(singleRelationship.ToAttribute, deserialized);
                }
            }
        }

        /// <summary>
        /// CdsaObjectModel - EnsureArgumentExceptionWhenNoAttributeReference
        /// </summary>
        [TestMethod]
        public void ObjectModel_EnsureInvalidDataExceptionWhenNoAttributeReference()
        {
            var model = CdmFolderTestsHelper.GenerateModel();
            var modelJson = model.Export();

            ((JObject)((JArray)modelJson.GetValue("relationships"))[0])["fromAttribute"]["attributeName"] = string.Empty;
            var deserialized = Model.Import<Model>(modelJson.ToString());
            deserialized.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>();
        }

        /// <summary>
        /// CdsaObjectModel - Validate Model Object
        /// </summary>
        [TestMethod]
        public void ObjectModel_ValidateModelObject()
        {
            var model = new Model();
            model.Invoking(a => a.Validate()).Should().Throw<InvalidDataException>("model doesn't contain a name");

            model.Name = "TestModel";
            model.Validate();

            model.Name = "a ";
            model.Invoking(a => a.Validate()).Should().Throw<InvalidDataException>("invalid model name");

            model.Name = " b";
            model.Invoking(a => a.Validate()).Should().Throw<InvalidDataException>("invalid model name");

            model.Name = " ";
            model.Invoking(a => a.Validate()).Should().Throw<InvalidDataException>("invalid model name");

            model.Name = "TestModel";

            model.Entities.Add(new LocalEntity());
            model.Invoking(a => a.Validate()).Should().Throw<InvalidDataException>("entity is not valid");

            model.Entities.First().Name = "A";
            model.Validate();

            var relationship = new SingleKeyRelationship
            {
                FromAttribute = new AttributeReference() { EntityName = "A", AttributeName = "A1" },
            };

            model.Entities.Add(new LocalEntity() { Name = "e2" });
            relationship.ToAttribute = new AttributeReference() { EntityName = "B", AttributeName = "B1" };
            model.Relationships.Add(relationship);
            model.Validate();

            var sb = new StringBuilder();
            for (int i = 0; i < 1025; i++)
            {
                sb.Append("r");
            }

            model.Relationships.First().Name = sb.ToString();

            model.Invoking(a => a.Validate()).Should().Throw<InvalidDataException>("invalid relationship name");

            model.Relationships.First().Name = null;

            var referenceEntity = new ReferenceEntity()
            {
                Name = "AccountRef",
                Source = "Account",
                ModelId = "7",
            };

            model.Entities.Add(referenceEntity);

            var referencedModel = new Model();
            referencedModel.Entities.Add(new LocalEntity() { Name = "Account" });
            model.ReferenceModels.Add(new ReferenceModel { Id = "13", Location = new Uri("https://testaccountadlsgen1.dfs.core.windows.net/cdmfolders/simplemodel/model.json") });

            model.Invoking(a => a.Validate(allowUnresolvedModelReferences: false)).Should().Throw<InvalidDataException>("reference entity does not have reference model");

            model.ReferenceModels.First().Id = "7";
            model.Validate(allowUnresolvedModelReferences: false);
        }

        /// <summary>
        /// CdsaObjectModel - Validate Reference Model
        /// </summary>
        [TestMethod]
        public void ObjectModel_ValidateReferenceModel()
        {
            var referenceModel = new ReferenceModel();
            referenceModel.Invoking(a => a.Validate()).Should().Throw<InvalidDataException>("moniker is not set");

            referenceModel.Id = Guid.NewGuid().ToString();
            referenceModel.Invoking(a => a.Validate()).Should().Throw<InvalidDataException>("location is not set");

            referenceModel.Location = new Uri("http://testaccountadlsgen1.dfs.core.windows.net/cdmfolders/simplemodel/notjson.csv");
            referenceModel.Invoking(a => a.Validate()).Should().Throw<InvalidDataException>("location does not point to .json");

            referenceModel.Location = new Uri("http://testaccountadlsgen2.dfs.core.windows.net/cdmfolders/simplemodel/model.json");
            referenceModel.Validate();
        }

        /// <summary>
        /// CdsaObjectModel - Validate Attribute
        /// </summary>
        [TestMethod]
        public void ObjectModel_ValidateAttribute()
        {
            var attribute = new CdmFolders.ObjectModel.Attribute
            {
                Name = " ", // invalid name
            };

            attribute.Invoking(a => a.Validate()).Should().Throw<InvalidDataException>("name cannot be empty");

            attribute.Name = "a."; // valid name

            attribute.Validate(); // No validation errors are expected

            attribute.Name = "abc"; // valid name

            attribute.Validate(); // No validation errors are expected

            CdmFolderTestsHelper.VerifyNameValidations(attribute);

            var sb = new StringBuilder();
            for (int i = 0; i < 257; i++)
            {
                sb.Append("a");
            }

            attribute.Name = sb.ToString(); // invalid name, too long
            attribute.Invoking(a => a.Validate()).Should().Throw<InvalidDataException>();

            sb = new StringBuilder();
            for (int i = 0; i < 4001; i++)
            {
                sb.Append("b");
            }

            attribute.Description = sb.ToString(); // invalid description, too long

            attribute.Invoking(a => a.Validate()).Should().Throw<InvalidDataException>();

            attribute.Name = "abc";
            attribute.Description = "def";
            attribute.Validate(); // No validation errors are expected

            CdmFolderTestsHelper.VerifyAnnotationsValidations(attribute);
        }

        /// <summary>
        /// CdsaObjectModel - Validate Entity
        /// </summary>
        [TestMethod]
        public void ObjectModel_ValidateLocalEntity()
        {
            var entity = new LocalEntity();
            entity.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>();

            var sb = new StringBuilder();
            for (int i = 0; i < 257; i++)
            {
                sb.Append("e");
            }

            entity.Name = sb.ToString();
            entity.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("invalid name, too long");

            entity.Name = " ";
            entity.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("invalid empty name");

            entity.Name = null;
            entity.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("name must be set");

            entity.Name = "e1.";
            entity.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("name cannot contain dot");

            entity.Name = "e1\"";
            entity.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("name cannot contain quotation mark");

            entity.Name = "e 1";
            entity.Validate(); // No validation errors are expected

            CdmFolderTestsHelper.VerifyNameValidations(entity);

            entity.Attributes.Add(new CdmFolders.ObjectModel.Attribute());
            entity.Attributes.First().Name = "att1";
            entity.Validate(); // No validation errors are expected

            entity.Partitions.Add(new Partition() { Name = "Partition" });
            entity.Validate(); // No validation errors are expected

            entity.Partitions.First().Location = new Uri("https://partition-location.com");
            entity.Validate(); // No validation errors are expected

            entity.Schemas.Add(new Uri("http://not-a-schema.com/"));
            Assert.ThrowsException<InvalidDataException>(() => entity.Validate(), "invalid schema");
            entity.Schemas.Clear();
            entity.Schemas.Add(new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/Address.0.6.json"));
            entity.Schemas.Add(new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/Address.0.7.cdm.json"));
            entity.Validate();

            CdmFolderTestsHelper.VerifyAnnotationsValidations(entity);
        }

        /// <summary>
        /// CdsaObjectModel - Validate Reference Entity
        /// </summary>
        [TestMethod]
        public void ObjectModel_ValidateReferenceEntity()
        {
            var refEntity = new ReferenceEntity();
            refEntity.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>();

            refEntity.Name = "AccountRef";
            refEntity.Source = "Account";
            refEntity.ModelId = Guid.NewGuid().ToString();

            var sb = new StringBuilder();
            for (int i = 0; i < 257; i++)
            {
                sb.Append("e");
            }

            refEntity.Name = sb.ToString();
            refEntity.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("invalid name, too long");

            refEntity.Name = " ";
            refEntity.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("invalid empty name");

            refEntity.Name = null;
            refEntity.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("name must be set");

            refEntity.Name = "e1.";
            refEntity.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("name cannot contain dot");

            refEntity.Name = "e1";
            refEntity.Validate(); // No validation errors are expected

            CdmFolderTestsHelper.VerifyNameValidations(refEntity);

            CdmFolderTestsHelper.VerifyAnnotationsValidations(refEntity);

            refEntity.Source = "   ";
            refEntity.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("source is not properly set");

            refEntity.Source = "Account";
            refEntity.ModelId = "  ";
            refEntity.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("model moniker is not properly set");

            refEntity.ModelId = "3";

            refEntity.Validate();

            var referencedModel = new Model();
            referencedModel.Entities.Add(new LocalEntity() { Name = "Account" });
            referencedModel.Entities.WhereLocal().First().Attributes.Add(new CdmFolders.ObjectModel.Attribute() { Name = "a1" });
            referencedModel.Entities.WhereLocal().First().Partitions.Add(new Partition() { Location = new Uri("https://testaccountadlsgen2.dfs.core.windows.net/cdmfolders/simplemodel/a.csv") });
            referencedModel.Entities.WhereLocal().First().Schemas.Add(new Uri("https://github.com/microsoft/cdm/v1/cdm.json?entity=A"));

            var model = new Model();
            model.Name = "refModel";
            model.ReferenceModels.Add(new ReferenceModel() { Id = "3", Location = new Uri("https://partition-location.com/model.json") });

            model.Validate(allowUnresolvedModelReferences: false);
        }

        /// <summary>
        /// CdsaObjectModel - Validate Single Key Relationship
        /// </summary>
        [TestMethod]
        public void ObjectModel_ValidateSingleKeyRelationship()
        {
            var relationship = new SingleKeyRelationship();

            var e1 = new LocalEntity()
            {
                Name = "e1",
            };

            var e2 = new LocalEntity()
            {
                Name = "e2",
            };

            var ar1 = new AttributeReference() { EntityName = "e1", AttributeName = "e11" };
            var a1 = new CdmFolders.ObjectModel.Attribute() { Name = "e11" };
            relationship.FromAttribute = ar1;

            var ar2 = new AttributeReference() { EntityName = "e2", AttributeName = "e22" };
            var a2 = new CdmFolders.ObjectModel.Attribute() { Name = "e22" };
            relationship.ToAttribute = ar2;

            relationship.Validate(); // No validation errors are expected

            CdmFolderTestsHelper.VerifyNameValidations(relationship);

            var sb = new StringBuilder();
            for (int i = 0; i < 1024; i++)
            {
                sb.Append("r");
            }

            relationship.Name = sb.ToString();

            relationship.Validate(); // No validation errors are expected

            relationship.Name += "r"; // invalid name length

            relationship.Invoking(r => r.Validate()).Should().Throw<InvalidDataException>("invalid name length");

            relationship.Name = null;

            relationship.Validate(); // name is not a must for relationship

            relationship.Name = string.Empty;

            relationship.Invoking(r => r.Validate()).Should().Throw<InvalidDataException>("name cannot be empty");

            relationship.Name = "  "; // 2 blank spaces

            relationship.Invoking(r => r.Validate()).Should().Throw<InvalidDataException>("name cannot contain blank spaces only");

            relationship.Name = "r.";

            relationship.Validate();

            CdmFolderTestsHelper.VerifyAnnotationsValidations(relationship);
        }

        /// <summary>
        /// CdsaObjectModel - Validate Partition
        /// </summary>
        [TestMethod]
        public void ObjectModel_ValidatePartition()
        {
            var partition = new Partition() { Name = "Partition" };
            partition.Validate(); // No validation errors are expected

            partition.Location = new Uri("http://partition-location.com");
            partition.Validate(); // No validation errors are expected

            CdmFolderTestsHelper.VerifyAnnotationsValidations(partition);
            CdmFolderTestsHelper.VerifyNameValidations(partition);
        }

        /// <summary>
        /// CdsaObjectModel - Validate Attribute Collections
        /// </summary>
        [TestMethod]
        public void ObjectModel_ValidateAttributeCollections()
        {
            var attributeCollection = new AttributeCollection();
            var att1 = new CdmFolders.ObjectModel.Attribute();
            var att2 = new CdmFolders.ObjectModel.Attribute();

            CdmFolderTestsHelper.ValidateDataObjectCollectionValidation(attributeCollection, att1, att2);
        }

        /// <summary>
        /// CdsaObjectModel - Validate Entity Collections
        /// </summary>
        [TestMethod]
        public void ObjectModel_ValidateEntityCollections()
        {
            var sourceModel = new Model() { Name = "Source Model" };
            sourceModel.Entities.Add(new LocalEntity() { Name = "Account" });

            var targetModel = new Model() { Name = "Target Model" };
            targetModel.ReferenceModels.Add(new ReferenceModel() { Id = "1" });
            var e1 = new LocalEntity() { Name = "Lead" };
            var e2 = new ReferenceEntity() { Name = "AccountRef", Source = "Account", ModelId = "1" };

            CdmFolderTestsHelper.ValidateDataObjectCollectionValidation(targetModel.Entities, e1, e2);
        }

        /// <summary>
        /// CdsaObjectModel - Validate Reference Model Collection
        /// </summary>
        [TestMethod]
        public void ObjectModel_ValidateReferenceModelCollection()
        {
            var referenceModelCollection = new ReferenceModelCollection()
            {
                new ReferenceModel
                {
                    Id = "a",
                    Location = new Uri("http://testaccountadlsgen1.dfs.core.windows.net/cdmfolders/simplemodel/model.json"),
                },
                new ReferenceModel
                {
                    Id = "A",
                    Location = new Uri("http://testaccountadlsgen1.dfs.core.windows.net/cdmfolders/simplemodel/model.json"),
                },
            };

            referenceModelCollection.Invoking(c => c.Validate()).Should().Throw<InvalidDataException>("non-unique monikers.");

            referenceModelCollection.First().Id = "B";

            referenceModelCollection.Validate();
        }

        /// <summary>
        /// CdsaObjectModel - Enums default values
        /// </summary>
        [TestMethod]
        public void ObjectModel_EnumsDefaultValues()
        {
            default(DataType).Should().Be(DataType.Unclassified);
        }

        /// <summary>
        /// Tests that <see cref="SchemaCollection.Validate"/> works as expected
        /// </summary>
        [TestMethod]
        public void ObjectModel_SchemaCollectionValidate()
        {
            // same valid source, no duplicate entity names is valid
            Uri[] validSchemasNoDuplicates =
            {
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/A.0.6.json"),
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/B.0.6.json"),
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/C.0.6.cdm.json"),
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/D.0.6.cdm.json"),
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/E.0.6.cdm.json"),
            };

            var schemas = new SchemaCollection();
            schemas.AddRange(validSchemasNoDuplicates);
            schemas.Validate();
            Trace.TraceInformation("Validate() same source different entities passed");

            // different path with same entity name is valid
            Uri[] validSchemasDifferentPathSameName =
            {
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/Contact.0.6.json"),
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/A/Contact.0.6.cdm.json"),
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/B/Contact.0.6.cdm.json"),
            };

            schemas = new SchemaCollection();
            schemas.AddRange(validSchemasDifferentPathSameName);
            schemas.Validate();
            Trace.TraceInformation("Validate() different path same entity names passed");

            // different verion with same entity name is valid
            Uri[] validSchemasDifferentVersionSameName =
            {
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/Contact.0.6.json"),
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/Contact.0.7.json"),
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/Contact.1.6.cdm.json"),
            };

            schemas = new SchemaCollection();
            schemas.AddRange(validSchemasDifferentVersionSameName);
            schemas.Validate();
            Trace.TraceInformation("Validate() different version same entity names passed");

            // not a model file is invalid
            schemas = new SchemaCollection
            {
                new Uri("http://foo.com/schemas/aa.json?entity=A"),
            };
            Assert.ThrowsException<InvalidDataException>(() => schemas.Validate());

            schemas = new SchemaCollection
            {
                new Uri("http://foo.com/schemas/aajson?entity=A"),
            };
            Assert.ThrowsException<InvalidDataException>(() => schemas.Validate());

            // entity must be valid and the only parameter
            schemas = new SchemaCollection
            {
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/Contact.json"),
            };
            Assert.ThrowsException<InvalidDataException>(() => schemas.Validate());

            schemas = new SchemaCollection
            {
                new Uri("http://foo.com/schemas/Contact.0.6.json"),
            };
            Assert.ThrowsException<InvalidDataException>(() => schemas.Validate());

            schemas = new SchemaCollection
            {
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/Contact.0.6.json?entityx=A"),
            };
            Assert.ThrowsException<InvalidDataException>(() => schemas.Validate());

            // duplicate entities are invalid
            Uri[] duplicateSchemas =
            {
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/A.0.6.json"),
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/B.0.6.json"),
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/C.0.6.json"),
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/B.0.6.cdm.json"),
                new Uri("https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/D.0.6.json"),
            };

            schemas = new SchemaCollection();
            schemas.AddRange(duplicateSchemas);
            Assert.ThrowsException<InvalidDataException>(() => schemas.Validate());
        }

        /// <summary>
        /// Tests that <see cref="SchemaCollection.EntitiesSpec"/> works as expected
        /// </summary>
        [TestMethod]
        public void ObjectModel_SchemaCollectionEntityNames()
        {
            var schemas = new SchemaCollection();
            SchemaEntityInfo[] entityInfos =
            {
                new SchemaEntityInfo { EntityName = "A", EntityNamespace = string.Empty, EntityVersion = "0.1" },
                new SchemaEntityInfo { EntityName = "B", EntityNamespace = "x", EntityVersion = "1.1" },
                new SchemaEntityInfo { EntityName = "C", EntityNamespace = "x/y", EntityVersion = "4.0.1" },
                new SchemaEntityInfo { EntityName = "D", EntityNamespace = "dddtdd", EntityVersion = "45.10.01" },
                new SchemaEntityInfo { EntityName = "E", EntityNamespace = "foo/bar/09", EntityVersion = "0.111" },
            };

            Uri[] schemaCollection =
            {
                new Uri($"https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/{entityInfos[0]}"),
                new Uri($"https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/{entityInfos[1]}"),
                new Uri($"https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/{entityInfos[2]}"),
                new Uri($"https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/{entityInfos[3]}"),
                new Uri($"https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/core/applicationCommon/{entityInfos[4]}"),
            };

            schemas = new SchemaCollection();
            schemas.AddRange(schemaCollection);
            var entitiesSpec = schemas.EntitiesSpec.ToArray();
            Assert.AreEqual(schemaCollection.Length, entitiesSpec.Length);
            for (int i = 0; i < schemaCollection.Length; i++)
            {
                Assert.AreEqual(entityInfos[i].EntityName, entitiesSpec[i].EntityName);
                Assert.AreEqual(entityInfos[i].EntityVersion, entitiesSpec[i].EntityVersion);
                Assert.AreEqual(entityInfos[i].EntityNamespace, entitiesSpec[i].EntityNamespace);
            }
        }
    }
}
