// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCorpusDefinition, CdmManifestDefinition, cdmObjectType, CdmReferencedEntityDeclarationDefinition, resolveContext } from '../../../../internal';
import { CdmFolder } from '../../../../Persistence';
import { testHelper } from '../../../testHelper';

describe('Persistence.CdmFolder.ReferencedEntityDeclaration', () => {
    /// <summary>
    /// The path between TestDataPath and TestName.
    /// </summary>
    const testsSubpath: string = 'Persistence/CdmFolder/ReferencedEntityDeclaration';

    /**
     * Testing for folder impl instance with referenced entity declaration.
     */
    it('TestLoadReferencedEntity', () => {
        const readFile: string = testHelper.getInputFileContent(testsSubpath, 'TestLoadReferencedEntity', 'entities.manifest.cdm.json');

        const cdmManifest: CdmManifestDefinition = CdmFolder.ManifestPersistence.fromObject(
            new resolveContext(new CdmCorpusDefinition(), undefined), '', '', '', JSON.parse(readFile));
        expect(cdmManifest.entities.length)
            .toBe(1);
        expect(cdmManifest.entities.allItems[0].getObjectType())
            .toBe(cdmObjectType.referencedEntityDeclarationDef);
        const entity: CdmReferencedEntityDeclarationDefinition =
            cdmManifest.entities.allItems[0] as CdmReferencedEntityDeclarationDefinition;
        expect(entity.entityName)
            .toBe('testEntity');
        expect(entity.explanation)
            .toBe('test explanation');
        expect(entity.entityPath)
            .toBe('testPath');
        expect(entity.exhibitsTraits.length)
            .toBe(1);
    });
});
