// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities.network;

/**
 * Interface to be implemented by users to encapsulate their customized token provider.
 */
public interface TokenProvider {
    /**
     * Returns the token string with the authentication type included.
     * It is expected that the returned token has been validated for expiration upfront
     * by the implementer of the interface.
     *
     * @return the token string with the authentication type included, e.g. "Bearer XXXXX"
     */
    String getToken();
}
