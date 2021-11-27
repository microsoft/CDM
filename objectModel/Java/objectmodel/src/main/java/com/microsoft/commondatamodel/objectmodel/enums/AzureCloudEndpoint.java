// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.enums;

public enum AzureCloudEndpoint {
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


