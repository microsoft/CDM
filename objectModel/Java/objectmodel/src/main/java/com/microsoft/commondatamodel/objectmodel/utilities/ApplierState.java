// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import java.util.function.Consumer;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ApplierState {
    boolean flexRemove;
    ResolvedAttribute arrayTemplate;
    Integer flexCurrentOrdinal;
    Integer arrayFinalOrdinal;
    Integer arrayInitialOrdinal;
    Consumer<ApplierContext> arraySpecializedContext;

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
     * @return ApplierState
     */
    @Deprecated
    public ApplierState copy() {
        final ApplierState copy = new ApplierState();

        copy.flexRemove = flexRemove;
        copy.arrayTemplate = arrayTemplate;
        copy.flexCurrentOrdinal = flexCurrentOrdinal;
        copy.arrayFinalOrdinal = arrayFinalOrdinal;
        copy.arrayInitialOrdinal = arrayInitialOrdinal;
        copy.arraySpecializedContext = arraySpecializedContext;

        return copy;
    }

    @Deprecated
    public boolean getFlexRemove() { return this.flexRemove; }

    @Deprecated
    public void setFlexRemove(final boolean value) { this.flexRemove = value; }

    @Deprecated
    public ResolvedAttribute getArrayTemplate() { return this.arrayTemplate; }

    @Deprecated
    public void setArrayTemplate(final ResolvedAttribute value) { this.arrayTemplate = value; }

    @Deprecated
    public Integer getFlexCurrentOrdinal() { return this.flexCurrentOrdinal; }

    @Deprecated
    public void setFlexCurrentOrdinal(final Integer value) { this.flexCurrentOrdinal = value; }

    @Deprecated
    public Integer getArrayFinalOrdinal() { return this.arrayFinalOrdinal; }

    @Deprecated
    public void setArrayFinalOrdinal(final Integer value) { this.arrayFinalOrdinal = value; }

    @Deprecated
    public Integer getArrayInitialOrdinal() { return this.arrayInitialOrdinal; }

    @Deprecated
    public void setArrayInitialOrdinal(final Integer value) { this.arrayInitialOrdinal = value; }

    @Deprecated
    public Consumer<ApplierContext> getArraySpecializedContext() { return this.arraySpecializedContext; }

    @Deprecated
    public void setArraySpecializedContext(final Consumer<ApplierContext> value) { this.arraySpecializedContext = value; }
}
