// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities.logger;

import com.microsoft.aad.msal4j.AzureCloudEndpoint;
import com.microsoft.aad.msal4j.ClientCredentialFactory;
import com.microsoft.aad.msal4j.ClientCredentialParameters;
import com.microsoft.aad.msal4j.ConfidentialClientApplication;
import com.microsoft.aad.msal4j.IAuthenticationResult;
import com.microsoft.aad.msal4j.IClientCredential;

import com.microsoft.commondatamodel.objectmodel.enums.EnvironmentType;
import com.microsoft.commondatamodel.objectmodel.utilities.network.TokenProvider;

import java.net.MalformedURLException;
import java.util.Collections;
import java.util.Date;
import java.util.Set;

/**
 * Configuration information to establish a connection with the database for telemetry collection.
 */
public class TelemetryConfig {

  /**
   * The tenant (directory) ID of the Azure AD application registration
   */
  private String tenantId;

  /**
   * The client ID of the application
   */
  private String clientId;

  /**
   * The client secret of the application
   */
  private String secret;

  /**
   * User geographic info
   */
  private String region;

  /**
   * Whether to remove all log information that may contain user content, 
   * including corpus path and error/warning messages.
   * Note: This property could be removed in the if the compliance issue gets resolved.
   */
  private boolean removeUserContent;

  /**
   * Kusto (ADX) cluster name
   */
  private String kustoClusterName;

  /**
   * Kusto database name
   */
  private String kustoDatabaseName;

  /**
   * Kusto table for informational logs
   */
  private String kustoInfoLogTable = CDM_INFOLOG_TABLE;

  /**
   * Kusto table for warning logs
   */
  private String kustoWarningLogTable = CDM_WARNINGLOG_TABLE;

  /**
   * Kusto table for error logs
   */
  private String kustoErrorLogTable = CDM_ERRORLOG_TABLE;

  /**
   * Azure cloud instance
   */
  private AzureCloudEndpoint cloudInstance;

  /**
   * The level of detail to be logged into the Kusto database
   */
  private EnvironmentType ingestAtLevel;

  /**
   * The user-defined token provider.
   */
  private TokenProvider tokenProvider;

  /**
   * The client AAD App context
   */
  private ConfidentialClientApplication context;

  /**
   * The MSAL authentication result
   */
  private IAuthenticationResult lastAuthenticationResult;

  /**
   * Default Kusto database log table names
   */
  private static final String CDM_INFOLOG_TABLE = "infoLogs";
  private static final String CDM_WARNINGLOG_TABLE = "warningLogs";
  private static final String CDM_ERRORLOG_TABLE = "errorLogs";

  /**
   * Constructs a telemetry configuration with user-defined token provider, region and whether to remove user content.
   * 
   * @param tokenProvider A token provider defined by user.
   * @param ingestAtLevel Kusto ingestion security level for the execution environment.
   * @param region Geographic information, e.g. "West US".
   * @param removeUserContent Whether to remove all potential user created content.
   */
  public TelemetryConfig(final TokenProvider tokenProvider, final EnvironmentType ingestAtLevel, 
    final String region, final boolean removeUserContent) {
 
    this.tokenProvider = tokenProvider;
    this.ingestAtLevel = ingestAtLevel;
    this.region = region;
    this.removeUserContent = removeUserContent;
  }

  /**
   * Constructs a telemetry configuration with user-defined token provider, removing all user content by default.
   */
  public TelemetryConfig(final TokenProvider tokenProvider, final EnvironmentType ingestAtLevel) {
    this(tokenProvider, ingestAtLevel, null, true);
  }

