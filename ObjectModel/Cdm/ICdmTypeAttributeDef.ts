import { ICdmAttributeDef, ICdmDataTypeRef, ICdmObjectRef } from '../internal';

export interface ICdmTypeAttributeDef extends ICdmAttributeDef {
    attributeContext?: ICdmObjectRef;
    isPrimaryKey: boolean;
    isReadOnly: boolean;
    isNullable: boolean;
    dataFormat: string;
    sourceName: string;
    sourceOrdering: number;
    displayName: string;
    description: string;
    maximumValue: string;
    minimumValue: string;
    maximumLength: number;
    valueConstrainedToList: boolean;
    defaultValue: any;
    getDataTypeRef(): ICdmDataTypeRef;
    setDataTypeRef(dataType: ICdmDataTypeRef): ICdmDataTypeRef;
}
