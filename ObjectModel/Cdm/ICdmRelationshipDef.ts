import { ICdmObjectDef, ICdmRelationshipRef } from '../internal';

export interface ICdmRelationshipDef extends ICdmObjectDef {
    getExtendsRelationshipRef(): ICdmRelationshipRef;
}
