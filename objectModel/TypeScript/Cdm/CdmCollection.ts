import {
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmObject,
    cdmObjectType,
    VisitCallback
} from '../internal';

export class CdmCollection<T extends CdmObject> {
    public ctx: CdmCorpusContext;
    public defaultType: cdmObjectType;
    /**
     * @internal
     */
    public allItems: T[];
    protected owner: CdmObject;

    constructor(ctx: CdmCorpusContext, owner: CdmObject, defaultType: cdmObjectType) {
        this.ctx = ctx;
        this.owner = owner;
        this.allItems = [];
        this.defaultType = defaultType;
    }

    public get length(): number {
        return this.allItems.length;
    }

    /**
     * Add an element to CdmCollection.
     * @param obj If this parameter is a string, a new object with this name will be created and added to the collection.
     * This parameter can also be an element to be added to the cdmCollection or a list of elements to be added to the collection.
     * @param simpleRef Parameter only used if function creates a new elementn,
     * and is only used for certain types by the constructor of the object to be added.
     * @returns If an item was created, it returns the newly created item. Otherwise doesn't return anything.
     */
    public push(obj: string | T, simpleRef: boolean = false): T {
        if (typeof obj === 'string' || obj === undefined) {
            const newObj: T = this.ctx.corpus.MakeObject<T>(this.defaultType, obj as string, simpleRef);

            return this.push(newObj);
        } else {
            this.makeDocumentDirty();
            const currObject: T = obj;
            currObject.owner = this.owner;
            this.propagateInDocument(currObject, this.owner.inDocument);
            this.allItems.push(currObject);

            return currObject;
        }
    }

    public insert(index: number, item: T): void {
        item.owner = this.owner;
        this.propagateInDocument(item, this.owner.inDocument);
        this.makeDocumentDirty();
        this.allItems.splice(index, 0, item);
    }

    public concat(list: T[]): void {
        for (const elem of list) {
            this.push(elem);
        }
    }

    public remove(currObject: T): boolean {
        const index: number = this.allItems.indexOf(currObject);
        if (index > -1) {
            this.removeAt(index);

            return true;
        }

        return false;
    }

    public removeAt(index: number): void {
        if (index >= 0 && index < this.length) {
            this.allItems[index].owner = undefined;
            this.propagateInDocument(this.allItems[index], undefined);
            this.makeDocumentDirty();
            this.allItems.splice(index, 1);
        }
    }

    public item(name: string): T {
        return this.allItems.find((x: T) => x.fetchObjectDefinitionName() === name);
    }

    public visitArray(path: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        let result: boolean = false;
        if (this.allItems) {
            const lItem: number = this.allItems.length;
            for (let iItem: number = 0; iItem < lItem; iItem++) {
                const element: CdmObject = this.allItems[iItem];
                if (element) {
                    if (element.visit(path, preChildren, postChildren)) {
                        result = true;
                        break;
                    }
                }
            }
        }

        return result;
    }

    public clear(): void {
        for (const item of this.allItems) {
            item.owner = undefined;
            this.propagateInDocument(item, undefined);
        }
        this.makeDocumentDirty();
        this.allItems = [];
    }

    public [Symbol.iterator](): IterableIterator<T> {
        return this.allItems[Symbol.iterator]();
    }

    protected makeDocumentDirty(): void {
        if (!this.ctx.corpus.isCurrentlyResolving) {
            const document: CdmDocumentDefinition =
                this.owner && this.owner.inDocument ? this.owner.inDocument : this.owner as CdmDocumentDefinition;
            if (document) {
                document.isDirty = true;
                document.needsIndexing = true;
            }
        }
    }

    protected propagateInDocument(cdmObject: CdmObject, document: CdmDocumentDefinition): void {
        if (!this.ctx.corpus.isCurrentlyResolving) {
            this.ctx.corpus.blockDeclaredPathChanges = true;
            cdmObject.visit(
                '',
                (iObject: CdmObject, path: string) => {
                    // If object's document is already the same as the one we're trying to set
                    // then we're assuming that every sub-object is also set to it, so bail out.
                    if (iObject.inDocument === document) {
                        return true;
                    }

                    iObject.inDocument = document;

                    return false;
                },
                undefined);
            this.ctx.corpus.blockDeclaredPathChanges = false;
        }
    }
}
