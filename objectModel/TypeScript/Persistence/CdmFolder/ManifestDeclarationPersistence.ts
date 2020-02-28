// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmManifestDeclarationDefinition,
    cdmObjectType,
    copyOptions,
    resolveOptions
} from '../../internal';
import * as timeUtils from '../../Utilities/timeUtils';
import {
    ManifestDeclaration
} from './types';

export class ManifestDeclarationPersistence {
    /**
     * Creates an instance from object of folder type.
     * @param ctx The context.
     * @param dataObj The object to read data from.
     * @returns A new CdmManifestDeclarationDefinition instance generated.
     */
    public static fromData(ctx: CdmCorpusContext, dataObj: ManifestDeclaration): CdmManifestDeclarationDefinition {
        const newFolderDec: CdmManifestDeclarationDefinition = ctx.corpus.MakeObject(cdmObjectType.manifestDeclarationDef, dataObj.manifestName);

        newFolderDec.definition = dataObj.definition;
        if (dataObj.lastFileStatusCheckTime) {
            newFolderDec.lastFileStatusCheckTime = new Date(dataObj.lastFileStatusCheckTime);
        }
        if (dataObj.lastFileModifiedTime) {
            newFolderDec.lastFileModifiedTime = new Date(dataObj.lastFileModifiedTime);
        }
        if (dataObj.explanation) {
            newFolderDec.explanation = dataObj.explanation;
        }

        return newFolderDec;
    }

    public static toData(instance: CdmManifestDeclarationDefinition, resOpt: resolveOptions, options: copyOptions): ManifestDeclaration {
        return {
            lastFileStatusCheckTime: timeUtils.getFormattedDateString(instance.lastFileStatusCheckTime),
            lastFileModifiedTime: timeUtils.getFormattedDateString(instance.lastFileModifiedTime),
            explanation: instance.explanation,
            manifestName: instance.manifestName,
            definition: instance.definition
        };
    }
}
