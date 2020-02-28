// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmObject,
    cdmObjectSimple,
    cdmObjectType,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmImport extends cdmObjectSimple {
    public corpusPath: string;
    public moniker: string;
    /**
     * @internal
     */
    public doc: CdmDocumentDefinition;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.import;
    }

    constructor(ctx: CdmCorpusContext, corpusPath: string, moniker: string) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.corpusPath = corpusPath;
            this.moniker = moniker ? moniker : undefined;
            this.objectType = cdmObjectType.import;
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.import;
        }
        // return p.measure(bodyCode);
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmImport {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            let copy: CdmImport;
            if (!host) {
                copy = new CdmImport(this.ctx, this.corpusPath, this.moniker);
            } else {
                copy = host as CdmImport;
                copy.ctx = this.ctx;
                copy.corpusPath = this.corpusPath;
                copy.moniker = this.moniker;
            }
            copy.doc = this.doc;

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public validate(): boolean {
        // let bodyCode = () =>
        {
            return this.corpusPath ? true : false;
        }
        // return p.measure(bodyCode);
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            // not much to do
            if (preChildren && preChildren(this, pathFrom)) {
                return false;
            }
            if (postChildren && postChildren(this, pathFrom)) {
                return true;
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public get resolvedDocument(): CdmDocumentDefinition {
        return this.doc;
    }
}
