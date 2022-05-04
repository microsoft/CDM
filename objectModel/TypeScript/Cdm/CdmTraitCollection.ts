// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { isString } from 'util';
import {
    CdmCollection,
    CdmCorpusContext,
    CdmObject,
    CdmObjectBase,
    cdmObjectType,
    CdmTraitDefinition,
    CdmTraitGroupDefinition,
    CdmTraitGroupReference,
    CdmTraitReference,
    CdmTraitReferenceBase,
    isCdmTraitDefinition,
    isCdmTraitGroupDefinition,
    isCdmTraitGroupReference,
    isCdmTraitReference
} from '../internal';

/**
 * CdmCollection customized for CdmTraitReferenceBase.
 */
export class CdmTraitCollection extends CdmCollection<CdmTraitReferenceBase> {
    /**
     * Constructs a CdmTraitCollection by using the parent constructor and TraitRef as the default type.
     * @param ctx The context.
     * @param owner The object this collection is a member of.
     */
    constructor(ctx: CdmCorpusContext, owner: CdmObject) {
        super(ctx, owner, cdmObjectType.traitRef);
    }

    public insert(index: number, traitReference: CdmTraitReferenceBase): void {
        this.clearCache();
        super.insert(index, traitReference);
    }

    public push(trait: string | CdmTraitDefinition | CdmTraitGroupDefinition | CdmTraitReferenceBase, simpleRefOrArgs: boolean | [string, any][] = undefined)
                : CdmTraitReferenceBase {
        this.clearCache();

        if (simpleRefOrArgs === undefined || (simpleRefOrArgs !== undefined && typeof simpleRefOrArgs === 'boolean')) {
            let simpleRef: boolean = simpleRefOrArgs !== undefined ? simpleRefOrArgs as boolean : false
            if (typeof trait === 'string') {
                return super.push(trait, simpleRef);
            } else if (isCdmTraitDefinition(trait)) {
                return super.push(new CdmTraitReference(this.ctx, trait, simpleRef, false));
            } else if (isCdmTraitGroupDefinition(trait)) {
                return super.push(new CdmTraitGroupReference(this.ctx, trait, simpleRef));
            } else {
                return super.push(trait);
            }
        } else {
            if (typeof trait === 'string') {
                const traitRef: CdmTraitReference = super.push(trait) as CdmTraitReference;
                if (traitRef === undefined || simpleRefOrArgs === undefined) {
                    return traitRef;
                }
    
                for (const tupleList of simpleRefOrArgs as []) {
                    traitRef.arguments.push(tupleList[0], tupleList[1]);
                }
    
                return traitRef;
            }
            return undefined;
        }
    }

    public remove(trait: string | CdmTraitDefinition | CdmTraitReference | CdmTraitGroupDefinition | CdmTraitGroupReference, onlyFromProperty?: boolean): boolean {
        const index: number = this.indexOf(trait, onlyFromProperty);

        if (index !== -1) {
            this.clearCache();
            this.propagateInDocument(this.allItems[index], undefined);
            this.allItems.splice(index, 1);

            return true;
        }

        return false;
    }

    public concat(traitList: CdmTraitDefinition[] | CdmTraitReference[] | CdmTraitGroupDefinition[] | CdmTraitGroupReference[]): void {
        for (const trait of traitList) {
            this.push(trait);
        }
    }

    public removeAt(index: number): void {
        this.clearCache();
        super.removeAt(index);
    }

    /**
     * Returns a new collection consisting of only the trait reference objects present in this collection.
     * @returns New collection of found trait reference objects
     */
    public toTraitRefs(): CdmCollection<CdmTraitReference> {
        let traitCollection: CdmCollection<CdmTraitReference> = new CdmCollection<CdmTraitReference>(this.ctx, this.owner, cdmObjectType.traitRef);

        traitCollection.concat(this.allItems.filter(x => x instanceof CdmTraitReference) as CdmTraitReference[]);

        return traitCollection;
    }

    /**
     * Returns a new collection consisting of only the trait group reference objects present in this collection.
     * @returns New collection of found trait group reference objects
     */
    public toTraitGroupRefs(): CdmCollection<CdmTraitGroupReference> {
        let traitGroupCollection: CdmCollection<CdmTraitGroupReference> = new CdmCollection<CdmTraitGroupReference>(this.ctx, this.owner, cdmObjectType.traitGroupRef);

        traitGroupCollection.concat(this.allItems.filter(x => x instanceof CdmTraitGroupReference) as CdmTraitGroupReference[]);

        return traitGroupCollection;
    }

    public indexOf(obj: string | CdmTraitDefinition | CdmTraitReference | CdmTraitGroupDefinition | CdmTraitGroupReference, onlyFromProperty: boolean = false): number {
        if (!isString(obj)) {
            return this.indexOf(obj.fetchObjectDefinitionName(), onlyFromProperty);
        }

        let indexOfTraitNotFromProperty: number = -1;

        for (let index: number = 0; index < this.length; index++) {
            if (this.corresponds(this.allItems[index], obj)) {
                if (this.allItems[index] instanceof CdmTraitGroupReference || (this.allItems[index] as CdmTraitReference).isFromProperty) {
                    return index;
                }
                indexOfTraitNotFromProperty = index;
            }
        }

        if (!onlyFromProperty) {
            return indexOfTraitNotFromProperty;
        }

        return -1;
    }

    public clear(): void {
        this.clearCache();
        super.clear();
    }

    private clearCache(): void {
        const ownerAsCdmObjectBase: CdmObjectBase = this.owner as CdmObjectBase;
        if (ownerAsCdmObjectBase) {
            ownerAsCdmObjectBase.clearTraitCache();
        }
    }

    private corresponds(obj: CdmTraitReferenceBase, traitName: string): boolean {
        return obj.fetchObjectDefinitionName() === traitName;
    }
}
