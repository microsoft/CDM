// <copyright file="DependenciesTests.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.Tests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    /// <summary>
    /// Validate dependencies
    /// </summary>
    [TestClass]
    [TestCategory(nameof(DependenciesTests))]
    public class DependenciesTests
    {
        /// <summary>
        /// CdsaObjectModel - Validate dependency resolving
        /// </summary>
        [TestMethod]
        public void ObjectModel_ResolveDependencies()
        {
            // 1. Define source model
            var sourceModel = new Model() { Name = "Source Model" };
            var sourceEntity = new LocalEntity() { Name = "Account" };
            var sourceAttribute = new CdmFolders.ObjectModel.Attribute() { Name = "BudgetStatus", DataType = DataType.Int64 };
            sourceEntity.Attributes.Add(sourceAttribute);
            var sourceEntityPartitionLocation = new Uri("http://testaccountadlsgen.dfs.core.windows.net/cdmfolders/simplemodel/b540af95-0b36-4d35-9119-df26d4aa94aa.csv");
            sourceEntity.Partitions.Add(new Partition() { Location = sourceEntityPartitionLocation });

            sourceModel.Entities.Add(sourceEntity);

            var sourceModelId = Guid.NewGuid().ToString();
            var sourceModelLocation = "http://testaccountadlsgen1.dfs.core.windows.net/cdmfolders/simplemodel/model.json";

            // 2. Define target model json
            var targetModelLocation = "http://testaccountadlsgen2.dfs.core.windows.net/cdmfolders/simplemodel/model.json";
            var targetModelJson = "{ \"Name\":\"mydp\", \"entities\":[{\"$type\":\"ReferenceEntity\", \"name\":\"AccountRef\", \"source\":\"Account\", \"modelId\":\"" + sourceModelId + "\"}, " +
                                                                    "{ \"$type\":\"LocalEntity\", \"name\":\"Lead\", \"attributes\":[{\"name\":\"accountId\", \"dataType\":\"int64\"}]}], " +
                                                "\"referenceModels\":[{\"id\":\"" + sourceModelId + "\", \"location\":\"" + sourceModelLocation + "\"}], " +
                                                  "\"relationships\":[{\"$type\": \"SingleKeyRelationship\", \"fromAttribute\":{\"entityName\":\"Lead\", \"attributeName\":\"accountId\"}, " +
                                                                                                              "\"toAttribute\":{\"entityName\":\"AccountRef\", \"attributeName\":\"BudgetStatus\"}}]}";
            var targetModel = Model.Import<Model>(targetModelJson);

            // Validate prerequisites
            Assert.AreNotEqual(targetModelLocation, sourceModelLocation);

            // Validate OM instance population
            Assert.AreEqual(1, targetModel.ReferenceModels.Count);
            Assert.AreEqual(sourceModelId, targetModel.ReferenceModels.First().Id);
            Assert.AreEqual(sourceModelLocation, targetModel.ReferenceModels.First().Location.AbsoluteUri);

            Assert.AreEqual(2, targetModel.Entities.Count);

            var referenceEntity = targetModel.Entities["AccountRef"] as ReferenceEntity;

            Assert.IsNotNull(referenceEntity);
            Assert.AreEqual("AccountRef", referenceEntity.Name);
            Assert.AreEqual("Account", referenceEntity.Source);
            Assert.AreEqual(sourceModelId, referenceEntity.ModelId);

            Assert.AreEqual(1, targetModel.Relationships.Count);
            var relationship = targetModel.Relationships.First() as SingleKeyRelationship;
            Assert.IsNotNull(relationship);
        }

        /// <summary>
        /// CdsaObjectModel - Validate multiple dependency resolvness
        /// </summary>
        [TestMethod]
        public void ObjectModel_ResolveDependenciesMultiple()
        {
            // 1. Define source model
            var sourceModel = new Model() { Name = "Source Model" };
            var sourceEntity = new LocalEntity()
            {
                Name = "Account",
            };

            sourceEntity.Partitions.Add(new Partition() { Location = new Uri("http://someaccountadlsgen.dfs.core.windows.net/cdmfolders/simplemodel/model.json") });
            sourceModel.Entities.Add(sourceEntity);
            var sourceModelId = Guid.NewGuid().ToString();
            var sourceModelLocation = "http://testaccountadlsgen0.dfs.core.windows.net/cdmfolders/simplemodel/model.json";

            // 2. Define 1st target model json
            var targetModelId1 = Guid.NewGuid().ToString();
            var targetModelLocation1 = "http://adlsgenname.dfs.core.windows.net/cdmfolders/simplemodel/model.json";
            var targetModelJson1 = "{ \"Name\":\"mydp\", \"entities\":[{\"$type\":\"ReferenceEntity\", \"name\":\"AccountRef1\", \"source\":\"Account\", \"modelId\":\"" + sourceModelId + "\"}], " +
                                                 "\"referenceModels\":[{\"id\":\"" + sourceModelId + "\", \"location\":\"" + sourceModelLocation + "\"}]}";
            var targetModel1 = Model.Import<Model>(targetModelJson1);

            // 3. Define 2nd target model json
            var targetModelId2 = Guid.NewGuid().ToString();
            var targetModelLocation2 = "http://testaccountadlsgen2.dfs.core.windows.net/cdmfolders/simplemodel/model.json";
            var targetModelJson2 = "{ \"Name\":\"mydp2\", \"entities\":[{\"$type\":\"ReferenceEntity\", \"name\":\"AccountRef2\", \"source\":\"AccountRef1\", \"modelId\":\"" + targetModelId1 + "\"}], " +
                                                  "\"referenceModels\":[{\"id\":\"" + targetModelId1 + "\", \"location\":\"" + targetModelLocation1 + "\"}]}";
            var targetModel2 = Model.Import<Model>(targetModelJson2);

            // 4. Define 3rd target model json
            var targetModelJson3 = "{ \"Name\":\"mydp3\", \"entities\":[{\"$type\":\"ReferenceEntity\", \"name\":\"AccountRef3\", \"source\":\"AccountRef2\", \"modelId\":\"" + targetModelId2 + "\"}], " +
                                                  "\"referenceModels\":[{\"id\":\"" + targetModelId2 + "\", \"location\":\"" + targetModelLocation2 + "\"}]}";
            var targetModel3 = Model.Import<Model>(targetModelJson3);

            // 3. Resolve Models
            var modelsToResolve = new Dictionary<Uri, Model>
            {
                [new Uri("http://testaccountadlsgen3.dfs.core.windows.net/cdmfolders/simplemodel/model.json")] = targetModel3, // The key is targetModelLocation3 but different snapshot
                [new Uri("http://testaccountadlsgen2.dfs.core.windows.net/cdmfolders/simplemodel/model.json")] = targetModel2, // The key is targetModelLocation2 but different snapshot
                [new Uri("http://testaccountadlsgen1.dfs.core.windows.net/cdmfolders/simplemodel/model.json")] = targetModel1,                                       // The key is targetModelLocation1 without snapshot
                [new Uri("http://testaccountadlsgen0.dfs.core.windows.net/cdmfolders/simplemodel/model.json")] = sourceModel,  // The key is sourceModelLocation but different snapshot
            };
        }

        /// <summary>
        /// CdsaObjectModel - Validate multiple dependency resolvness
        /// </summary>
        [TestMethod]
        public void ObjectModel_ResolveDependenciesWithRelationship()
        {
            // 1. Define source model
            var sourceModel = new Model() { Name = "Source Model" };
            var sourceAttribute = new CdmFolders.ObjectModel.Attribute()
            {
                Name = "Id",
                DataType = DataType.Decimal,
            };

            var sourceEntity = new LocalEntity()
            {
                Name = "Account",
            };

            sourceEntity.Attributes.Add(sourceAttribute);
            sourceEntity.Partitions.Add(new Partition() { Location = new Uri("http://someaccountadlsgen.dfs.core.windows.net/cdmfolders/simplemodel/model.json") });
            sourceModel.Entities.Add(sourceEntity);
            var sourceModelId = Guid.NewGuid().ToString();
            var sourceModelLocation = "http://testaccountadlsgen0.dfs.core.windows.net/cdmfolders/simplemodel/model.json";

            // 2. Define 1st target model json
            var targetModelId1 = Guid.NewGuid().ToString();
            var targetModelLocation1 = "http://testaccountadlsgen1.dfs.core.windows.net/cdmfolders/simplemodel/model.json?param1=abc";
            var targetModelJson1 = "{ \"Name\":\"mydp\", \"entities\":[{ \"$type\":\"LocalEntity\", \"name\":\"Lead\", \"attributes\":[{\"name\":\"AccountId\", \"dataType\":\"decimal\"}]}," +
                                                                       "{\"$type\":\"ReferenceEntity\", \"name\":\"AccountRef1\", \"source\":\"Account\", \"modelId\":\"" + sourceModelId + "\"}], " +
                                                 "\"referenceModels\":[{\"id\":\"" + sourceModelId + "\", \"location\":\"" + sourceModelLocation + "\"}]}";
            var targetModel1 = Model.Import<Model>(targetModelJson1);

            // 3. Define 2nd target model json
            var targetModelId2 = Guid.NewGuid().ToString();
            var targetModelLocation2 = "http://testaccountadlsgen2.dfs.core.windows.net/cdmfolders/simplemodel/model.json";
            var targetModelJson2 = "{ \"Name\":\"mydp2\", \"entities\":[{\"$type\":\"ReferenceEntity\", \"name\":\"AccountRef2\", \"source\":\"AccountRef1\", \"modelId\":\"" + targetModelId1 + "\"}], " +
                                                  "\"referenceModels\":[{\"id\":\"" + targetModelId1 + "\", \"location\":\"" + targetModelLocation1 + "\"}]}";
            var targetModel2 = Model.Import<Model>(targetModelJson2);

            // 4. Define 3rd target model json
            var targetModelJson3 = "{ \"Name\":\"mydp3\", \"entities\":[{\"$type\":\"ReferenceEntity\", \"name\":\"AccountRef3\", \"source\":\"AccountRef2\", \"modelId\":\"" + targetModelId2 + "\"}, " +
                                                                       "{\"$type\":\"ReferenceEntity\", \"name\":\"LeadRef\", \"source\":\"Lead\", \"modelId\":\"" + targetModelId1 + "\"}, " +
                                                                       "{\"$type\":\"ReferenceEntity\", \"name\":\"AccountRef30\", \"source\":\"Account\", \"modelId\":\"" + sourceModelId + "\"}], " +
                                                  "\"referenceModels\":[{\"id\":\"" + targetModelId1 + "\", \"location\":\"" + targetModelLocation1 + "\"}," +
                                                                       "{\"id\":\"" + targetModelId2 + "\", \"location\":\"" + targetModelLocation2 + "\"}, " +
                                                                       "{\"id\":\"" + sourceModelId + "\", \"location\":\"" + sourceModelLocation + "\"}], " +
                                                    "\"relationships\":[{\"$type\": \"SingleKeyRelationship\", \"fromAttribute\":{\"entityName\":\"AccountRef3\", \"attributeName\":\"Id\"}, " +
                                                                                                                "\"toAttribute\":{\"entityName\":\"LeadRef\", \"attributeName\":\"AccountId\"}}," +
                                                                       "{\"$type\": \"SingleKeyRelationship\", \"fromAttribute\":{\"entityName\":\"AccountRef30\", \"attributeName\":\"Id\"}, " +
                                                                                                                "\"toAttribute\":{\"entityName\":\"LeadRef\", \"attributeName\":\"AccountId\"}}]}";
            var targetModel3 = Model.Import<Model>(targetModelJson3);

            // 3. Resolve Models
            var modelsToResolve = new Dictionary<Uri, Model>
            {
                [new Uri("http://testaccountadlsgen3.dfs.core.windows.net/cdmfolders/simplemodel/model.json?")] = targetModel3,                                      // The key is targetModelLocation3 without snapshot
                [new Uri("http://testaccountadlsgen2.dfs.core.windows.net/cdmfolders/simplemodel/model.json")] = targetModel2, // The key is targetModelLocation2 but different snapshot
                [new Uri("http://testaccountadlsgen1.dfs.core.windows.net/cdmfolders/simplemodel/model.jsonparam3=13")] = targetModel1,                              // The key is targetModelLocation1 without snapshot
                [new Uri("http://testaccountadlsgen0.dfs.core.windows.net/cdmfolders/simplemodel/model.json")] = sourceModel,  // The key is sourceModelLocation but different snapshot
            };

            // Assert that relationships aren't resolved
            SingleKeyRelationship relationship1 = targetModel3.Relationships.First() as SingleKeyRelationship;
            AttributeReference fromAttribute1 = relationship1.FromAttribute;
            AttributeReference toAttribute1 = relationship1.ToAttribute;

            SingleKeyRelationship relationship2 = targetModel3.Relationships.Last() as SingleKeyRelationship;
            AttributeReference fromAttribute2 = relationship2.FromAttribute;
            AttributeReference toAttribute2 = relationship2.ToAttribute;
        }
    }
}
