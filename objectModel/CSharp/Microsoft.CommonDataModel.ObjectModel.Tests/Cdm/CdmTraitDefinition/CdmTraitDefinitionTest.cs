// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    [TestClass]
    public class CdmTraitDefinitionTests
    {
        [TestMethod]
        public void TestExtendsTraitPropertyOptional()
        {
            var corpus = new CdmCorpusDefinition();
            var extendTraitRef1 = new CdmTraitReference(corpus.Ctx, "testExtendTraitName1", true, false);
            var extendTraitRef2 = new CdmTraitReference(corpus.Ctx, "testExtendTraitName2", true, false);
            var traitDefinition = new CdmTraitDefinition(corpus.Ctx, "testTraitName", extendTraitRef1);

            Assert.AreEqual(extendTraitRef1, traitDefinition.ExtendsTrait);
            traitDefinition.ExtendsTrait = null;
            Assert.IsNull(traitDefinition.ExtendsTrait);

            traitDefinition.ExtendsTrait = extendTraitRef2;
            Assert.AreEqual(extendTraitRef2, traitDefinition.ExtendsTrait);
            traitDefinition.ExtendsTrait = null;
            Assert.IsNull(traitDefinition.ExtendsTrait);
        }
    }
}