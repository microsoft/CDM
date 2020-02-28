// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmObject,
    cdmObjectType,
    CdmTraitCollection,
    CdmTraitDefinition,
    CdmTraitReference,
    ResolvedTrait
} from '../internal';

export function addTraitRef(
    ctx: CdmCorpusContext,
    collection: CdmTraitCollection,
    traitDefOrRef: CdmTraitReference | CdmTraitDefinition | string,
    implicitRef: boolean): CdmTraitReference {
    // let bodyCode = () =>
    {
        if (traitDefOrRef) {
            let tRef: CdmTraitReference;
            if ((traitDefOrRef as CdmObject).getObjectType && (traitDefOrRef as CdmObject).getObjectType() === cdmObjectType.traitRef) {
                // already a ref, just store it
                tRef = traitDefOrRef as CdmTraitReference;
            } else {
                if (typeof (traitDefOrRef) === 'string') {
                    // all we got is a string, so make a trait ref out of it
                    tRef = new CdmTraitReference(ctx, traitDefOrRef, implicitRef, false);
                } else {
                    // must be a trait def, so make a ref
                    tRef = new CdmTraitReference(ctx, traitDefOrRef as CdmTraitDefinition, false, false);
                }
            }

            collection.push(tRef);

            return tRef;
        }
    }
    // return p.measure(bodyCode);
}

export function fetchTraitRefName(traitRefOrDef: CdmTraitReference | CdmTraitDefinition | string | ResolvedTrait): string {
    // let bodyCode = () =>
    {
        // lots of things this could be on an unresolved object model, so try them
        if (typeof traitRefOrDef === 'string') {
            return traitRefOrDef;
        }
        if ((traitRefOrDef as ResolvedTrait).trait) { // is this a resolved trait?
            return (traitRefOrDef as ResolvedTrait).traitName;
        }

        const ot: cdmObjectType = (traitRefOrDef as CdmObject).getObjectType();
        if (ot === cdmObjectType.traitDef) {
            return (traitRefOrDef as CdmTraitDefinition).getName();
        }
        if (ot === cdmObjectType.traitRef) {
            return (traitRefOrDef as CdmTraitDefinition).fetchObjectDefinitionName();
        }

        return undefined;
    }
    // return p.measure(bodyCode);
}

export function fetchTraitReferenceIndex(
    collection: CdmTraitCollection,
    traitDef: CdmTraitReference | CdmTraitDefinition | string,
    onlyFromProperty: boolean = false): number {
    // let bodyCode = () =>
    {
        if (!collection) {
            return -1;
        }
        const traitName: string = fetchTraitRefName(traitDef);

        let traitIndex: number = -1;
        for (let index: number = 0; index < collection.length; index++) {
            const t: CdmTraitReference = collection.allItems[index];
            if (fetchTraitRefName(t) === traitName) {
                // found a trait that satisfies the name, but continue checking for a trait from property.
                traitIndex = index;
                if ('isFromProperty' in t ? t.isFromProperty : true) {
                    return index;
                }
            }
        }

        // if it got here it means that the trait from property wasn't found.
        return onlyFromProperty ? -1 : traitIndex;
    }
    // return p.measure(bodyCode);
}

export function removeTraitRef(
    collection: CdmTraitCollection,
    traitDef: CdmTraitReference | CdmTraitDefinition | string,
    onlyFromProperty?: boolean): void {
    // let bodyCode = () =>
    {
        const index: number = fetchTraitReferenceIndex(collection, traitDef, onlyFromProperty);
        if (index >= 0) {
            collection.allItems.splice(index, 1);
        }
    }
    // return p.measure(bodyCode);
}
