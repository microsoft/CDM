// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { applierContext, ResolvedTrait, resolveOptions, CdmAttributeResolutionGuidance } from '../internal';

export interface AttributeResolutionApplier {
    /**
     * @internal
     */
    matchName: string;

    /**
     * @internal
     */
    priority: number;

    /**
     * @internal
     */
    overridesBase: boolean;

    /**
     * @internal
     */
    willCreateContext?: applierQuery;

    /**
     * @internal
     */
    doCreateContext?: applierAction;

    /**
     * @internal
     */
    willRemove?: applierQuery;

    /**
     * @internal
     */
    willAttributeModify?: applierQuery;

    /**
     * @internal
     */
    doAttributeModify?: applierAction;

    /**
     * @internal
     */
    willGroupAdd?: applierQuery;

    /**
     * @internal
     */
    doGroupAdd?: applierAction;

    /**
     * @internal
     */
    willRoundAdd?: applierQuery;

    /**
     * @internal
     */
    doRoundAdd?: applierAction;

    /**
     * @internal
     */
    willAttributeAdd?: applierQuery;

    /**
     * @internal
     */
    doAttributeAdd?: applierAction;

    /**
     * @internal
     */
    willAlterDirectives?(resOpt: resolveOptions, resGuide: CdmAttributeResolutionGuidance): boolean;

    /**
     * @internal
     */
    doAlterDirectives?(resOpt: resolveOptions, resGuid: CdmAttributeResolutionGuidance): void;
}

// one of the doXXX steps that an applier may perform
export type applierAction = (onStep: applierContext) => void;
export type applierQuery = (onStep: applierContext) => boolean;
// a discrete action for an applier to perform upon a trait/attribute/etc.
