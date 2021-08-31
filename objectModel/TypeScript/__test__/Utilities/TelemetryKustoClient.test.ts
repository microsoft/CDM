// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as timeUtils from '../../Utilities/timeUtils';
import {
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmManifestDefinition,
    cdmStatusLevel,
    CdmCorpusDefinition,
    cdmObjectType,
    CdmTypeAttributeDefinition,
    environmentType,
    azureCloudEndpoint,
    StringUtils
} from '../../internal';
import { TelemetryConfig } from '../../Utilities/Logging/TelemetryConfig';
import { TelemetryKustoClient } from '../../Utilities/Logging/TelemetryKustoClient';
import { testHelper } from '../testHelper';


describe('Utilities.TelemetryKustoClient', () => {
    /** Environment variables for Kusto configuration. */
    const tenantId: string = process.env['KUSTO_TENANTID'];
    const clientId: string = process.env['KUSTO_CLIENTID'];
    const secret: string = process.env['KUSTO_SECRET'];
    const clusterName: string = process.env['KUSTO_CLUSTER'];
    const databaseName: string = process.env['KUSTO_DATABASE'];
    const infoTable: string = process.env["KUSTO_INFOTABLE"];
    const warningTable: string = process.env["KUSTO_WARNINGTABLE"];
    const errorTable: string = process.env["KUSTO_ERRORTABLE"];

    /** The path between TestDataPath and TestName. */
    const testsSubpath: string = 'Utilities';

    /** Declare a blackhole callback. */
    const eventCallback = () => { }

    const kustoIt: jest.It = (process.env['KUSTO_RUNTESTS']) ? it : it.skip;

    kustoIt('TestInitializeClientWithDefaultDatabase', async() => {
        const corpus: CdmCorpusDefinition = initializeClientWithDefaultDatabase();
        (corpus.telemetryClient as TelemetryKustoClient).enable();

        await callResolveManifestWithAnEntity(corpus);

        if (!(corpus.telemetryClient as TelemetryKustoClient).checkRequestQueueIsEmpty()) {
            await (corpus.telemetryClient as TelemetryKustoClient).ingestRequestQueue();
        }
    });

    kustoIt('TestInitializeClientWithUserDatabase', async() => {
        const corpus: CdmCorpusDefinition = initializeClientWithUserDatabase();
        (corpus.telemetryClient as TelemetryKustoClient).enable();

        await callResolveManifestWithAnEntity(corpus);

        if (!(corpus.telemetryClient as TelemetryKustoClient).checkRequestQueueIsEmpty()) {
            await (corpus.telemetryClient as TelemetryKustoClient).ingestRequestQueue();
        }
    });

    kustoIt('TestAadAppAuthorizationException', async () => {
        // initialize with some dummy credentials
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        const kustoConfig: TelemetryConfig = new TelemetryConfig(environmentType.DEV, 'West US', false, 'tenantId', 'clientId', 
            'secret', 'clusterName', 'databaseName', azureCloudEndpoint.AzurePublic);

        corpus.telemetryClient = new TelemetryKustoClient(corpus.ctx, kustoConfig);

        try {
            await kustoConfig.getAuthenticationToken();
        } catch (err) {
            expect(`${err}`.includes('There was an error while acquiring Kusto authorization Token with client ID/secret authentication')).toBeTruthy();
        }
    });

    kustoIt('TestMaximumTimeoutAndRetries', async () => {
        const corpus: CdmCorpusDefinition = initializeClientWithDefaultDatabase();

        // set timeout to 1 millisecond so the function will reach max timeout and fail
        (corpus.telemetryClient as TelemetryKustoClient).timeoutMilliseconds = 1;

        const query: string = `.ingest inline into table infoLogs<|\n${timeUtils.getFormattedDateString(new Date())},class name,method name,some message,None,corpus path,correlation id,api correlation id,app id,property`;

        try {
            await (corpus.telemetryClient as TelemetryKustoClient).postKustoQuery(query);
        } catch (err) {
            expect(err).toBe('The number of retries has exceeded the maximum number allowed by the client.');
        }
    });

    function initializeClientWithDefaultDatabase(): CdmCorpusDefinition {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestTelemetryKustoClient');

        expect(StringUtils.isNullOrWhiteSpace(tenantId)).toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(clientId)).toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(secret)).toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(clusterName)).toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(databaseName)).toBe(false);

        const kustoConfig: TelemetryConfig = new TelemetryConfig(environmentType.DEV, 'West US', false, tenantId, clientId, 
            secret, clusterName, databaseName, azureCloudEndpoint.AzurePublic);

        corpus.telemetryClient = new TelemetryKustoClient(corpus.ctx, kustoConfig);
        corpus.appId = 'CDM Integration Test';

        // set callback to receive error, warning and progress logs.
        corpus.setEventCallback(eventCallback, cdmStatusLevel.progress);

        return corpus;
    }

    function initializeClientWithUserDatabase(): CdmCorpusDefinition {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestTelemetryKustoClient');

        expect(StringUtils.isNullOrWhiteSpace(tenantId)).toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(clientId)).toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(secret)).toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(clusterName)).toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(databaseName)).toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(infoTable)).toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(warningTable)).toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(errorTable)).toBe(false);

        const kustoConfig: TelemetryConfig = new TelemetryConfig(environmentType.DEV, 'West US', false, tenantId, clientId, 
            secret, clusterName, databaseName, azureCloudEndpoint.AzurePublic, infoTable, warningTable, errorTable);

        corpus.telemetryClient = new TelemetryKustoClient(corpus.ctx, kustoConfig);

        // set callback to receive error, warning and progress logs.
        corpus.setEventCallback(eventCallback, cdmStatusLevel.progress);

        return corpus;
    }

    async function callResolveManifestWithAnEntity(corpus: CdmCorpusDefinition): Promise<void> {
        let manifest: CdmManifestDefinition = corpus.MakeObject(cdmObjectType.manifestDef, 'dummy');

        corpus.storage.fetchRootFolder('local').documents.push(manifest, "default.manifest.cdm.json");
        let entity1: CdmEntityDefinition = corpus.MakeObject(cdmObjectType.entityDef, 'MyEntity');

        let someAttrib1: CdmTypeAttributeDefinition = corpus.MakeObject(cdmObjectType.typeAttributeDef, 'MyAttribute', false);
        someAttrib1.dataType = corpus.MakeRef(cdmObjectType.dataTypeRef, 'entityId', true);
        entity1.attributes.push(someAttrib1);

        let entity1Doc: CdmDocumentDefinition = corpus.MakeObject(cdmObjectType.documentDef, 'MyEntity.cdm.json');
        entity1Doc.definitions.push(entity1);
        corpus.storage.fetchRootFolder('local').documents.push(entity1Doc);

        manifest.entities.push(entity1);
        await manifest.createResolvedManifestAsync('new dummy', null);
    }
});