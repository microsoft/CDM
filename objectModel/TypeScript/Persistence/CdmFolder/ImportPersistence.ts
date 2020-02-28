// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmImport,
    cdmObjectType,
    copyOptions,
    resolveOptions
} from '../../internal';
import { Import } from './types';

export class ImportPersistence {
    public static fromData(ctx: CdmCorpusContext, object: Import): CdmImport {
        const imp: CdmImport = ctx.corpus.MakeObject(cdmObjectType.import);
        let corpusPath: string = object.corpusPath;
        if (!corpusPath) {
            corpusPath = object.uri;
        }

        imp.corpusPath = corpusPath;
        imp.moniker = object.moniker;

        return imp;
    }
    public static toData(instance: CdmImport, resOpt: resolveOptions, options: copyOptions): Import {
        const result : Import = {
            corpusPath: instance.corpusPath
        };

        if (instance.moniker) {
            result.moniker = instance.moniker;
        }

        return result;
    }
}
