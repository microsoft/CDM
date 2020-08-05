// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionAttributeStateSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionContext;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.List;

/**
 * Class to handle CombineAttributes operations
 */
public class CdmOperationCombineAttributes extends CdmOperationBase {
    private String TAG = CdmOperationCombineAttributes.class.getSimpleName();
    private List<String> take;
    private CdmTypeAttributeDefinition mergeInto;

    public CdmOperationCombineAttributes(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationCombineAttributesDef);
        this.setType(CdmOperationType.CombineAttributes);
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        Logger.error(TAG, this.getCtx(), "Projection operation not implemented yet.", "copy");
        return new CdmOperationCombineAttributes(this.getCtx());
    }

    public List<String> getTake() {
        return take;
    }

    public void setTake(final List<String> take) {
        this.take = take;
    }

    public CdmTypeAttributeDefinition getMergeInto() {
        return mergeInto;
    }

    public void setMergeInto(final CdmTypeAttributeDefinition mergeInto) {
        this.mergeInto = mergeInto;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
        return CdmObjectBase.copyData(this, resOpt, options, CdmOperationCombineAttributes.class);
    }

    @Override
    public String getName() {
        return "operationCombineAttributes";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public CdmObjectType getObjectType() {
        return CdmObjectType.OperationCombineAttributesDef;
    }

    @Override
    public boolean isDerivedFrom(String baseDef, ResolveOptions resOpt) {
        Logger.error(TAG, this.getCtx(), "Projection operation not implemented yet.", "isDerivedFrom");
        return false;
    }

    @Override
    public boolean validate() {
        ArrayList<String> missingFields = new ArrayList<>();

        if (this.take == null || this.take.size() == 0) {
            missingFields.add("take");
        }
        if (this.mergeInto == null) {
            missingFields.add("mergeInto");
        }
        if (missingFields.size() > 0) {
            Logger.error(TAG, this.getCtx(), Errors.validateErrorString(this.getAtCorpusPath(), missingFields));
            return false;
        }
        return true;
    }

    @Override
    public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
        String path = "";
        if (!this.getCtx().getCorpus().getBlockDeclaredPathChanges()) {
            path = this.getDeclaredPath();
            if (StringUtils.isNullOrEmpty(path)) {
                path = pathFrom + "operationCombineAttributes";
                this.setDeclaredPath(path);
            }
        }

        if (preChildren != null && preChildren.invoke(this, path)) {
            return false;
        }

        if (postChildren != null && postChildren.invoke(this, path)) {
            return true;
        }

        return false;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public ProjectionAttributeStateSet appendProjectionAttributeState(ProjectionContext projCtx, ProjectionAttributeStateSet projAttrStateSet, CdmAttributeContext attrCtx) {
        Logger.error(TAG, this.getCtx(), "Projection operation not implemented yet.", "appendProjectionAttributeState");
        return null;
    }
}
