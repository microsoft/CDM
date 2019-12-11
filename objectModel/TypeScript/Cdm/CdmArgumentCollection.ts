import { isArray, isString } from 'util';
import {
    CdmArgumentDefinition,
    CdmCollection,
    CdmCorpusContext,
    cdmObjectType,
    CdmTraitReference
} from '../internal';

// tslint:disable: no-any
// tslint:disable: no-unsafe-any
export class CdmArgumentCollection extends CdmCollection<CdmArgumentDefinition> {
    protected get owner(): CdmTraitReference {
        return super.owner as CdmTraitReference;
    }

    protected set owner(value: CdmTraitReference) {
        super.owner = value;
    }

    constructor(ctx: CdmCorpusContext, owner: CdmTraitReference) {
        super(ctx, owner, cdmObjectType.argumentDef);
    }

    public push(arg: string | CdmArgumentDefinition | undefined, value?: any)
        : CdmArgumentDefinition {
        this.owner.resolvedArguments = false;
        const argument: CdmArgumentDefinition = super.push(arg);
        if (value !== undefined) {
            argument.value = value;
        }

        return argument;
    }

    public insert (index: number, arg: CdmArgumentDefinition): void {
        this.owner.resolvedArguments = false;
        super.insert(index, arg);
    }

    public fetchValue(name: string): any {
        for (const argument of this.allItems) {
            if (argument.name === name) {
                return argument.value;
            }
        }

        // special case with only one argument and no name give, make a big assumption that this is the one they want
        // right way is to look up parameter def and check name, but this public interface is for working on an unresolved def
        if (this.allItems.length === 1 && this.allItems[0].name === undefined) {
            return this.allItems[0].value;
        }

        return undefined;
    }

    public updateArgument(name: string, value: any): void {
        this.makeDocumentDirty();
        for (const argument of this.allItems) {
            if (argument.name === name) {
                argument.value = value;

                return;
            }
        }
        this.push(name, value);
    }
}
