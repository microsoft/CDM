// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * Unit test for ProjectionResolutionCommonUtil functions
 */
describe('Cdm/Projection/ProjectionResolutionCommonUtilUnitTest', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/TestProjectionResolutionCommonUtil';

    const resOptCombinations: string[][] = [
        [],
        ['referenceOnly'],
        ['normalized'],
        ['structured'],
        ['referenceOnly', 'normalized'],
        ['referenceOnly', 'structured'],
        ['normalized', 'structured'],
        ['referenceOnly', 'normalized', 'structured']
    ];

    it('Test', () => {
        // TODO (sukanyas): Need to add Tests
    });
});
