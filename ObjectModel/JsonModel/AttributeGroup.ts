import { AttributeGroupReference , EntityAttribute , TraitReference , TypeAttribute } from '../internal';

export interface AttributeGroup {
    explanation?: string;
    attributeGroupName: string;
    attributeContext?: string;
    members: (string | AttributeGroupReference | TypeAttribute | EntityAttribute)[];
    exhibitsTraits?: (string | TraitReference)[];
}
