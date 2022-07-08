// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmObject,
    cdmObjectSimple,
    cdmObjectType,
    cdmLogCode,
    Logger,
    resolveOptions,
    StringUtils,
    VisitCallback
} from '../internal';

export class CdmImport extends cdmObjectSimple {
    private TAG: string = CdmImport.name;

    public corpusPath: string;
    public moniker: string;
    /**
     * @internal
     */
    public document: CdmDocumentDefinition;

    /**
     * Used when creating a copy of an import to figure out the new corpus path.
     * @internal
     */
    public previousOwner: CdmObject;

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
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
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
            copy.document = this.document ? this.document.copy(resOpt) as CdmDocumentDefinition : undefined;
            copy.previousOwner = this.owner;

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public fetchObjectDefinitionName(): string {
        return undefined;
    }
    
    public validate(): boolean {
        // let bodyCode = () =>
        {
            if (!this.corpusPath) {
                let missingFields: string[] = ['corpusPath'];
                Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, missingFields.map((s: string) => `'${s}'`).join(', '), this.atCorpusPath);
                return false;
            }

            return true;
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
}
