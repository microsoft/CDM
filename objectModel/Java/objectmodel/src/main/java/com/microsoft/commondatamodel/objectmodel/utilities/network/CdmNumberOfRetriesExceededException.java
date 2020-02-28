// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities.network;

public class CdmNumberOfRetriesExceededException extends CdmNetworkException {
    public CdmNumberOfRetriesExceededException() {
        super();
    }

    public CdmNumberOfRetriesExceededException(final String message) {
        super(message);
    }
}
