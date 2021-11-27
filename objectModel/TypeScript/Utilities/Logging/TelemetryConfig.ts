// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as msal from '@azure/msal-node';
import { AzureCloudEndpointConvertor } from '../../Enums/azureCloudEndpoint';
import { azureCloudEndpoint, environmentType } from '../../internal';
import { TokenProvider } from '../Network';


export class TelemetryConfig {
    /**
     * The tenant (directory) ID of the Azure AD application registration.
     */
    public tenantId: string;

    /**
     * The client ID of the application.
     */
    public clientId: string;

    /**
     * The client secret of the application.
     */
    public secret: string;

    /**
     * User geographic info.
     */
    public region: string;

    /**
     * Whether to remove all log information that may contain user content, 
     * including corpus path and error/warning messages.
     * Note: This property could be removed in the if the compliance issue gets resolved.
     */
    public removeUserContent: boolean;

    /**
     * Kusto (ADX) cluster name.
     */
    public kustoClusterName: string;

    /**
     * Kusto database name.
     */
    public kustoDatabaseName: string;

    /**
     * Default Kusto database log table names.
     */
     private readonly cdmInfoLogTable: string = 'infoLogs';
     private readonly cdmWarningLogTable: string = 'warningLogs';
     private readonly cdmErrorLogTable: string = 'errorLogs';

    /**
     * Kusto table for informational logs.
     */
    public kustoInfoLogTable: string = this.cdmInfoLogTable;

    /**
     * Kusto table for warning logs.
     */
    public kustoWarningLogTable: string = this.cdmWarningLogTable;

    /**
     * Kusto table for error logs.
     */
    public kustoErrorLogTable: string = this.cdmErrorLogTable;

    /**
     * Azure cloud instance.
     */
    public cloudInstance: azureCloudEndpoint;

    /**
     * The level of detail to be logged into the Kusto database.
     */
    public ingestAtLevel: environmentType;

    /**
     * The user-defined token provider..
     */
    public tokenProvider: TokenProvider;

    /**
     * The client AAD App context.
     */
    private context: msal.IConfidentialClientApplication;


    /**
     * Constructs a telemetry configuration with user-defined token provider.
     */
    constructor(ingestAtLevel: environmentType, region: string, removeUserContent: boolean, tokenProvider: TokenProvider);

    /**
     * Constructs a telemetry configuration with the credentials for user-defined Kusto cluster and table names.
     */
    constructor(ingestAtLevel: environmentType, region: string, removeUserContent: boolean, tenantId: string, 
        clientId: string, secret: string, clusterName: string, databaseName: string, cloudInstance?: azureCloudEndpoint);

    /**
     * Constructs a telemetry configuration with the credentials for a Kusto cluster with default table names.
     */
    constructor(ingestAtLevel: environmentType, region: string, removeUserContent: boolean, tenantId: string, 
        clientId: string, secret: string, clusterName: string, databaseName: string, cloudInstance: azureCloudEndpoint,
        infoTable: string, warningTable: string, errorTable: string);

    /**
     * Base implementation for the TelemetryConfig constructor.
     * Constructs a telemetry configuration with user-defined token provider, 
     * or with the credentials for user-defined Kusto cluster and table names.
     * @param ingestAtLevel Kusto ingestion security level for the execution environment.
     * @param region Geographic information, e.g. "West US".
     * @param removeUserContent Whether to remove all potential user created content.
     * @param tenantIdOrTokenProvider The tenant (directory) ID of the Azure AD application registration; or a token provider defined by user.
     * @param clientId The client ID of the application.
     * @param secret The client secret of the application.
     * @param clusterName Kusto cluster name.
     * @param databaseName Kusto database name.
     * @param infoTable Table for storing informational logs.
     * @param warningTable Table for storing warning logs.
     * @param errorTable Table for storing error logs.
     */
    constructor(ingestAtLevel: environmentType, region: string = null, removeUserContent: boolean = false, 
        tenantIdOrTokenProvider: string | TokenProvider, clientId?: string, secret?: string, 
        clusterName?: string, databaseName?: string, cloudInstance: azureCloudEndpoint = azureCloudEndpoint.AzurePublic, 
        infoTable?: string, warningTable?: string, errorTable?: string) {

        if (tenantIdOrTokenProvider) {
            // Constructs with AAD App credentials
            if (typeof tenantIdOrTokenProvider === 'string') {
                this.tenantId = tenantIdOrTokenProvider;
                this.clientId = clientId;
                this.secret = secret;
            }

            // Constructs with user-defined token provider
            else {
                this.tokenProvider = this.tokenProvider
            }
        }

        this.kustoClusterName = clusterName;
        this.kustoDatabaseName = databaseName;

        if (infoTable && warningTable && errorTable) {
            this.kustoInfoLogTable = infoTable;
            this.kustoWarningLogTable = warningTable;
            this.kustoErrorLogTable = errorTable;
        }

        this.ingestAtLevel = ingestAtLevel;
        this.region = region;
        this.removeUserContent = removeUserContent;
        this.cloudInstance = cloudInstance;
    }

    /**
     * @internal
     * Get the authentication token either using AAD App credentials or user-defined token provider.
     * @returns An authentication token.
     */
    public async getAuthenticationToken(): Promise<string> {
        // User-defined token provider
        if (this.tokenProvider) {
            return this.tokenProvider.getToken();
        }

        // Get token by supplying AAD App credentials
        else if (this.tenantId && this.clientId && this.secret && this.kustoClusterName && this.kustoDatabaseName 
            && this.kustoInfoLogTable && this.kustoWarningLogTable && this.kustoErrorLogTable) {
            
            const result: msal.AuthenticationResult = await this.generateKustoToken();
            return `${result.tokenType} ${result.accessToken}`;
        }

        // Throw an exception if neither method is configured
        else {
            throw new Error('Failed to get authentication token: No method configured to provide a token.');
        }
    }

    /**
     * Build context when users make the first call. Need to ensure client Id, tenant and secret are not null.
     */
    private buildContext(): void {
        if (this.context === undefined) {
            const clientConfig = {
                auth: {
                    clientId: this.clientId,
                    authority: `${AzureCloudEndpointConvertor.azureCloudEndpointToURL(this.cloudInstance)}${this.tenantId}`,
                    clientSecret: this.secret
                }
            };
            this.context = new msal.ConfidentialClientApplication(clientConfig);
        }
    }

    /**
     * Generate a Bearer token for accessing the Kusto resource using MSAL.
     * @returns The authentication result.
     */
    private async generateKustoToken(): Promise<msal.AuthenticationResult> {
        // Define the resource scope to be the current Kusto cluster
        const scopes: string[] = [`https://${this.kustoClusterName}.kusto.windows.net/.default`];

        // Authenticate with AAD App credentials
        this.buildContext();

        // Acquire token using MSAL
        return new Promise<msal.AuthenticationResult>((resolve, reject) => {
            const clientCredentialRequest = {
                scopes,
            };

            this.context.acquireTokenByClientCredential(clientCredentialRequest).then((response) => {
                if (response.accessToken && response.accessToken.length !== 0 && response.tokenType) {
                    resolve(response);
                }

                reject(Error('Received invalid Kusto authentication result. The result might be null, or missing HTTP authorization header from the authentication result.'));
            }).catch((error) => {
                reject(Error('There was an error while acquiring Kusto authorization Token with client ID/secret authentication. Exception:' + JSON.stringify(error)));
            });
        });
    }
}
