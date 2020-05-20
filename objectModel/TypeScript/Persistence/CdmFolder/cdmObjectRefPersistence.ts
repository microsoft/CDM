// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmObjectReference,
    cdmObjectType,
    CdmTraitReference,
    copyOptions,
    identifierRef,
    resolveOptions
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
import {
    Argument,
    AttributeGroup,
    AttributeGroupReference,
    CdmJsonType,
    DataType,
    DataTypeReference,
    Entity,
    EntityReferenceDefinition,
    Purpose,
    PurposeReference,
    Trait,
    TraitReference
} from './types';
import * as utils from './utils';

export class cdmObjectRefPersistence {
    public static toData(instance: CdmObjectReference, resOpt: resolveOptions, options: copyOptions): CdmJsonType {
        // We don't know what object we are creating to initialize to any
        // tslint:disable-next-line:no-any
        let copy: any = {};
        if (instance.namedReference) {
            const identifier: (string | identifierRef)
                = utils.copyIdentifierRef(instance, resOpt, options);
            if (instance.simpleNamedReference) {
                return identifier;
            }
            const replace: CdmJsonType = cdmObjectRefPersistence.copyRefData(instance, resOpt, copy, identifier, options);
            if (replace) {
                copy = replace;
            }
        } else if (instance.explicitReference) {
            const erCopy: CdmJsonType = instance.explicitReference.copyData(resOpt, options);
            const replace: CdmJsonType = cdmObjectRefPersistence.copyRefData(instance, resOpt, copy, erCopy, options);
            if (replace) {
                copy = replace;
            }
        }
        if (instance.appliedTraits.length > 0) {
            // We don't know if the object we are copying has applied traits or not and hence use any
            // tslint:disable-next-line:no-any
            copy.appliedTraits = copyDataUtils.arrayCopyData<CdmTraitReference>(resOpt, instance.appliedTraits, options);
        }

        return copy;
    }
    private static copyRefData(instance: CdmObjectReference, resOpt: resolveOptions,
                               copy: CdmJsonType, refTo: CdmJsonType, options: copyOptions): CdmJsonType {
        switch (instance.objectType) {
            case cdmObjectType.attributeGroupRef:
                (copy as AttributeGroupReference).attributeGroupReference = refTo as string | AttributeGroup;

                return copy;
            case cdmObjectType.dataTypeRef:
                (copy as DataTypeReference).dataTypeReference = refTo as string | DataType;

                return copy;
            case cdmObjectType.entityRef:
                (copy as EntityReferenceDefinition).entityReference = refTo as string | Entity;

                return copy;
            case cdmObjectType.purposeRef:
                (copy as PurposeReference).purposeReference = refTo as string | Purpose;

                return copy;
            case cdmObjectType.traitRef:
                const traitRef: TraitReference = copy as TraitReference;
                traitRef.traitReference = refTo as string | Trait;
                traitRef.arguments = copyDataUtils.arrayCopyData<Argument>(resOpt, (instance as CdmTraitReference).arguments, options);

                return traitRef;
            default:
                return undefined;
        }
    }
}
