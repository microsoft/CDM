// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.EnvironmentType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.TelemetryConfig;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.TelemetryKustoClient;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.testng.annotations.Test;
import org.testng.SkipException;

import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;

public class TelemetryKustoClientTest {
  /** Environment variables for Kusto configuration */
  private static final String TENANT_ID = System.getenv("KUSTO_TENANTID");
  private static final String CLIENT_ID = System.getenv("KUSTO_CLIENTID");
  private static final String SECRET = System.getenv("KUSTO_SECRET");
  private static final String CLUSTER_NAME = System.getenv("KUSTO_CLUSTER");
  private static final String DATABASE_NAME = System.getenv("KUSTO_DATABASE");
  private static final String INFO_TABLE = System.getenv("KUSTO_INFOTABLE");
  private static final String WARNING_TABLE = System.getenv("KUSTO_WARNINGTABLE");
  private static final String ERROR_TABLE = System.getenv("KUSTO_ERRORTABLE");

  /** The path between TestDataPath and TestName. */
  private static final String TESTS_SUBPATH = "Utilities";

  /** Declare a blackhole callback. */
  private final EventCallback eventCallback = (level, message) -> {
    // NOOP
  };

  /**
   * Check if the environment variable for telemetry is set.
   */
  public static void checkKustoEnvironment() {
    if (!"1".equals(System.getenv("KUSTO_RUNTESTS"))) {
      // this will cause tests to appear as "Skipped" in the final result
      throw new SkipException("Kusto environment not set up");
    }
  }

  /**
   * Test for ingesting logs into default CDM Kusto database.
   */
  @Test
  public void testInitializeClientWithDefaultDatabase() throws InterruptedException {
    checkKustoEnvironment();
    
    CdmCorpusDefinition corpus = initializeClientWithDefaultDatabase();
    corpus.getTelemetryClient().enable();

    callResolveManifestWithAnEntity(corpus);

    while(!((TelemetryKustoClient)corpus.getTelemetryClient()).checkRequestQueueIsEmpty()) {
      Thread.sleep(((TelemetryKustoClient)corpus.getTelemetryClient()).getTimeoutMilliseconds());
    }
  }

  /**
   * Test for ingesting logs into user-defined Kusto database.
   */
  @Test
  public void testInitializeClientWithUserDatabase() throws InterruptedException {
    checkKustoEnvironment();

    CdmCorpusDefinition corpus = initializeClientWithUserDatabase();
    corpus.getTelemetryClient().enable();

    callResolveManifestWithAnEntity(corpus);

    while(!((TelemetryKustoClient)corpus.getTelemetryClient()).checkRequestQueueIsEmpty()) {
      Thread.sleep(((TelemetryKustoClient)corpus.getTelemetryClient()).getTimeoutMilliseconds());
    }
  }

  /**
   * Test with invalid AAD App credentials, which should fail the authorization.
   */
  @Test
  public void testAadAppAuthorizationException() {
    checkKustoEnvironment();

    // initialize with some dummy credentials
    CdmCorpusDefinition corpus = new CdmCorpusDefinition();

    TelemetryConfig kustoConfig = new TelemetryConfig("tenant id", "client id", "secret", "cluster name", "database name", EnvironmentType.DEV);

    corpus.setTelemetryClient(new TelemetryKustoClient(corpus.getCtx(), kustoConfig));

    try {
      kustoConfig.getAuthenticationToken();
    } catch (final Exception ex) {
      assertTrue(ex.getMessage().contains
        ("There was an error while acquiring Kusto authorization Token with client ID/secret authentication"));
    }
  }

  /**
   * Test retry policy with max timeout set to be a small value.
   */
  @Test
  public void testMaximumTimeoutAndRetries() throws InterruptedException {
    checkKustoEnvironment();

    CdmCorpusDefinition corpus = initializeClientWithDefaultDatabase();

    // set timeout to 1 millisecond so the function will reach max timeout and fail
    ((TelemetryKustoClient)corpus.getTelemetryClient()).setMaxTimeoutMilliseconds(1);

    String query = String.format
      (".ingest inline into table infoLogs<|\n%s,class name,method name,some message,None,corpus path,correlation id,api correlation id,app id,property",
        TimeUtils.formatDateStringIfNotNull(OffsetDateTime.now(ZoneOffset.UTC)));

    try {
      ((TelemetryKustoClient)corpus.getTelemetryClient()).postKustoQuery(query).join();
    } catch (final Exception ex) {
      assertTrue(ex.getMessage().contains("CdmTimedOutException"));
    }
  }

