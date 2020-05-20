// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Tests.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    /// <summary>
    /// Base class for all the new resolution guidance tests
    /// </summary>
    public class CommonTest
    {
        /// <summary>
        /// The path of the SchemaDocs project.
        /// </summary>
        protected const string SchemaDocsPath = TestHelper.SchemaDocumentsPath;

        /// <summary>
        /// The test's data path.
        /// </summary>
        protected static readonly string TestsSubpath = Path.Combine("Cdm", "ResolutionGuidance");

        /// <summary>
        /// This method runs the tests with a set expected attributes & attribute context values and validated the actual result
        /// </summary>
        /// <param name="testName"></param>
        /// <param name="sourceEntityName"></param>
        /// <param name="expectedContext_*">expected attribute context object - for each resolution option combination</param>
        /// <param name="expected_*">expected attribute object - for each resolution option combination</param>
        /// <returns></returns>
        protected static async Task RunTestWithValues(
            string testName,
            string sourceEntityName,

            AttributeContextExpectedValue expectedContext_default,
            AttributeContextExpectedValue expectedContext_normalized,
            AttributeContextExpectedValue expectedContext_referenceOnly,
            AttributeContextExpectedValue expectedContext_structured,
            AttributeContextExpectedValue expectedContext_normalized_structured,
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized,
            AttributeContextExpectedValue expectedContext_referenceOnly_structured,
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured,

            List<AttributeExpectedValue> expected_default,
            List<AttributeExpectedValue> expected_normalized,
            List<AttributeExpectedValue> expected_referenceOnly,
            List<AttributeExpectedValue> expected_structured,
            List<AttributeExpectedValue> expected_normalized_structured,
            List<AttributeExpectedValue> expected_referenceOnly_normalized,
            List<AttributeExpectedValue> expected_referenceOnly_structured,
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured
            )
        {
            try
            {
                string testInputPath = TestHelper.GetInputFolderPath(TestsSubpath, testName);

                CdmCorpusDefinition corpus = new CdmCorpusDefinition();
                corpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
                corpus.Storage.Mount("localInput", new LocalAdapter(testInputPath));
                corpus.Storage.Mount("cdm", new LocalAdapter(SchemaDocsPath));
                corpus.Storage.DefaultNamespace = "localInput";

                CdmEntityDefinition srcEntityDef = await corpus.FetchObjectAsync<CdmEntityDefinition>($"localInput:/{sourceEntityName}.cdm.json/{sourceEntityName}") as CdmEntityDefinition;
                Assert.IsTrue(srcEntityDef != null);

                var resOpt = new ResolveOptions
                {
                    WrtDoc = srcEntityDef.InDocument,
                    Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { })
                };

                CdmEntityDefinition resolvedEntityDef = null;
                string outputEntityName = string.Empty;
                string outputEntityFileName = string.Empty;
                string entityFileName = string.Empty;

                if (expectedContext_default != null && expected_default != null)
                {
                    entityFileName = "default";
                    resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { });
                    outputEntityName = $"{sourceEntityName}_Resolved_{entityFileName}";
                    outputEntityFileName = $"{outputEntityName}.cdm.json";
                    resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityName, resOpt);
                    ValidateOutputWithValues(expectedContext_default, expected_default, resolvedEntityDef);
                }

                if (expectedContext_normalized != null && expected_normalized != null)
                {
                    entityFileName = "normalized";
                    resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized" });
                    outputEntityName = $"{sourceEntityName}_Resolved_{entityFileName}";
                    outputEntityFileName = $"{outputEntityName}.cdm.json";
                    resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityName, resOpt);
                    ValidateOutputWithValues(expectedContext_normalized, expected_normalized, resolvedEntityDef);
                }

                if (expectedContext_referenceOnly != null && expected_referenceOnly != null)
                {
                    entityFileName = "referenceOnly";
                    resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "referenceOnly" });
                    outputEntityName = $"{sourceEntityName}_Resolved_{entityFileName}";
                    outputEntityFileName = $"{outputEntityName}.cdm.json";
                    resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityName, resOpt);
                    ValidateOutputWithValues(expectedContext_referenceOnly, expected_referenceOnly, resolvedEntityDef);
                }

                if (expectedContext_structured != null && expected_structured != null)
                {
                    entityFileName = "structured";
                    resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "structured" });
                    outputEntityName = $"{sourceEntityName}_Resolved_{entityFileName}";
                    outputEntityFileName = $"{outputEntityName}.cdm.json";
                    resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityName, resOpt);
                    ValidateOutputWithValues(expectedContext_structured, expected_structured, resolvedEntityDef);
                }

                if (expectedContext_normalized_structured != null && expected_normalized_structured != null)
                {
                    entityFileName = "normalized_structured";
                    resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "structured" });
                    outputEntityName = $"{sourceEntityName}_Resolved_{entityFileName}";
                    outputEntityFileName = $"{outputEntityName}.cdm.json";
                    resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityName, resOpt);
                    ValidateOutputWithValues(expectedContext_normalized_structured, expected_normalized_structured, resolvedEntityDef);
                }

                if (expectedContext_referenceOnly_normalized != null && expected_referenceOnly_normalized != null)
                {
                    entityFileName = "referenceOnly_normalized";
                    resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "referenceOnly", "normalized" });
                    outputEntityName = $"{sourceEntityName}_Resolved_{entityFileName}";
                    outputEntityFileName = $"{outputEntityName}.cdm.json";
                    resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityName, resOpt);
                    ValidateOutputWithValues(expectedContext_referenceOnly_normalized, expected_referenceOnly_normalized, resolvedEntityDef);
                }

                if (expectedContext_referenceOnly_structured != null && expected_referenceOnly_structured != null)
                {
                    entityFileName = "referenceOnly_structured";
                    resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "referenceOnly", "structured" });
                    outputEntityName = $"{sourceEntityName}_Resolved_{entityFileName}";
                    outputEntityFileName = $"{outputEntityName}.cdm.json";
                    resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityName, resOpt);
                    ValidateOutputWithValues(expectedContext_referenceOnly_structured, expected_referenceOnly_structured, resolvedEntityDef);
                }

                if (expectedContext_referenceOnly_normalized_structured != null && expected_referenceOnly_normalized_structured != null)
                {
                    entityFileName = "referenceOnly_normalized_structured";
                    resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "referenceOnly", "normalized", "structured" });
                    outputEntityName = $"{sourceEntityName}_Resolved_{entityFileName}";
                    outputEntityFileName = $"{outputEntityName}.cdm.json";
                    resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityName, resOpt);
                    ValidateOutputWithValues(expectedContext_referenceOnly_normalized_structured, expected_referenceOnly_normalized_structured, resolvedEntityDef);
                }
            }
            catch (Exception e)
            {
                Assert.Fail(e.Message);
            }
        }

        /// <summary>
        /// Runs validation to test actual output vs expected output for attributes collection vs attribute context
        /// </summary>
        /// <param name="expectedContext"></param>
        /// <param name="expectedAttributes"></param>
        /// <param name="actualResolvedEntityDef"></param>
        protected static void ValidateOutputWithValues(AttributeContextExpectedValue expectedContext, List<AttributeExpectedValue> expectedAttributes, CdmEntityDefinition actualResolvedEntityDef)
        {
            ObjectValidator.ValidateAttributesCollection(expectedAttributes, actualResolvedEntityDef.Attributes);
            ObjectValidator.ValidateAttributeContext(expectedContext, actualResolvedEntityDef.AttributeContext);
        }
    }
}
