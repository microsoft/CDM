// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.enums;

public class AzureCloudEndpointConvertor {
    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
     * @param endpointType AzureCloudEndpoint
     * @return AzureCloudEndpoint
     */
    @Deprecated
    public static com.microsoft.aad.msal4j.AzureCloudEndpoint azureCloudEndpointToInstance(AzureCloudEndpoint endpointType)
    {
        switch (endpointType) {
            case AzurePublic:
                return com.microsoft.aad.msal4j.AzureCloudEndpoint.AzurePublic;
            case AzureChina:
                return com.microsoft.aad.msal4j.AzureCloudEndpoint.AzureChina;
            case AzureGermany:
                return com.microsoft.aad.msal4j.AzureCloudEndpoint.AzureGermany;
            case AzureUsGovernment:
                return com.microsoft.aad.msal4j.AzureCloudEndpoint.AzureUsGovernment;
            default:
                throw new UnsupportedOperationException();
        }
    }

}
