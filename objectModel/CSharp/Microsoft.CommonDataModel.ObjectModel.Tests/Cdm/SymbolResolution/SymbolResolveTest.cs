// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.IO;
    using System.Threading.Tasks;

    [TestClass]
    public class SymbolResolveTest
    {
        /// <summary>
        /// The test's data path.
        /// </summary>
        private static readonly string TestsSubpath = Path.Combine("Cdm", "SymbolResolution");

        [TestMethod]
        public async Task TestSymbolResolution()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(TestsSubpath, "TestSymbolResolution");

            // load the file
            CdmEntityDefinition ent = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/symbolEntity.cdm.json/symbolEnt");
            ResolveOptions resOpt = new ResolveOptions(ent.InDocument);

            // resolve a reference to the trait object
            CdmObjectBase traitDef = corpus.ResolveSymbolReference(
                resOpt,
                ent.InDocument,
                "symbolEnt/exhibitsTraits/someTraitOnEnt",
                CdmObjectType.TraitDef,
                false
            );

            Assert.IsTrue(traitDef is CdmTraitDefinition);

            // resolve a path to the reference object that contains the trait
            CdmObjectBase traitRef = corpus.ResolveSymbolReference(
                resOpt,
                ent.InDocument,
                "symbolEnt/exhibitsTraits/someTraitOnEnt/(ref)",
                CdmObjectType.TraitDef,
                false
            );

            Assert.IsTrue(traitRef is CdmTraitReference);

            // FetchObjectDefinition on a path to a reference should fetch the actual object
            CdmTraitDefinition traitRefDefinition = traitRef.FetchObjectDefinition<CdmTraitDefinition>(resOpt);
            CdmTraitDefinition traitDefDefinition = traitDef.FetchObjectDefinition<CdmTraitDefinition>(resOpt);
            Assert.AreEqual(traitRefDefinition, traitDef);
            Assert.AreEqual(traitDefDefinition, traitDef);

            CdmObjectBase groupRef = corpus.ResolveSymbolReference(
                resOpt,
                ent.InDocument,
                "symbolEnt/hasAttributes/someGroupRef/(ref)",
                CdmObjectType.AttributeGroupDef,
                false
            );

            Assert.IsTrue(groupRef is CdmAttributeGroupReference);

            CdmObjectBase groupDef = corpus.ResolveSymbolReference(
                resOpt,
                ent.InDocument,
                "symbolEnt/hasAttributes/someGroupRef",
                CdmObjectType.AttributeGroupDef,
                false
            );

            Assert.IsTrue(groupDef is CdmAttributeGroupDefinition);

            // calling FetchObjectDefinition on a symbol to a ref or def should both give the definition
            CdmAttributeGroupDefinition groupRefDefinition = groupRef.FetchObjectDefinition<CdmAttributeGroupDefinition>(resOpt);
            CdmAttributeGroupDefinition groupDefDefinition = groupDef.FetchObjectDefinition<CdmAttributeGroupDefinition>(resOpt);
            Assert.AreEqual(groupRefDefinition, groupDef);
            Assert.AreEqual(groupDefDefinition, groupDef);

            CdmObjectBase typeAtt = corpus.ResolveSymbolReference(
                resOpt,
                ent.InDocument,
                "symbolEnt/hasAttributes/someGroupRef/members/someAttribute",
                CdmObjectType.AttributeGroupDef,
                false
            );

            Assert.IsTrue(typeAtt is CdmTypeAttributeDefinition);
        }
    }
}
