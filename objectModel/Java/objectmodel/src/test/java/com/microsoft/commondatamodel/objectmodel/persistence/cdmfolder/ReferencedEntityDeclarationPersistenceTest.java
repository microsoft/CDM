// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmReferencedEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ReferencedEntityDeclaration;
import java.time.OffsetDateTime;
import org.testng.AssertJUnit;
import org.testng.annotations.Test;

public class ReferencedEntityDeclarationPersistenceTest {
  @Test
  public void toData_expectResultHasProperFields() {
    final CdmReferencedEntityDeclarationDefinition instance = new CdmReferencedEntityDeclarationDefinition(null, null);
    instance.setEntityName("ENTITY_NAME");
    instance.setExplanation("EXPLANATION");
    instance.setLastFileStatusCheckTime(OffsetDateTime.parse("2019-01-01T00:00:00Z"));
    instance.setLastFileModifiedTime(OffsetDateTime.parse("2019-01-01T00:00:00Z"));
    instance.setEntityPath("ENTITY_PATH");

    final ReferencedEntityDeclaration result = ReferencedEntityDeclarationPersistence.toData(instance, null, null);

    AssertJUnit.assertEquals("ReferencedEntity", result.getType());
    AssertJUnit.assertEquals("ENTITY_NAME", result.getEntityName());
    AssertJUnit.assertEquals("EXPLANATION", result.getExplanation());
    AssertJUnit.assertEquals("2019-01-01T00:00:00Z", result.getLastFileStatusCheckTime());
    AssertJUnit.assertEquals("2019-01-01T00:00:00Z", result.getLastFileModifiedTime());
    AssertJUnit.assertEquals("ENTITY_PATH", result.getEntityPath());
  }
}
