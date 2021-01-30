// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
  CdmCorpusContext,
  cdmObjectType,
  CdmOperationBase,
  cdmOperationType,
  copyOptions,
  Logger,
  OperationTypeConvertor,
  resolveOptions,
  StringUtils
} from '../../../internal';
import { OperationBase } from '../types';


export class OperationBasePersistence {
  public static fromData<T extends CdmOperationBase>(ctx: CdmCorpusContext, objectType: cdmObjectType, object: OperationBase): T {
      if (!object) {
          return undefined;
      }

      const operation: CdmOperationBase = ctx.corpus.MakeObject<CdmOperationBase>(objectType);
      const operationType: cdmOperationType = OperationTypeConvertor.fromObjectType(objectType);
      const operationName: string = OperationTypeConvertor.operationTypeToString(operationType);

      if (object.$type && !StringUtils.equalsWithIgnoreCase(object.$type, operationName)) {
          Logger.error(operationName, ctx, `$type ${object.$type} is invalid for this operation.`);
      } else {
          operation.type = operationType;
      }

      operation.condition = object.condition;
      operation.explanation = object.explanation;
      operation.sourceInput = object.sourceInput;

      return operation as T;
  }

  public static toData<T extends OperationBase>(instance: CdmOperationBase, resOpt: resolveOptions, options: copyOptions): T {
      if (!instance) {
          return undefined;
      }

      return {
          $type: OperationTypeConvertor.operationTypeToString(instance.type),
          condition: instance.condition,
          explanation: instance.explanation,
          sourceInput: instance.sourceInput
      } as T;
  }
}
