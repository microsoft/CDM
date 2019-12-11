import { AttributeGroupReference , EntityAttribute , TraitReference , TypeAttribute } from '.';

export abstract class AttributeGroup {
    public explanation?: string;
    public attributeGroupName: string;
    public attributeContext?: string;
    public members: (string | AttributeGroupReference | TypeAttribute | EntityAttribute)[];
    public exhibitsTraits?: (string | TraitReference)[];
}
