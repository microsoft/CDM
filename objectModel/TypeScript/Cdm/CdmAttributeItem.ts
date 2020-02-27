// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmObject,
    CdmTraitCollection,
} from '../internal';
import { CdmReferencesEntities } from './CdmReferencesEntities';

export interface CdmAttributeItem extends CdmObject, CdmReferencesEntities {
    readonly appliedTraits: CdmTraitCollection;
}
