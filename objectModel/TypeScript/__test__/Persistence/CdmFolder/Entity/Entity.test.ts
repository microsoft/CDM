import {
    CdmCorpusDefinition,
    CdmEntityDefinition,
    cdmStatusLevel,
    CdmTraitReference,
    CdmTypeAttributeDefinition
} from '../../../../internal';
import { LocalAdapter } from '../../../../Storage';
import { testHelper } from '../../../testHelper';

describe('Persistence.CdmFolder.Entity', () => {
    /// <summary>
    /// The path between TestDataPath and TestName.
    /// </summary>
    const testsSubpath: string = 'Persistence/CdmFolder/Entity';

    /**
     * Testing that trait with multiple properties are maintained even when one of the properties is null
     */
    it('TestEntityProperties', async (done) => {
        const corpus: CdmCorpusDefinition = createCorpusForTest('TestEntityProperties');

        const obj: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/entA.cdm.json/Entity A');
        const att: CdmTypeAttributeDefinition = obj.attributes.allItems[0] as CdmTypeAttributeDefinition;
        let result = att.appliedTraits.allItems.find((x: CdmTraitReference) => x.namedReference === 'is.constrained');

        expect(result).not
            .toBeUndefined();
        expect(att.maximumLength)
            .toBe(30);
        expect(att.maximumValue)
            .toBeUndefined();
        expect(att.minimumValue)
            .toBeUndefined();

        // removing the only argument should remove the trait
        att.maximumLength = undefined;
        result = att.appliedTraits.allItems.find((x: CdmTraitReference) => x.namedReference === 'is.constrained');

        expect(att.maximumLength)
            .toBeUndefined();
        expect(result)
            .toBeUndefined();

        done();
    });

    function createCorpusForTest(testName: string): CdmCorpusDefinition {
        const pathOfInput: string = testHelper.getInputFolderPath(testsSubpath, testName);

        const localAdapter: LocalAdapter = new LocalAdapter(testHelper.getInputFolderPath(testsSubpath, testName));
        const cdmCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        cdmCorpus.storage.mount('local', localAdapter);
        cdmCorpus.storage.defaultNamespace = 'local';

        // Set empty callback to avoid breaking tests due too many errors in logs,
        // change the event callback to console or file status report if wanted.
        // tslint:disable-next-line: no-empty
        cdmCorpus.setEventCallback(() => { }, cdmStatusLevel.error);

        return cdmCorpus;
    }
});
