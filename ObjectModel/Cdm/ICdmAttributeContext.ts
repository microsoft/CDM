import { cdmAttributeContextType , ICdmObject, ICdmObjectDef , ICdmObjectRef , resolveOptions } from '../internal';

export interface ICdmAttributeContext extends ICdmObjectDef {
    type: cdmAttributeContextType;
    parent?: ICdmObjectRef;
    definition?: ICdmObjectRef;
    copyNode(resOpt: resolveOptions): ICdmObject;
    getContentRefs(): (ICdmObjectRef | ICdmAttributeContext)[];
}
