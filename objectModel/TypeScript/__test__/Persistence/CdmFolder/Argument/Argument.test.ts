// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
  CdmCorpusDefinition,
} from '../../../../internal';
import { CdmFolder } from '../../../../Persistence';
import { Argument } from '../../../../Persistence/CdmFolder/types';


describe('Persistence.CdmFolder.Argument', () => {
  /**
   * Test loading an argument with value 0 (number).
   */
  it('TestLoadingZeroValue', () => {
    const corpus = new CdmCorpusDefinition();
    const argumentData: Argument = {
      'value': 0
    };

    var argument = CdmFolder.ArgumentPersistence.fromData(corpus.ctx, argumentData);
    expect(argument.value)
      .toEqual(0);

    var argumentToData = CdmFolder.ArgumentPersistence.toData(argument, null, null);
    expect(argumentToData)
      .toEqual(0);
  });

   /**
   * Test loading an argument with blank name & value 0 (number).
   */
    it('TestLoadingZeroValue', () => {
      const corpus = new CdmCorpusDefinition();
      const argumentData: Argument = {
        'name': ' ',
        'value': 0
      };
  
      var argument = CdmFolder.ArgumentPersistence.fromData(corpus.ctx, argumentData);
      expect(argument.value)
        .toEqual(0);
  
      var argumentToData = CdmFolder.ArgumentPersistence.toData(argument, null, null);
      expect(argumentToData)
        .toEqual(0);
    });
});