import { cdmStatusLevel } from '../../../Cdm/cdmStatusLevel';
import {
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmFolderDefinition,
    CdmManifestDefinition,
    cdmObjectType
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';

export function generateManifest(localRootPath: string): CdmManifestDefinition {
    const cdmCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
    cdmCorpus.storage.defaultNamespace = 'local';
    // tslint:disable-next-line: no-empty
    cdmCorpus.setEventCallback(() => { }, cdmStatusLevel.error);
    cdmCorpus.storage.mount('local', new LocalAdapter(localRootPath));

    // add cdm namespace
    cdmCorpus.storage.mount('cdm', new LocalAdapter(localRootPath));

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
