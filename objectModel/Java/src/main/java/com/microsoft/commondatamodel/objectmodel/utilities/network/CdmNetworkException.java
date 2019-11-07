package com.microsoft.commondatamodel.objectmodel.utilities.network;

public abstract class CdmNetworkException extends RuntimeException {
    public CdmNetworkException() {
        super();
    }

    public CdmNetworkException(final String message) {
        super(message);
    }
}
