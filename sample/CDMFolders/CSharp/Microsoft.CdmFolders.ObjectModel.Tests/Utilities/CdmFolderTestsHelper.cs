// <copyright file="CdmFolderTestsHelper.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.Tests.Utilities
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Text;
    using FluentAssertions;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Contains helper method for the Cdm Folder tests
    /// </summary>
    internal static class CdmFolderTestsHelper
    {
        internal static Model GenerateModel(
            int entitiesCount = 5,
            int referencedEntities = 5,
            int relationshipsCount = 5,
            int attributesCount = 5,
            int partitionsCount = 5,
            int annotationsCount = 5,
            int schemaCount = 3)
        {
            Model localModel = GenerateLocalModel(entitiesCount, relationshipsCount, attributesCount, partitionsCount, annotationsCount, schemaCount);

            var referenceModelId = Guid.NewGuid().ToString();
            localModel.ReferenceModels.Add(new ReferenceModel()
            {
                Id = referenceModelId,
                Location = new Uri("https://testaccountadlsgen2.dfs.core.windows.net/cdmfolders/simplemodel/model.json"),
            });

            AutoIncrementCounter counter = new AutoIncrementCounter();
            for (int i = 0; i < referencedEntities; i++)
            {
                var entitySource = localModel.Entities[new Random().Next(0, localModel.Entities.Count)];

                var referenceEntity = new ReferenceEntity()
                {
                    Name = $"{GenerateString(counter)}_Ref",
                    Source = entitySource.Name,
                    Description = "I'm a Reference Entity",
                    IsHidden = GenerateBoolean(counter),
                    ModelId = referenceModelId,
                };

                referenceEntity.Annotations.AddRange(GenerateAnnotations(annotationsCount, counter));

                localModel.Entities.Add(referenceEntity);
            }

            return localModel;
        }

        internal static Model GenerateLocalModel(
            int entitiesCount,
            int relationshipsCount,
            int attributesCount,
            int partitionsCount,
            int annotationsCount,
            int schemaCount)
        {
            AutoIncrementCounter counter = new AutoIncrementCounter();
            var model = new Model()
            {
                Application = "demoapp",
                Name = $"test_model_{Guid.NewGuid().ToString()}",
                Culture = new CultureInfo(GenerateCulture(counter)),
                IsHidden = GenerateBoolean(counter),
            };

            model.Annotations.AddRange(GenerateAnnotations(annotationsCount, counter));

            for (int i = 0; i < entitiesCount; i++)
            {
                var entity = new LocalEntity()
                {
                    Name = GenerateString(counter),
                    IsHidden = GenerateBoolean(counter),
                    Description = GenerateString(counter),
                };

                PopulateEntity(attributesCount, partitionsCount, annotationsCount, schemaCount, counter, entity);
                model.Entities.Add(entity);
            }

            AddRelationshipsToModel(relationshipsCount, annotationsCount, counter, model);

            return model;
        }


        internal static ModelExtensions.ExtendedModel GenerateExtendedModel(
            int entitiesCount = 5,
            int referencedEntities = 5,
            int relationshipsCount = 5,
            int attributesCount = 5,
            int partitionsCount = 5,
            int annotationsCount = 5,
            int schemaCount = 3)
        {
            AutoIncrementCounter counter = new AutoIncrementCounter();
            var model = new ModelExtensions.ExtendedModel()
            {
                Application = "extendedModel",
                Name = $"test_extended_model_{Guid.NewGuid().ToString()}",
                Culture = new CultureInfo(GenerateCulture(counter)),
                IsHidden = GenerateBoolean(counter),
                ExtendedAttribute = $"{GenerateString(counter)}_ModelExtendedAttr",
            };

            model.Annotations.AddRange(GenerateAnnotations(annotationsCount, counter));

            for (int i = 0; i < entitiesCount; i++)
            {
                var entity = new ModelExtensions.LocalEntity()
                {
                    Name = GenerateString(counter),
                    IsHidden = GenerateBoolean(counter),
                    Description = GenerateString(counter),
                    ExtendedLocalEntityAttribute = $"{GenerateString(counter)}_LocExtendedAttr",
                    Complex = i % 2 == 0 ?
                                (ModelExtensions.ComplexBase)new ModelExtensions.Complex1
                                {
                                    Attribute1 = $"{GenerateString(counter)}_Attr1",
                                    Attribute2 = $"{GenerateString(counter)}_Attr2",
                                    Attribute3 = $"{GenerateString(counter)}_Attr3",
                                    Attribute4 = $"{GenerateString(counter)}_Attr4",
                                }
                                : (ModelExtensions.ComplexBase)new ModelExtensions.Complex2
                                {
                                    Attribute1 = $"{GenerateString(counter)}_Attr1",
                                    Attribute2 = $"{GenerateString(counter)}_Attr2",
                                    Attribute5 = $"{GenerateString(counter)}_Attr5",
                                    Attribute6 = $"{GenerateString(counter)}_Attr6",
                                }
                };

                PopulateEntity(attributesCount, partitionsCount, annotationsCount, schemaCount, counter, entity);

                model.Entities.Add(entity);
            }

            AddRelationshipsToModel(relationshipsCount, annotationsCount, counter, model);

            var referenceModelId = Guid.NewGuid().ToString();
            model.ReferenceModels.Add(new ModelExtensions.ReferenceModel()
            {
                Id = referenceModelId,
                Location = new Uri("https://testaccountadlsgen2.dfs.core.windows.net/cdmfolders/simplemodel/model.json"),
                ExtendedReferenceModelAttribute = GenerateString(counter),
            });

            counter = new AutoIncrementCounter();
            for (int i = 0; i < referencedEntities; i++)
            {
                var entitySource = model.Entities[new Random().Next(0, model.Entities.Count)];

                var referenceEntity = new ModelExtensions.ReferenceEntity()
                {
                    Name = $"{GenerateString(counter)}_Ref",
                    Source = entitySource.Name,
                    Description = "I'm a Reference Entity",
                    IsHidden = GenerateBoolean(counter),
                    ModelId = referenceModelId,
                    ExtendedReferenceEntityAttribute = $"{GenerateString(counter)}_RefExtendedAttr"
                };

                referenceEntity.Annotations.AddRange(GenerateAnnotations(annotationsCount, counter));

                model.Entities.Add(referenceEntity);
            }

            return model;
        }

        private static void AddRelationshipsToModel(int relationshipsCount, int annotationsCount, AutoIncrementCounter counter, Model model)
        {
            for (int i = 0; i < relationshipsCount; i++)
            {
                SingleKeyRelationship relationship = new SingleKeyRelationship()
                {
                    Name = GenerateString(counter),
                    Description = GenerateString(counter),
                };
                int selectedFromEntity = counter % model.Entities.Count();
                int selectedFromAttribute = counter % model.Entities.WhereLocal().ElementAt(selectedFromEntity).Attributes.Count();
                relationship.FromAttribute = new AttributeReference()
                {
                    EntityName = model.Entities.ElementAt(selectedFromEntity).Name,
                    AttributeName = model.Entities.WhereLocal().ElementAt(selectedFromEntity).Attributes.ElementAt(selectedFromAttribute).Name,
                };

                int selectedToEntity = counter % model.Entities.Count();
                int selectedToAttribute = counter % model.Entities.WhereLocal().ElementAt(selectedToEntity).Attributes.Count();

                relationship.ToAttribute = new AttributeReference()
                {
                    EntityName = model.Entities.ElementAt(selectedToEntity).Name,
                    AttributeName = model.Entities.WhereLocal().ElementAt(selectedToEntity).Attributes.ElementAt(selectedToAttribute).Name,
                };

                relationship.Annotations.AddRange(GenerateAnnotations(annotationsCount, counter));
                model.Relationships.Add(relationship);
            }
        }

        private static void PopulateEntity(int attributesCount, int partitionsCount, int annotationsCount, int schemaCount, AutoIncrementCounter counter, LocalEntity entity)
        {
            entity.Annotations.AddRange(GenerateAnnotations(annotationsCount, counter));
            for (int j = 0; j < attributesCount; j++)
            {
                var attribute = new CdmFolders.ObjectModel.Attribute()
                {
                    Name = GenerateString(counter),
                    DataType = DataType.String,
                    Description = GenerateString(counter),
                };
                attribute.Annotations.AddRange(GenerateAnnotations(annotationsCount, counter));
                entity.Attributes.Add(attribute);
            }

            for (int p = 0; p < partitionsCount; p++)
            {
                Partition partition = GeneratePartition(counter, p);
                partition.Annotations.AddRange(GenerateAnnotations(annotationsCount, counter));
                entity.Partitions.Add(partition);
            }

            for (int s = 0; s < schemaCount; s++)
            {
                entity.Schemas.Add(new Uri($"https://raw.githubusercontent.com/microsoft/cdm/master/schemadocuments/core/applicationcommon/SchemaName.0.{s+1}.cdm.json"));
            }
        }

        internal static string GenerateString(int i)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
            return new string(Enumerable.Range(0, (i % 10) + 5).Select(s => chars[(s + i) % chars.Length]).ToArray());
        }

        internal static bool GenerateBoolean(int i)
        {
            return i % 2 == 0;
        }

        internal static string GenerateCulture(int i)
        {
            var cultureValues = new List<string>() { "es-ES", "fr-CA", "de-DE", "da", "he" };
            return cultureValues[i % cultureValues.Count];
        }

        internal static IEnumerable<Annotation> GenerateAnnotations(int annotationsCount, AutoIncrementCounter i)
        {
            return Enumerable.Range(0, annotationsCount).Select(
                s => new Annotation
                {
                    Name = GenerateString(s + i),
                    Value = GenerateString(s + i + 1),
                });
        }

        internal static Partition GeneratePartition(int counter, int p)
        {
            Partition partition = new Partition()
            {
                Name = GenerateString(counter),
                Description = GenerateString(counter),
                Location = new Uri(@"https://accountname.blob.core.windows.net/cdsa"),
            };

            if (p % 3 == 0)
            {
                partition.FileFormatSettings = new CsvFormatSettings
                {
                    ColumnHeaders = true,
                    CsvStyle = CsvStyle.QuoteAlways,
                    Delimiter = ",",
                    QuoteStyle = CsvQuoteStyle.None,
                };
            }

            return partition;
        }

        internal static void VerifyModelSerialization(Model model, string rawJsonObject)
        {
            JObject jsonObject = JsonConvert.DeserializeObject<JObject>(rawJsonObject);
            VerifyModelSerialization(model, jsonObject);
        }

        internal static void VerifyModelSerialization(Model model, JObject jsonObject)
        {
            GetValueFromJson("application", jsonObject).Should().Be(model.Application);
            GetValueFromJson("name", jsonObject).Should().Be(model.Name);
            GetValueFromJson("description", jsonObject).Should().Be(model.Description);
            VerifySerializationWithDefaultValue(model.Culture, GetValueFromJson("culture", jsonObject), CultureInfo.InvariantCulture);
            VerifySerializationIsHiddenValue(model.IsHidden, GetValueFromJson("isHidden", jsonObject), false);

            var jAnnotations = (JArray)jsonObject.GetValue("annotations");
            VerifyAnnotations(jAnnotations, model.Annotations);

            var jEntities = (JArray)jsonObject.GetValue("entities");
            VerifyCollection(jEntities, model.Entities.Count);

            var jReferenceModels = (JArray)jsonObject.GetValue("referenceModels");
            VerifyReferenceModels(jReferenceModels, model.ReferenceModels);

            for (int i = 0; model.Entities.Any() && i < jEntities.Count; i++)
            {
                var jEntity = (JObject)jEntities[i];
                var dEntity = model.Entities.ElementAt(i);

                if (dEntity is ReferenceEntity)
                {
                    GetValueFromJson("name", jEntity).Should().Be(dEntity.Name);
                    GetValueFromJson("source", jEntity).Should().Be(((ReferenceEntity)dEntity).Source);
                    GetValueFromJson("modelId", jEntity).Should().Be(((ReferenceEntity)dEntity).ModelId);
                }
                else if (dEntity is LocalEntity)
                {
                    var dlEntity = dEntity.AsLocal();

                    GetValueFromJson("name", jEntity).Should().Be(dEntity.Name);
                    GetValueFromJson("description", jEntity).Should().Be(dEntity.Description);
                    var jEntityDataCategory = GetValueFromJson("dataCategory", jEntity);

                    VerifySerializationIsHiddenValue(dEntity.IsHidden, GetValueFromJson("isHidden", jEntity), false);

                    var jEntityAnnotations = (JArray)jEntity.GetValue("annotations");
                    VerifyAnnotations(jEntityAnnotations, dEntity.Annotations);

                    var jAttributes = (JArray)jEntity.GetValue("attributes");

                    VerifyCollection(jAttributes, dlEntity.Attributes.Count);

                    for (int j = 0; dlEntity.Attributes.Any() && j < jAttributes.Count; j++)
                    {
                        var jAttr = (JObject)jAttributes[j];
                        var dAttr = dlEntity.Attributes.ElementAt(j);

                        GetValueFromJson("name", jAttr).Should().Be(dAttr.Name);
                        GetValueFromJson("description", jAttr).Should().Be(dAttr.Description);

                        GetValueFromJson("dataType", jAttr).Should().Be(DataTypeStringToCamelCase(dAttr.DataType));

                        var jEntityAttributeAnnotations = (JArray)jAttr.GetValue("annotations");
                        VerifyAnnotations(jEntityAttributeAnnotations, dAttr.Annotations);
                    }

                    var jPartitions = (JArray)jEntity.GetValue("partitions");

                    VerifyCollection(jPartitions, dlEntity.Partitions.Count);

                    for (int j = 0; dlEntity.Partitions.Any() && j < jPartitions.Count; j++)
                    {
                        var oPartition = (JObject)jPartitions[j];
                        var dPartition = dlEntity.Partitions.ElementAt(j);

                        GetValueFromJson("description", oPartition).Should().Be(dPartition.Description);
                        GetValueFromJson("location", oPartition).Should().Be(dPartition.Location.AbsoluteUri);
                        GetValueFromJson("name", oPartition).Should().Be(dPartition.Name);

                        var jEntityPartitionsAnnotations = (JArray)oPartition.GetValue("annotations");
                        VerifyAnnotations(jEntityPartitionsAnnotations, dPartition.Annotations);

                        if (dPartition.FileFormatSettings != null)
                        {
                            var oFileFormatSettings = (JObject)oPartition.GetValue("fileFormatSettings");
                            Assert.IsNotNull(oFileFormatSettings);
                            Assumes.Is<CsvFormatSettings>(dPartition.FileFormatSettings);
                            CsvFormatSettings csvFormatSettings = (CsvFormatSettings)dPartition.FileFormatSettings;
                            GetValueFromJson("columnHeaders", oFileFormatSettings).Should().Be(csvFormatSettings.ColumnHeaders.ToString());
                            GetValueFromJson("csvStyle", oFileFormatSettings).Should().Be($"CsvStyle.{csvFormatSettings.CsvStyle}");
                            GetValueFromJson("delimiter", oFileFormatSettings).Should().Be(csvFormatSettings.Delimiter.ToString());
                            GetValueFromJson("quoteStyle", oFileFormatSettings).Should().Be($"QuoteStyle.{csvFormatSettings.QuoteStyle}");
                        }
                    }
                }
            }

            var jRelationships = (JArray)jsonObject.GetValue("relationships");

            VerifyCollection(jRelationships, model.Relationships.Count);
            for (int i = 0; model.Relationships.Any() && i < jRelationships.Count; i++)
            {
                var oRelationship = (JObject)jRelationships[i];
                var dRelationship = model.Relationships.ElementAt(i);
                GetValueFromJson("description", oRelationship).Should().Be(dRelationship.Description);
                GetValueFromJson("name", oRelationship).Should().Be(dRelationship.Name);

                var jEntityPartitionsAnnotations = (JArray)oRelationship.GetValue("annotations");
                VerifyAnnotations(jEntityPartitionsAnnotations, dRelationship.Annotations);
            }
        }

        internal static void VerifyExtendedModelSerialization(ModelExtensions.ExtendedModel model, string rawJsonObject)
        {
            JObject jsonObject = JsonConvert.DeserializeObject<JObject>(rawJsonObject);
            VerifyExtendedModelSerialization(model, jsonObject);
        }

        internal static void VerifyExtendedModelSerialization(ModelExtensions.ExtendedModel model, JObject jsonObject)
        {
            VerifyModelSerialization(model, jsonObject);
            
            GetValueFromJson("xyz:extendedAttribute", jsonObject).Should().Be(model.ExtendedAttribute);

            var jEntities = (JArray)jsonObject.GetValue("entities");

            var jReferenceModels = (JArray)jsonObject.GetValue("referenceModels");
            VerifyExtendedReferenceModels(jReferenceModels, model.ReferenceModels);

            for (int i = 0; model.Entities.Any() && i < jEntities.Count; i++)
            {
                var jEntity = (JObject)jEntities[i];
                var dEntity = model.Entities.ElementAt(i);

                if (dEntity is ModelExtensions.ReferenceEntity dRefEntity)
                {
                    GetValueFromJson("xyz:extendedReferenceEntityAttribute", jEntity).Should().Be(dRefEntity.ExtendedReferenceEntityAttribute);
                }
                else if (dEntity is ModelExtensions.LocalEntity dLocEntity)
                {
                    GetValueFromJson("xyz:extendedLocalEntityAttribute", jEntity).Should().Be(dLocEntity.ExtendedLocalEntityAttribute);
                    var jComplex = (JObject)jEntity.GetValue("xyz:complex");

                    GetValueFromJson("xyz:attribute1", jComplex).Should().Be(dLocEntity.Complex.Attribute1);
                    GetValueFromJson("xyz:attribute2", jComplex).Should().Be(dLocEntity.Complex.Attribute2);
                    if (dLocEntity.Complex is ModelExtensions.Complex1 dcomplex1)
                    {
                        GetValueFromJson("xyz:attribute3", jComplex).Should().Be(dcomplex1.Attribute3);
                        GetValueFromJson("xyz:attribute4", jComplex).Should().Be(dcomplex1.Attribute4);
                    }
                    else if (dLocEntity.Complex is ModelExtensions.Complex2 dcomplex2)
                    {
                        GetValueFromJson("xyz:attribute5", jComplex).Should().Be(dcomplex2.Attribute5);
                        GetValueFromJson("xyz:attribute6", jComplex).Should().Be(dcomplex2.Attribute6);
                    }
                    else
                    {
                        Assert.Fail("Invalid complex type");
                    }
                }
            }
        }

        internal static void VerifyModelDeserialization(string rawJsonObject, Model deserialized)
        {
            JObject jsonObject = (JObject)JsonConvert.DeserializeObject(rawJsonObject);
            GetValueFromJson("application", jsonObject).Should().Be(deserialized.Application);
            GetValueFromJson("name", jsonObject).Should().Be(deserialized.Name);
            GetValueFromJson("description", jsonObject).Should().Be(deserialized.Description);

            VerifyDeserializationWithDefaultValue(deserialized.Culture, GetValueFromJson("culture", jsonObject), CultureInfo.InvariantCulture);
            VerifyDeserializationIsHiddenValue(deserialized.IsHidden, GetValueFromJson("isHidden", jsonObject), false);

            var jEntities = (JArray)jsonObject.GetValue("entities");
            var jAnnotations = (JArray)jsonObject.GetValue("annotations");
            VerifyAnnotations(jAnnotations, deserialized.Annotations);

            for (int i = 0; i < jEntities.Count; i++)
            {
                var jEntity = (JObject)jEntities[i];
                var dEntity = deserialized.Entities.ElementAt(i);

                GetValueFromJson("name", jEntity).Should().Be(dEntity.Name);

                GetValueFromJson("description", jEntity).Should().Be(dEntity.Description);

                VerifyDeserializationIsHiddenValue(dEntity.IsHidden, GetValueFromJson("isHidden", jEntity), false);

                var jEntityAnnotations = (JArray)jEntity.GetValue("annotations");
                VerifyAnnotations(jEntityAnnotations, dEntity.Annotations);

                if (dEntity is ReferenceEntity)
                {
                    GetValueFromJson("name", jEntity).Should().Be(dEntity.Name);
                    GetValueFromJson("source", jEntity).Should().Be(((ReferenceEntity)dEntity).Source);
                    GetValueFromJson("modelId", jEntity).Should().Be(((ReferenceEntity)dEntity).ModelId);
                }
                else if (dEntity is LocalEntity)
                {
                    var dlEntity = dEntity.AsLocal();
                    GetValueFromJson("name", jEntity).Should().Be(dEntity.Name);
                    GetValueFromJson("description", jEntity).Should().Be(dEntity.Description);
                    var jEntityDataCategory = GetValueFromJson("dataCategory", jEntity);

                    var jAttributes = (JArray)jEntity.GetValue("attributes");

                    jAttributes.Count.Should().Be(dlEntity.Attributes.Count);
                    for (int j = 0; j < jAttributes.Count; j++)
                    {
                        var jAttr = (JObject)jAttributes[j];
                        var dAttr = dlEntity.Attributes.ElementAt(j);

                        GetValueFromJson("name", jAttr).Should().Be(dAttr.Name);
                        GetValueFromJson("description", jAttr).Should().Be(dAttr.Description);

                        GetValueFromJson("dataType", jAttr).Should().Be(DataTypeStringToCamelCase(dAttr.DataType));

                        var jEntityAttributeAnnotations = (JArray)jAttr.GetValue("annotations");
                        VerifyAnnotations(jEntityAttributeAnnotations, dAttr.Annotations);
                    }

                    var jPartitions = (JArray)jEntity.GetValue("partitions");
                    if (dlEntity.Partitions.Count == 0)
                    {
                        Assert.IsTrue(jPartitions == null || jPartitions.Count == 0);
                    }
                    else
                    {
                        jPartitions.Count.Should().Be(dlEntity.Partitions.Count);
                        for (int j = 0; j < jPartitions.Count; j++)
                        {
                            var oPartition = (JObject)jPartitions[j];
                            var dPartition = dlEntity.Partitions.ElementAt(j);

                            GetValueFromJson("description", oPartition).Should().Be(dPartition.Description);
                            GetValueFromJson("location", oPartition).Should().Be(dPartition.Location?.ToString());
                            GetValueFromJson("name", oPartition).Should().Be(dPartition.Name);

                            var jEntityPartitionsAnnotations = (JArray)oPartition.GetValue("annotations");
                            VerifyAnnotations(jEntityPartitionsAnnotations, dPartition.Annotations);
                        }
                    }

                    var jSchemas = (JArray)jEntity.GetValue("schemas");
                    if (dlEntity.Schemas.Count == 0)
                    {
                        Assert.IsTrue(jSchemas == null || jSchemas.Count == 0);
                    }
                    else
                    {
                        jSchemas.Count.Should().Be(dlEntity.Schemas.Count);
                    }
                }
            }

            var jRelationships = (JArray)jsonObject.GetValue("relationships");

            jRelationships.Count.Should().Be(deserialized.Relationships.Count());
            for (int i = 0; i < jRelationships.Count; i++)
            {
                var oRelationship = (JObject)jRelationships[i];
                var dRelationship = deserialized.Relationships.ElementAt(i);
                GetValueFromJson("description", oRelationship).Should().Be(dRelationship.Description);
                GetValueFromJson("name", oRelationship).Should().Be(dRelationship.Name);

                var jEntityPartitionsAnnotations = (JArray)oRelationship.GetValue("annotations");
                VerifyAnnotations(jEntityPartitionsAnnotations, dRelationship.Annotations);
            }
        }

        internal static void VerifyExtendedModelDeserialization(string rawJsonObject, ModelExtensions.ExtendedModel deserialized)
        {
            VerifyModelDeserialization(rawJsonObject, deserialized);
            JObject jsonObject = (JObject)JsonConvert.DeserializeObject(rawJsonObject);
            GetValueFromJson("xyz:extendedAttribute", jsonObject).Should().Be(deserialized.ExtendedAttribute);

            var jReferenceModels = (JArray)jsonObject.GetValue("referenceModels");
            VerifyExtendedReferenceModels(jReferenceModels, deserialized.ReferenceModels);

            var jEntities = (JArray)jsonObject.GetValue("entities");

            for (int i = 0; i < jEntities.Count; i++)
            {
                var jEntity = (JObject)jEntities[i];
                var dEntity = deserialized.Entities.ElementAt(i);

                if (dEntity is ModelExtensions.ReferenceEntity dRefEntity)
                {
                    GetValueFromJson("xyz:extendedReferenceEntityAttribute", jEntity).Should().Be(dRefEntity.ExtendedReferenceEntityAttribute);
                }
                else if (dEntity is ModelExtensions.LocalEntity dLocEntity)
                {
                    GetValueFromJson("xyz:extendedLocalEntityAttribute", jEntity).Should().Be(dLocEntity.ExtendedLocalEntityAttribute);
                    var jComplex = (JObject)jEntity.GetValue("xyz:complex");

                    GetValueFromJson("xyz:attribute1", jComplex).Should().Be(dLocEntity.Complex.Attribute1);
                    GetValueFromJson("xyz:attribute2", jComplex).Should().Be(dLocEntity.Complex.Attribute2);
                    if (dLocEntity.Complex is ModelExtensions.Complex1 dcomplex1)
                    {
                        GetValueFromJson("xyz:attribute3", jComplex).Should().Be(dcomplex1.Attribute3);
                        GetValueFromJson("xyz:attribute4", jComplex).Should().Be(dcomplex1.Attribute4);
                    }
                    else if (dLocEntity.Complex is ModelExtensions.Complex2 dcomplex2)
                    {
                        GetValueFromJson("xyz:attribute5", jComplex).Should().Be(dcomplex2.Attribute5);
                        GetValueFromJson("xyz:attribute6", jComplex).Should().Be(dcomplex2.Attribute6);
                    }
                    else
                    {
                        Assert.Fail("Invalid complex type");
                    }
                }
                else
                {
                    Assert.Fail("Invalid entity type");
                }
            }
        }

        internal static string GetValueFromJson(string path, JObject jsonObject)
        {
            jsonObject.TryGetValue(path, out JToken value);
            if (value == null || value.Type == JTokenType.Undefined || value.Type == JTokenType.Null)
            {
                return null;
            }
            else if (value.Type == JTokenType.Date)
            {
                return ((DateTimeOffset)value).ToUniversalTime().ToString();
            }
            else
            {
                return value.ToString();
            }
        }

        internal static void VerifySerializationWithDefaultValue<T>(T value, string jsonValue, T defaultValue)
        {
            if (jsonValue == null)
            {
                value.Should().Be(defaultValue);
            }
            else
            {
                value.ToString().Should().Be(jsonValue);
            }
        }

        internal static void VerifySerializationIsHiddenValue(bool value, string jsonValue, bool parentValue)
        {
            if (parentValue || jsonValue == null)
            {
                value.Should().Be(parentValue);
            }
            else
            {
                value.ToString().Should().Be(jsonValue);
            }
        }

        internal static void VerifyDeserializationWithDefaultValue<T>(T value, string jsonValue, T defaultValue)
        {
            if (jsonValue == null)
            {
                value.Should().Be(defaultValue);
            }
            else
            {
                value.ToString().Should().Be(jsonValue);
            }
        }

        internal static void VerifyDeserializationIsHiddenValue(bool value, string jsonValue, bool parentValue)
        {
            if (parentValue || jsonValue == null)
            {
                value.Should().Be(parentValue);
            }
            else
            {
                value.ToString().Should().Be(jsonValue);
            }
        }

        internal static void VerifyAnnotations(AnnotationCollection original, AnnotationCollection deserialized)
        {
            original.Count.Should().Be(deserialized.Count);
            for (int i = 0; i < original.Count; i++)
            {
                var oAnnotation = original[i];
                var dAnnotation = deserialized[i];

                oAnnotation.Name.Should().Be(dAnnotation.Name);
                oAnnotation.Value.Should().Be(dAnnotation.Value);
            }
        }

        internal static void VerifyAnnotations(JArray jAnnotations, ObjectCollection<Annotation> mAnnotations)
        {
            if (mAnnotations.Count > 0)
            {
                jAnnotations.Count.Should().Be(mAnnotations.Count);
            }
            else
            {
                jAnnotations.Should().BeNull();
            }

            for (int a = 0; mAnnotations.Any() && a < jAnnotations.Count(); a++)
            {
                var jAnnotation = (JObject)jAnnotations[a];
                var mAnnotation = mAnnotations[a];
                GetValueFromJson("name", jAnnotation).Should().Be(mAnnotation.Name);
                GetValueFromJson("value", jAnnotation).Should().Be(mAnnotation.Value);
            }
        }

        internal static void VerifyReferenceModels(JArray jReferenceModels, ObjectCollection<ReferenceModel> mReferenceModels)
        {
            if (mReferenceModels.Count > 0)
            {
                jReferenceModels.Count.Should().Be(mReferenceModels.Count);
            }
            else
            {
                jReferenceModels.Should().BeNull();
            }

            for (int r = 0; mReferenceModels.Any() && r < jReferenceModels.Count(); r++)
            {
                var jReferenceModel = (JObject)jReferenceModels[r];
                var mReferenceModel = mReferenceModels[r];
                GetValueFromJson("id", jReferenceModel).Should().Be(mReferenceModel.Id);
                GetValueFromJson("location", jReferenceModel).Should().Be(mReferenceModel.Location.AbsoluteUri);
            }
        }

        internal static void VerifyExtendedReferenceModels(JArray jReferenceModels, ObjectCollection<ReferenceModel> mReferenceModels)
        {
            if (mReferenceModels.Count > 0)
            {
                jReferenceModels.Count.Should().Be(mReferenceModels.Count);
            }
            else
            {
                jReferenceModels.Should().BeNull();
            }

            for (int r = 0; mReferenceModels.Any() && r < jReferenceModels.Count(); r++)
            {
                var jReferenceModel = (JObject)jReferenceModels[r];
                var mReferenceModel = (ModelExtensions.ReferenceModel)mReferenceModels[r];
                GetValueFromJson("xyz:extendedReferenceModelAttribute", jReferenceModel).Should().Be(mReferenceModel.ExtendedReferenceModelAttribute);
            }
        }

        internal static void VerifyCollection(JArray jAarry, int numberOfItemsInModel)
        {
            if (numberOfItemsInModel > 0)
            {
                jAarry.Count.Should().Be(numberOfItemsInModel);
            }
            else
            {
                jAarry.Should().BeNull();
            }
        }

        internal static string DataTypeStringToCamelCase(DataType dataType)
        {
            if (dataType == default)
            {
                return null;
            }

            var dataTypeString = dataType.ToString();
            return LowerFirstLetter(dataTypeString);
        }

        internal static string LowerFirstLetter(string str)
        {
            return char.ToLowerInvariant(str[0]) + str.Substring(1);
        }

        internal static void VerifyAttributeReference(AttributeReference attributeReference, Model model)
        {
            var attribute = model.Entities.WhereLocal()
                .SelectMany(e => e.Attributes)
                .Where(a => StringComparer.Ordinal.Equals(a.Name, attributeReference.AttributeName)).SingleOrDefault();
            attribute.Should().NotBeNull();
        }

        internal static void VerifyNameValidations(MetadataObject metadataObj)
        {
            metadataObj.Validate();

            metadataObj.Name = string.Empty; // invalid name

            metadataObj.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("name cannot be empty");

            metadataObj.Name = " "; // invalid name

            metadataObj.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("empty name is not allowed");

            metadataObj.Name = "  a"; // invalid name

            metadataObj.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("leading spaces are not allowed");

            metadataObj.Name = "b "; // invalid name

            metadataObj.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("trailing spaces are not allowed");

            metadataObj.Name = " ab "; // invalid name

            metadataObj.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("leading and trailing are not allowed");

            metadataObj.Name = " a b "; // invalid name

            metadataObj.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("leading and trailing are not allowed");

            metadataObj.Name = "    s"; // invalid name (trailing tab)

            metadataObj.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>("leading and trailing are not allowed");

            metadataObj.Name = "a b"; // valid name

            metadataObj.Validate();

            metadataObj.Name = "objName";

            metadataObj.Validate();
        }

        internal static void VerifyAnnotationsValidations(MetadataObject metadataObj)
        {
            metadataObj.Annotations.Add(new Annotation()); // invalid annotation, Name is not set

            metadataObj.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>();

            metadataObj.Annotations.First().Name = " "; // invalid annotation, Name is not set
            metadataObj.Invoking(m => m.Validate()).Should().Throw<InvalidDataException>();

            metadataObj.Annotations.First().Name = "abc";
            metadataObj.Invoking(m => m.Validate()).Should().NotThrow();
        }

        internal static void ValidateDataObjectCollectionValidation<T>(MetadataObjectCollection<T> collection, T dataObject1, T dataObject2)
           where T : MetadataObject
        {
            collection.Add(dataObject1);
            collection.Add(dataObject2);

            dataObject1.Name = "name";
            dataObject2.Name = "Name"; // Two metadata objects with the same name

            collection.Invoking(c => c.Validate()).Should().Throw<InvalidDataException>();
            dataObject2.Name = "name2";

            collection.Validate(); // Validation error were not expected

            dataObject2.Name = "a   "; // invalid name

            collection.Invoking(c => c.Validate()).Should().Throw<InvalidDataException>();

            dataObject1.Name = "nAme"; // Same name, different case sensetivity

            collection.Invoking(c => c.Validate()).Should().Throw<InvalidDataException>();

            dataObject2.Name = "name2";

            VerifyAnnotationsValidations(dataObject1);
            VerifyAnnotationsValidations(dataObject2);
        }

        internal static void VerifyPropertiesOrder(JObject o)
        {
            var expectedOrderTypes = new[] { typeof(JValue), typeof(JObject), typeof(JArray) };
            var i = 0;
            foreach (var property in o.Properties())
            {
                while (i < expectedOrderTypes.Length && property.Value.GetType() != expectedOrderTypes[i])
                {
                    i++;
                }

                i.Should().BeLessThan(expectedOrderTypes.Length, $"{property.Path} is out of order");

                if (property.Value is JArray a)
                {
                    if (a.Count == 0 || (a.First() as JObject) == null)
                    {
                        // simple or empty array
                        continue;
                    }

                    foreach (JObject p in a)
                    {
                        VerifyPropertiesOrder(p);
                    }
                }
            }
        }

        internal class AutoIncrementCounter
        {
            internal static int counter = 0;

            public int Counter => counter++;

            public static implicit operator int(AutoIncrementCounter counter) => counter.Counter;
        }

    }
}
