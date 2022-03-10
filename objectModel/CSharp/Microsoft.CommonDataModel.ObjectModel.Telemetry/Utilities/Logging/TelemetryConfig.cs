// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Logging
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Network;
    using Microsoft.Identity.Client;

    /// <summary>
    /// Configuration information to establish a connection with the database for telemetry collection
    /// </summary>
    public class TelemetryConfig
    {
        /// <summary>
        /// The tenant (directory) ID of the Azure AD application registration
        /// </summary>
        public string TenantId { get; set; }

        /// <summary>
        /// The client ID of the application
        /// </summary>
        public string ClientId { get; set; }

        /// <summary>
        /// The client secret of the application
        /// </summary>
        public string Secret { get; set; }

        /// <summary>
        /// User geographic info
        /// </summary>
        public string Region { get; set; }

        /// <summary>
        /// Whether to remove all log information that may contain user content, 
        /// including corpus path and error/warning messages
        /// </summary>
        /// <remarks>This property could be removed in the if the compliance issue gets resolved</remarks>
        public bool RemoveUserContent { get; set; }

        /// <summary>
        /// Kusto (ADX) cluster name
        /// </summary>
        public string KustoClusterName { get; set; }

        /// <summary>
        /// Kusto database name
        /// </summary>
        public string KustoDatabaseName { get; set; }

        /// <summary>
        /// Kusto table for informational logs
        /// </summary>
        public string KustoInfoLogTable { get; set; } = CdmInfoLogTable;

        /// <summary>
        /// Kusto table for warning logs
        /// </summary>
        public string KustoWarningLogTable { get; set; } = CdmWarningLogTable;

        /// <summary>
        /// Kusto table for error logs
        /// </summary>
        public string KustoErrorLogTable { get; set; } = CdmErrorLogTable;

        /// <summary>
        /// Azure cloud instance
        /// </summary>
        public AzureCloudInstance CloudInstance { get; set; }

        /// <summary>
        /// The level of detail to be logged into the Kusto database
        /// </summary>
        public EnvironmentType IngestAtLevel { get; set; }

        /// <summary>
        /// The user-defined token provider.
        /// </summary>
        public TokenProvider TokenProvider { get; set; }

        /// <summary>
        /// The client AAD App context
        /// </summary>
        private IConfidentialClientApplication Context;

        /// <summary>
        /// Default Kusto database log table names
        /// </summary>
        private const string CdmInfoLogTable = "infoLogs";
        private const string CdmWarningLogTable = "warningLogs";
        private const string CdmErrorLogTable = "errorLogs";

        /// <summary>
        /// Configure with user-defined token provider
        /// </summary>
        /// <param name="tokenProvider">A token provider defined by user</param>
        /// <param name="ingestAtLevel">Kusto ingestion security level for the execution environment</param>
        /// <param name="region">(Optional) Geographic information, e.g. "West US"</param>
        /// <param name="removeUserContent">(Optional) Whether to remove all potential user created content</param>
        public TelemetryConfig(TokenProvider tokenProvider, EnvironmentType ingestAtLevel, string region = null, 
            bool removeUserContent = true) : this(ingestAtLevel, region, removeUserContent)
        {
            this.TokenProvider = tokenProvider;
        }

        /// <summary>
        /// Configure the credentials for the default log table names
        /// with the credentials of the AAD app that has been granted permission in the CDM Kusto cluster
        /// </summary>
        /// <param name="tenantId">The tenant (directory) ID of the Azure AD application registration</param>
        /// <param name="clientId">The client ID of the application</param>
        /// <param name="secret">The client secret of the application</param>
        /// <param name="clusterName">Kusto/ADX cluster name</param>
        /// <param name="databaseName">Kusto database name</param>
        /// <param name="ingestAtLevel">Kusto ingestion security level for the execution environment</param>
        /// <param name="region">(Optional) Geographic information, e.g. "West US"</param>
        /// <param name="cloudInstance">(Optional) Azure cloud instance, default to be public cloud</param>
        /// <param name="removeUserContent">(Optional) Whether to remove all potential user created content</param>
        /// <remarks>
        /// The TelemetryKustoClient is designed to ingest into tables with the following schema:
        /// (timestamp: datetime, className: string, method: string, message: string, code: string, corpusPath: string, correlationId: string, apiCorrelationId: string, appId: string, property: string)
        /// Using a different schema may result in ingestion failure and missing data
        /// </remarks>
        public TelemetryConfig(string tenantId, string clientId, string secret,
            string clusterName, string databaseName, EnvironmentType ingestAtLevel,
            string region = null, AzureCloudInstance cloudInstance = AzureCloudInstance.AzurePublic, 
            bool removeUserContent = true) : this(ingestAtLevel, region, removeUserContent)
        {
            this.TenantId = tenantId;
            this.ClientId = clientId;
            this.Secret = secret;
            this.KustoClusterName = clusterName;
            this.KustoDatabaseName = databaseName;
            this.CloudInstance = cloudInstance;
        }

        /// <summary>
        /// Base constructor, a helper for simplifying constructors
        /// </summary>
        private TelemetryConfig(EnvironmentType ingestAtLevel, string region = null, bool removeUserContent = true)
        {
            this.IngestAtLevel = ingestAtLevel;
            this.Region = region;
            this.RemoveUserContent = removeUserContent;
        }

        /// <summary>
        /// Configure the credentials for a user-created Kusto client
        /// </summary>
        /// <param name="tenantId">The tenant (directory) ID of the Azure AD application registration</param>
        /// <param name="clientId">The client ID of the application</param>
        /// <param name="secret">The client secret of the application</param>
        /// <param name="clusterName">Kusto/ADX cluster name</param>
        /// <param name="databaseName">Kusto database name</param>
        /// <param name="infoTable">Table for storing informational logs</param>
        /// <param name="warningTable">Table for storing warning logs</param>
        /// <param name="errorTable">Table for storing error logs</param>
        /// <param name="ingestAtLevel">Kusto ingestion security level for the execution environment</param>
        /// <param name="region">(Optional) Geographic information, e.g. "West US"</param>
        /// <param name="cloudInstance">(Optional) Azure cloud instance, default to be public cloud</param>
        /// <param name="removeUserContent">(Optional) Whether to remove all potential user created content</param>
        /// <remarks>
        /// The TelemetryKustoClient is designed to ingest into tables with the following schema:
        /// (timestamp: datetime, className: string, method: string, message: string, code: string, corpusPath: string, correlationId: string, apiCorrelationId: string, appId: string, property: string)
        /// Using a different schema may result in ingestion failure and missing data
        /// </remarks>
        public TelemetryConfig(string tenantId, string clientId, string secret, string clusterName,
            string databaseName, string infoTable, string warningTable, string errorTable, EnvironmentType ingestAtLevel,
            string region = null, AzureCloudInstance cloudInstance = AzureCloudInstance.AzurePublic, bool removeUserContent = true) 
            : this(tenantId, clientId, secret, clusterName, databaseName, ingestAtLevel, region, cloudInstance, removeUserContent)
        {
            this.KustoInfoLogTable = infoTable;
            this.KustoWarningLogTable = warningTable;
            this.KustoErrorLogTable = errorTable;
        }

        /// <summary>
        /// Get the authentication token either using AAD App credentials or user-defined token provider
        /// </summary>
        /// <returns>An authentication token</returns>
        internal async Task<string> GetAuthenticationToken()
        {
            // User-defined token provider
            if (this.TokenProvider != null)
            {
                return this.TokenProvider.GetToken();
            }

            // Get token by supplying AAD App credentials
            else if (this.TenantId != null && this.ClientId != null && this.Secret != null
                && this.KustoClusterName != null && this.KustoDatabaseName != null
                && this.KustoInfoLogTable != null && this.KustoWarningLogTable != null && this.KustoErrorLogTable != null)
            {
                AuthenticationResult result = await GenerateKustoToken();
                return result.CreateAuthorizationHeader();
            }

            // Throw an exception if neither method is configured
            else
            {
                throw new Exception
                    ("Failed to get authentication token: No method configured to provide a token.");
            }
        }

        /// <summary>
        /// Build context when users make the first call. Need to ensure client Id, tenant and secret are not null.
        /// </summary>
        private void BuildContext()
        {
            if (this.Context == null)
            {
                this.Context = ConfidentialClientApplicationBuilder.Create(this.ClientId)
                    .WithAuthority(this.CloudInstance, this.TenantId)
                    .WithClientSecret(this.Secret)
                    .Build();
            }
        }

        /// <summary>
        /// Generate a Bearer token for accessing the Kusto resource using MSAL
        /// </summary>
        /// <returns>The authentication result</returns>
        private async Task<AuthenticationResult> GenerateKustoToken()
        {
            // Define the resource scope to be the current Kusto cluster
            string[] scopes = { $"https://{this.KustoClusterName}.kusto.windows.net/.default" };

            // Authenticate with AAD App credentials
            BuildContext();

            AuthenticationResult result;

            // Acquire token using MSAL
            try
            {
                result = await Context.AcquireTokenForClient(scopes).ExecuteAsync();
            }
            catch (Exception ex)
            {
                var errorMsg = $"Exception: {ex.Message}";
                if (ex.InnerException != null)
                {
                    errorMsg += $" InnerException: {ex.InnerException.Message}";
                }
                throw new Exception($"There was an error while acquiring Kusto authorization Token with client ID/secret authentication. {errorMsg}");
            }

            if (result == null || result.CreateAuthorizationHeader() == null)
            {
                throw new Exception
                    ("Received invalid Kusto authentication result. " +
                    "The result might be null, or missing HTTP authorization header from the authentication result.");
            }
            return result;
        }
    }
}
