// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { testHelper } from '../../testHelper';
import {
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmFolderDefinition,
    CdmManifestDefinition,
    cdmObjectType
} from '../../../internal';

export function generateManifest(): CdmManifestDefinition {
    const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(null, 'generateManifest', undefined, false, undefined, true);

    const manifest: CdmManifestDefinition = new CdmManifestDefinition(cdmCorpus.ctx, 'manifest');
    manifest.folderPath = '/';
    manifest.namespace = 'local';

    return manifest;
}

export function createDocumentForEntity(
    cdmCorpus: CdmCorpusDefinition,
    entity: CdmEntityDefinition,
    nameSpace?: string
): CdmDocumentDefinition {
    if (!nameSpace) {
        nameSpace = 'local';
    }
    const cdmFolderDef: CdmFolderDefinition = cdmCorpus.storage.fetchRootFolder(nameSpace);
    const entityDoc: CdmDocumentDefinition = cdmCorpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `${entity.entityName}.cdm.json`, false);
    cdmFolderDef.documents.push(entityDoc);
    entityDoc.definitions.push(entity);

    return entityDoc;
}
