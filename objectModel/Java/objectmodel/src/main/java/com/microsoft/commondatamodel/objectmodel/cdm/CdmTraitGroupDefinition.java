// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * The CDM definition of a Trait Group object, representing a collection (grouping) of one or more traits.
 */
public class CdmTraitGroupDefinition extends CdmObjectDefinitionBase {
    private final String TAG = CdmObjectDefinitionBase.class.getSimpleName();

    private String traitGroupName;

    /**
     * Constructs a CdmTraitGroupDefinition.
     * @param ctx The context.
     * @param traitGroupName The TraitGroup name.
     */
    public CdmTraitGroupDefinition(CdmCorpusContext ctx, String traitGroupName) {
        super(ctx);
        setObjectType(CdmObjectType.TraitGroupDef);
        this.traitGroupName = traitGroupName;
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        if (resOpt == null) {
            resOpt = new ResolveOptions(this, getCtx().getCorpus().getDefaultResolutionDirectives());
        }

        CdmTraitGroupDefinition copy;
        if (host == null) {
            copy = new CdmTraitGroupDefinition(getCtx(), getTraitGroupName());
        } else {
            copy = (CdmTraitGroupDefinition) host;
            copy.setCtx(getCtx());
            copy.setTraitGroupName(getTraitGroupName());
        }

        copyDef(resOpt, copy);
        return copy;
    }

    @Override
    public boolean validate() {
        if (StringUtils.isNullOrTrimEmpty(getTraitGroupName())) {
            List<String> missingFields = new ArrayList<> ();
            missingFields.add("TraitGroupName");
            Logger.error(getCtx(), TAG, "validate", getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, getAtCorpusPath(),
                    missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.joining(", ")));
            return false;
        }
        return true;
    }

    @Override
    @Deprecated
    public Object copyData(ResolveOptions resOpt, CopyOptions options) {
        return CdmObjectBase.copyData(this, resOpt, options);
    }

    @Override
    public boolean isDerivedFrom(String baseDef, ResolveOptions resOpt) {
        return false;
    }

    @Override
    public boolean visit(String pathFrom, VisitCallback preChildren, VisitCallback postChildren) {
        String path = "";
        if (!getCtx().getCorpus().getBlockDeclaredPathChanges()) {
            path = getDeclaredPath();
            if (StringUtils.isNullOrTrimEmpty(path)) {
                path = pathFrom + getTraitGroupName();
                setDeclaredPath(path);
            }
        }

        if (preChildren != null && preChildren.invoke(this, path)) {
            return false;
        }

        if (visitDef(path, preChildren, postChildren)) {
            return true;
        }

        if (postChildren != null && postChildren.invoke(this, path)) {
            return true;
        }

        return false;
    }

    @Override
    @Deprecated
    void constructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt) {
        constructResolvedTraitsDef(null, rtsb, resOpt);
    }

    @Override
    @Deprecated
    public ResolvedAttributeSetBuilder constructResolvedAttributes(ResolveOptions resOpt) {
        return null;
    }

    @Override
    @Deprecated
    public ResolvedAttributeSetBuilder constructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under) {
        return null;
    }

    /**
     * Gets or sets the TraitGroup name.
     * @return
     */
    public String getTraitGroupName() {
        return traitGroupName;
    }

    public void setTraitGroupName(String traitGroupName) {
        this.traitGroupName = traitGroupName;
    }

    @Override
    public String getName()
    {
        return getTraitGroupName();
    }
}
