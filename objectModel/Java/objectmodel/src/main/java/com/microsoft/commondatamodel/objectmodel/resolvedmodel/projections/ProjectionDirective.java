// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectDefinitionBase;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectReference;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CardinalitySettings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.DepthInfo;
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
    private ResolveOptions resOpt;
    private CdmObjectDefinitionBase owner;
    private CdmObjectReference ownerRef;
    private CardinalitySettings cardinality;
    private boolean isSourcePolymorphic;
    private boolean hasNoMaximumDepth;
    private Integer maximumDepth;
    private Boolean isArray;
    private boolean isReferenceOnly;
    private boolean isNormalized;
    private boolean isStructured;
    private boolean isVirtual;

    public ProjectionDirective(ResolveOptions resOpt, CdmObjectDefinitionBase owner) {
        this(resOpt, owner, null);
    }

    public ProjectionDirective(ResolveOptions resOpt, CdmObjectDefinitionBase owner, CdmObjectReference ownerRef) {
        this.resOpt = resOpt;

        // Owner information
        this.owner = owner;
        this.ownerRef = ownerRef;

        if (owner != null && owner.getObjectType() == CdmObjectType.EntityAttributeDef) {
            // Entity Attribute

            CdmEntityAttributeDefinition _owner = (CdmEntityAttributeDefinition) owner;
            this.cardinality = _owner.getCardinality() != null ? _owner.getCardinality() : new CardinalitySettings(_owner);
            this.isSourcePolymorphic = (_owner.getIsPolymorphicSource() != null && _owner.getIsPolymorphicSource() == true);
        } else {
            // Entity Def or Type Attribute

            this.cardinality = null;
            this.isSourcePolymorphic = false;
        }

        if (resOpt.getDirectives() != null) {
            this.isReferenceOnly = (resOpt.getDirectives().has("referenceOnly") == true);
            this.isNormalized = (resOpt.getDirectives().has("normalized") == true);
            this.isStructured = (resOpt.getDirectives().has("structured") == true);
            this.isVirtual = (resOpt.getDirectives().has("virtual") == true);
            this.hasNoMaximumDepth = (resOpt.getDirectives().has("noMaxDepth") == true);
            this.isArray = (resOpt.getDirectives().has("isArray") == true);
        }

        // if noMaxDepth directive the max depth is 32 else defaults to what was set by the user
        // these depths were arbitrary and were set for the resolution guidance
        // re-using the same for projections as well
        this.maximumDepth = this.hasNoMaximumDepth ? DepthInfo.maxDepthLimit : resOpt.getMaxDepth();
    }

    /**
     * Resolution option used
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return ResolveOptions
     */
    @Deprecated
    public ResolveOptions getResOpt() {
        return resOpt;
    }

    /**
     * The calling referencing EntityDef, the EntityAttributeDef, or the TypeAttributeDef that contains this projection
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return CdmObjectDefinitionBase
     */
    @Deprecated
    public CdmObjectDefinitionBase getOwner() {
        return owner;
    }

    /**
     * The EntityRef to the owning EntityDef, EntityAttributeDef, or TypeAttributeDef
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return CdmObjectReference
     */
    @Deprecated
    public CdmObjectReference getOwnerRef() {
        return ownerRef;
    }

    /**
     * The entity/type attribute name or "{a/A}"
     * This may pass through at each operation action/transformation
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return String
     */
    @Deprecated
    public String getOriginalSourceAttributeName() {
        return (owner != null &&
                (owner.getObjectType() == CdmObjectType.EntityAttributeDef ||
                        owner.getObjectType() == CdmObjectType.TypeAttributeDef)) ? owner.getName() : null;
    }

    /**
     * If EntityAttributeDef - then the Cardinality from the Owner EntityAttributeDef
     * This is ignored for EntityDef and will default to min:max = 0:1
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return CardinalitySettings
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
     * @return boolean
     */
    @Deprecated
    public boolean getIsSourcePolymorphic() {
        return isSourcePolymorphic;
    }

    /**
     * Has maximum depth override flag
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return boolean
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
     * @return Integer
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
     * @return Boolean
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
     * @return Boolean
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
     * @return Boolean
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
     * @return Boolean
     */
    @Deprecated
    public boolean getIsStructured() {
        return isStructured;
    }

    /**
     * Is structured
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return Boolean
     */
    @Deprecated
    public boolean getIsVirtual() {
        return isVirtual;
    }
}