  /**
   * Constructs a telemetry configuration with the credentials for user-defined Kusto cluster and table names.
   * 
   * @param tenantId The tenant (directory) ID of the Azure AD application registration.
   * @param clientId The client ID of the application.
   * @param secret The client secret of the application.
   * @param clusterName Kusto/ADX cluster name.
   * @param databaseName Kusto database name.
   * @param infoTable Table for storing informational logs.
   * @param warningTable Table for storing warning logs.
   * @param errorTable Table for storing error logs.
   * @param ingestAtLevel Kusto ingestion security level for the execution environment.
   * @param region Geographic information, e.g. "West US".
   * @param removeUserContent Whether to remove all potential user created content.
   * @param cloudInstance Azure cloud instance, default to be public cloud.
   */
  public TelemetryConfig(final String tenantId, final String clientId, final String secret, 
    final String clusterName, final String databaseName, final String infoTable,
    final String warningTable, final String errorTable, final EnvironmentType ingestAtLevel,
    final String region, final boolean removeUserContent, final AzureCloudEndpoint cloudInstance) {

    this.tenantId = tenantId;
    this.clientId = clientId;
    this.secret = secret;

    this.kustoClusterName = clusterName;
    this.kustoDatabaseName = databaseName;
    this.kustoInfoLogTable = infoTable;
    this.kustoWarningLogTable = warningTable;
    this.kustoErrorLogTable = errorTable;
    
    this.ingestAtLevel = ingestAtLevel;
    this.region = region;
    this.cloudInstance = cloudInstance;
  }
  
  /**
   * Constructs a telemetry configuration with the credentials for default Kusto cluster and table names,
   * removing all potential user content and using Azure public cloud instance.
   */
  public TelemetryConfig(final String tenantId, final String clientId, final String secret, 
    final String clusterName, final String databaseName, final EnvironmentType ingestAtLevel) {
    
    this(tenantId, clientId, secret, clusterName, databaseName, 
      CDM_INFOLOG_TABLE, CDM_WARNINGLOG_TABLE, CDM_ERRORLOG_TABLE,
      ingestAtLevel, null, true, AzureCloudEndpoint.AzurePublic);
  }

  /**
   * Constructs a telemetry configuration with the credentials for Kusto cluster with default table name.
   * Set user region and Azure cloud instance, removing all user content by default.
   */
  public TelemetryConfig(final String tenantId, final String clientId, final String secret, 
    final String clusterName, final String databaseName, final EnvironmentType ingestAtLevel,
    final String region, final AzureCloudEndpoint cloudInstance) {

    this(tenantId, clientId, secret, clusterName, databaseName, 
      CDM_INFOLOG_TABLE, CDM_WARNINGLOG_TABLE, CDM_ERRORLOG_TABLE,
      ingestAtLevel, region, true, cloudInstance);
  }

  /**
   * Constructs a telemetry configuration with the credentials for user-defined Kusto cluster,
   * removing all potential user content and using Azure public cloud instance.
   */
  public TelemetryConfig(final String tenantId, final String clientId, final String secret, 
    final String clusterName, final String databaseName, final String infoTable,
    final String warningTable, final String errorTable, final EnvironmentType ingestAtLevel) {

    this(tenantId, clientId, secret, clusterName, databaseName,
      infoTable, warningTable, errorTable,
      ingestAtLevel, null, true, AzureCloudEndpoint.AzurePublic);
  }

  /**
   * Gets the authentication token either using AAD App credentials or user-defined token provider.
   * 
   * @return An authentication token.
   */
  public String getAuthenticationToken() {
    // User-defined token provider
    if (this.tokenProvider != null) {
      return this.tokenProvider.getToken();
    }

    // Get token by supplying AAD App credentials
    else if (this.tenantId != null && this.clientId != null && this.secret != null
      && this.kustoClusterName != null && this.kustoDatabaseName != null
      && this.kustoInfoLogTable != null && this.kustoWarningLogTable != null && this.kustoErrorLogTable != null) {

      this.generateKustoToken();
      final String tokenWithHeader = "Bearer " + this.lastAuthenticationResult.accessToken();
      return tokenWithHeader;
    }

    // Throw an exception if neither method is configured
    else {
      throw new RuntimeException("Failed to get authentication token: No method configured to provide a token.");
    }
  }

