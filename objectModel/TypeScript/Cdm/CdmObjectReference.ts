import {
    CdmObject,
    CdmObjectDefinition,
    CdmTraitCollection,
    resolveOptions
} from '../internal';

export interface CdmObjectReference extends CdmObject {
    /**
     * the object reference applied traits.
     */
    readonly appliedTraits: CdmTraitCollection;

    /**
     * the object explicit reference.
     */
    explicitReference?: CdmObjectDefinition;

    /**
     * the object named reference.
     */
    namedReference?: string;

    /**
     * if true use namedReference else use explicitReference.
     */
    simpleNamedReference?: boolean;

    /**
     * @deprecated
     */
    fetchResolvedReference(resOpt?: resolveOptions): CdmObjectDefinition;
}
