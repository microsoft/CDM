// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CardinalitySettings,
    CdmEntityAttributeDefinition,
    CdmObjectDefinitionBase,
    CdmObjectReference,
    DepthInfo,
    cdmObjectType,
    resolveOptions
} from '../../internal';

/**
 * Directives to pass to the top level projection on resolution
 * ProjectionDirective contains all the inputs for a projection towards resolution.
 * ProjectionContext is the context that initializes, lives and evolves through the projection resolution process.
 * ProjectionContext contains an instance of ProjectionDirective.
 * @internal
 */
// tslint:disable:variable-name
export class ProjectionDirective {
    /**
     * Resolution option used
     * @internal
     */
    public resOpt: resolveOptions;

    /**
     * The calling referencing EntityDef or the EntityAttributeDef that contains this projection
     * @internal
     */
    public owner: CdmObjectDefinitionBase;

    /**
     * The EntityRef to the owning EntityDef or EntityAttributeDef
     * @internal
     */
    public ownerRef: CdmObjectReference;

    /**
     * Is Owner EntityDef or EntityAttributeDef
     * @internal
     */
    public ownerType: cdmObjectType;

    /**
     * The entity attribute name or "{a/A}"
     * This may pass through at each operation action/transformation
     * @internal
     */
    public get originalSourceEntityAttributeName(): string {
        return (this.owner?.objectType === cdmObjectType.entityAttributeDef) ? this.owner.getName() : undefined;
    }

    /**
     * If EntityAttributeDef - then the Cardinality from the Owner EntityAttributeDef
     * This is ignored for EntityDef and will default to min:max = 0:1
     * @internal
     */
    public cardinality: CardinalitySettings;

    /**
     * For entity attribute - get if the source is polymorphic
     * @internal
     */
    public isSourcePolymorphic: boolean;

    /**
     * Has maximum depth override flag
     * @internal
     */
    public hasNoMaximumDepth: boolean;

    /**
     * Allowed maximum depth of reference
     * @internal
     */
    public maximumDepth?: number;

    /**
     * Is array
     * @internal
     */
    public isArray?: boolean;

    /**
     * Is referenceOnly
     * @internal
     */
    public isReferenceOnly: boolean;

    /**
     * Is normalized
     * @internal
     */
    public isNormalized: boolean;

    /**
     * Is structured
     * @internal
     */
    public isStructured: boolean;

    /**
     * Is virtual
     * @internal
     */
    public isVirtual: boolean;

    constructor(resOpt: resolveOptions, owner: CdmObjectDefinitionBase, ownerRef: CdmObjectReference = null) {
        this.resOpt = resOpt;

        // Owner information
        this.owner = owner;
        this.ownerRef = ownerRef;
        this.ownerType = owner ? owner.objectType : cdmObjectType.error;

        if (owner?.objectType === cdmObjectType.entityAttributeDef) {
            // Entity Attribute

            const _owner: CdmEntityAttributeDefinition = owner as CdmEntityAttributeDefinition;
            this.cardinality = _owner.cardinality ? _owner.cardinality : new CardinalitySettings(_owner);
            this.isSourcePolymorphic = (_owner.isPolymorphicSource !== undefined && _owner.isPolymorphicSource !== null && _owner.isPolymorphicSource === true);
        } else {
            // Entity Def

            this.cardinality = undefined;
            this.isSourcePolymorphic = false;
        }

        this.isReferenceOnly = (resOpt.directives?.has('referenceOnly') === true);
        this.isNormalized = (resOpt.directives?.has('normalized') === true);
        this.isStructured = (resOpt.directives?.has('structured') === true);
        this.isVirtual = (resOpt.directives?.has('virtual') === true);
        this.hasNoMaximumDepth = (resOpt.directives?.has('noMaxDepth') === true);
        this.isArray = (resOpt.directives?.has('isArray') === true);

        // if noMaxDepth directive the max depth is 32 else defaults to what was set by the user
        // these depths were arbitrary and were set for the resolution guidance
        // re-using the same for projections as well
        this.maximumDepth = this.hasNoMaximumDepth ? DepthInfo.maxDepthLimit : resOpt.maxDepth;
    }
}
