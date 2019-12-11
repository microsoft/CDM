import { AttributeResolutionGuidance , EntityReference , PurposeReference, TraitReference } from '.';

export abstract class EntityAttribute {
    public explanation?: string;
    public purpose?: (string | PurposeReference);
    public name: string;
    public entity: string | EntityReference;
    public appliedTraits?: (string | TraitReference)[];
    public resolutionGuidance? : AttributeResolutionGuidance;
}
