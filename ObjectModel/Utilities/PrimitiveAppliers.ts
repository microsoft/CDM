import {
    applierContext,
    ArgumentValue,
    AttributeContextImpl,
    AttributeContextParameters,
    cdmAttributeContextType,
    ICdmAttributeDef,
    ICdmObjectRef,
    ICdmTraitDef,
    ICdmTraitRef,
    ResolvedAttribute,
    ResolvedTrait,
    resolveOptions,
    TraitApplier,
    TraitDirectiveSet
} from '../internal';

// tslint:disable-next-line:variable-name
const PrimitiveAppliers: TraitApplier[] = [
    {
        matchName: 'is.removed',
        priority: 10,
        overridesBase: false,
        willRemove: (onStep: applierContext): boolean => {
            return true;
        }
    },
    {
        matchName: 'does.addAttribute',
        priority: 4,
        overridesBase: false,
        willAttributeAdd: (appCtx: applierContext): boolean => {
            return true;
        },
        doAttributeAdd: (appCtx: applierContext): void => {
            // get the added attribute and applied trait
            const sub: ICdmAttributeDef = appCtx.resTrait.parameterValues.getParameterValue('addedAttribute').value as ICdmAttributeDef;
            // sub = sub.copy();
            const appliedTrait: string | ICdmTraitRef | ICdmTraitDef =
                appCtx.resTrait.parameterValues.getParameterValue('appliedTrait').value as (string | ICdmTraitRef | ICdmTraitDef);
            if (appliedTrait) {
                sub.addAppliedTrait(appliedTrait, false); // could be a def or ref or string handed in. this handles it
            }
            appCtx.resAttNew.target = sub;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();
            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
        }
    },
    {
        matchName: 'does.referenceEntity',
        priority: 4,
        overridesBase: true,
        willRemove: (appCtx: applierContext): boolean => {
            let visible: boolean = true;
            if (appCtx.resAttSource) {
                // all others go away
                visible = false;
                if (appCtx.resAttSource.target === appCtx.resTrait.parameterValues.getParameterValue('addedAttribute').value) {
                    visible = true;
                }
            }

            return false; // find this bug
        },
        willRoundAdd: (appCtx: applierContext): boolean => {
            return true;
        },
        doRoundAdd: (appCtx: applierContext): void => {
            // get the added attribute and applied trait
            const sub: ICdmAttributeDef = appCtx.resTrait.parameterValues.getParameterValue('addedAttribute').value as ICdmAttributeDef;
            // sub = sub.copy();
            const appliedTrait: string | ICdmTraitRef | ICdmTraitDef =
                appCtx.resTrait.parameterValues.getParameterValue('appliedTrait').value as (string | ICdmTraitRef | ICdmTraitDef);
            if (appliedTrait) {
                sub.addAppliedTrait(appliedTrait, false); // could be a def or ref or string handed in. this handles it
            }
            appCtx.resAttNew.target = sub;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();
            // add the trait that tells them what this means
            if (!sub.getAppliedTraitRefs() ||
                !sub.getAppliedTraitRefs()
                    .find((atr: ICdmTraitRef) => atr.getObjectDefName() === 'is.linkedEntity.identifier')) {
                sub.addAppliedTrait('is.linkedEntity.identifier', true);
            }
            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
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

            appCtx.attCtx = AttributeContextImpl.createChildUnder(appCtx.resOpt, acp);
        }
    },
    {
        matchName: 'does.addSupportingAttribute',
        priority: 8,
        overridesBase: true,
        willAttributeAdd: (appCtx: applierContext): boolean => {
            return true;
        },
        doAttributeAdd: (appCtx: applierContext): void => {
            // get the added attribute and applied trait
            let sub: ICdmAttributeDef = appCtx.resTrait.parameterValues.getParameterValue('addedAttribute').value as ICdmAttributeDef;
            sub = sub.copy(appCtx.resOpt) as ICdmAttributeDef;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();
            // might have set a supporting trait to add to this attribute
            let appliedTrait: ArgumentValue = appCtx.resTrait.parameterValues.getParameterValue('appliedTrait').value;
            if (typeof (appliedTrait) === 'object') {
                appliedTrait = (appliedTrait as ICdmObjectRef).getObjectDef(appCtx.resOpt);
                // shove new trait onto attribute
                // could be a def or ref or string handed in. this handles it
                sub.addAppliedTrait(appliedTrait as (ICdmTraitDef | ICdmTraitRef), false);
                // get the resolved traits from attribute
                appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
                // assumes some things, like the argument name. probably a dumb design,
                // should just take the name and assume the trait too. that simplifies the source docs
                let supporting: string = '(unspecified)';
                if (appCtx.resAttSource) {
                    supporting = appCtx.resAttSource.resolvedName;
                }
                appCtx.resAttNew.resolvedTraits = appCtx.resAttNew.resolvedTraits.setTraitParameterValue(
                    appCtx.resOpt, appliedTrait as ICdmTraitDef, 'inSupportOf', supporting);
            } else {
                // get the resolved traits from attribute
                appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
            }

            appCtx.resAttNew.target = sub;
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
                regarding: appCtx.resAttSource.target as ICdmAttributeDef
            };

            appCtx.attCtx = AttributeContextImpl.createChildUnder(appCtx.resOpt, acp);
        }
    },
    {
        matchName: 'does.imposeDirectives',
        priority: 1,
        overridesBase: true,
        willAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait): boolean => {
            return true;
        },
        doAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait): void => {
            const allAdded: string = resTrait.parameterValues.getParameterValue('directives')
                .getValueString(resOpt);

            if (allAdded) {
                if (resOpt.directives) {
                    resOpt.directives = resOpt.directives.copy();
                    allAdded.split(',')
                        .forEach((d: string) => {
                            resOpt.directives.add(d);
                        });
                }
            }
        }
    },
    {
        matchName: 'does.removeDirectives',
        priority: 2,
        overridesBase: true,
        willAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait): boolean => {
            return true;
        },
        doAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait): void => {
            const allRemoved: string = resTrait.parameterValues.getParameterValue('directives')
                .getValueString(resOpt);

            if (allRemoved) {
                if (resOpt.directives) {
                    resOpt.directives = resOpt.directives.copy();
                    allRemoved.split(',')
                        .forEach((d: string) => {
                            resOpt.directives.delete(d);
                        });
                }
            }

        }
    },
    {
        matchName: 'does.selectAttributes',
        priority: 4,
        overridesBase: false,
        willAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait): boolean => {
            const selects: string = resTrait.parameterValues.getParameterValue('selects')
                .getValueString(resOpt);

            return (selects === 'one');
        },
        doAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait): void => {
            if (resOpt.directives) {
                resOpt.directives = resOpt.directives.copy();
            } else {
                resOpt.directives = new TraitDirectiveSet();
            }
            resOpt.directives.add('selectOne');
        },
        willRoundAdd: (appCtx: applierContext): boolean => {
            const dir: TraitDirectiveSet = appCtx.resOpt.directives;
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
            const sub: ICdmAttributeDef =
                appCtx.resTrait.parameterValues.getParameterValue('storeSelectionInAttribute').value as ICdmAttributeDef;
            appCtx.resAttNew.target = sub;
            appCtx.resAttNew.applierState.flex_remove = false;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();

            // add the trait that tells them what this means
            if (!sub.getAppliedTraitRefs()
                || !sub.getAppliedTraitRefs()
                    .find((atr: ICdmTraitRef) => atr.getObjectDefName() === 'is.linkedEntity.name')) {
                sub.addAppliedTrait('is.linkedEntity.name', true);
            }

            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
        },
        willCreateContext: (appCtx: applierContext): boolean => {
            const dir: TraitDirectiveSet = appCtx.resOpt.directives;
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
                type: cdmAttributeContextType.addedAttributeSupporting,
                name: '_selectedEntityName'
            };

            appCtx.attCtx = AttributeContextImpl.createChildUnder(appCtx.resOpt, acp);
        }
    },
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
                const format: string = appCtx.resTrait.parameterValues.getParameterValue('renameFormat')
                    .getValueString(appCtx.resOpt);
                const state: any = appCtx.resAttSource.applierState;
                const ordinal: string = (state && state.flex_currentOrdinal !== undefined) ? state.flex_currentOrdinal.toString() : '';
                if (!format) {
                    return;
                }
                const formatLength: number = format.length;
                if (formatLength === 0) {
                    return;
                }
                // parse the format looking for positions of {n} and {o} and text chunks around them
                // there are only 5 possibilies
                let upper: boolean = false;
                let iN: number = format.indexOf('{n}');
                if (iN < 0) {
                    iN = format.indexOf('{N}');
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
                const srcName: string = appCtx.resAttSource.resolvedName;
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
    {
        matchName: 'does.referenceEntityVia',
        priority: 4,
        overridesBase: false,
        willRemove: (appCtx: applierContext): boolean => {
            const dir: TraitDirectiveSet = appCtx.resOpt.directives;

            const isNorm: boolean = dir && dir.has('normalized');
            const isArray: boolean = dir && dir.has('isArray');
            const isRefOnly: boolean = dir && dir.has('referenceOnly');
            const alwaysAdd: boolean = appCtx.resTrait.parameterValues.getParameterValue('alwaysAddForeignKey')
                .getValueString(appCtx.resOpt) === 'true';
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
            const dir: TraitDirectiveSet = appCtx.resOpt.directives;

            const isNorm: boolean = dir && dir.has('normalized');
            const isArray: boolean = dir && dir.has('isArray');
            const isRefOnly: boolean = dir && dir.has('referenceOnly');
            const alwaysAdd: boolean = appCtx.resTrait.parameterValues.getParameterValue('alwaysAddForeignKey')
                .getValueString(appCtx.resOpt) === 'true';

            // add a foreign key and remove everything else when asked to do so.
            // however, avoid doing this for normalized arrays, since they remove all atts anyway
            return (isRefOnly || alwaysAdd) && (isNorm === false || isArray === false);
        },
        doRoundAdd: (appCtx: applierContext): void => {
            // get the added attribute and applied trait
            const sub: ICdmAttributeDef =
                appCtx.resTrait.parameterValues.getParameterValue('foreignKeyAttribute').value as ICdmAttributeDef;
            appCtx.resAttNew.target = sub;
            appCtx.resAttNew.applierState.flex_remove = false;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();

            // add the trait that tells them what this means
            if (!sub.getAppliedTraitRefs() || !sub.getAppliedTraitRefs()
                .find((atr: ICdmTraitRef) => atr.getObjectDefName() === 'is.linkedEntity.identifier')) {
                sub.addAppliedTrait('is.linkedEntity.identifier', true);
            }

            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
            if (appCtx.resAttNew.resolvedTraits) {
                appCtx.resAttNew.resolvedTraits = appCtx.resAttNew.resolvedTraits.deepCopy();
            }
        },
        willCreateContext: (appCtx: applierContext): boolean => {
            const dir: TraitDirectiveSet = appCtx.resOpt.directives;
            const isNorm: boolean = dir && dir.has('normalized');
            const isArray: boolean = dir && dir.has('isArray');
            const isRefOnly: boolean = dir && dir.has('referenceOnly');
            const alwaysAdd: boolean = appCtx.resTrait.parameterValues.getParameterValue('alwaysAddForeignKey')
                .getValueString(appCtx.resOpt) === 'true';

            // add a foreign key and remove everything else when asked to do so.
            // however, avoid doing this for normalized arrays, since they remove all atts anyway
            return (isRefOnly || alwaysAdd) && (isNorm === false || isArray === false);
        },
        doCreateContext: (appCtx: applierContext): void => {
            // make a new attributeContext to differentiate this foreign key att
            const acp: AttributeContextParameters = {
                under: appCtx.attCtx,
                type: cdmAttributeContextType.addedAttributeIdentity,
                name: '_foreignKey'
            };

            appCtx.attCtx = AttributeContextImpl.createChildUnder(appCtx.resOpt, acp);
        }
    },
    {
        matchName: 'does.explainArray',
        priority: 6,
        overridesBase: false,
        willGroupAdd: (appCtx: applierContext): boolean => {
            const dir: TraitDirectiveSet = appCtx.resOpt.directives;
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
            const sub: ICdmAttributeDef =
                appCtx.resTrait.parameterValues.getParameterValue('storeCountInAttribute').value as ICdmAttributeDef;
            appCtx.resAttNew.target = sub;
            appCtx.resAttNew.applierState.flex_remove = false;
            // use the default name.
            appCtx.resAttNew.resolvedName = sub.getName();

            // add the trait that tells them what this means
            if (!sub.getAppliedTraitRefs() || !sub.getAppliedTraitRefs()
                .find((atr: ICdmTraitRef) => atr.getObjectDefName() === 'is.linkedEntity.array.count')) {
                sub.addAppliedTrait('is.linkedEntity.array.count', true);
            }

            // get the resolved traits from attribute
            appCtx.resAttNew.resolvedTraits = sub.getResolvedTraits(appCtx.resOpt);
        },
        willCreateContext: (appCtx: applierContext): boolean => {
            return true;
        },
        doCreateContext: (appCtx: applierContext): void => {
            const acp: AttributeContextParameters = {
                under: appCtx.attCtx,
                type: cdmAttributeContextType.attributeDefinition
            };
            appCtx.attCtx = AttributeContextImpl.createChildUnder(appCtx.resOpt, acp);
        },
        willAttributeAdd: (appCtx: applierContext): boolean => {
            const dir: TraitDirectiveSet = appCtx.resOpt.directives;
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
                    const fixedSizeString: string = appCtx.resTrait.parameterValues.getParameterValue('maximumExpansion')
                        .getValueString(appCtx.resOpt);
                    let fixedSize: number = 1;
                    if (fixedSizeString && fixedSizeString !== 'undefined') {
                        fixedSize = Number.parseInt(fixedSizeString, 10);
                    }

                    const initialString: string = appCtx.resTrait.parameterValues.getParameterValue('startingIndex')
                        .getValueString(appCtx.resOpt);
                    let initial: number = 0;
                    if (initialString && initialString !== 'undefined') {
                        initial = Number.parseInt(initialString, 10);
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
                    // appCtx.resAttNew.resolvedName = template.resolvedName; // must solve problem with apply happening twice.
                    appCtx.resAttNew.resolvedName = (template.target as ICdmAttributeDef).getName();
                    appCtx.resAttNew.resolvedTraits = template.resolvedTraits.deepCopy();
                    appCtx.continue = state.flex_currentOrdinal < state.array_finalOrdinal;
                }

            }
        },
        willAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait): boolean => {
            const isArray: string = resTrait.parameterValues.getParameterValue('isArray')
                .getValueString(resOpt);

            return isArray === 'true';
        },
        doAlterDirectives: (resOpt: resolveOptions, resTrait: ResolvedTrait): void => {
            if (resOpt.directives) {
                resOpt.directives = resOpt.directives.copy();
            } else {
                resOpt.directives = new TraitDirectiveSet();
            }
            resOpt.directives.add('isArray');
        },
        willRemove: (appCtx: applierContext): boolean => {
            const dir: TraitDirectiveSet = appCtx.resOpt.directives;
            const isNorm: boolean = dir && dir.has('normalized');
            const isArray: boolean = dir && dir.has('isArray');

            // remove the 'template' attributes that got copied on expansion if they come here
            // also, normalized means that arrays of entities shouldn't be put inline
            // only remove the template attributes that seeded the array expansion
            const isTemplate: boolean = appCtx.resAttSource.applierState && appCtx.resAttSource.applierState.flex_remove;

            return isArray && (isTemplate || isNorm);
        }

    }
];

export { PrimitiveAppliers };
