// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmFolderDefinition,
    CdmManifestDefinition,
    CdmTraitReference,
    copyOptions,
    resolveOptions
} from '../../../internal';
import { ModelJson } from '../../../Persistence';
import { LocalEntity, Model } from '../../../Persistence/ModelJson/types';
import { testHelper } from '../../testHelper';

describe('Persistence.ModelJson.ModelJson', () => {

    /**
     * Test path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Persistence/ModelJson/DataPartition';

    it('TestModelJsonDataPartitionLocationConsistency', async () => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestModelJsonDataPartitionLocationConsistency');
        const manifestRead: CdmManifestDefinition =
            await cdmCorpus.fetchObjectAsync('default.manifest.cdm.json', cdmCorpus.storage.fetchRootFolder('local'));
        expect(manifestRead.entities.allItems[0].dataPartitions.allItems[0].location)
            .toEqual('EpisodeOfCare/partition-data.csv');

        const convertedToModelJson: Model = await ModelJson.ManifestPersistence.toData(manifestRead, undefined, undefined);
        const location: string = convertedToModelJson.entities[0]['partitions'][0].location;
        expect(location.indexOf('\\Persistence\\ModelJson\\DataPartition\\TestModelJsonDataPartitionLocationConsistency\\Input\\EpisodeOfCare\\partition-data.csv'))
            .toBeGreaterThan(-1);

        const cdmCorpus2: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestModelJsonDataPartitionLocationConsistency');
        const manifestAfterConvertion: CdmManifestDefinition = await ModelJson.ManifestPersistence.fromObject(
            cdmCorpus2.ctx,
            convertedToModelJson,
            cdmCorpus2.storage.fetchRootFolder('local'));
        expect(manifestAfterConvertion.entities.allItems[0].dataPartitions.allItems[0].location)
            .toEqual('EpisodeOfCare/partition-data.csv');

        const cdmCorpus3: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestModelJsonDataPartitionLocationConsistency');
        const readFile: string =
            testHelper.getInputFileContent(testsSubpath, 'TestModelJsonDataPartitionLocationConsistency', 'model.json');
        const namespaceFolder: CdmFolderDefinition = cdmCorpus3.storage.fetchRootFolder('local');
        let modelJsonAsString: string = readFile;
        modelJsonAsString = modelJsonAsString.replace(/\r\n/g, '\n');
        modelJsonAsString = modelJsonAsString.replace(/\s/g, '');
        modelJsonAsString = modelJsonAsString.replace('C:\\\\cdm\\\\testData\\\\Persistence\\\\ModelJson\\\\DataPartition\\\\TestModelJsonDataPartitionLocationConsistency\\\\Input\\\\EpisodeOfCare\\\\partition-data.csv',
            location.replace(new RegExp('\\\\', 'g'), '\\\\'));
        modelJsonAsString = modelJsonAsString.replace(new RegExp('/', 'g'), '\\\\');

        const manifestReadFromModelJson: CdmManifestDefinition =
            await ModelJson.ManifestPersistence.fromObject(cdmCorpus3.ctx, JSON.parse(modelJsonAsString), namespaceFolder);
        expect(manifestReadFromModelJson.entities.allItems[0].dataPartitions.allItems[0].location)
            .toEqual('EpisodeOfCare/partition-data.csv');
    });

    /**
     * Tests that the trait is.partition.format.CSV is merged with the fileFormatSettings property during load.
     */
    it('testLoadingCsvPartitionTraits', async () => {
        var cdmCorpus = testHelper.getLocalCorpus(testsSubpath, 'TestLoadingCsvPartitionTraits');
        var manifest = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>('model.json');

        var dataPartition = manifest.entities.allItems[0].dataPartitions.allItems[0];

        // Ensure that the fileFormatSettings and the is.partition.format.CSV trait got merged into one trait.
        expect(dataPartition.exhibitsTraits.allItems.length)
            .toEqual(1);

        var csvTrait = dataPartition.exhibitsTraits.allItems[0] as CdmTraitReference;

        expect(csvTrait.arguments.allItems[0].value)
            .toEqual('true');
        expect(csvTrait.arguments.allItems[1].value)
            .toEqual('CsvStyle.QuoteAlways');
        expect(csvTrait.arguments.allItems[2].value)
            .toEqual(',');
        expect(csvTrait.arguments.allItems[3].value)
            .toEqual('QuoteStyle.Csv');
        expect(csvTrait.arguments.allItems[4].value)
            .toEqual('UTF-8');
        expect(csvTrait.arguments.allItems[5].value)
            .toEqual('\n');
    });

    /**
     * Tests that the trait is.partition.format.CSV is merged with the fileFormatSettings property during load.
     * Given that the trait is does not have arguments present on fileFormatSettings.
     */
    it('testLoadingCsvPartitionTraitsFromFileFormatSettings', async () => {
        var cdmCorpus = testHelper.getLocalCorpus(testsSubpath, 'TestLoadingCsvPartitionTraitsFromFileFormatSettings');
        var manifest = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>('model.json');

        var dataPartition = manifest.entities.allItems[0].dataPartitions.allItems[0];

        // Ensure that the fileFormatSettings and the is.partition.format.CSV trait got merged into one trait.
        expect(dataPartition.exhibitsTraits.allItems.length)
            .toEqual(1);

        var csvTrait = dataPartition.exhibitsTraits.allItems[0] as CdmTraitReference;

        expect(csvTrait.arguments.allItems[0].value)
            .toEqual('\n');
        expect(csvTrait.arguments.allItems[1].value)
            .toEqual('false');
        expect(csvTrait.arguments.allItems[2].value)
            .toEqual('CsvStyle.QuoteAfterDelimiter');
        expect(csvTrait.arguments.allItems[3].value)
            .toEqual(';');
        expect(csvTrait.arguments.allItems[4].value)
            .toEqual('QuoteStyle.None');
        expect(csvTrait.arguments.allItems[5].value)
            .toEqual('ASCII');
    });

    /**
     * Tests that the trait is.partition.format.CSV is saved when contains arguments not supported by fileFormatSettings.
     */
    it('testLoadingAndSavingCsvPartitionTraits', async () => {
        var cdmCorpus = testHelper.getLocalCorpus(testsSubpath, 'TestLoadingCsvPartitionTraitsFromFileFormatSettings');
        var manifest = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>('model.json');

        // If the data partition trait is.partition.format.CSV being saved has arguments that are not supported by fileFormatSettings
        // the trait should also be persisted.
        var manifestData = await ModelJson.ManifestPersistence.toData(manifest, new resolveOptions(manifest.inDocument), new copyOptions());
        var localEntity: LocalEntity = manifestData.entities[0] as LocalEntity;
        expect(localEntity.partitions[0]['cdm:traits'].length)
            .toEqual(1);

        // Remove the argument that is not supported by fileFormatSettings and check if the trait is removed after that.
        var csvTrait = manifest.entities.allItems[0].dataPartitions.allItems[0].exhibitsTraits.allItems[0] as CdmTraitReference;
        csvTrait.arguments.remove(csvTrait.arguments.item('newline'));

        manifestData = await ModelJson.ManifestPersistence.toData(manifest, new resolveOptions(manifest.inDocument), new copyOptions());
        localEntity = manifestData.entities[0] as LocalEntity;
        expect(localEntity.partitions[0]['cdm:traits'])
            .toBeUndefined();
    });
});
