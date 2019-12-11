import { Purpose, TraitReference } from '.';

export abstract class PurposeReference {
    public purposeReference: string | Purpose;
    public appliedTraits?: (string | TraitReference)[];
}
