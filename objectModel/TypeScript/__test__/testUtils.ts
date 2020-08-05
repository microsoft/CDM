import {
    AttributeResolutionDirectiveSet,
    CdmCorpusDefinition, 
    CdmEntityDefinition,
    CdmFolderDefinition,
    resolveOptions
} from '../internal';

export const testUtils = {
    /**
     * A function to resolve an entity
     */
    getResolvedEntity: async (corpus: CdmCorpusDefinition, inputEntity: CdmEntityDefinition, resolutionOptions: string[]): Promise<CdmEntityDefinition> => {
        const roHashSet: Set<string> = new Set<string>();
        for (let i: number = 0; i < resolutionOptions.length; i++) {
            roHashSet.add(resolutionOptions[i]);
        }

        const resolvedEntityName: string = `Resolved_${inputEntity.entityName}`;
        const ro: resolveOptions = new resolveOptions(inputEntity.inDocument, new AttributeResolutionDirectiveSet(roHashSet));

        const resolvedFolder: CdmFolderDefinition = corpus.storage.fetchRootFolder('output');
        const resolvedEntity: CdmEntityDefinition = await inputEntity.createResolvedEntityAsync(resolvedEntityName, ro, resolvedFolder);

        return resolvedEntity;
    }
}