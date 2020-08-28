import {
    AttributeResolutionDirectiveSet,
    CdmCorpusDefinition, 
    CdmEntityDefinition,
    CdmFolderDefinition,
    resolveOptions
} from '../internal';

export const testUtils = {
    /**
     * Resolves an entity
     * @param corpus The corpus
     * @param inputEntity The entity to resolve
     * @param resolutionOptions The resolution options
     * @param addResOptToName Whether to add the resolution options as part of the resolved entity name
     */
    getResolvedEntity: async (corpus: CdmCorpusDefinition, inputEntity: CdmEntityDefinition, resolutionOptions: string[], addResOptToName: boolean = false): Promise<CdmEntityDefinition> => {
        const roHashSet: Set<string> = new Set<string>();
        for (let i: number = 0; i < resolutionOptions.length; i++) {
            roHashSet.add(resolutionOptions[i]);
        }

        let resolvedEntityName: string = '';

        if (addResOptToName) {
            const fileNameSuffix: string = testUtils.getResolutionOptionNameSuffix(resolutionOptions);
            resolvedEntityName = `Resolved_${inputEntity.entityName}${fileNameSuffix}`;
        } else {
            resolvedEntityName = `Resolved_${inputEntity.entityName}`;
        }

        const ro: resolveOptions = new resolveOptions(inputEntity.inDocument, new AttributeResolutionDirectiveSet(roHashSet));

        const resolvedFolder: CdmFolderDefinition = corpus.storage.fetchRootFolder('output');
        const resolvedEntity: CdmEntityDefinition = await inputEntity.createResolvedEntityAsync(resolvedEntityName, ro, resolvedFolder);

        return resolvedEntity;
    },
    /**
     * Returns a suffix that contains the file name and resolution option used
     * @param resolutionOptions The resolution options
     */
    getResolutionOptionNameSuffix(resolutionOptions: string[]): string {
        let fileNamePrefix: string = '';

        for (let i: number = 0; i < resolutionOptions.length; i++) {
            fileNamePrefix = `${fileNamePrefix}_${resolutionOptions[i]}`;
        }

        if (!fileNamePrefix) {
            fileNamePrefix = '_default';
        }

        return fileNamePrefix;
    }
}
