// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectBase;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionAttributeStateSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionContext;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.List;

/**
 * Class to handle IncludeAttributes operations
 */
public class CdmOperationIncludeAttributes extends CdmOperationBase {
    private String TAG = CdmOperationIncludeAttributes.class.getSimpleName();
    private List<String> includeAttributes;

    public CdmOperationIncludeAttributes(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationIncludeAttributesDef);
        this.setType(CdmOperationType.IncludeAttributes);
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        Logger.error(TAG, this.getCtx(), "Projection operation not implemented yet.", "copy");
        return new CdmOperationIncludeAttributes(this.getCtx());
    }

    public List<String> getIncludeAttributes() {
        return includeAttributes;
    }

    public void setIncludeAttributes(final List<String> includeAttributes) {
        this.includeAttributes = includeAttributes;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
        return CdmObjectBase.copyData(this, resOpt, options, CdmOperationIncludeAttributes.class);
    }

    @Override
    public String getName() {
        return "operationIncludeAttributes";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public CdmObjectType getObjectType() {
        return CdmObjectType.OperationIncludeAttributesDef;
    }

    @Override
    public boolean isDerivedFrom(String baseDef, ResolveOptions resOpt) {
        Logger.error(TAG, this.getCtx(), "Projection operation not implemented yet.", "isDerivedFrom");
        return false;
    }

    @Override
    public boolean validate() {
        ArrayList<String> missingFields = new ArrayList<>();

        if (this.includeAttributes == null || this.includeAttributes.size() == 0) {
            missingFields.add("includeAttributes");
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
                path = pathFrom + "operationIncludeAttributes";
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
