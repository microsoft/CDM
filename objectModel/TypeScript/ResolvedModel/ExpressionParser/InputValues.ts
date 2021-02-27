// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ProjectionDirective } from "../../internal";

/**
 * A structure to carry all the input values during evaluation/resolution of an expression tree
 * @internal
 */
export class InputValues {
    public nextDepth?: number;
    public maxDepth?: number;
    public noMaxDepth?: boolean;
    public isArray?: boolean;

    public minCardinality?: number;
    public maxCardinality?: number;

    public referenceOnly: boolean;
    public normalized: boolean;
    public structured: boolean;
    public isVirtual: boolean;

    constructor(projDirective: ProjectionDirective) {
        if (!projDirective) {
            return;
        }

        this.noMaxDepth = projDirective.hasNoMaximumDepth;
        this.isArray = projDirective.isArray;

        this.referenceOnly = projDirective.isReferenceOnly;
        this.normalized = projDirective.isNormalized;
        this.structured = projDirective.isStructured;
        this.isVirtual = projDirective.isVirtual;

        this.nextDepth = projDirective.resOpt.depthInfo.currentDepth;
        this.maxDepth = projDirective.maximumDepth;

        this.minCardinality = projDirective.cardinality?._minimumNumber;
        this.maxCardinality = projDirective.cardinality?._maximumNumber;
    }
}
