// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Stopwatch } from 'ts-stopwatch';

import { azureCloudEndpoint } from '../../Enums/azureCloudEndpoint';
import { CdmCorpusDefinition, CdmDocumentDefinition, CdmManifestDefinition, cdmStatusLevel } from '../../internal';
import { ADLSAdapter } from '../../Storage';
import { StorageAdapterCacheContext } from '../../Storage/StorageAdapterBase';
import { TokenProvider } from '../../Utilities/Network';
import { adlsTestHelper } from '../adlsTestHelper';
import { testHelper } from '../testHelper';
import { MockADLSAdapter } from './MockADLSAdapter';

class FakeTokenProvider implements TokenProvider {
    public getToken(): string {
        return 'TOKEN';
    }
}

const adlsTest = {
    async runWriteReadTest(adapter: ADLSAdapter): Promise<void> {
        const filename: string = `WriteReadTest/${process.env['USERNAME']}_${process.env['COMPUTERNAME']}_TypeScript.txt`;
        const writeContents: string = `${new Date().toString()}\n${filename}`;
        await adapter.writeAsync(filename, writeContents);
        const readContents: string = await adapter.readAsync(filename);
        expect(writeContents)
            .toEqual(readContents);
    },

    async runCheckFileTimeTests(adapter: ADLSAdapter): Promise<void> {
        const filename: string = `WriteReadTest/${process.env['USERNAME']}_${process.env['COMPUTERNAME']}_TypeScript.txt`;
        const writeContents: string = `${new Date().toString()}\n${filename}`;
        await adapter.writeAsync(filename, writeContents);
        const readContents: string = await adapter.readAsync(filename);
        expect(writeContents)
            .toEqual(readContents);

        const offset1: Date = await adapter.computeLastModifiedTimeAsync('/FileTimeTest/CheckFileTime.txt');
        const offset2: Date = await adapter.computeLastModifiedTimeAsync('FileTimeTest/CheckFileTime.txt');

        expect(offset1)
            .not
            .toBeNull();
        expect(offset2)
            .not
            .toBeNull();
        expect(offset1.getTime() === offset2.getTime())
            .toBe(true);
        expect(offset1 < new Date())
            .toBe(true);
    },

    async runFileEnumTest(adapter: ADLSAdapter): Promise<void> {
        const context: StorageAdapterCacheContext = adapter.createFileQueryCacheContext();
        try {
            const files1: string[] = await adapter.fetchAllFilesAsync('/FileEnumTest/');
            const files2: string[] = await adapter.fetchAllFilesAsync('/FileEnumTest');
            const files3: string[] = await adapter.fetchAllFilesAsync('FileEnumTest/');
            const files4: string[] = await adapter.fetchAllFilesAsync('FileEnumTest');

            // expect 100 files to be enumerated
            expect(files1.length === 100 && files2.length === 100 && files3.length === 100 && files4.length === 100)
                .toBe(true);

            // these calls should be fast due to cache
            const watch: Stopwatch = new Stopwatch();
            watch.start();
            for (let i = 0; i < files1.length; i++) {
                expect(files1[i] === files2[i] && files1[i] === files3[i] && files1[i] === files4[i])
                    .toBe(true);
                await adapter.computeLastModifiedTimeAsync(files1[i]);
            }
            watch.stop();

            expect(watch.getTime())
                .toBeLessThan(100);
        }
        finally {
            context.dispose();
        }
    },

    async runSpecialCharactersTest(adapter: ADLSAdapter): Promise<void> {
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        corpus.storage.mount('adls', adapter);
        corpus.storage.defaultNamespace = 'adls';
        try {
            const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('default.manifest.cdm.json');
            await manifest.fileStatusCheckAsync();

            expect(manifest.entities.length)
                .toBe(1);
            expect(manifest.entities.allItems[0].dataPartitions.length)
                .toBe(2);
            expect(manifest.entities.allItems[0].dataPartitions.allItems[0].location)
                .toBe('TestEntity-With=Special Characters/year=2020/TestEntity-partition-With=Special Characters-0.csv');
            expect(manifest.entities.allItems[0].dataPartitions.allItems[1].location)
                .toBe('TestEntity-With=Special Characters/year=2020/TestEntity-partition-With=Special Characters-1.csv');
        } catch (ex) {
            fail(ex);
        }
    }
};

