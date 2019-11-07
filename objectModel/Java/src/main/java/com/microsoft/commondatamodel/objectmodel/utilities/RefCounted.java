package com.microsoft.commondatamodel.objectmodel.utilities;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
public class RefCounted {
    public int refCnt;

    public RefCounted() {
        refCnt = 0;
    }

    public void addRef() {
        refCnt++;
    }

    public void release() {
        refCnt--;
    }

    public int getRefCnt() {
        return refCnt;
    }

    public void setRefCnt(final int refCnt) {
        this.refCnt = refCnt;
    }
}
