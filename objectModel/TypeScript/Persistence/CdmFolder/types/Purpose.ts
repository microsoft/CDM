import { PurposeReference, TraitReference } from '.';

export abstract class Purpose {
    public explanation?: string;
    public purposeName: string;
    public extendsPurpose?: string | PurposeReference;
    public exhibitsTraits?: (string | TraitReference)[];
}
