// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmCorpusContext,
    cdmObjectType,
    CdmTraitReference,
    copyOptions,
    resolveOptions
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
import {
    AttributeContext,
    TraitReference
} from './types';
import * as utils from './utils';

export class AttributeContextPersistence {
    public static fromData(ctx: CdmCorpusContext, object: AttributeContext): CdmAttributeContext {
        if (!object) { return; }
        const attributeContext: CdmAttributeContext =
            ctx.corpus.MakeObject<CdmAttributeContext>(cdmObjectType.attributeContextDef, object.name);
        attributeContext.type = AttributeContextPersistence.mapTypeNameToEnum(object.type);
        if (object.parent) {
            attributeContext.parent = CdmFolder.AttributeContextReferencePersistence.fromData(ctx, object.parent);
        }
        if (object.explanation) {
            attributeContext.explanation = object.explanation;
        }
        if (object.definition) {
            switch (attributeContext.type) {
                case cdmAttributeContextType.entity:
                case cdmAttributeContextType.entityReferenceExtends:
                    attributeContext.definition = CdmFolder.EntityReferencePersistence.fromData(ctx, object.definition);
                    break;
                case cdmAttributeContextType.attributeGroup:
                    attributeContext.definition = CdmFolder.AttributeGroupReferencePersistence.fromData(ctx, object.definition);
                    break;
                case cdmAttributeContextType.addedAttributeSupporting:
                case cdmAttributeContextType.addedAttributeIdentity:
                case cdmAttributeContextType.addedAttributeExpansionTotal:
                case cdmAttributeContextType.addedAttributeSelectedType:
                case cdmAttributeContextType.attributeDefinition:
                    attributeContext.definition = CdmFolder.AttributeReferencePersistence.fromData(ctx, object.definition);
                    break;
                default:
            }
        }
        // I know the trait collection names look wrong. but I wanted to use the def baseclass
        utils.addArrayToCdmCollection<CdmTraitReference>(attributeContext.exhibitsTraits, utils.createTraitReferenceArray(ctx, object.appliedTraits));
        if (object.contents && object.contents.length > 0) {
            const l: number = object.contents.length;
            for (let i: number = 0; i < l; i++) {
                const ct: string | AttributeContext = object.contents[i];
                if (typeof (ct) === 'string') {
                    attributeContext.contents.push(CdmFolder.AttributeReferencePersistence.fromData(ctx, ct));
                } else {
                    attributeContext.contents.push(AttributeContextPersistence.fromData(ctx, ct));
                }
            }
        }

        return attributeContext;
    }
    public static toData(instance: CdmAttributeContext, resOpt: resolveOptions, options: copyOptions): AttributeContext {
        return {
            explanation: instance.explanation,
            name: instance.name,
            type: AttributeContextPersistence.mapEnumToTypeName(instance.type),
            parent: instance.parent ? instance.parent.copyData(resOpt, options) as string : undefined,
            definition: instance.definition ? instance.definition.copyData(resOpt, options) as string : undefined,
            // i know the trait collection names look wrong. but I wanted to use the def baseclass
            appliedTraits: copyDataUtils.arrayCopyData<string | TraitReference>(
                resOpt,
                instance.exhibitsTraits.allItems.filter((trait: CdmTraitReference) => !trait.isFromProperty),
                options),
            contents: copyDataUtils.arrayCopyData<string | AttributeContext>(resOpt, instance.contents, options)
        };
    }
    public static mapTypeNameToEnum(typeName: string): cdmAttributeContextType {
        switch (typeName) {
            case 'entity':
                return cdmAttributeContextType.entity;
            case 'entityReferenceExtends':
                return cdmAttributeContextType.entityReferenceExtends;
            case 'attributeGroup':
                return cdmAttributeContextType.attributeGroup;
            case 'attributeDefinition':
                return cdmAttributeContextType.attributeDefinition;
            case 'addedAttributeSupporting':
                return cdmAttributeContextType.addedAttributeSupporting;
            case 'addedAttributeIdentity':
                return cdmAttributeContextType.addedAttributeIdentity;
            case 'addedAttributeExpansionTotal':
                return cdmAttributeContextType.addedAttributeExpansionTotal;
            case 'addedAttributeSelectedType':
                return cdmAttributeContextType.addedAttributeSelectedType;
            case 'generatedRound':
                return cdmAttributeContextType.generatedRound;
            case 'generatedSet':
                return cdmAttributeContextType.generatedSet;
            case 'projection':
                return cdmAttributeContextType.projection;
            case 'source':
                return cdmAttributeContextType.source;
            case 'operations':
                return cdmAttributeContextType.operations;
            case 'operationAddCountAttribute':
                return cdmAttributeContextType.operationAddCountAttribute;
            case 'operationAddSupportingAttribute':
                return cdmAttributeContextType.operationAddSupportingAttribute;
            case 'operationAddTypeAttribute':
                return cdmAttributeContextType.operationAddTypeAttribute;
            case 'operationExcludeAttributes':
                return cdmAttributeContextType.operationExcludeAttributes;
            case 'operationArrayExpansion':
                return cdmAttributeContextType.operationArrayExpansion;
            case 'operationCombineAttributes':
                return cdmAttributeContextType.operationCombineAttributes;
            case 'operationRenameAttributes':
                return cdmAttributeContextType.operationRenameAttributes;
            case 'operationReplaceAsForeignKey':
                return cdmAttributeContextType.operationReplaceAsForeignKey;
            case 'operationIncludeAttributes':
                return cdmAttributeContextType.operationIncludeAttributes;
            case 'operationAddAttributeGroup':
                return cdmAttributeContextType.operationAddAttributeGroup;

            default:
                return -1;
        }
    }
    public static mapEnumToTypeName(enumVal: cdmAttributeContextType): string {
        switch (enumVal) {
            case cdmAttributeContextType.entity:
                return 'entity';
            case cdmAttributeContextType.entityReferenceExtends:
                return 'entityReferenceExtends';
            case cdmAttributeContextType.attributeGroup:
                return 'attributeGroup';
            case cdmAttributeContextType.attributeDefinition:
                return 'attributeDefinition';
            case cdmAttributeContextType.addedAttributeSupporting:
                return 'addedAttributeSupporting';
            case cdmAttributeContextType.addedAttributeIdentity:
                return 'addedAttributeIdentity';
            case cdmAttributeContextType.addedAttributeExpansionTotal:
                return 'addedAttributeExpansionTotal';
            case cdmAttributeContextType.addedAttributeSelectedType:
                return 'addedAttributeSelectedType';
            case cdmAttributeContextType.generatedRound:
                return 'generatedRound';
            case cdmAttributeContextType.generatedSet:
                return 'generatedSet';
            case cdmAttributeContextType.projection:
                return 'projection';
            case cdmAttributeContextType.source:
                return 'source';
            case cdmAttributeContextType.operations:
                return 'operations';
            case cdmAttributeContextType.operationAddCountAttribute:
                return 'operationAddCountAttribute';
            case cdmAttributeContextType.operationAddSupportingAttribute:
                return 'operationAddSupportingAttribute';
            case cdmAttributeContextType.operationAddTypeAttribute:
                return 'operationAddTypeAttribute';
            case cdmAttributeContextType.operationExcludeAttributes:
                return 'operationExcludeAttributes';
            case cdmAttributeContextType.operationArrayExpansion:
                return 'operationArrayExpansion';
            case cdmAttributeContextType.operationCombineAttributes:
                return 'operationCombineAttributes';
            case cdmAttributeContextType.operationRenameAttributes:
                return 'operationRenameAttributes';
            case cdmAttributeContextType.operationReplaceAsForeignKey:
                return 'operationReplaceAsForeignKey';
            case cdmAttributeContextType.operationIncludeAttributes:
                return 'operationIncludeAttributes';
            case cdmAttributeContextType.operationAddAttributeGroup:
                return 'operationAddAttributeGroup';
            default:
                return 'unknown';
        }
    }
}
