import * as cdm from "cdm.objectmodel";
import { IExplorerDocument } from "./IExplorerDocument";

export class ExplorerDocument implements IExplorerDocument {
    public get name(): string {
        return this.document.getName();
    }

    constructor(public document: cdm.types.ICdmDocumentDef) {
    }
}