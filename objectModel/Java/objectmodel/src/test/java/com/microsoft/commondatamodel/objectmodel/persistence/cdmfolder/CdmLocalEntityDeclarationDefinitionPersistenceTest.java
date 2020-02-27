// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmLocalEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.LocalEntityDeclaration;
import java.time.OffsetDateTime;
import org.testng.AssertJUnit;
import org.testng.annotations.Test;

public class CdmLocalEntityDeclarationDefinitionPersistenceTest {
  @Test
  public void toData_expectResultHasProperFields() {
    final CdmLocalEntityDeclarationDefinition instance = new CdmLocalEntityDeclarationDefinition(null, null);
    instance.setEntityName("ENTITY_NAME");
    instance.setExplanation("EXPLANATION");
    instance.setLastFileStatusCheckTime(OffsetDateTime.parse("2019-01-01T00:00:00Z"));
    instance.setLastFileModifiedTime(OffsetDateTime.parse("2019-01-01T00:00:00Z"));
    instance.setLastChildFileModifiedTime(OffsetDateTime.parse("2019-01-01T00:00:00Z"));
    instance.setEntityPath("ENTITY_PATH");

    final LocalEntityDeclaration result = LocalEntityDeclarationPersistence.toData(instance, null, null);
    AssertJUnit.assertEquals("LocalEntity", result.getType());
    AssertJUnit.assertEquals("ENTITY_NAME", result.getEntityName());
    AssertJUnit.assertEquals("EXPLANATION", result.getExplanation());
    AssertJUnit.assertEquals(OffsetDateTime.parse("2019-01-01T00:00:00Z"), result.getLastFileStatusCheckTime());
    AssertJUnit.assertEquals(OffsetDateTime.parse("2019-01-01T00:00:00Z"), result.getLastFileModifiedTime());
    AssertJUnit.assertEquals(OffsetDateTime.parse("2019-01-01T00:00:00Z"), result.getLastChildFileModifiedTime());
    AssertJUnit.assertEquals("ENTITY_PATH", result.getEntityPath());
  }
}
