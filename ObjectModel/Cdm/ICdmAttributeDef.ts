import { ICdmObjectRef , ICdmReferencesEntities , ICdmRelationshipRef , ICdmTraitDef , resolveOptions } from '../internal';

export interface ICdmAttributeDef extends ICdmObjectRef, ICdmReferencesEntities {
    getExplanation(): string;
    setExplanation(explanation: string): string;
    getName(): string;
    getRelationshipRef(): ICdmRelationshipRef;
    setRelationshipRef(relRef: ICdmRelationshipRef): ICdmRelationshipRef;
    removeTraitDef(resOpt: resolveOptions, ref: ICdmTraitDef): void;
}
