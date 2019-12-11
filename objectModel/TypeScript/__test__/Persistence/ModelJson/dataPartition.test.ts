import {
    CdmCorpusDefinition,
    CdmFolderDefinition,
    CdmManifestDefinition
} from '../../../internal';
import * as modelJsonPersistence from '../../../Persistence/ModelJson';
import { Model } from '../../../Persistence/ModelJson/types';
import { testHelper } from '../../testHelper';

describe('Persistence.ModelJson.ModelJson', () => {

    /**
     * Test path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Persistence/ModelJson/DataPartition';

    it('TestModelJsonDataPartitionLocationConsistency', async () => {
        const inputPath : string = testHelper.getInputFolderPath(testsSubpath, 'TestModelJsonDataPartitionLocationConsistency');
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(inputPath);
        const manifestRead : CdmManifestDefinition =
            await cdmCorpus.fetchObjectAsync('default.manifest.cdm.json', cdmCorpus.storage.fetchRootFolder('local'));
        expect(manifestRead.entities.allItems[0].dataPartitions.allItems[0].location)
            .toEqual('EpisodeOfCare/partition-data.csv');

        const convertedToModelJson: Model = await modelJsonPersistence.ManifestPersistence.toData(manifestRead, undefined, undefined);
        const location: string = convertedToModelJson.entities[0]['partitions'][0].location;
        expect(location.indexOf('\\Persistence\\ModelJson\\DataPartition\\TestModelJsonDataPartitionLocationConsistency\\Input\\EpisodeOfCare\\partition-data.csv'))
            .toBeGreaterThan(-1);

        const cdmCorpus2: CdmCorpusDefinition = testHelper.getLocalCorpus(inputPath);
        const manifestAfterConvertion: CdmManifestDefinition = await modelJsonPersistence.ManifestPersistence.fromData(
            cdmCorpus2.ctx,
            convertedToModelJson,
            cdmCorpus2.storage.fetchRootFolder('local'));
        expect(manifestAfterConvertion.entities.allItems[0].dataPartitions.allItems[0].location)
            .toEqual('EpisodeOfCare/partition-data.csv');

        const cdmCorpus3: CdmCorpusDefinition = testHelper.getLocalCorpus(inputPath);
        const readFile: string =
            testHelper.getInputFileContent(testsSubpath, 'TestModelJsonDataPartitionLocationConsistency', 'model.json');
        const namespaceFolder: CdmFolderDefinition = cdmCorpus3.storage.fetchRootFolder('local');
        let modelJsonAsString: string = readFile.replace('C:\\\\cdm\\\\CDM.ObjectModel.CSharp\\\\Microsoft.CommonDataModel\\\\Microsoft.CommonDataModel.ObjectModel.Tests\\\\TestData\\\\Persistence\\\\ModelJson\\\\DataPartition\\\\TestModelJsonDataPartitionLocationConsistency\\\\Input\\\\EpisodeOfCare\\\\partition-data.csv',
                                                         location.replace(new RegExp('\\\\', 'g'), '\\\\'));
        modelJsonAsString = modelJsonAsString.replace(/\r\n/g, '\n');
        modelJsonAsString = modelJsonAsString.replace(/\s/g, '');
        modelJsonAsString = modelJsonAsString.replace(new RegExp('/', 'g'), '\\\\');

        const manifestReadFromModelJson: CdmManifestDefinition =
            await modelJsonPersistence.ManifestPersistence.fromData(cdmCorpus3.ctx, JSON.parse(modelJsonAsString), namespaceFolder);
        expect(manifestReadFromModelJson.entities.allItems[0].dataPartitions.allItems[0].location)
            .toEqual('EpisodeOfCare/partition-data.csv');
    });
});
