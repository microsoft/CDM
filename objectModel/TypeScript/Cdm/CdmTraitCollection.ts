import { isString } from 'util';
import {
    CdmCollection,
    CdmCorpusContext,
    CdmObject,
    CdmObjectBase,
    cdmObjectType,
    CdmTraitDefinition,
    CdmTraitReference,
    isCdmTraitDefinition,
    isCdmTraitReference
} from '../internal';

export class CdmTraitCollection extends CdmCollection<CdmTraitReference> {
    constructor(ctx: CdmCorpusContext, owner: CdmObject) {
        super(ctx, owner, cdmObjectType.traitRef);
    }

    public push(trait: string | CdmTraitDefinition | CdmTraitReference,
                simpleRef: boolean = false)
                : CdmTraitReference {
        this.clearCache();

        if (typeof trait === 'string') {
            return super.push(trait, simpleRef);
        } else if (isCdmTraitDefinition(trait)) {
            const traitReference: CdmTraitReference = new CdmTraitReference(this.ctx, trait, simpleRef, false);

            return super.push(traitReference);
        } else {
            return super.push(trait);
        }
    }

    public insert(index: number, traitReference: CdmTraitReference): void {
        this.clearCache();
        super.insert(index, traitReference);
    }

    public remove(trait: string | CdmTraitDefinition | CdmTraitReference, onlyFromProperty?: boolean): boolean {
        const index: number = this.indexOf(trait, onlyFromProperty);
        if (index !== -1) {
            this.clearCache();
            this.propagateInDocument(this.allItems[index], undefined);
            this.allItems.splice(index, 1);

            return true;
        }

        return false;
    }

    public concat(traitList: CdmTraitDefinition[] | CdmTraitReference[]): void {
        for (const trait of traitList) {
            this.push(trait);
        }
    }

    public removeAt(index: number): void {
        this.clearCache();
        super.removeAt(index);
    }

    public indexOf(trait: string | CdmTraitDefinition | CdmTraitReference, onlyFromProperty: boolean = false): number {
        let traitName: string;
        let indexOfTraitNotFromProperty: number = -1;
        if (isString(trait)) {
            traitName = trait;
        } else if (isCdmTraitDefinition(trait)) {
            traitName = trait.traitName;
        } else if (isCdmTraitReference(trait)) {
            traitName = trait.fetchObjectDefinitionName();
        }
        for (let index: number = 0; index < this.allItems.length; index++) {
            if (this.corresponds(this.allItems[index], traitName)) {
                if (this.allItems[index].isFromProperty) {
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

    private corresponds(traitReference: CdmTraitReference, name: string) : boolean {
        return traitReference.fetchObjectDefinitionName() === name;
    }

    private clearCache(): void {
        const ownerAsCdmObjectBase: CdmObjectBase = this.owner as CdmObjectBase;
        if (ownerAsCdmObjectBase) {
            ownerAsCdmObjectBase.clearTraitCache();
        }
    }
}
