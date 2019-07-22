import {
    ICdmAttributeContext,
    ICdmAttributeGroupRef,
    ICdmEntityAttributeDef,
    ICdmObjectDef,
    ICdmObjectRef,
    ICdmReferencesEntities,
    ICdmTypeAttributeDef,
    ResolvedAttributeSet,
    ResolvedEntity,
    resolveOptions,
    TraitSpec
} from '../internal';

export interface ICdmEntityDef extends ICdmObjectDef, ICdmReferencesEntities {
    attributeContext?: ICdmAttributeContext;
    sourceName: string;
    displayName: string;
    description: string;
    version: string;
    cdmSchemas: string[];
    getExtendsEntityRef(): ICdmObjectRef;
    setExtendsEntityRef(ref: ICdmObjectRef): ICdmObjectRef;
    getHasAttributeDefs(): (ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)[];
    addAttributeDef(attDef: ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef)
        : ICdmAttributeGroupRef | ICdmTypeAttributeDef | ICdmEntityAttributeDef;
    countInheritedAttributes(resOpt: resolveOptions): number;
    getAttributesWithTraits(resOpt: resolveOptions, queryFor: TraitSpec | TraitSpec[]): ResolvedAttributeSet;
    getResolvedEntity(resOpt: resolveOptions): ResolvedEntity;
    createResolvedEntity(resOpt: resolveOptions, newDocName: string): ICdmEntityDef;
}
