import { ICdmDataTypeRef , ICdmObjectDef } from '../internal';

export interface ICdmDataTypeDef extends ICdmObjectDef {
    getExtendsDataTypeRef(): ICdmDataTypeRef;
}
