// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.Identity.Client;
using System;

namespace Microsoft.CommonDataModel.ObjectModel.Enums
{
    /// <summary>
    /// AzureCloudEndpoint is an utility enum containing URLs for each of the national clouds endpoints, as well as the public cloud endpoint
    /// </summary>
    public enum AzureCloudEndpoint
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
    };

    internal class AzureCloudEndpointConvertor
    {
        internal static AzureCloudInstance AzureCloudEndpointToInstance(AzureCloudEndpoint endpointType)
        {
            switch (endpointType)
            {
                case AzureCloudEndpoint.AzurePublic:
                    return AzureCloudInstance.AzurePublic;
                case AzureCloudEndpoint.AzureChina:
                    return AzureCloudInstance.AzureChina;
                case AzureCloudEndpoint.AzureGermany:
                    return AzureCloudInstance.AzureGermany;
                case AzureCloudEndpoint.AzureUsGovernment:
                    return AzureCloudInstance.AzureUsGovernment;
                default:
                    throw new InvalidOperationException();
            }
        }
    }
}

