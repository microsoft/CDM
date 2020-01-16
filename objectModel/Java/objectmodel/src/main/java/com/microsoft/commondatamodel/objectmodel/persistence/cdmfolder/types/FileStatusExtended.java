package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import java.time.OffsetDateTime;

public class FileStatusExtended extends FileStatus {
    private OffsetDateTime lastChildFileModifiedTime;

    public OffsetDateTime getLastChildFileModifiedTime() {
        return lastChildFileModifiedTime;
    }

    public void setLastChildFileModifiedTime(final OffsetDateTime lastChildFileModifiedTime) {
        this.lastChildFileModifiedTime = lastChildFileModifiedTime;
    }    
}
