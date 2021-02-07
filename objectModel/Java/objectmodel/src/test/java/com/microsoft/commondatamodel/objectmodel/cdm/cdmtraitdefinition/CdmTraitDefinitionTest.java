// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.cdmtraitdefinition;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CdmTraitDefinitionTest {
    @Test
    public void testExtendsTraitPropertyOptional() {
        final CdmCorpusDefinition corpus = new CdmCorpusDefinition();
        final CdmTraitReference extendTraitRef1 = new CdmTraitReference(corpus.getCtx(), "testExtendTraitName1", true, false);
        final CdmTraitReference extendTraitRef2 = new CdmTraitReference(corpus.getCtx(), "testExtendTraitName2", true, false);
        final CdmTraitDefinition traitDefinition = new CdmTraitDefinition(corpus.getCtx(), "testTraitName", extendTraitRef1);

        Assert.assertEquals(extendTraitRef1, traitDefinition.getExtendsTrait());
        traitDefinition.setExtendsTrait(null);
        Assert.assertNull(traitDefinition.getExtendsTrait());

        traitDefinition.setExtendsTrait(extendTraitRef2);
        Assert.assertEquals(extendTraitRef2, traitDefinition.getExtendsTrait());
        traitDefinition.setExtendsTrait(null);
        Assert.assertNull(traitDefinition.getExtendsTrait());
    }
}