// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.


/**
 * AzureCloudEndpoint is an utility enum containing URLs for each of the national clouds endpoints, as well as the public cloud endpoint
 */
export enum azureCloudEndpoint
{
    /// <summary>
    /// Microsoft Azure public cloud. Maps to https://login.microsoftonline.com
    /// </summary>
    AzurePublic,

    /// <summary>
    /// Microsoft Chinese national cloud. Maps to https://login.chinacloudapi.cn
    /// </summary>
    AzureChina,

    /// <summary>
    /// Microsoft German national cloud ("Black Forest"). Maps to https://login.microsoftonline.de
    /// </summary>
    AzureGermany,

    /// <summary>
    /// US Government cloud. Maps to https://login.microsoftonline.us
    /// </summary>
    AzureUsGovernment,
}

/**
 * @internal
 */
export class AzureCloudEndpointConvertor
{
    /**
     * @internal
     */
    public static azureCloudEndpointToURL(endpointType: azureCloudEndpoint): string {
        switch (endpointType)
        {
            case azureCloudEndpoint.AzurePublic:
                return 'https://login.microsoftonline.com/';
            case azureCloudEndpoint.AzureChina:
                return 'https://login.chinacloudapi.cn/';
            case azureCloudEndpoint.AzureGermany:
                return 'https://login.microsoftonline.de/';
            case azureCloudEndpoint.AzureUsGovernment:
                return 'https://login.microsoftonline.us/';
            default:
                throw new Error('Invalid operation.');
        }
     }
}