  /**
   * Build context when users make the first call. Need to ensure client Id, tenant and secret are not null.
   */
  private void buildContext() {
    if (this.context == null) {
      IClientCredential credential = ClientCredentialFactory.createFromSecret(this.secret);

      try {
        this.context = ConfidentialClientApplication
          .builder(this.clientId, credential)
          .authority(this.cloudInstance.endpoint + this.tenantId)
          .build();
      } catch (MalformedURLException e) {
        throw new RuntimeException("There was an error while building context. Exception: ", e);
      }
    }
  }

  /**
   * Checks whether need to refresh authentication token or not.
   * 
   * @return A boolean that indicates if needs to refresh.
   */
  private boolean needsRefreshToken() {
    if (lastAuthenticationResult == null) {
      return true;
    }

    final Date now = new Date();
    return this.lastAuthenticationResult.expiresOnDate().before(now);
  }

  /**
   * Generate a Bearer token for accessing the Kusto resource using MSAL
   */
  private void generateKustoToken() {
    // Check if the token has expired
    if (!needsRefreshToken()) {
      return;
    }

    // Define the resource scope to be the current Kusto cluster
    final Set<String> SCOPE = Collections.singleton(String.format("https://%s.kusto.windows.net/.default", this.kustoClusterName));

    // Authenticate with AAD App credentials
    this.buildContext();

    IAuthenticationResult result;

    // Acquire token using MSAL
    try {
      ClientCredentialParameters parameters = ClientCredentialParameters.builder(SCOPE).build();
      result = this.context.acquireToken(parameters).join();
    } catch (Exception ex) {
        throw new RuntimeException
          ("There was an error while acquiring Kusto authorization Token with client ID/secret authentication. Exception: ", ex);
    }

    if (result == null || result.accessToken() == null) {
      throw new RuntimeException
        ("Received invalid Kusto authentication result. " +
        "The result might be null, or missing HTTP authorization header from the authentication result.");
    }

    this.lastAuthenticationResult = result;
  }

  /**
   * Getters and setters
   */

  void setTenantId(final String tenantId) {
    this.tenantId = tenantId;
  }

  String getTenantId() {
    return this.tenantId;
  }

  void setClientId(final String clientId) {
    this.clientId = clientId;
  }

  String getClientId() {
    return this.clientId;
  }

  void setSecret(final String secret) {
    this.secret = secret;
  }

  String getSecret() {
    return this.secret;
  }

  void setRegion(final String region) {
    this.region = region;
  }

  String getRegion() {
    return this.region;
  }

  void setRemoveUserContent(final boolean removeUserContent) {
    this.removeUserContent = removeUserContent;
  }

  boolean getRemoveUserContent() {
    return this.removeUserContent;
  }

  void setKustoClusterName(final String clusterName) {
    this.kustoClusterName = clusterName;
  }

  String getKustoClusterName() {
    return this.kustoClusterName;
  }

  void setKustoDatabaseName(final String databaseName) {
    this.kustoDatabaseName = databaseName;
  }

  String getKustoDatabaseName() {
    return this.kustoDatabaseName;
  }

  void setKustoInfoLogTable(final String tableName) {
    this.kustoInfoLogTable = tableName;
  }

  String getKustoInfoLogTable() {
    return this.kustoInfoLogTable;
  }

  void setKustoWarningLogTable(final String tableName) {
    this.kustoWarningLogTable = tableName;
  }

  String getKustoWarningLogTable() {
    return this.kustoWarningLogTable;
  }

  void setKustoErrorLogTable(final String tableName) {
    this.kustoErrorLogTable = tableName;
  }

  String getKustoErrorLogTable() {
    return this.kustoErrorLogTable;
  }

  void setCloudInstance(final AzureCloudEndpoint cloudInstance) {
    this.cloudInstance = cloudInstance;
  }

  AzureCloudEndpoint getCloudInstance() {
    return this.cloudInstance;
  }

  void setIngestAtLevel(final EnvironmentType ingestAtLevel) {
    this.ingestAtLevel = ingestAtLevel;
  }

  EnvironmentType getIngestAtLevel() {
    return this.ingestAtLevel;
  }

  void setTokenProvider(final TokenProvider tokenProvider) {
    this.tokenProvider = tokenProvider;
  }

  TokenProvider getTokenProvider() {
    return this.tokenProvider;
  }
}
