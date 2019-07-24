import {
    ICdmAttributeGroupRef,
    ICdmEntityAttributeDef,
    ICdmObjectDef,
    ICdmObjectRef,
    ICdmReferencesEntities,
    ICdmTypeAttributeDef
} from '../internal';

export interface ICdmAttributeGroupDef extends ICdmObjectDef, ICdmReferencesEntities {
    attributeContext?: ICdmObjectRef;
    getMembersAttributeDefs(): (ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)[];
    addAttributeDef(attDef: ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)
        : ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef;
}
