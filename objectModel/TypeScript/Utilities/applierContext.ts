// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttributeContext,
    CdmAttributeResolutionGuidance,
    ResolvedAttribute,
    resolveOptions
} from '../internal';

/**
 * @internal
 */
export interface applierContext {
    state?: string;
    resOpt: resolveOptions;
    attCtx?: CdmAttributeContext;
    resGuide: CdmAttributeResolutionGuidance;
    resAttSource: ResolvedAttribute;
    resAttNew?: ResolvedAttribute;
    resGuideNew?: CdmAttributeResolutionGuidance;
    continue?: boolean;
}
