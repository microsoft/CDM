// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
