// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmObject,
    CdmObjectDefinition,
    CdmTraitCollection,
    resolveOptions
} from '../internal';

export interface CdmObjectReference extends CdmObject {
    /**
     * the object reference applied traits.
     */
    readonly appliedTraits: CdmTraitCollection;

    /**
     * the object explicit reference.
     */
    explicitReference?: CdmObjectDefinition;

    /**
     * the object named reference.
     */
    namedReference?: string;

    /**
     * if true use namedReference else use explicitReference.
     */
    simpleNamedReference?: boolean;

    /**
     * @deprecated Only for internal use.
     */
    fetchResolvedReference(resOpt?: resolveOptions): CdmObjectDefinition;
}
