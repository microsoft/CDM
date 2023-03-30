// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationAlterTraits,
    copyOptions,
    cdmLogCode,
    Logger,
    resolveOptions,
    CdmCollection,
    CdmTraitReferenceBase,
} from '../../../internal';
import { OperationAlterTraits, TraitGroupReference, TraitReference } from '../types';
import * as utils from './../utils';
import * as copyDataUtils from '../../../Utilities/CopyDataUtils';
import { OperationBasePersistence } from './OperationBasePersistence';

/**
 * Operation AlterTraits persistence
 */
export class OperationAlterTraitsPersistence {
    private static TAG: string = OperationAlterTraitsPersistence.name;

    public static fromData(ctx: CdmCorpusContext, object: OperationAlterTraits): CdmOperationAlterTraits {
        if (!object) {
            return undefined;
        }

        const alterTraitsOp: CdmOperationAlterTraits = OperationBasePersistence.fromData(ctx, cdmObjectType.operationAlterTraitsDef, object);
        if (object.traitsToAdd !== undefined) {
            alterTraitsOp.traitsToAdd = new CdmCollection<CdmTraitReferenceBase>(ctx, alterTraitsOp, cdmObjectType.traitRef);
            utils.addArrayToCdmCollection(alterTraitsOp.traitsToAdd, utils.createTraitReferenceArray(ctx, object.traitsToAdd));
        }
        if (object.traitsToRemove !== undefined) {
            alterTraitsOp.traitsToRemove = new CdmCollection<CdmTraitReferenceBase>(ctx, alterTraitsOp, cdmObjectType.traitRef);
            utils.addArrayToCdmCollection(alterTraitsOp.traitsToRemove, utils.createTraitReferenceArray(ctx, object.traitsToRemove));
        }
        alterTraitsOp.argumentsContainWildcards = object.argumentsContainWildcards;

        if (typeof (object.applyTo) === 'string') {
            alterTraitsOp.applyTo = [object.applyTo]
        } else if (Array.isArray(object.applyTo)) {
            alterTraitsOp.applyTo = object.applyTo;
        } else if (object.applyTo !== undefined) {
            Logger.error(ctx, this.TAG, this.fromData.name, undefined, cdmLogCode.ErrPersistProjUnsupportedProp, cdmLogCode.ErrPersistProjUnsupportedProp, "applyTo", "string or list of strings");
        }

        if (typeof (object.applyToTraits) === 'string') {
            alterTraitsOp.applyToTraits = [object.applyToTraits]
        } else if (Array.isArray(object.applyToTraits)) {
            alterTraitsOp.applyToTraits = object.applyToTraits;
        } else if (object.applyToTraits !== undefined) {
            Logger.error(ctx, this.TAG, this.fromData.name, undefined, cdmLogCode.ErrPersistProjUnsupportedProp, cdmLogCode.ErrPersistProjUnsupportedProp, "applyToTraits", "string or list of strings");
        }

        return alterTraitsOp;
    }

    public static toData(instance: CdmOperationAlterTraits, resOpt: resolveOptions, options: copyOptions): OperationAlterTraits {
        if (!instance) {
            return undefined;
        }

        const data: OperationAlterTraits = OperationBasePersistence.toData(instance, resOpt, options);
        data.traitsToAdd = copyDataUtils.arrayCopyData<string | TraitReference | TraitGroupReference>(resOpt, instance.traitsToAdd, options);
        data.traitsToRemove = copyDataUtils.arrayCopyData<string | TraitReference | TraitGroupReference>(resOpt, instance.traitsToRemove, options);
        data.argumentsContainWildcards = instance.argumentsContainWildcards;
        data.applyTo = instance.applyTo;
        data.applyToTraits = instance.applyToTraits;

        return data;
    }
}
