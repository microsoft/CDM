import { ICdmAttributeDef , ICdmEntityRef } from '../internal';

export interface ICdmEntityAttributeDef extends ICdmAttributeDef {
    getEntityRef(): ICdmEntityRef;
    setEntityRef(entRef: ICdmEntityRef): ICdmEntityRef;
}
