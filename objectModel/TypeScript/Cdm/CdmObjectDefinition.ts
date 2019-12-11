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
     * @deprecated
     * all objectDefs have some kind of name, this method returns the name independent of the name of the name property.
     */
    getName(): string;

    /**
     * @deprecated
     * Returns true if the object (or the referenced object) is an extension from the specified symbol name in some way.
     */
    isDerivedFrom(base: string, resOpt?: resolveOptions): boolean;
}
