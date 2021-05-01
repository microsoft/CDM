// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmObjectReferenceBase,
    CdmTraitDefinition,
} from '../internal';
import { CdmTraitGroupDefinition } from './CdmTraitGroupDefinition';

/**
 * The CDM definition interface for a generic reference to either a trait or a trait group. 
 */
export abstract class CdmTraitReferenceBase extends CdmObjectReferenceBase {
    constructor(ctx: CdmCorpusContext, trait: string | CdmTraitDefinition | CdmTraitGroupDefinition, simpleReference: boolean) {
        super(ctx, trait, simpleReference);
    }
}
