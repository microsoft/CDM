package com.microsoft.commondatamodel.objectmodel.utilities.network;

public class CdmNumberOfRetriesExceededException extends CdmNetworkException {
    public CdmNumberOfRetriesExceededException() {
        super();
    }

    public CdmNumberOfRetriesExceededException(final String message) {
        super(message);
    }
}
