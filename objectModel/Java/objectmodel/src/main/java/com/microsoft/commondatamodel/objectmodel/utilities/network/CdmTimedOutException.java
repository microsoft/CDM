package com.microsoft.commondatamodel.objectmodel.utilities.network;

public class CdmTimedOutException extends CdmNetworkException {
    public CdmTimedOutException() {
        super();
    }

    public CdmTimedOutException(final String message) {
        super(message);
    }
}