describe('Cdm.Storage.AdlsAdapter', () => {

    const testSubpath: string = 'Storage';

    const adlsIt: jest.It = (process.env['ADLS_RUNTESTS']) ? it : it.skip;

    /**
     * The tests declared with "adlsIt" will run only if the ADLS environment variables are setup.
     * In order to run and debug these tests via Test Explorer in Visual Studio Code you must
     * temporarily replace "adlsIt" with "it"
     */
    adlsIt('ADLSWriteReadSharedKey', async () => {
        await adlsTest.runWriteReadTest(adlsTestHelper.createAdapterWithSharedKey());
    });

    adlsIt('ADLSWriteReadClientId', async () => {
        await adlsTest.runWriteReadTest(adlsTestHelper.createAdapterWithClientId());
    });

    adlsIt('ADLSWriteReadClientIdWithEndpoint', async () => {
        await adlsTest.runWriteReadTest(adlsTestHelper.createAdapterWithClientId(undefined, true));
    });

    adlsIt('ADLSWriteReadWithBlobHostname', async () => {
        await adlsTest.runWriteReadTest(adlsTestHelper.createAdapterWithSharedKey(undefined, true));
        await adlsTest.runWriteReadTest(adlsTestHelper.createAdapterWithClientId(undefined, false, true));
    });

    adlsIt('ADLSCheckFileTimeSharedKey', async () => {
        await adlsTest.runCheckFileTimeTests(adlsTestHelper.createAdapterWithSharedKey());
    });

    adlsIt('ADLSCheckFileTimeClientId', async () => {
        await adlsTest.runCheckFileTimeTests(adlsTestHelper.createAdapterWithClientId());
    });

    adlsIt('ADLSFileEnumSharedKey', async () => {
        await adlsTest.runFileEnumTest(adlsTestHelper.createAdapterWithSharedKey());
    });

    adlsIt('ADLSFileEnumClientId', async () => {
        await adlsTest.runFileEnumTest(adlsTestHelper.createAdapterWithClientId());
    });

    adlsIt('ADLSSpecialCharactersTest', async () => {
        await adlsTest.runSpecialCharactersTest(adlsTestHelper.createAdapterWithClientId('PathWithSpecialCharactersAndUnescapedStringTest/Root-With=Special Characters:'));
    });

    /**
     * Tests if the adapter won't retry if a HttpStatusCode response with a code in AvoidRetryCodes is received.
     */
    adlsIt('testAvoidRetryCodes', async () => {
        const adlsAdapter = adlsTestHelper.createAdapterWithSharedKey();
        adlsAdapter.numberOfRetries = 3;

        const corpus = new CdmCorpusDefinition();
        corpus.storage.mount('adls', adlsAdapter);
        let count = 0;
        corpus.setEventCallback((status, message) => {
            if (message.indexOf('Response for request ') !== -1) {
                count++;
            }
        }, cdmStatusLevel.progress);

        await corpus.fetchObjectAsync<CdmDocumentDefinition>('adls:/inexistentFile.cdm.json');

        expect(count)
            .toEqual(1);
    });

    /**
     * Checks if the endpoint of the adls adapter is set to default if not present in the config parameters.
     * This is necessary to support old config files that do not include an "endpoint".
     */
    test('TestEndpointMissingOnConfig', () => {
        const config = {
            'hostname': 'hostname.dfs.core.windows.net',
            'root': 'root',
            'tenant': 'tenant',
            'clientId': 'clientId'
        };
        const adlsAdapter = new ADLSAdapter();
        adlsAdapter.updateConfig(JSON.stringify(config));
        expect(adlsAdapter.endpoint)
            .toEqual(azureCloudEndpoint.AzurePublic);
    });

    /**
     * Test if formattedHostname is properly set when loading from config.
     */
    it('TestFormattedHostnameFromConfig', () => {
        const config = {
            'hostname': 'hostname.dfs.core.windows.net',
            'root': 'root',
            'tenant': 'tenant',
            'clientId': 'clientId'
        };
        const adlsAdapter = new ADLSAdapter();
        adlsAdapter.updateConfig(JSON.stringify(config));

        const corpusPath: string = adlsAdapter.createCorpusPath('https://hostname.dfs.core.windows.net/root/partitions/data.csv');
        expect(corpusPath)
            .toEqual('/partitions/data.csv');
    });

    /**
     * Tests to create corpus paths and adapter paths in AdlsAdapter
     */
    it('TestCreateCorpusAndAdapterPathInAdlsAdapter', () => {
        const host1: string = 'storageaccount.dfs.core.windows.net';
        const root: string = '/fs';
        let adlsAdapter: MockADLSAdapter = new MockADLSAdapter(host1, root, 'test');

        const adapterPath1: string = 'https://storageaccount.dfs.core.windows.net/fs/a/1.csv';
        const adapterPath2: string = 'https://storageaccount.dfs.core.windows.net:443/fs/a/2.csv';
        const adapterPath3: string = 'https://storageaccount.blob.core.windows.net/fs/a/3.csv';
        const adapterPath4: string = 'https://storageaccount.blob.core.windows.net:443/fs/a/4.csv';

        const corpusPath1: string = adlsAdapter.createCorpusPath(adapterPath1);
        const corpusPath2: string = adlsAdapter.createCorpusPath(adapterPath2);
        const corpusPath3: string = adlsAdapter.createCorpusPath(adapterPath3);
        const corpusPath4: string = adlsAdapter.createCorpusPath(adapterPath4);

        expect(corpusPath1)
            .toBe('/a/1.csv');
        expect(corpusPath2)
            .toBe('/a/2.csv');
        expect(corpusPath3)
            .toBe('/a/3.csv');
        expect(corpusPath4)
            .toBe('/a/4.csv');

        expect(adlsAdapter.createAdapterPath(corpusPath1))
            .toBe(adapterPath1);
        expect(adlsAdapter.createAdapterPath(corpusPath2))
            .toBe(adapterPath2);
        expect(adlsAdapter.createAdapterPath(corpusPath3))
            .toBe(adapterPath3);
        expect(adlsAdapter.createAdapterPath(corpusPath4))
            .toBe(adapterPath4);

        // Check that an adapter path is correctly created from a corpus path with any namespace
        const corpusPathWithNamespace1: string = 'adls:/test.json';
        const corpusPathWithNamespace2: string = 'mylake:/test.json';
        const expectedAdapterPath: string = 'https://storageaccount.dfs.core.windows.net/fs/test.json';

        expect(adlsAdapter.createAdapterPath(corpusPathWithNamespace1))
            .toBe(expectedAdapterPath);
        expect(adlsAdapter.createAdapterPath(corpusPathWithNamespace2))
            .toBe(expectedAdapterPath);

        // Check that an adapter path is correctly created from a corpus path with colons
        const corpusPathWithColons: string = 'namespace:/a/path:with:colons/some-file.json';
        expect(adlsAdapter.createAdapterPath(corpusPathWithColons))
            .toBe('https://storageaccount.dfs.core.windows.net/fs/a/path%3Awith%3Acolons/some-file.json');
        expect(adlsAdapter.createCorpusPath('https://storageaccount.dfs.core.windows.net/fs/a/path%3Awith%3Acolons/some-file.json'))
            .toBe('/a/path:with:colons/some-file.json');
        expect(adlsAdapter.createCorpusPath('https://storageaccount.dfs.core.windows.net/fs/a/path%3awith%3acolons/some-file.json'))
            .toBe('/a/path:with:colons/some-file.json');

        // Check other special characters
        expect(adlsAdapter.createAdapterPath('namespace:/a/path with=special=characters/some-file.json'))
            .toBe('https://storageaccount.dfs.core.windows.net/fs/a/path%20with%3Dspecial%3Dcharacters/some-file.json');
        expect(adlsAdapter.createCorpusPath('https://storageaccount.dfs.core.windows.net/fs/a/path%20with%3dspecial%3dcharacters/some-file.json'))
            .toBe('/a/path with=special=characters/some-file.json');
        expect(adlsAdapter.createCorpusPath('https://storageaccount.dfs.core.windows.net/fs/a/path%20with%3dspecial%3Dcharacters/some-file.json'))
            .toBe('/a/path with=special=characters/some-file.json');

        // Check that an adapter path is null if the corpus path provided is null
        expect(adlsAdapter.createAdapterPath(undefined))
            .toBeUndefined();

        const host2: string = 'storageaccount.blob.core.windows.net:8888';
        adlsAdapter = new MockADLSAdapter(host2, root, 'test');

        const adapterPath5: string = 'https://storageaccount.blob.core.windows.net:8888/fs/a/5.csv';
        const adapterPath6: string = 'https://storageaccount.dfs.core.windows.net:8888/fs/a/6.csv';
        const adapterPath7: string = 'https://storageaccount.blob.core.windows.net/fs/a/7.csv';

        expect(adlsAdapter.createCorpusPath(adapterPath5))
            .toBe('/a/5.csv');
        expect(adlsAdapter.createCorpusPath(adapterPath6))
            .toBe('/a/6.csv');
        expect(adlsAdapter.createCorpusPath(adapterPath7))
            .toBeUndefined();
    });

    /**
     * The secret property is not saved to the config.json file for security reasons.
     * When constructing and ADLS adapter from config, the user should be able to set the secret after the adapter is constructed.
     */
    it('TestConfigAndUpdateConfigWithoutSecret', () => {
        const config = {
            root: 'root',
            hostname: 'hostname',
            tenant: 'tenant',
            clientId: 'clientId'
        };

        try {
            const adlsAdapter1: MockADLSAdapter = new MockADLSAdapter();
            adlsAdapter1.updateConfig(JSON.stringify(config));
            adlsAdapter1.clientId = 'clientId2'
            adlsAdapter1.secret = 'secret';
            adlsAdapter1.sharedKey = 'sharedKey';
            adlsAdapter1.tokenProvider = new FakeTokenProvider();
        } catch {
            fail('adlsAdapter initialized without secret shouldn\'t throw exception when updating config.')
        }

        try {
            const adlsAdapter2: MockADLSAdapter = new MockADLSAdapter();
            adlsAdapter2.clientId = 'clientId2'
            adlsAdapter2.secret = 'secret';
            adlsAdapter2.sharedKey = 'sharedKey';
            adlsAdapter2.tokenProvider = new FakeTokenProvider();
            adlsAdapter2.updateConfig(JSON.stringify(config));
        } catch {
            fail('adlsAdapter initialized without secret shouldn\'t throw exception when updating config.')
        }
    });

    /**
     * Tests to initialize hostname and root in AdlsAdapter
     */
    it('TestInitializeHostnameAndRoot', () => {
        const host1: string = 'storageaccount.dfs.core.windows.net';
        const adlsAdapter1: MockADLSAdapter = new MockADLSAdapter(host1, 'root-without-slash', 'test');
        expect(adlsAdapter1.hostname)
            .toBe('storageaccount.dfs.core.windows.net');
        expect(adlsAdapter1.root)
            .toBe('/root-without-slash');

        const adapterPath1: string = 'https://storageaccount.dfs.core.windows.net/root-without-slash/a/1.csv';
        const corpusPath1: string = adlsAdapter1.createCorpusPath(adapterPath1);
        expect(corpusPath1)
            .toBe('/a/1.csv');
        expect(adlsAdapter1.createAdapterPath(corpusPath1))
            .toBe(adapterPath1);

        const adlsAdapter1WithFolders: MockADLSAdapter = new MockADLSAdapter(host1, 'root-without-slash/folder1/folder2', 'test');
        expect(adlsAdapter1WithFolders.root)
            .toBe('/root-without-slash/folder1/folder2');

        const adapterPath2: string = 'https://storageaccount.dfs.core.windows.net/root-without-slash/folder1/folder2/a/1.csv';
        const corpusPath2: string = adlsAdapter1WithFolders.createCorpusPath(adapterPath2);
        expect(corpusPath2)
            .toBe('/a/1.csv');
        expect(adlsAdapter1WithFolders.createAdapterPath(corpusPath2))
            .toBe(adapterPath2);

        const adlsAdapter2: MockADLSAdapter = new MockADLSAdapter(host1, '/root-starts-with-slash', 'test');
        expect(adlsAdapter2.root)
            .toBe('/root-starts-with-slash');
        const adlsAdapter2WithFolders: MockADLSAdapter = new MockADLSAdapter(host1, '/root-starts-with-slash/folder1/folder2', 'test');
        expect(adlsAdapter2WithFolders.root)
            .toBe('/root-starts-with-slash/folder1/folder2');

        const adlsAdapter3: MockADLSAdapter = new MockADLSAdapter(host1, 'root-ends-with-slash/', 'test');
        expect(adlsAdapter3.root)
            .toBe('/root-ends-with-slash');
        const adlsAdapter3WithFolders: MockADLSAdapter = new MockADLSAdapter(host1, 'root-ends-with-slash/folder1/folder2/', 'test');
        expect(adlsAdapter3WithFolders.root)
            .toBe('/root-ends-with-slash/folder1/folder2');

        const adlsAdapter4: MockADLSAdapter = new MockADLSAdapter(host1, '/root-with-slashes/', 'test');
        expect(adlsAdapter4.root)
            .toBe('/root-with-slashes');
        const adlsAdapter4WithFolders: MockADLSAdapter = new MockADLSAdapter(host1, '/root-with-slashes/folder1/folder2/', 'test');
        expect(adlsAdapter4WithFolders.root)
            .toBe('/root-with-slashes/folder1/folder2');

        // Mount from config
        const config: string = testHelper.getInputFileContent(testSubpath, 'TestInitializeHostnameAndRoot', 'config.json');
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        corpus.storage.mountFromConfig(config);
        expect((corpus.storage.fetchAdapter('adlsadapter1') as ADLSAdapter).root)
            .toBe('/root-without-slash');
        expect((corpus.storage.fetchAdapter('adlsadapter2') as ADLSAdapter).root)
            .toBe('/root-without-slash/folder1/folder2');
        expect((corpus.storage.fetchAdapter('adlsadapter3') as ADLSAdapter).root)
            .toBe('/root-starts-with-slash/folder1/folder2');
        expect((corpus.storage.fetchAdapter('adlsadapter4') as ADLSAdapter).root)
            .toBe('/root-ends-with-slash/folder1/folder2');
        expect((corpus.storage.fetchAdapter('adlsadapter5') as ADLSAdapter).root)
            .toBe('/root-with-slashes/folder1/folder2');
    });

    /**
     * Test azure cloud endpoint in config.
     */
    it('TestLoadingAndSavingEndpointInConfig', () => {
        // Mount from config
        const config: string = testHelper.getInputFileContent(testSubpath, 'TestLoadingAndSavingEndpointInConfig', 'config.json');
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        corpus.storage.mountFromConfig(config);
        expect((corpus.storage.fetchAdapter('adlsadapter1') as ADLSAdapter).endpoint)
            .toBeUndefined;
        expect((corpus.storage.fetchAdapter('adlsadapter2') as ADLSAdapter).endpoint)
            .toBe(azureCloudEndpoint.AzurePublic);
        expect((corpus.storage.fetchAdapter('adlsadapter3') as ADLSAdapter).endpoint)
            .toBe(azureCloudEndpoint.AzureChina);
        expect((corpus.storage.fetchAdapter('adlsadapter4') as ADLSAdapter).endpoint)
            .toBe(azureCloudEndpoint.AzureGermany);
        expect((corpus.storage.fetchAdapter('adlsadapter5') as ADLSAdapter).endpoint)
            .toBe(azureCloudEndpoint.AzureUsGovernment);

        try {
            const configSnakeCase: string = testHelper.getInputFileContent(testSubpath, 'TestLoadingAndSavingEndpointInConfig', 'config-SnakeCase.json');
            const corpusSnakeCase: CdmCorpusDefinition = new CdmCorpusDefinition();
            corpusSnakeCase.storage.mountFromConfig(configSnakeCase);
            fail('Expected RuntimeException for config.json using endpoint value in snake case.')
        } catch(ex) {
            const message: string = "Endpoint value should be a string of an enumeration value from the class AzureCloudEndpoint in Pascal case.";
            expect(ex.message)
                .toBe(message);
        }
    });
});
