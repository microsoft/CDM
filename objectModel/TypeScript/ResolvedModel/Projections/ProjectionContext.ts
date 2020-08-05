// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmAttributeContext, ProjectionAttributeStateSet, ProjectionDirective, ResolvedAttributeSet } from '../../internal';

/**
 * Context for each projection or nested projection
 * @internal
 */
export class ProjectionContext {
    /**
     * Directive passed to the root projection
     * @internal
     */
    public projectionDirective: ProjectionDirective;

    /**
     * The collection of original source entities's resolved attributes
     * @internal
     */
    public originalSourceResolvedAttributeSet: ResolvedAttributeSet;

    /**
     * The attribute context of the current resolve attribute
     * @internal
     */
    public currentAttributeContext: CdmAttributeContext;

    /**
     * A list of attribute state
     * @internal
     */
    public currentAttributeStateSet: ProjectionAttributeStateSet;

    constructor(projDirective: ProjectionDirective, attrCtx: CdmAttributeContext) {
        this.projectionDirective = projDirective;
        this.currentAttributeContext = attrCtx;
        this.currentAttributeStateSet = new ProjectionAttributeStateSet(projDirective?.owner?.ctx);
    }
}
