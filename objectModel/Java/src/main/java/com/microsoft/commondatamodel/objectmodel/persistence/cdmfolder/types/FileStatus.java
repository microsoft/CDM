package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import java.time.OffsetDateTime;

public class FileStatus {
    private OffsetDateTime lastFileStatusCheckTime;
    private OffsetDateTime lastFileModifiedTime;

    public OffsetDateTime getLastFileStatusCheckTime() {
        return this.lastFileStatusCheckTime;
    }

    public void setLastFileStatusCheckTime(final OffsetDateTime lastFileStatusCheckTime) {
        this.lastFileStatusCheckTime = lastFileStatusCheckTime;
    }

    public OffsetDateTime getLastFileModifiedTime() {
        return this.lastFileModifiedTime;
    }

    public void setLastFileModifiedTime(final OffsetDateTime lastFileModifiedTime) {
        this.lastFileModifiedTime = lastFileModifiedTime;
    }
}
