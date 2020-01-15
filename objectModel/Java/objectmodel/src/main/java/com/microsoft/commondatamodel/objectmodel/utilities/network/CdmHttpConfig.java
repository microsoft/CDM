package com.microsoft.commondatamodel.objectmodel.utilities.network;

import java.io.Serializable;

/**
 * CDM Http Config is used for serialization purposes by network-based adapters to set up config.
 */
class CdmHttpConfig implements Serializable {
    public long timeout;

    public long maximumTimeout;

    public int numberOfRetries;
}
