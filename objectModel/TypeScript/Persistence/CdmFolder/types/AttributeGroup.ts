// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { AttributeGroupReference , EntityAttribute , TraitGroupReference, TraitReference , TypeAttribute } from '.';
import { identifierRef } from '../../../Utilities/identifierRef';

export abstract class AttributeGroup {
    public explanation?: string;
    public attributeGroupName: string;
    public attributeContext?: (string | identifierRef);
    public members: (string | AttributeGroupReference | TypeAttribute | EntityAttribute)[];
    public exhibitsTraits?: (string | TraitReference | TraitGroupReference)[];
}
