// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    applierContext,
    AttributeContextParameters,
    AttributeResolutionApplier,
    AttributeResolutionDirectiveSet,
    CdmAttribute,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmAttributeResolutionGuidance,
    CdmTraitDefinition,
    CdmTraitReference,
    CdmTypeAttributeDefinition,
    ResolvedAttribute,
    resolveOptions
} from '../internal';

/**
 * @internal
 */
export interface ResolutionAppliers {
    /**
     * @internal
     */
    isRemoved: AttributeResolutionApplier;

    /**
     * @internal
     */
    isRemovedInternal: AttributeResolutionApplier;

    /**
     * @internal
     */
    doesReferenceEntity: AttributeResolutionApplier;

    /**
     * @internal
     */
    doesAddSupportingAttribute: AttributeResolutionApplier;

    /**
     * @internal
     */
    doesImposeDirectives: AttributeResolutionApplier;

    /**
     * @internal
     */
    doesRemoveDirectives: AttributeResolutionApplier;

    /**
     * @internal
     */
    doesSelectAttributes: AttributeResolutionApplier;

    /**
     * @internal
     */
    doesDisambiguateNames: AttributeResolutionApplier;

    /**
     * @internal
     */
    doesReferenceEntityVia: AttributeResolutionApplier;

    /**
     * @internal
     */
    doesExplainArray: AttributeResolutionApplier;
}

