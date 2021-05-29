// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ResolvedEntityReferenceSet , resolveOptions } from '../internal';

export interface CdmReferencesEntities {
    /**
     * @deprecated
     * For internal use only.
     */
    fetchResolvedEntityReference(resOpt: resolveOptions): ResolvedEntityReferenceSet;
}
