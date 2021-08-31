// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.symbolresolution;
 
import java.io.File;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeGroupDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeGroupReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectBase;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;

import org.testng.Assert;
import org.testng.annotations.Test;

public class SymbolResolveTest {
    private static final String TESTS_SUBPATH = new File("Cdm", "SymbolResolution").toString();

    @Test
    public void testSymbolResolution() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testSymbolResolution");

        // load the file
        final CdmEntityDefinition ent = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/symbolEntity.cdm.json/symbolEnt").join();
        final ResolveOptions resOpt = new ResolveOptions(ent.getInDocument());

        // resolve a reference to the trait object
        CdmObjectBase traitDef = corpus.resolveSymbolReference(
            resOpt,
            ent.getInDocument(),
            "symbolEnt/exhibitsTraits/someTraitOnEnt",
            CdmObjectType.TraitDef,
            false
        );

        Assert.assertTrue(traitDef instanceof CdmTraitDefinition);

        // resolve a path to the reference object that contains the trait
        CdmObjectBase traitRef = corpus.resolveSymbolReference(
            resOpt,
            ent.getInDocument(),
            "symbolEnt/exhibitsTraits/someTraitOnEnt/(ref)",
            CdmObjectType.TraitDef,
            false
        );

        Assert.assertTrue(traitRef instanceof CdmTraitReference);

        // FetchObjectDefinition on a path to a reference should fetch the actual object
        CdmTraitDefinition traitRefDefinition = traitRef.<CdmTraitDefinition>fetchObjectDefinition(resOpt);
        CdmTraitDefinition traitDefDefinition = traitDef.<CdmTraitDefinition>fetchObjectDefinition(resOpt);
        Assert.assertEquals(traitRefDefinition, traitDef);
        Assert.assertEquals(traitDefDefinition, traitDef);

        CdmObjectBase groupRef = corpus.resolveSymbolReference(
            resOpt,
            ent.getInDocument(),
            "symbolEnt/hasAttributes/someGroupRef/(ref)",
            CdmObjectType.AttributeGroupDef,
            false
        );

        Assert.assertTrue(groupRef instanceof CdmAttributeGroupReference);

        CdmObjectBase groupDef = corpus.resolveSymbolReference(
            resOpt,
            ent.getInDocument(),
            "symbolEnt/hasAttributes/someGroupRef",
            CdmObjectType.AttributeGroupDef,
            false
        );

        Assert.assertTrue(groupDef instanceof CdmAttributeGroupDefinition);

        // calling FetchObjectDefinition on a symbol to a ref or def should both give the definition
        CdmAttributeGroupDefinition groupRefDefinition = groupRef.<CdmAttributeGroupDefinition>fetchObjectDefinition(resOpt);
        CdmAttributeGroupDefinition groupDefDefinition = groupDef.<CdmAttributeGroupDefinition>fetchObjectDefinition(resOpt);
        Assert.assertEquals(groupRefDefinition, groupDef);
        Assert.assertEquals(groupDefDefinition, groupDef);

        CdmObjectBase typeAtt = corpus.resolveSymbolReference(
            resOpt,
            ent.getInDocument(),
            "symbolEnt/hasAttributes/someGroupRef/members/someAttribute",
            CdmObjectType.AttributeGroupDef,
            false
        );

        Assert.assertTrue(typeAtt instanceof CdmTypeAttributeDefinition);
    }
}