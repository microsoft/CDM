import { cdmStatusLevel } from '../../../Cdm/cdmStatusLevel';
import {
    CdmCorpusDefinition,
    CdmManifestDefinition
 } from '../../../internal';
import { LocalAdapter } from '../../../StorageAdapter';

// tslint:disable-next-line: export-name
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
