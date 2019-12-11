import { CdmCorpusDefinition, CdmManifestDefinition, resolveContext } from '../../../../internal';

/**
 * Typescript only test. It's C# equivalent would not pass.
 * Testing for non crash on undefined.
 */
it('instancefromdata does not crash for undefined input.', () => {
    const manifestClass: CdmManifestDefinition = CdmManifestDefinition.instanceFromData(
        new resolveContext(new CdmCorpusDefinition(), undefined),
        undefined);
    expect(!manifestClass);
});
