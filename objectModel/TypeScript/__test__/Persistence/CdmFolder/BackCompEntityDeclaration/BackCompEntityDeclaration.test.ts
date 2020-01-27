import { CdmCorpusDefinition, CdmManifestDefinition, resolveContext } from '../../../../internal';
import { CdmFolder } from '../../../../Persistence';
import { testHelper } from '../../../testHelper';

describe('Persistence.CdmFolder.BackCompEntityDeclaration', () => {
    /// <summary>
    /// The path between TestDataPath and TestName.
    /// </summary>
    const testsSubpath: string = 'Persistence/CdmFolder/BackCompEntityDeclaration';
    it('TestLoadLegacyEntityDeclaration', () => {
        const content: string =
            testHelper.getInputFileContent(testsSubpath, 'TestLoadLegacyEntityDeclaration', 'entities.manifest.cdm.json');
        const cdmManifest: CdmManifestDefinition =
            CdmFolder.ManifestPersistence.fromObject(
                new resolveContext(new CdmCorpusDefinition(), undefined),
                '',
                '',
                '',
                JSON.parse(content)
            );

        // local entity declaration
        expect(cdmManifest.entities.allItems[0].entityPath)
            .toEqual('testPath');

        // referenced entity declaration
        expect(cdmManifest.entities.allItems[1].entityPath)
            .toEqual('Account.cdm.json/Account');
    });
});
