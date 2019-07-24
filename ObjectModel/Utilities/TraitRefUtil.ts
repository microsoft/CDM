import {
    ArgumentValue,
    CdmCorpusContext,
    cdmObjectType,
    ICdmObject,
    ICdmTraitDef,
    ICdmTraitRef,
    ResolvedTrait,
    TraitImpl,
    TraitReferenceImpl
} from '../internal';

export function addTraitRef(ctx: CdmCorpusContext, collection: TraitReferenceImpl[], traitDefOrRef: ICdmTraitRef | ICdmTraitDef | string,
                            implicitRef: boolean): ICdmTraitRef {
    // let bodyCode = () =>
    {
        if (traitDefOrRef) {
            let tRef: TraitReferenceImpl;
            if ((traitDefOrRef as ICdmObject).getObjectType && (traitDefOrRef as ICdmObject).getObjectType() === cdmObjectType.traitRef) {
                // already a ref, just store it
                tRef = traitDefOrRef as TraitReferenceImpl;
            } else {
                if (typeof (traitDefOrRef) === 'string') {
                    // all we got is a string, so make a trait ref out of it
                    tRef = new TraitReferenceImpl(ctx, traitDefOrRef, implicitRef, false);
                } else {
                    // must be a trait def, so make a ref
                    tRef = new TraitReferenceImpl(ctx, traitDefOrRef as TraitImpl, false, false);
                }
            }

            collection.push(tRef);

            return tRef;
        }
    }
    // return p.measure(bodyCode);
}

export function getTraitRefName(traitRefOrDef: ICdmTraitRef | ICdmTraitDef | string | ResolvedTrait): string {
    // let bodyCode = () =>
    {
        // lots of things this could be on an unresolved object model, so try them
        if (typeof traitRefOrDef === 'string') {
            return traitRefOrDef;
        }
        if ((traitRefOrDef as ResolvedTrait).trait) { // is this a resolved trait?
            return (traitRefOrDef as ResolvedTrait).traitName;
        }

        const ot: cdmObjectType = (traitRefOrDef as ICdmObject).getObjectType();
        if (ot === cdmObjectType.traitDef) {
            return (traitRefOrDef as ICdmTraitDef).getName();
        }
        if (ot === cdmObjectType.traitRef) {
            return (traitRefOrDef as ICdmTraitDef).getObjectDefName();
        }

        return undefined;
    }
    // return p.measure(bodyCode);
}

export function getTraitRefIndex(collection: (ICdmTraitRef | ResolvedTrait)[],
                                 traitDef: ICdmTraitRef | ICdmTraitDef | string): number {
    // let bodyCode = () =>
    {
        if (!collection) {
            return -1;
        }
        let index: number;
        const traitName: string = getTraitRefName(traitDef);
        index = collection.findIndex((t: TraitReferenceImpl | ResolvedTrait) => {
            return getTraitRefName(t) === traitName;
        });

        return index;
    }
    // return p.measure(bodyCode);
}

export function removeTraitRef(collection: (TraitReferenceImpl)[], traitDef: ICdmTraitRef | ICdmTraitDef | string): void {
    // let bodyCode = () =>
    {
        const index: number = getTraitRefIndex(collection, traitDef);
        if (index >= 0) {
            collection.splice(index, 1);
        }
    }
    // return p.measure(bodyCode);
}

export function getTraitRefArgumentValue(tr: ICdmTraitRef | ResolvedTrait, argName: string): ArgumentValue {
    // let bodyCode = () =>
    {
        if (tr) {
            let av: ArgumentValue;
            if ((tr as ResolvedTrait).parameterValues) {
                av = (tr as ResolvedTrait).parameterValues.getParameterValue(argName).value;
            } else {
                av = (tr as ICdmTraitRef).getArgumentValue(argName);
            }

            return av;
        }
    }
    // return p.measure(bodyCode);
}
