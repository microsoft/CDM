// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmObject,
    CdmTraitCollection,
    resolveOptions
} from '../internal';

export interface CdmObjectDefinition extends CdmObject {
    /**
     * the object's explanation.
     */
    explanation: string;

    /**
     * the object exhibits traits.
     */
    readonly exhibitsTraits: CdmTraitCollection;

    /**
     * all objectDefs have some kind of name, this method returns the name independent of the name of the name property.
     */
    getName(): string;
}
