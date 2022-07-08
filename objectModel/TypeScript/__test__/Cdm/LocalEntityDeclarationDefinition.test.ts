// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmLocalEntityDeclarationDefinition,
    CdmDataPartitionDefinition,
    CdmDataPartitionPatternDefinition
} from '../../internal';
import { testHelper } from '../testHelper';

describe('Cdm/LocalEntityDeclarationDefinitionTests', () => {
    /**
     * Tests if the copy function creates copies of the sub objects
     */
    it('testLocalEntityDeclarationDefinitionCopy', () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus('', 'testLocalEntityDeclarationDefinitionCopy', undefined, undefined, undefined, true);
        const entity: CdmLocalEntityDeclarationDefinition = new CdmLocalEntityDeclarationDefinition(corpus.ctx, 'name');

        const dataPartitionName: string = 'dataPartitionName';
        const dataPartitionPatternName: string = 'dataPartitionPatternName';
        const incrementalPartitionName: string = 'incrementalPartitionName';
        const incrementalPartitionPatternName: string = "incrementalPartitionPatternName";

        const dataPartition: CdmDataPartitionDefinition = entity.dataPartitions.push(dataPartitionName);
        const dataPartitionPattern: CdmDataPartitionPatternDefinition = entity.dataPartitionPatterns.push(dataPartitionPatternName);
        const incrementalPartition: CdmDataPartitionDefinition = entity.incrementalPartitions.push(incrementalPartitionName);
        const incrementalPartitionPattern: CdmDataPartitionPatternDefinition = entity.incrementalPartitionPatterns.push(incrementalPartitionPatternName);

        const copy: CdmLocalEntityDeclarationDefinition = entity.copy() as CdmLocalEntityDeclarationDefinition;
        copy.dataPartitions.allItems[0].name = 'newDataPartitionName';
        copy.dataPartitionPatterns.allItems[0].name = 'newDataPartitionPatternName';
        copy.incrementalPartitions.allItems[0].name = 'newIncrementalPartitionName';
        copy.incrementalPartitionPatterns.allItems[0].name = 'newIncrementalPartitionPatternName';

        expect(dataPartition.name)
            .toBe(dataPartitionName);
        expect(dataPartitionPattern.name)
            .toBe(dataPartitionPatternName);
        expect(incrementalPartition.name)
            .toBe(incrementalPartitionName);
        expect(incrementalPartitionPattern.name)
            .toBe(incrementalPartitionPatternName);
    });
});
