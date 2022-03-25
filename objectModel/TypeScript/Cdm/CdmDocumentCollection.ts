// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { isBoolean, isString } from 'util';
import {
    CdmCollection,
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmFolderDefinition,
    cdmObjectType,
    Logger,
    cdmLogCode
} from '../internal';

export class CdmDocumentCollection extends CdmCollection<CdmDocumentDefinition> {
    private TAG: string = CdmDocumentCollection.name;

    constructor(ctx: CdmCorpusContext, owner: CdmFolderDefinition) {
        super(ctx, owner, cdmObjectType.documentDef);
    }

    protected get owner(): CdmFolderDefinition {
        return super.owner as CdmFolderDefinition;
    }

    protected set owner(value: CdmFolderDefinition) {
        super.owner = value;
    }

    /**
     * @inheritdoc
     */
    public push(documentOrName: string | CdmDocumentDefinition, documentNameOrSimpleRef?: string | boolean)
        : CdmDocumentDefinition {
        let document: CdmDocumentDefinition;
        if (documentOrName !== undefined && isString(documentOrName)) {
            const simpleRef: boolean = isBoolean(documentNameOrSimpleRef) ? documentNameOrSimpleRef : false;
            document = this.ctx.corpus.MakeObject<CdmDocumentDefinition>(this.defaultType, documentOrName, simpleRef);
        } else if (documentOrName instanceof CdmDocumentDefinition) {
            document = documentOrName;
        }

        if (document) {
            if (documentNameOrSimpleRef !== undefined && isString(documentNameOrSimpleRef)) {
                document.name = documentNameOrSimpleRef;
            }

            if (!this.checkAndAddItemModifications(document)) {
                return undefined;
            }

            // why is this collection unlike all other collections?
            // because documents are in folders. folders are not in documents.
            document.owner = this.owner;
            this.allItems.push(document);

            return document;
        }
    }

    public insert(index: number, docDef: CdmDocumentDefinition): void {
        if (!this.checkAndAddItemModifications(docDef)) {
            return;
        }

        // why is this collection unlike all other collections?
        // because documents are in folders. folders are not in documents.
        docDef.owner = this.owner;
        const l: number = this.length;
        for (let i: number = l; i > index; i = i - 1) {
            this.allItems[i] = this.allItems[i - 1];
        }
        this.allItems[index] = docDef;
    }

    public remove(object: string | CdmDocumentDefinition): boolean {
        if (isString(object)) {
            if (this.owner.documentLookup.has(object)) {
                this.removeItemModifications(object);
                const index: number = this.allItems.findIndex((elem: CdmDocumentDefinition) => elem.name === object);
                // setting this currentlyResolving flag will keep the base collection code from setting the inDocument to null
                // this makes sense because a document is "in" itself. always.
                const bSave: boolean = this.ctx.corpus.isCurrentlyResolving;
                this.ctx.corpus.isCurrentlyResolving = true;
                super.removeAt(index);
                this.ctx.corpus.isCurrentlyResolving = bSave;

                return true;
            }

            return false;
        } else {
            return this.remove(object.name);
        }
    }

    public removeAt(index: number): void {
        if (index >= 0 && index < this.length) {
            this.remove(this.allItems[index].name);
        }
    }

    public clear(): void {
        this.allItems.forEach((document: CdmDocumentDefinition) => {
            this.removeItemModifications(document.name);
        });
        super.clear();
    }

    private checkAndAddItemModifications(document: CdmDocumentDefinition): boolean {
        if (this.item(document.name) !== undefined) {
            Logger.error(this.ctx, this.TAG, "checkAndAddItemModifications", document.atCorpusPath, cdmLogCode.ErrDocAlreadyExist, document.name,
            this.owner.atCorpusPath != undefined ? this.owner.atCorpusPath : this.owner.name);
            return false;
        }

        if (document.owner !== undefined && document.owner !== this.owner) {
            // this is fun! the document is moving from one folder to another
            // it must be removed from the old folder for sure, but also now
            // there will be a problem with any corpus paths that are relative to that old folder location.
            // so, whip through the document and change any corpus paths to be relative to this folder
            document.localizeCorpusPaths(this.owner); // returns false if it fails, but ... who cares? we tried
            (document.owner as CdmFolderDefinition).documents.remove(document.name);
        }
        document.folderPath = this.owner.folderPath;
        document.owner = this.owner;
        document.namespace = this.owner.namespace;
        this.makeDocumentDirty(); // set the document to dirty so it will get saved in the new folder location if saved
        this.owner.corpus.addDocumentObjects(this.owner, document);

        return true;
    }

    private removeItemModifications(documentName: string): void {
        this.owner.corpus.removeDocumentObjects(this.owner, this.owner.documentLookup.get(documentName));
        this.owner.documentLookup.delete(documentName);
    }
}
