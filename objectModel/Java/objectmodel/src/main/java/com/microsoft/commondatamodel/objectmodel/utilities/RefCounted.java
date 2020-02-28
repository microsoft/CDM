// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class RefCounted {
    /**
     * @deprecated This field is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public int refCnt;

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public RefCounted() {
        refCnt = 0;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public void addRef() {
        refCnt++;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public void release() {
        refCnt--;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public int getRefCnt() {
        return refCnt;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public void setRefCnt(final int refCnt) {
        this.refCnt = refCnt;
    }
}