  private CdmCorpusDefinition initializeClientWithDefaultDatabase() throws InterruptedException {
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestTelemetryKustoClient");

    assertFalse(StringUtils.isNullOrEmpty(TENANT_ID));
    assertFalse(StringUtils.isNullOrEmpty(CLIENT_ID));
    assertFalse(StringUtils.isNullOrEmpty(SECRET));
    assertFalse(StringUtils.isNullOrEmpty(CLUSTER_NAME));
    assertFalse(StringUtils.isNullOrEmpty(DATABASE_NAME));

    TelemetryConfig kustoConfig = new TelemetryConfig(TENANT_ID, CLIENT_ID, SECRET, CLUSTER_NAME, DATABASE_NAME, EnvironmentType.DEV, false);

    corpus.setTelemetryClient(new TelemetryKustoClient(corpus.getCtx(), kustoConfig));
    corpus.setAppId("CDM Integration Test");

    // set callback to receive error and warning logs.
    corpus.setEventCallback(eventCallback, CdmStatusLevel.Progress);

    return corpus;
  }

  private CdmCorpusDefinition initializeClientWithUserDatabase() throws InterruptedException {
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestTelemetryKustoClient");
    // TODO: need to investigate why only Java not failing if using event callback from GetLocalCorpus() 
    // set callback to receive error and warning logs.
    corpus.setEventCallback(eventCallback, CdmStatusLevel.Progress);

    assertFalse(StringUtils.isNullOrEmpty(TENANT_ID));
    assertFalse(StringUtils.isNullOrEmpty(CLIENT_ID));
    assertFalse(StringUtils.isNullOrEmpty(SECRET));
    assertFalse(StringUtils.isNullOrEmpty(CLUSTER_NAME));
    assertFalse(StringUtils.isNullOrEmpty(DATABASE_NAME));
    assertFalse(StringUtils.isNullOrEmpty(INFO_TABLE));
    assertFalse(StringUtils.isNullOrEmpty(WARNING_TABLE));
    assertFalse(StringUtils.isNullOrEmpty(ERROR_TABLE));

    TelemetryConfig kustoConfig = new TelemetryConfig(TENANT_ID, CLIENT_ID, SECRET, CLUSTER_NAME, DATABASE_NAME,
      INFO_TABLE, WARNING_TABLE, ERROR_TABLE, EnvironmentType.DEV, false);
    
    corpus.setTelemetryClient(new TelemetryKustoClient(corpus.getCtx(), kustoConfig));
    corpus.setAppId("CDM Integration Test");

    return corpus;
  }

  /**
   * Call CreateResolvedManifestAsync function to resolve a manifest with one entity,
   * and get the logs of the function and all other internally called functions
   */
  private void callResolveManifestWithAnEntity(final CdmCorpusDefinition corpus) {
    CdmManifestDefinition manifest = corpus.makeObject(CdmObjectType.ManifestDef, "dummy");

    corpus.getStorage().fetchRootFolder("local").getDocuments().add(manifest, "default.manifest.cdm.json");
    CdmEntityDefinition entity1 = corpus.makeObject(CdmObjectType.EntityDef, "MyEntity");

    CdmTypeAttributeDefinition someAttrib1 = corpus.makeObject(CdmObjectType.TypeAttributeDef, "MyAttribute", false);
    someAttrib1.setDataType(corpus.makeRef(CdmObjectType.DataTypeRef, "entityId", true));
    entity1.getAttributes().add(someAttrib1);

    CdmDocumentDefinition entity1Doc = corpus.makeObject(CdmObjectType.DocumentDef, "MyEntity.cdm.json");
    entity1Doc.getDefinitions().add(entity1);
    corpus.getStorage().fetchRootFolder("local").getDocuments().add(entity1Doc);

    manifest.getEntities().add(entity1);
    manifest.createResolvedManifestAsync("new dummy", null).join();
  }
}