// tslint:disable-next-line:variable-name
const PrimitiveAppliers: ResolutionAppliers = {
    isRemoved:
    {
        matchName: 'is.removed',
        priority: 10,
        overridesBase: false,
        willRemove: (onStep: applierContext): boolean => {
            return true;
        }
    },
    isRemovedInternal:
    {
        matchName: 'is.removed.internal',
        priority: 10,
        overridesBase: false,
        willRemove: (onStep: applierContext): boolean => {
            return onStep.resAttSource.applierState && onStep.resAttSource.applierState.flex_remove;
        }
    },
    doesReferenceEntity:
    {
        matchName: 'does.referenceEntity',
        priority: 4,
        overridesBase: true,
        willRemove: (appCtx: applierContext): boolean => {
            // Return always false for the time being.
            // let visible: boolean = true;
            // if (appCtx.resAttSource) {
            //     // all others go away
            //     visible = false;
            //     if (appCtx.resAttSource.target === appCtx.resGuide.entityByReference.foreignKeyAttribute) {
            //         visible = true;
            //     }
            // }
            return false;
        },
        willRoundAdd: (appCtx: applierContext): boolean => {
            return true;
        },
        doRoundAdd: (appCtx: applierContext): void => {
            // get the added attribute and applied trait
            const sub: CdmAttribute = appCtx.resGuide.entityByReference.foreignKeyAttribute as CdmAttribute;
            appCtx.resAttNew.target = sub;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();
            // add the trait that tells them what this means
            if (!sub.appliedTraits ||
                !sub.appliedTraits.allItems
                    .find((atr: CdmTraitReference) => atr.fetchObjectDefinitionName() === 'is.linkedEntity.identifier')) {
                sub.appliedTraits.push('is.linkedEntity.identifier', true);
            }
            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.fetchResolvedTraits(appCtx.resOpt);
            appCtx.resGuideNew = sub.resolutionGuidance;
            if (appCtx.resAttNew.resolvedTraits) {
                appCtx.resAttNew.resolvedTraits = appCtx.resAttNew.resolvedTraits.deepCopy();
            }
        },
        willCreateContext: (appCtx: applierContext): boolean => {
            return true;
        },
        doCreateContext: (appCtx: applierContext): void => {
            // make a new attributeContext to differentiate this supporting att
            const acp: AttributeContextParameters = {
                under: appCtx.attCtx,
                type: cdmAttributeContextType.addedAttributeIdentity,
                name: '_foreignKey'
            };

            appCtx.attCtx = CdmAttributeContext.createChildUnder(appCtx.resOpt, acp);
        }
    },
    doesAddSupportingAttribute:
    {
        matchName: 'does.addSupportingAttribute',
        priority: 8,
        overridesBase: true,
        willAttributeAdd: (appCtx: applierContext): boolean => {
            return true;
        },
        doAttributeAdd: (appCtx: applierContext): void => {
            // get the added attribute and applied trait
            let sub: CdmTypeAttributeDefinition = appCtx.resGuide.addSupportingAttribute;
            sub = sub.copy(appCtx.resOpt) as CdmTypeAttributeDefinition;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();
            // add a supporting trait to this attribute
            const supTraitRef: CdmTraitReference = sub.appliedTraits.push('is.addedInSupportOf', false);
            const supTraitDef: CdmTraitDefinition = supTraitRef.fetchObjectDefinition(appCtx.resOpt);

            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.fetchResolvedTraits(appCtx.resOpt);
            // assumes some things, like the argument name. probably a dumb design,
            // should just take the name and assume the trait too. that simplifies the source docs
            let supporting: string = '(unspecified)';
            if (appCtx.resAttSource) {
                supporting = appCtx.resAttSource.resolvedName;
            }
            appCtx.resAttNew.resolvedTraits = appCtx.resAttNew.resolvedTraits.setTraitParameterValue(
                appCtx.resOpt, supTraitDef, 'inSupportOf', supporting);

            appCtx.resAttNew.target = sub;
            appCtx.resGuideNew = sub.resolutionGuidance;

        },
        willCreateContext: (appCtx: applierContext): boolean => {
            return true;
        },
        doCreateContext: (appCtx: applierContext): void => {
            // make a new attributeContext to differentiate this supporting att
            const acp: AttributeContextParameters = {
                under: appCtx.attCtx,
                type: cdmAttributeContextType.addedAttributeSupporting,
                name: `supporting_${appCtx.resAttSource.resolvedName}`,
                regarding: appCtx.resAttSource.target as CdmAttribute
            };

            appCtx.attCtx = CdmAttributeContext.createChildUnder(appCtx.resOpt, acp);
        }
    },
    doesImposeDirectives:
    {
        matchName: 'does.imposeDirectives',
        priority: 1,
        overridesBase: true,
        willAlterDirectives: (resOpt: resolveOptions, resGuide: CdmAttributeResolutionGuidance): boolean => {
            return true;
        },
        doAlterDirectives: (resOpt: resolveOptions, resGuide: CdmAttributeResolutionGuidance): void => {
            const allAdded: string[] = resGuide.imposedDirectives;
            if (allAdded) {
                if (resOpt.directives) {
                    resOpt.directives = resOpt.directives.copy();
                    allAdded
                        .forEach((d: string) => {
                            resOpt.directives.add(d);
                        });
                }
            }
        }
    },
    doesRemoveDirectives:
    {
        matchName: 'does.removeDirectives',
        priority: 2,
        overridesBase: true,
        willAlterDirectives: (resOpt: resolveOptions, resGuide: CdmAttributeResolutionGuidance): boolean => {
            return true;
        },
        doAlterDirectives: (resOpt: resolveOptions, resGuide: CdmAttributeResolutionGuidance): void => {
            const allRemoved: string[] = resGuide.removedDirectives;
            if (allRemoved) {
                if (resOpt.directives) {
                    resOpt.directives = resOpt.directives.copy();
                    allRemoved.forEach((d: string) => {
                        resOpt.directives.delete(d);
                    });
                }
            }

        }
    },
    doesSelectAttributes:
    {
        matchName: 'does.selectAttributes',
        priority: 4,
        overridesBase: false,
        willAlterDirectives: (resOpt: resolveOptions, resGuide: CdmAttributeResolutionGuidance): boolean => {
            const selects: string = resGuide.selectsSubAttribute.selects;

            return (selects === 'one');
        },
        doAlterDirectives: (resOpt: resolveOptions, resGuide: CdmAttributeResolutionGuidance): void => {
            if (resOpt.directives) {
                resOpt.directives = resOpt.directives.copy();
            } else {
                resOpt.directives = new AttributeResolutionDirectiveSet();
            }
            resOpt.directives.add('selectOne');
        },
        willRoundAdd: (appCtx: applierContext): boolean => {
            const dir: AttributeResolutionDirectiveSet = appCtx.resOpt.directives;
            const selectsOne: boolean = dir && dir.has('selectOne');
            const structured: boolean = dir && dir.has('structured');
            if (selectsOne && !structured) {
                // when one class is being pulled from a list of them
                // add the class attribute unless this is a structured output (assumes they know the class)
                return true;
            }

            return false;
        },
        doRoundAdd: (appCtx: applierContext): void => {
            // get the added attribute and applied trait
            const sub: CdmTypeAttributeDefinition =
                appCtx.resGuide.selectsSubAttribute.selectedTypeAttribute;
            appCtx.resAttNew.target = sub;
            appCtx.resAttNew.applierState.flex_remove = false;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();

            // add the trait that tells them what this means
            if (!sub.appliedTraits
                || !sub.appliedTraits.allItems
                    .find((atr: CdmTraitReference) => atr.fetchObjectDefinitionName() === 'is.linkedEntity.name')) {
                sub.appliedTraits.push('is.linkedEntity.name', true);
            }

            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.fetchResolvedTraits(appCtx.resOpt);
            appCtx.resGuideNew = sub.resolutionGuidance;

            // make this code create a context for any copy of this attribute that gets in an array
            appCtx.resAttNew.applierState.array_specializedContext = PrimitiveAppliers.doesSelectAttributes.doCreateContext;
        },
        willCreateContext: (appCtx: applierContext): boolean => {
            const dir: AttributeResolutionDirectiveSet = appCtx.resOpt.directives;
            const selectsOne: boolean = dir && dir.has('selectOne');
            const structured: boolean = dir && dir.has('structured');
            if (selectsOne && !structured) {
                return true;
            }

            return false;
        },
        doCreateContext: (appCtx: applierContext): void => {
            // make a new attributeContext to differentiate this supporting att
            const acp: AttributeContextParameters = {
                under: appCtx.attCtx,
                type: cdmAttributeContextType.addedAttributeSelectedType,
                name: '_selectedEntityName'
            };

            appCtx.attCtx = CdmAttributeContext.createChildUnder(appCtx.resOpt, acp);
        }
    },
    doesDisambiguateNames:
    {
        matchName: 'does.disambiguateNames',
        priority: 9,
        overridesBase: true,
        willAttributeModify: (appCtx: applierContext): boolean => {
            if (appCtx.resAttSource && !appCtx.resOpt.directives.has('structured')) {
                return true;
            }

            return false;
        },
        doAttributeModify: (appCtx: applierContext): void => {
            if (appCtx.resAttSource) {
                const format: string = appCtx.resGuide.renameFormat;
                const state: any = appCtx.resAttSource.applierState;
                const ordinal: string = (state && state.flex_currentOrdinal !== undefined) ? state.flex_currentOrdinal.toString() : '';
                if (!format) {
                    return;
                }
                const formatLength: number = format.length;
                if (formatLength === 0) {
                    return;
                }
                // parse the format looking for positions of {a} and {o} and text chunks around them
                // there are only 5 possibilies
                let upper: boolean = false;
                let iN: number = format.indexOf('{a}');
                if (iN < 0) {
                    iN = format.indexOf('{A}');
                    upper = true;
                }
                const iO: number = format.indexOf('{o}');
                const replace: (start: number, at: number, length: number, value: string) => string =
                    (start: number, at: number, length: number, value: string): string => {
                        let newValue: string = value;
                        if (upper && newValue) {
                            newValue = newValue.charAt(0)
                                .toUpperCase() + newValue.slice(1);
                        }
                        let replaced: string = '';
                        if (at > start) {
                            replaced = format.slice(start, at);
                        }
                        replaced += newValue;
                        if (at + 3 < length) {
                            replaced += format.slice(at + 3, length);
                        }

                        return replaced;
                    };
                let result: string;
                const srcName: string = appCtx.resAttSource.previousResolvedName;
                if (iN < 0 && iO < 0) {
                    result = format;
                } else if (iN < 0) {
                    result = replace(0, iO, formatLength, ordinal);
                } else if (iO < 0) {
                    result = replace(0, iN, formatLength, srcName);
                } else if (iN < iO) {
                    result = replace(0, iN, iO, srcName);
                    result += replace(iO, iO, formatLength, ordinal);
                } else {
                    result = replace(0, iO, iN, ordinal);
                    result += replace(iN, iN, formatLength, srcName);
                }
                appCtx.resAttSource.resolvedName = result;
            }
        }
    },
    doesReferenceEntityVia:
    {
        matchName: 'does.referenceEntityVia',
        priority: 4,
        overridesBase: false,
        willRemove: (appCtx: applierContext): boolean => {
            const dir: AttributeResolutionDirectiveSet = appCtx.resOpt.directives;

            const isNorm: boolean = dir && dir.has('normalized');
            const isArray: boolean = dir && dir.has('isArray');
            const isRefOnly: boolean = dir && dir.has('referenceOnly');
            const alwaysAdd: boolean = appCtx.resGuide.entityByReference.foreignKeyAttribute !== undefined &&
                appCtx.resGuide.entityByReference.alwaysIncludeForeignKey === true;
            const doFK: boolean = (alwaysAdd || isRefOnly) && (isNorm === false || isArray === false);
            let visible: boolean = true;
            if (doFK && appCtx.resAttSource) {
                // if in reference only mode, then remove everything that isn't marked to retain
                visible = false;
                if (alwaysAdd || (appCtx.resAttSource.applierState && appCtx.resAttSource.applierState.flex_remove === false)) {
                    visible = true;
                }
            }

            return !visible;
        },
        willRoundAdd: (appCtx: applierContext): boolean => {
            const dir: AttributeResolutionDirectiveSet = appCtx.resOpt.directives;

            const isNorm: boolean = dir && dir.has('normalized');
            const isArray: boolean = dir && dir.has('isArray');
            const isRefOnly: boolean = dir && dir.has('referenceOnly');
            const alwaysAdd: boolean = appCtx.resGuide.entityByReference.foreignKeyAttribute !== undefined &&
                appCtx.resGuide.entityByReference.alwaysIncludeForeignKey === true;

            // add a foreign key and remove everything else when asked to do so.
            // however, avoid doing this for normalized arrays, since they remove all alls anyway
            return (isRefOnly || alwaysAdd) && (isNorm === false || isArray === false);
        },
        doRoundAdd: (appCtx: applierContext): void => {
            // get the added attribute and applied trait
            const sub: CdmAttribute =
                appCtx.resGuide.entityByReference.foreignKeyAttribute as CdmAttribute;
            appCtx.resAttNew.target = sub;
            appCtx.resAttNew.applierState.flex_remove = false;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();

            // add the trait that tells them what this means
            if (!sub.appliedTraits || !sub.appliedTraits.allItems
                .find((atr: CdmTraitReference) => atr.fetchObjectDefinitionName() === 'is.linkedEntity.identifier')) {
                sub.appliedTraits.push('is.linkedEntity.identifier', true);
            }

            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.fetchResolvedTraits(appCtx.resOpt);
            if (appCtx.resAttNew.resolvedTraits) {
                appCtx.resAttNew.resolvedTraits = appCtx.resAttNew.resolvedTraits.deepCopy();
            }
        },
        willCreateContext: (appCtx: applierContext): boolean => {
            const dir: AttributeResolutionDirectiveSet = appCtx.resOpt.directives;
            const isNorm: boolean = dir && dir.has('normalized');
            const isArray: boolean = dir && dir.has('isArray');
            const isRefOnly: boolean = dir && dir.has('referenceOnly');
            const alwaysAdd: boolean = appCtx.resGuide.entityByReference.foreignKeyAttribute !== undefined &&
                appCtx.resGuide.entityByReference.alwaysIncludeForeignKey === true;

            return (isRefOnly || alwaysAdd) && (isNorm === false || isArray === false);
        },
        doCreateContext: (appCtx: applierContext): void => {
            // make a new attributeContext to differentiate this foreign key att
            const acp: AttributeContextParameters = {
                under: appCtx.attCtx,
                type: cdmAttributeContextType.addedAttributeIdentity,
                name: '_foreignKey'
            };

            appCtx.attCtx = CdmAttributeContext.createChildUnder(appCtx.resOpt, acp);
        }
    },
    doesExplainArray:
    {
        matchName: 'does.explainArray',
        priority: 6,
        overridesBase: false,
        willGroupAdd: (appCtx: applierContext): boolean => {
            const dir: AttributeResolutionDirectiveSet = appCtx.resOpt.directives;
            const isNorm: boolean = dir && dir.has('normalized');
            const isArray: boolean = dir && dir.has('isArray');
            const isStructured: boolean = dir && dir.has('structured');

            // expand array and add a count if this is an array AND it isn't structured or normalized
            // structured assumes they know about the array size from the structured data format
            // normalized means that arrays of entities shouldn't be put inline,
            // they should reference or include from the 'other' side of that 1:M relationship
            return isArray && !isNorm && !isStructured;
        },
        doGroupAdd: (appCtx: applierContext): void => {
            const sub: CdmAttribute = appCtx.resGuide.expansion.countAttribute as CdmAttribute;
            appCtx.resAttNew.target = sub;
            appCtx.resAttNew.applierState.flex_remove = false;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();

            // add the trait that tells them what this means
            if (!sub.appliedTraits || !sub.appliedTraits.allItems
                .find((atr: CdmTraitReference) => atr.fetchObjectDefinitionName() === 'is.linkedEntity.array.count')) {
                sub.appliedTraits.push('is.linkedEntity.array.count', true);
            }

            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.fetchResolvedTraits(appCtx.resOpt);
            appCtx.resGuideNew = sub.resolutionGuidance;
        },
        willCreateContext: (appCtx: applierContext): boolean => {
            return true;
        },
        doCreateContext: (appCtx: applierContext): void => {
            if (appCtx.resAttNew && appCtx.resAttNew.applierState && appCtx.resAttNew.applierState.array_specializedContext) {
                // this attribute may have a special context that it wants, use that instead
                appCtx.resAttNew.applierState.array_specializedContext(appCtx);
            } else {
                let ctxType: cdmAttributeContextType = cdmAttributeContextType.attributeDefinition;
                // if this is the group add, then we are adding the counter
                if (appCtx.state === 'group') {
                    ctxType = cdmAttributeContextType.addedAttributeExpansionTotal;
                }
                const acp: AttributeContextParameters = {
                    under: appCtx.attCtx,
                    type: ctxType
                };
                appCtx.attCtx = CdmAttributeContext.createChildUnder(appCtx.resOpt, acp);
            }
        },
        willAttributeAdd: (appCtx: applierContext): boolean => {
            const dir: AttributeResolutionDirectiveSet = appCtx.resOpt.directives;
            const isNorm: boolean = dir && dir.has('normalized');
            const isArray: boolean = dir && dir.has('isArray');
            const isStructured: boolean = dir && dir.has('structured');

            return isArray && !isNorm && !isStructured;
        },
        doAttributeAdd: (appCtx: applierContext): void => {
            appCtx.continue = false;
            if (appCtx.resAttSource) {
                const state: any = appCtx.resAttNew.applierState;
                if (state.array_finalOrdinal === undefined) {
                    // get the fixed size (not set means no fixed size)
                    let fixedSize: number = 1;
                    if (appCtx.resGuide.expansion && appCtx.resGuide.expansion.maximumExpansion) {
                        fixedSize = appCtx.resGuide.expansion.maximumExpansion;
                    }

                    let initial: number = 0;
                    if (appCtx.resGuide.expansion && appCtx.resGuide.expansion.startingOrdinal) {
                        initial = appCtx.resGuide.expansion.startingOrdinal;
                    }

                    fixedSize += initial;
                    // marks this att as the template for expansion
                    state.array_template = appCtx.resAttSource;
                    if (!appCtx.resAttSource.applierState) {
                        appCtx.resAttSource.applierState = {};
                    }
                    appCtx.resAttSource.applierState.flex_remove = true;
                    // give back the attribute that holds the count first
                    state.array_initialOrdinal = initial;
                    state.array_finalOrdinal = fixedSize - 1;
                    state.flex_currentOrdinal = initial;
                } else {
                    state.flex_currentOrdinal = state.flex_currentOrdinal as number + 1;
                }

                if (state.flex_currentOrdinal <= state.array_finalOrdinal) {
                    const template: ResolvedAttribute = (state.array_template) as ResolvedAttribute;
                    appCtx.resAttNew.target = template.target;
                    // copy the template
                    appCtx.resAttNew.resolvedName = state.array_template.previousResolvedName;
                    appCtx.resAttNew.resolvedTraits = template.resolvedTraits.deepCopy();
                    appCtx.resGuideNew = appCtx.resGuide; // just take the source, because this is not a new attribute that may have different settings
                    appCtx.continue = state.flex_currentOrdinal < state.array_finalOrdinal;
                }

            }
        },
        willAlterDirectives: (resOpt: resolveOptions, resGuide: CdmAttributeResolutionGuidance): boolean => {
            if (resGuide.cardinality && resGuide.cardinality === 'many') {
                return true;
            }

            return false;
        },
        doAlterDirectives: (resOpt: resolveOptions, resGuide: CdmAttributeResolutionGuidance): void => {
            if (resOpt.directives) {
                resOpt.directives = resOpt.directives.copy();
            } else {
                resOpt.directives = new AttributeResolutionDirectiveSet();
            }
            resOpt.directives.add('isArray');
        },
        willRemove: (appCtx: applierContext): boolean => {
            const dir: AttributeResolutionDirectiveSet = appCtx.resOpt.directives;
            const isNorm: boolean = dir && dir.has('normalized');
            const isArray: boolean = dir && dir.has('isArray');

            // remove the 'template' attributes that got copied on expansion if they come here
            // also, normalized means that arrays of entities shouldn't be put inline
            // only remove the template attributes that seeded the array expansion
            const isTemplate: boolean = appCtx.resAttSource.applierState && appCtx.resAttSource.applierState.flex_remove;

            return isArray && (isTemplate || isNorm);
        }

    }
};

export { PrimitiveAppliers };
