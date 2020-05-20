// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import org.apache.commons.lang3.NotImplementedException;
import org.testng.Assert;

import java.util.List;

/**
 * Helper class that supports validation of the actual object wrt expected object.
 */
public class ObjectValidator {

    public static void validateAttributeContext(final AttributeContextExpectedValue expected, final CdmAttributeContext actual) {
        if (expected == null || actual == null) {
            Assert.assertNull(expected);
            Assert.assertNull(actual);
            return;
        }
        Assert.assertEquals(actual.getType().toString().toLowerCase(), expected.getType().toLowerCase());
        Assert.assertEquals(actual.getName(), expected.getName());
        if (actual.getParent() != null) {
            Assert.assertEquals(actual.getParent().getNamedReference(), expected.getParent());
        }
        if (expected.getDefinition() != null && actual.getDefinition() != null) {
            Assert.assertEquals(actual.getDefinition().getNamedReference(), expected.getDefinition());
        }
        int expCount = 0;
        if (expected.getContexts() != null && expected.getContexts().size() > 0) {
            expCount += expected.getContexts().size();
        }
        if (expected.getContextStrings() != null && expected.getContextStrings().size() > 0) {
            expCount += expected.getContextStrings().size();
        }
        Assert.assertEquals(actual.getContents().getCount(), expCount);
        for (int i = 0, ac = 0, acs = 0; i < actual.getContents().getCount(); i++) {
            if (actual.getContents().get(i) instanceof CdmAttributeContext) {
                validateAttributeContext(expected.getContexts().get(ac++), (CdmAttributeContext) actual.getContents().get(i));
            } else if (actual.getContents().get(i) instanceof CdmAttributeReference) {
                String exp = expected.getContextStrings().get(acs++);
                CdmAttributeReference act = (CdmAttributeReference) actual.getContents().get(i);
                Assert.assertEquals(act.getNamedReference(), exp);
            } else {
                throw new NotImplementedException("validateAttributeContext: instanceof Unknown");
            }
        }
    }

    public static void validateAttributesCollection(final List<AttributeExpectedValue> expected, final CdmCollection<CdmAttributeItem> actual) {
        Assert.assertEquals(actual.getCount(), expected.size());
        for (int i = 0; i < actual.getCount(); i++) {
            if (actual.get(i) instanceof CdmTypeAttributeDefinition) {
                AttributeExpectedValue exp = (AttributeExpectedValue) expected.get(i);
                CdmTypeAttributeDefinition act = (CdmTypeAttributeDefinition) actual.get(i);
                validateTypeAttributeDefinition(exp, act);
            } else if (actual.get(i) instanceof CdmAttributeGroupReference) {
                AttributeExpectedValue exp = (AttributeExpectedValue) expected.get(i);
                CdmAttributeGroupReference act = (CdmAttributeGroupReference) actual.get(i);
                validateAttributeGroupRef(exp, act);
            }
        }
    }

    public static void validateTypeAttributeDefinition(final AttributeExpectedValue expected, final CdmTypeAttributeDefinition actual) {
        Assert.assertEquals(actual.fetchDataFormat().toString(), expected.getDataFormat());
        Assert.assertEquals(actual.getDataType(), expected.getDataType());
        Assert.assertEquals(actual.fetchDescription(), expected.getDescription());
        Assert.assertEquals(actual.fetchDisplayName(), expected.getDisplayName());
        Assert.assertEquals(actual.getExplanation(), expected.getExplanation());
        Assert.assertEquals(actual.fetchIsNullable().booleanValue(), expected.getNullable());
        Assert.assertEquals(actual.fetchIsPrimaryKey().booleanValue(), expected.getPrimaryKey());
        Assert.assertEquals(actual.fetchIsReadOnly().booleanValue(), expected.getReadOnly());
        Assert.assertEquals(actual.fetchMaximumLength(), expected.getMaximumLength());
        Assert.assertEquals(actual.fetchMaximumValue(), expected.getMaximumValue());
        Assert.assertEquals(actual.fetchMinimumValue(), expected.getMinimumValue());
        Assert.assertEquals(actual.getName(), expected.getName());
        Assert.assertEquals(actual.getPurpose(), expected.getPurpose());
        Assert.assertEquals(actual.fetchSourceName(), expected.getSourceName());
        if (actual.fetchSourceOrdering() != null) {
            Assert.assertEquals(actual.fetchSourceOrdering().intValue(), expected.getSourceOrdering());
        }
    }

    public static void validateAttributeGroupRef(final AttributeExpectedValue expected, final CdmAttributeGroupReference actual) {
        if (expected.getAttributeGroupName() != null || expected.getMembers() != null) {
            if (actual.getExplicitReference() != null) {
                CdmAttributeGroupDefinition actualObj = (CdmAttributeGroupDefinition) actual.getExplicitReference();

                if (expected.getAttributeGroupName()!= null) {
                    Assert.assertEquals(actualObj.getAttributeGroupName(), expected.getAttributeGroupName());
                }
                if (expected.getAttributeContext() != null) {
                    Assert.assertEquals(actualObj.getAttributeContext().getNamedReference(), expected.getAttributeContext());
                }
                if (expected.getMembers() != null) {
                    Assert.assertEquals(actualObj.getMembers().getCount(), expected.getMembers().size());
                    for (int i = 0; i < actualObj.getMembers().getCount(); i++) {
                        if (actualObj.getMembers().get(i) instanceof CdmTypeAttributeDefinition) {
                            AttributeExpectedValue exp = (AttributeExpectedValue) expected.getMembers().get(i);
                            CdmTypeAttributeDefinition act = (CdmTypeAttributeDefinition) actualObj.getMembers().get(i);
                            validateTypeAttributeDefinition(exp, act);
                        } else if (actualObj.getMembers().get(i) instanceof CdmAttributeGroupReference) {
                            AttributeExpectedValue exp = (AttributeExpectedValue) expected.getMembers().get(i);
                            CdmAttributeGroupReference act = (CdmAttributeGroupReference) actualObj.getMembers().get(i);
                            validateAttributeGroupRef(exp, act);
                        } else {
                            throw new NotImplementedException("Unknown type!");
                        }
                    }
                }
            }
        }
    }
}