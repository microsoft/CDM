// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.argument;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ArgumentPersistence;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Class for testing the ArgumentPersistence.
 */
public class ArgumentTest {
  /**
   * Test loading an argument with value 0 (number).
   */
  @Test
  public void TestLoadingZeroValue() {
    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    ObjectNode argumentData = JsonNodeFactory.instance.objectNode();
    argumentData.put("value", 0);

    CdmArgumentDefinition argument = ArgumentPersistence.fromData(corpus.getCtx(), argumentData);
    Assert.assertEquals(argument.getValue(), 0);

    Object argumentToData = ArgumentPersistence.toData(argument, null, null);
    Assert.assertEquals(argumentToData, 0);
  }

  /**
   * Test loading an argument with blank name & value 0 (number).
   */
  @Test
  public void TestLoadingBlankName() {
    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    ObjectNode argumentData = JsonNodeFactory.instance.objectNode();
    argumentData.put("name", "  ");
    argumentData.put("value", 0);

    CdmArgumentDefinition argument = ArgumentPersistence.fromData(corpus.getCtx(), argumentData);
    Assert.assertEquals(argument.getValue(), 0);

    Object argumentToData = ArgumentPersistence.toData(argument, null, null);
    Assert.assertEquals(argumentToData, 0);
  }
}
