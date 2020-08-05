// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectDefinitionBase;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectReference;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CardinalitySettings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

/**
 * Directives to pass to the top level projection on resolution
 * ProjectionDirective contains all the inputs for a projection towards resolution.
 * ProjectionContext is the context that initializes, lives and evolves through the projection resolution process.
 * ProjectionContext contains an instance of ProjectionDirective.
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public final class ProjectionDirective {
    /**
     * Max depth default
     */
    final int maxDepthDefault = 2;

    /**
     * Max Depth if 'noMaxDepth' is defined
     */
    final int maxDepthHasNoMax = 32;

    private ResolveOptions resOpt;
    private CdmObjectDefinitionBase owner;
    private CdmObjectReference ownerRef;
    private CdmObjectType ownerType;
    private String originalSourceEntityAttributeName;
    private CardinalitySettings cardinality;
    private boolean isSourcePolymorphic;
    private Integer currentDepth;
    private boolean hasNoMaximumDepth;
    private Integer maximumDepth;
    private Boolean isArray;
    private boolean isReferenceOnly;
    private boolean isNormalized;
    private boolean isStructured;

    public ProjectionDirective(ResolveOptions resOpt, CdmObjectDefinitionBase owner) {
        this(resOpt, owner, null);
    }

    public ProjectionDirective(ResolveOptions resOpt, CdmObjectDefinitionBase owner, CdmObjectReference ownerRef) {
        this.resOpt = resOpt;

        // Owner information
        this.owner = owner;
        this.ownerRef = ownerRef;
        this.ownerType = (owner != null) ? owner.getObjectType() : CdmObjectType.Error;

        if (owner != null && owner.getObjectType() == CdmObjectType.EntityAttributeDef) {
            // Entity Attribute

            CdmEntityAttributeDefinition _owner = (CdmEntityAttributeDefinition) owner;
            this.cardinality = _owner.getCardinality() != null ? _owner.getCardinality() : new CardinalitySettings(_owner);
            this.isSourcePolymorphic = (_owner.getIsPolymorphicSource() != null && _owner.getIsPolymorphicSource() == true);
        } else {
            // Entity Def

            this.cardinality = null;
            this.isSourcePolymorphic = false;
        }

        if (resOpt.getDirectives() != null) {
            this.isReferenceOnly = (resOpt.getDirectives().has("referenceOnly") == true);
            this.isNormalized = (resOpt.getDirectives().has("normalized") == true);
            this.isStructured = (resOpt.getDirectives().has("structured") == true);
            this.hasNoMaximumDepth = (resOpt.getDirectives().has("noMaxDepth") == true);
            this.isArray = (resOpt.getDirectives().has("isArray") == true);
        }

        this.currentDepth = (resOpt != null && resOpt.getRelationshipDepth() == null) ? 1 : resOpt.getRelationshipDepth() + 1;
        resOpt.setRelationshipDepth(this.currentDepth);

        // if noMaxDepth directive the max depth is 32 else defaults to 2
        // these depths were arbitrary and were set for the resolution guidance
        // re-using the same for projections as well
        this.maximumDepth = this.hasNoMaximumDepth ? maxDepthHasNoMax : maxDepthDefault;
    }

    /**
     * Resolution option used
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public ResolveOptions getResOpt() {
        return resOpt;
    }

    /**
     * The calling referencing EntityDef or the EntityAttributeDef that contains this projection
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public CdmObjectDefinitionBase getOwner() {
        return owner;
    }

    /**
     * The EntityRef to the owning EntityDef or EntityAttributeDef
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public CdmObjectReference getOwnerRef() {
        return ownerRef;
    }

    /**
     * Is Owner EntityDef or EntityAttributeDef
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public CdmObjectType getOwnerType() {
        return ownerType;
    }

    /**
     * The entity attribute name or "{a/A}"
     * This may pass through at each operation action/transformation
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public String getOriginalSourceEntityAttributeName() {
        return (owner != null && owner.getObjectType() == CdmObjectType.EntityAttributeDef) ? owner.getName() : null;
    }

    /**
     * If EntityAttributeDef - then the Cardinality from the Owner EntityAttributeDef
     * This is ignored for EntityDef and will default to min:max = 0:1
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public CardinalitySettings getCardinality() {
        return cardinality;
    }

    /**
     * For entity attribute - get if the source is polymorphic
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public boolean getIsSourcePolymorphic() {
        return isSourcePolymorphic;
    }

    /**
     * Current depth of reference
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public Integer getCurrentDepth() {
        return currentDepth;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public void setCurrentDepth(final Integer currentDepth) {
        this.currentDepth = currentDepth;
    }

    /**
     * Has maximum depth override flag
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public boolean getHasNoMaximumDepth() {
        return hasNoMaximumDepth;
    }

    /**
     * Allowed maximum depth of reference
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public Integer getMaximumDepth() {
        return maximumDepth;
    }

    /**
     * Is array
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public Boolean getIsArray() {
        return isArray;
    }

    /**
     * Is referenceOnly
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public boolean getIsReferenceOnly() {
        return isReferenceOnly;
    }

    /**
     * Is normalized
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public boolean getIsNormalized() {
        return isNormalized;
    }

    /**
     * Is structured
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public boolean getIsStructured() {
        return isStructured;
    }
}
