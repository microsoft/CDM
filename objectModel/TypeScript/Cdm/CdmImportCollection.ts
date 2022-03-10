// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { isArray, isString } from 'util';
import {
    CdmCollection,
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmFolderDefinition,
    CdmImport,
    cdmObjectType
} from '../internal';

export class CdmImportCollection extends CdmCollection<CdmImport> {
constructor(ctx: CdmCorpusContext, owner: CdmDocumentDefinition) {
        super(ctx, owner, cdmObjectType.import);
    }

    public get owner(): CdmDocumentDefinition {
        return super.owner as CdmDocumentDefinition;
    }

    public set owner(value: CdmDocumentDefinition) {
        super.owner = value;
    }

    /**
     * @inheritdoc
     */
    public push(parameter: string | CdmImport, moniker?: string | boolean): CdmImport {
        const obj: CdmImport = super.push(parameter);
        if (moniker !== undefined && isString(moniker)) {
            obj.moniker = moniker;
        }

        return obj;
    }

    public item(corpusPath: string, moniker?: string, checkMoniker: boolean = true): CdmImport {
        return this.allItems.find((x: CdmImport) => checkMoniker ? x.corpusPath === corpusPath && x.moniker === moniker : x.corpusPath === corpusPath);
    }
}
