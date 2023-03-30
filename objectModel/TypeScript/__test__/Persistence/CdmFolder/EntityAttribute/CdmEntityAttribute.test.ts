// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition
} from '../../../../internal';
import { EntityAttributePersistence } from '../../../../Persistence/CdmFolder/EntityAttributePersistence';
import { EntityAttribute } from '../../../../Persistence/CdmFolder/types/EntityAttribute';

describe('Persistence.CdmFolder.CdmEntityAttribute', () => {
    /**
     * Tests if calling from and to data maintain the properties description and displayName.
     */
    it('TestDescriptionAndDisplayName', () => {
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        const entityName = 'TheEntity';
        const description: string = 'entityAttributeDescription';
        const displayName: string = 'whatABeutifulDisplayName';
        const inputData: EntityAttribute = {
            'name': entityName,
            'displayName': displayName,
            'description': description,
            'entity': undefined
        };

        const instance = EntityAttributePersistence.fromData(corpus.ctx, inputData);

        expect(instance.description)
            .toEqual(description);
        expect(instance.displayName)
            .toEqual(displayName);

        const data = EntityAttributePersistence.toData(instance, undefined, undefined);

        expect(data.description)
            .toEqual(description);
        expect(data.displayName)
            .toEqual(displayName);

        // Checks if there is no residue of the transformation of the properties into traits.
        expect(data.appliedTraits)
            .toBeUndefined();
    });
});