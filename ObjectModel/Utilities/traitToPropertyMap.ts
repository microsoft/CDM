import {
    ArgumentValue,
    CdmCorpusContext,
    cdmObjectType,
    copyOptions,
    Entity,
    getTraitRefArgumentValue,
    getTraitRefIndex,
    getTraitRefName,
    ICdmArgumentDef,
    ICdmConstantEntityDef,
    ICdmEntityDef,
    ICdmObject,
    ICdmTraitRef,
    ICdmTypeAttributeDef,
    ResolvedTrait,
    ResolvedTraitSet,
    TraitReference,
    TypeAttribute
} from '../internal';

// attribute and entity traits that are represented as properties
// this entire class is gross. it is a different abstraction level than all of the rest of this om.
// however, it does make it easier to work with the consumption object model so ... i will hold my nose.
export class traitToPropertyMap {

    public hostEnt: ICdmEntityDef;
    public hostAtt: ICdmTypeAttributeDef;
    public traits: (ResolvedTrait | ICdmTraitRef)[];
    public hostRtsEnt: ResolvedTraitSet;
    public hostRtsAtt: ResolvedTraitSet;
    public ctx: CdmCorpusContext;

    public initForEntityDef(ctx: CdmCorpusContext, persistedObject: Entity, host: ICdmObject): void {
        // let bodyCode = () =>
        {
            this.ctx = ctx;
            this.hostEnt = host as ICdmEntityDef;
            this.traits = this.hostEnt.getExhibitedTraitRefs();
            // turn properties into traits for internal form
            if (persistedObject) {
                if (persistedObject.sourceName) {
                    this.setTraitArgument('is.CDS.sourceNamed', 'name', persistedObject.sourceName);
                }
                if (persistedObject.displayName) {
                    this.setLocalizedTraitTable('is.localized.displayedAs', persistedObject.displayName);
                }
                if (persistedObject.description) {
                    this.setLocalizedTraitTable('is.localized.describedAs', persistedObject.description);
                }
                if (persistedObject.version) {
                    this.setTraitArgument('is.CDM.entityVersion', 'versionNumber', persistedObject.version);
                }
                if (persistedObject.cdmSchemas) {
                    this.setSingleAttTraitTable('is.CDM.attributeGroup', 'groupList', 'attributeGroupSet', persistedObject.cdmSchemas);
                }
            }
        }
        // return p.measure(bodyCode);
    }

    public initForResolvedEntity(ctx: CdmCorpusContext, rtsEnt: ResolvedTraitSet): void {
        this.hostRtsEnt = rtsEnt;
        this.traits = rtsEnt.set;
        this.ctx = ctx;
    }

    public initForTypeAttributeDef(ctx: CdmCorpusContext, persistedObject: TypeAttribute, host: ICdmObject): void {
        // let bodyCode = () =>
        {
            this.ctx = ctx;
            this.hostAtt = host as ICdmTypeAttributeDef;
            this.traits = this.hostAtt.getAppliedTraitRefs();

            // turn properties into traits for internal form
            if (persistedObject) {
                if (persistedObject.isReadOnly) {
                    this.getTrait('is.readOnly', true, true);
                }
                if (persistedObject.isNullable) {
                    this.getTrait('is.nullable', true, true);
                }
                if (persistedObject.sourceName) {
                    this.setTraitArgument('is.CDS.sourceNamed', 'name', persistedObject.sourceName);
                }
                if (persistedObject.sourceOrdering) {
                    this.setTraitArgument('is.CDS.ordered', 'ordinal', persistedObject.sourceOrdering.toString());
                }
                if (persistedObject.displayName) {
                    this.setLocalizedTraitTable('is.localized.displayedAs', persistedObject.displayName);
                }
                if (persistedObject.description) {
                    this.setLocalizedTraitTable('is.localized.describedAs', persistedObject.description);
                }
                if (persistedObject.valueConstrainedToList) {
                    this.getTrait('is.constrainedList', true, true);
                }
                if (persistedObject.isPrimaryKey) {
                    this.getTrait('is.identifiedBy', true, true);
                }
                if (persistedObject.maximumLength) {
                    this.setTraitArgument('is.constrained', 'maximumLength', persistedObject.maximumLength.toString());
                }
                if (persistedObject.maximumValue) {
                    this.setTraitArgument('is.constrained', 'maximumValue', persistedObject.maximumValue);
                }
                if (persistedObject.minimumValue) {
                    this.setTraitArgument('is.constrained', 'minimumValue', persistedObject.minimumValue);
                }
                if (persistedObject.dataFormat) {
                    this.dataFormatToTraits(persistedObject.dataFormat);
                }
                if (persistedObject.defaultValue) {
                    this.setDefaultValue(persistedObject.defaultValue);
                }
            }
        }
        // return p.measure(bodyCode);
    }

    public initForResolvedAttribute(ctx: CdmCorpusContext, rtsAtt: ResolvedTraitSet): void {
        this.hostRtsAtt = rtsAtt;
        this.traits = rtsAtt.set;
        this.ctx = ctx;
    }

    public persistForEntityDef(persistedObject: Entity, options: copyOptions): void {
        // let bodyCode = () =>
        {
            const removedIndexes : (number)[] = [];
            if (this.traits) {
                const l: number = this.traits.length;
                for (let i: number = 0; i < l; i++) {
                    const traitName: string = getTraitRefName(this.traits[i]);
                    switch (traitName) {
                        case 'is.CDS.sourceNamed':
                            persistedObject.sourceName = getTraitRefArgumentValue(this.traits[i], 'name') as string;
                            removedIndexes.push(i);
                            break;
                        case 'is.localized.describedAs':
                            persistedObject.description = this.getLocalizedTraitTable('is.localized.describedAs');
                            if (options && options.removeSingleRowLocalizedTableTraits && persistedObject.description) {
                                const cEnt: ICdmConstantEntityDef = this.getTraitTable('is.localized.describedAs', 'localizedDisplayText');
                                if (cEnt.getConstantValues().length === 1) {
                                    removedIndexes.push(i);
                                }
                            }
                            break;
                        case 'is.localized.displayedAs':
                            persistedObject.displayName = this.getLocalizedTraitTable('is.localized.displayedAs');
                            if (options && options.removeSingleRowLocalizedTableTraits && persistedObject.displayName) {
                                const cEnt: ICdmConstantEntityDef = this.getTraitTable('is.localized.displayedAs', 'localizedDisplayText');
                                if (cEnt.getConstantValues().length === 1) {
                                    removedIndexes.push(i);
                                }
                            }
                            break;
                        case 'is.CDM.entityVersion':
                            persistedObject.version = getTraitRefArgumentValue(this.traits[i], 'versionNumber') as string;
                            removedIndexes.push(i);
                            break;
                        case 'is.CDM.attributeGroup':
                            persistedObject.cdmSchemas = this.getSingleAttTraitTable('is.CDM.attributeGroup', 'groupList');
                            removedIndexes.push(i);
                        default:
                    }
                }

                // remove applied traits from the persisted object back to front
                // could make this faster if needed
                for (let iRem: number = removedIndexes.length - 1; iRem >= 0; iRem--) {
                    persistedObject.exhibitsTraits.splice(removedIndexes[iRem], 1);
                }

                if (persistedObject.exhibitsTraits.length === 0) {
                    persistedObject.exhibitsTraits = undefined;
                }
            }
        }
        // return p.measure(bodyCode);
    }

    public persistForTypeAttributeDef(persistedObject: TypeAttribute, options: copyOptions): void {
        // let bodyCode = () =>
        {
            const removedIndexes: (number)[] = [];
            persistedObject.dataFormat = this.traitsToDataFormat(persistedObject.appliedTraits, removedIndexes);

            if (!this.traits) {
                return;
            }

            const l: number = this.traits.length;
            for (let i: number = 0; i < l; i++) {
                const traitName: string = getTraitRefName(this.traits[i]);
                switch (traitName) {
                    case 'is.CDS.sourceNamed':
                        persistedObject.sourceName = getTraitRefArgumentValue(this.traits[i], 'name') as string;
                        removedIndexes.push(i);
                        break;
                    case 'is.CDS.ordered':
                        persistedObject.sourceOrdering = parseInt(getTraitRefArgumentValue(this.traits[i], 'ordinal') as string, 10);
                        removedIndexes.push(i);
                        break;
                    case 'is.constrainedList':
                        persistedObject.valueConstrainedToList = true;
                        removedIndexes.push(i);
                        break;
                    case 'is.constrained':
                        const temp: string = getTraitRefArgumentValue(this.traits[i], 'maximumLength') as string;
                        if (temp !== undefined) {
                            persistedObject.maximumLength = parseInt(temp, 10);
                        }
                        persistedObject.maximumValue = getTraitRefArgumentValue(this.traits[i], 'maximumValue') as string;
                        persistedObject.minimumValue = getTraitRefArgumentValue(this.traits[i], 'minimumValue') as string;
                        removedIndexes.push(i);
                        break;
                    case 'is.readOnly':
                        persistedObject.isReadOnly = true;
                        removedIndexes.push(i);
                        break;
                    case 'is.nullable':
                        persistedObject.isNullable = true;
                        removedIndexes.push(i);
                        break;
                    case 'is.localized.describedAs':
                        persistedObject.description = this.getLocalizedTraitTable('is.localized.describedAs');
                        if (options && options.removeSingleRowLocalizedTableTraits && persistedObject.description) {
                            const cEnt: ICdmConstantEntityDef = this.getTraitTable('is.localized.describedAs', 'localizedDisplayText');
                            if (cEnt.getConstantValues().length === 1) {
                                removedIndexes.push(i);
                            }
                        }
                        break;
                    case 'is.localized.displayedAs':
                        persistedObject.displayName = this.getLocalizedTraitTable('is.localized.displayedAs');
                        if (options && options.removeSingleRowLocalizedTableTraits && persistedObject.displayName) {
                            const cEnt: ICdmConstantEntityDef = this.getTraitTable('is.localized.displayedAs', 'localizedDisplayText');
                            if (cEnt.getConstantValues().length === 1) {
                                removedIndexes.push(i);
                            }
                        }
                        break;
                    case 'is.identifiedBy':
                        const ib: ArgumentValue = getTraitRefArgumentValue(this.traits[i], 'attribute');

                        persistedObject.isPrimaryKey = true;
                        removedIndexes.push(i);
                        break;
                    case 'does.haveDefault':
                        persistedObject.defaultValue = this.getDefaultValue();
                        removedIndexes.push(i);
                    default:
                }
            }
            // remove applied traits from the persisted object back to front
            // could make this faster if needed
            for (let iRem: number = removedIndexes.length - 1; iRem >= 0; iRem--) {
                persistedObject.appliedTraits.splice(removedIndexes[iRem], 1);
            }

            if (persistedObject.appliedTraits.length === 0) {
                persistedObject.appliedTraits = undefined;
            }
        }
        // return p.measure(bodyCode);
    }

    public setPropertyValue(propertyName: string, newValue: any | ArgumentValue | string[]): void {
        // let bodyCode = () =>
        {
            if (newValue === undefined) {
                if (this.hostAtt) {
                    this.hostAtt.removeAppliedTrait(propertyName);
                } // validate a known prop?
                if (this.hostEnt) {
                    this.hostEnt.removeExhibitedTrait(propertyName);
                } // validate a known prop?
            } else {
                switch (propertyName) {
                    case 'version':
                        this.setTraitArgument('is.CDM.entityVersion', 'versionNumber', newValue as ArgumentValue);
                        break;
                    case 'cdmSchemas':
                        this.setSingleAttTraitTable('is.CDM.attributeGroup', 'groupList', 'attributeGroupSet', newValue as string[]);
                        break;
                    case 'sourceName':
                        this.setTraitArgument('is.CDS.sourceNamed', 'name', newValue as ArgumentValue);
                        break;
                    case 'displayName':
                        this.setLocalizedTraitTable('is.localized.displayedAs', newValue as string);
                        break;
                    case 'description':
                        this.setLocalizedTraitTable('is.localized.describedAs', newValue as string);
                        break;
                    case 'sourceOrdering':
                        this.setTraitArgument('is.CDS.ordered', 'ordinal', newValue.toString());
                        break;
                    case 'isPrimaryKey':
                        if (newValue) {
                            this.getTrait('is.identifiedBy', true, true);
                        }
                        if (!newValue) {
                            this.hostAtt.removeAppliedTrait('is.identifiedBy');
                        }
                        break;
                    case 'isReadOnly':
                        if (newValue) {
                            this.getTrait('is.readOnly', true, true);
                        }
                        if (!newValue) {
                            this.hostAtt.removeAppliedTrait('is.readOnly');
                        }
                        break;
                    case 'isNullable':
                        if (newValue) {
                            this.getTrait('is.nullable', true, true);
                        }
                        if (!newValue) {
                            this.hostAtt.removeAppliedTrait('is.nullable');
                        }
                        break;
                    case 'valueConstrainedToList':
                        if (newValue) {
                            this.getTrait('is.constrainedList', true, true);
                        }
                        if (!newValue) {
                            this.hostAtt.removeAppliedTrait('is.constrainedList');
                        }
                        break;
                    case 'maximumValue':
                        this.setTraitArgument('is.constrained', 'maximumValue', newValue as ArgumentValue);
                        break;
                    case 'minimumValue':
                        this.setTraitArgument('is.constrained', 'minimumValue', newValue as ArgumentValue);
                        break;
                    case 'maximumLength':
                        this.setTraitArgument('is.constrained', 'maximumLength', newValue.toString());
                        break;
                    case 'dataFormat':
                        this.dataFormatToTraits(newValue as string);
                        break;
                    case 'defaultValue':
                        this.setDefaultValue(newValue);
                        break;
                    default:
                }
            }

        }
        // return p.measure(bodyCode);
    }
    public getPropertyValue(propertyName: string): ArgumentValue | string[] | number | boolean | any {
        // let bodyCode = () =>
        {
            switch (propertyName) {
                case 'version':
                    return getTraitRefArgumentValue(this.getTrait('is.CDM.entityVersion', false), 'versionNumber');
                case 'sourceName':
                    return getTraitRefArgumentValue(this.getTrait('is.CDS.sourceNamed', false), 'name');
                case 'displayName':
                    return this.getLocalizedTraitTable('is.localized.displayedAs');
                case 'description':
                    return this.getLocalizedTraitTable('is.localized.describedAs');
                case 'cdmSchemas':
                    return this.getSingleAttTraitTable('is.CDM.attributeGroup', 'groupList');
                case 'sourceOrdering':
                    return parseInt(getTraitRefArgumentValue(this.getTrait('is.CDS.ordered', false), 'ordinal') as string, 10);
                case 'isPrimaryKey':
                    return this.getTrait('is.identifiedBy', false) !== undefined;
                case 'isNullable':
                    return this.getTrait('is.nullable', false) !== undefined;
                case 'isReadOnly':
                    return this.getTrait('is.readOnly', false) !== undefined;
                case 'valueConstrainedToList':
                    return this.getTrait('is.constrainedList', false) !== undefined;
                case 'maximumValue':
                    return getTraitRefArgumentValue(this.getTrait('is.constrained', false), 'maximumValue');
                case 'minimumValue':
                    return getTraitRefArgumentValue(this.getTrait('is.constrained', false), 'minimumValue');
                case 'maximumLength':
                    const temp: string = getTraitRefArgumentValue(this.getTrait('is.constrained', false), 'maximumLength') as string;
                    if (temp !== undefined) {
                        return parseInt(temp, 10);
                    }
                    break;
                case 'dataFormat':
                    return this.traitsToDataFormat();
                case 'primaryKey':
                    const attRef: ArgumentValue = getTraitRefArgumentValue(this.getTrait('is.identifiedBy', false), 'attribute');
                    if (attRef) {
                        return (attRef as ICdmObject).getObjectDefName();
                    }
                    break;
                case 'defaultValue':
                    return this.getDefaultValue();
                default:
            }
        }
        // return p.measure(bodyCode);
    }

    public dataFormatToTraits(dataFormat: string): void {
        // let bodyCode = () =>
        {
            // if this is going to be called many times, then need to remove any dataformat traits that are left behind.
            // but ... probably not. in fact, this is probably never used because data formats come from data type which is not an attribute
            switch (dataFormat) {
                case 'Int16':
                    this.getTrait('is.dataFormat.integer', true, true);
                    this.getTrait('is.dataFormat.small', true, true);
                    break;
                case 'Int32':
                    this.getTrait('is.dataFormat.integer', true, true);
                    this.getTrait('is.dataFormat.small', true, true);
                    break;
                case 'Int64':
                    this.getTrait('is.dataFormat.integer', true, true);
                    this.getTrait('is.dataFormat.big', true, true);
                    break;
                case 'Float':
                    this.getTrait('is.dataFormat.floatingPoint', true, true);
                    break;
                case 'Double':
                    this.getTrait('is.dataFormat.floatingPoint', true, true);
                    this.getTrait('is.dataFormat.big', true, true);
                    break;
                case 'Guid':
                    this.getTrait('is.dataFormat.guid', true, true);
                case 'String':
                    this.getTrait('is.dataFormat.array', true, true);
                case 'Char':
                    this.getTrait('is.dataFormat.character', true, true);
                    this.getTrait('is.dataFormat.big', true, true);
                    break;
                case 'Byte':
                    this.getTrait('is.dataFormat.byte', true, true);
                case 'Binary':
                    this.getTrait('is.dataFormat.array', true, true);
                    break;
                case 'Time':
                    this.getTrait('is.dataFormat.time', true, true);
                    break;
                case 'Date':
                    this.getTrait('is.dataFormat.date', true, true);
                    break;
                case 'DateTimeOffset':
                    this.getTrait('is.dataFormat.time', true, true);
                    this.getTrait('is.dataFormat.date', true, true);
                    break;
                case 'Boolean':
                    this.getTrait('is.dataFormat.boolean', true, true);
                    break;
                case 'Decimal':
                    this.getTrait('is.dataFormat.numeric.shaped', true, true);
                    break;
                default:
            }
        }
        // return p.measure(bodyCode);
    }

    public traitsToDataFormat(removeFrom?: (string | TraitReference)[], removedIndexes?: number[]): string {
        // let bodyCode = () =>
        {
            let isArray: boolean = false;
            let isBig: boolean = false;
            let isSmall: boolean = false;
            let baseType: string = 'Unknown';
            if (!this.traits) {
                return undefined;
            }

            const startingRemoved: number = removedIndexes ? removedIndexes.length : 0;
            const l: number = this.traits.length;
            for (let i: number = 0; i < l; i++) {
                const traitName: string = getTraitRefName(this.traits[i]);
                let removedPosition: number = i;
                switch (traitName) {
                    case 'is.dataFormat.array':
                        isArray = true;
                        break;
                    case 'is.dataFormat.big':
                        isBig = true;
                        break;
                    case 'is.dataFormat.small':
                        isSmall = true;
                        break;
                    case 'is.dataFormat.integer':
                        baseType = 'Int';
                        break;
                    case 'is.dataFormat.floatingPoint':
                        baseType = 'Float';
                        break;
                    case 'is.dataFormat.character':
                        baseType = baseType !== 'Guid' ? 'Char' : baseType;
                        break;
                    case 'is.dataFormat.byte':
                        baseType = 'Byte';
                        break;
                    case 'is.dataFormat.date':
                        baseType = baseType === 'Time' ? 'DateTimeOffset' : 'Date';
                        break;
                    case 'is.dataFormat.time':
                        baseType = baseType === 'Date' ? 'DateTimeOffset' : 'Time';
                        break;
                    case 'is.dataFormat.boolean':
                        baseType = 'Boolean';
                        break;
                    case 'is.dataFormat.numeric.shaped':
                        baseType = 'Decimal';
                        break;
                    case 'is.dataFormat.guid':
                        baseType = 'Guid';
                        break;
                    default:
                        removedPosition = -1;
                }
                if (removedPosition !== -1 && removedIndexes) {
                    removedIndexes.push(removedPosition);
                }
            }

            if (isArray) {
                if (baseType === 'Char') {
                    baseType = 'String';
                } else if (baseType === 'Byte') {
                    baseType = 'Binary';
                } else if (baseType !== 'Guid') {
                    baseType = 'Unknown';
                }
            }

            if (baseType === 'Float' && isBig) {
                baseType = 'Double';
            }
            if (baseType === 'Int' && isBig) {
                baseType = 'Int64';
            }
            if (baseType === 'Int' && isSmall) {
                baseType = 'Int16';
            }
            if (baseType === 'Int') {
                baseType = 'Int32';
            }

            if (baseType === 'Unknown') {
                // couldn't figure it out. undo the changes
                if (removedIndexes) {
                    removedIndexes.splice(startingRemoved);
                }
            }
            if (baseType === 'Unknown') {
                return undefined;
            }

            return baseType;
        }
        // return p.measure(bodyCode);
    }

    public getTrait(trait: string | ICdmTraitRef | ResolvedTrait, create: boolean = false, simpleRef: boolean = false): ICdmTraitRef {
        let traitName: string;
        let resultantTrait: string | ICdmTraitRef | ResolvedTrait = trait;
        if (typeof (trait) === 'string') {
            let iTrait: number;
            traitName = trait;
            resultantTrait = undefined;
            iTrait = getTraitRefIndex(this.traits, traitName);
            if (iTrait !== -1) {
                resultantTrait = this.traits[iTrait];
            }
        }

        if (!resultantTrait && create) {
            if (simpleRef) {
                resultantTrait = traitName;
            } else {
                resultantTrait = this.ctx.corpus.MakeObject<ICdmTraitRef>(cdmObjectType.traitRef, traitName);
            }
            if (this.hostAtt) {
                resultantTrait = this.hostAtt.addAppliedTrait(resultantTrait, false);
            }
            if (this.hostEnt) {
                resultantTrait = this.hostEnt.addExhibitedTrait(resultantTrait, false);
            }
        }

        return resultantTrait as ICdmTraitRef;
    }

    public setTraitArgument(trait: string | ICdmTraitRef, argName: string, value: ArgumentValue): void {
        const resultantTrait: ICdmTraitRef = this.getTrait(trait, true, false);
        const args: ICdmArgumentDef[] = resultantTrait.getArgumentDefs();
        if (!args || !args.length) {
            resultantTrait.addArgument(argName, value);

            return;
        }

        for (const arg of args) {
            if (arg.getName() === argName) {
                arg.setValue(value);

                return;
            }
        }
        resultantTrait.addArgument(argName, value);
    }

    public setTraitTable(trait: string | ICdmTraitRef, argName: string, entityName: string,
                         action: (cEnt: ICdmConstantEntityDef, created: boolean) => void): void {
        // let bodyCode = () =>
        {
            const resultantTrait: ICdmTraitRef = this.getTrait(trait, true, false);
            if (!resultantTrait.getArgumentDefs() || !resultantTrait.getArgumentDefs().length) {
                // make the argument nothing but a ref to a constant entity
                // safe since there is only one param for the trait and it looks cleaner
                const cEnt: ICdmConstantEntityDef = this.ctx.corpus.MakeObject<ICdmConstantEntityDef>(cdmObjectType.constantEntityDef);
                cEnt.setEntityShape(this.ctx.corpus.MakeRef(cdmObjectType.entityRef, entityName, true));
                action(cEnt, true);
                resultantTrait.addArgument(argName, this.ctx.corpus.MakeRef(cdmObjectType.entityRef, cEnt, false));
            } else {
                const locEntRef: ICdmObject = getTraitRefArgumentValue(resultantTrait, argName) as ICdmObject;
                if (locEntRef) {
                    const locEnt: ICdmConstantEntityDef = locEntRef.getObjectDef(undefined) as ICdmConstantEntityDef;
                    if (locEnt) {
                        action(locEnt, false);
                    }
                }
            }
        }
        // return p.measure(bodyCode);
    }

    public getTraitTable(trait: string | ICdmTraitRef | ResolvedTrait, argName: string): ICdmConstantEntityDef {
        // let bodyCode = () =>
        {
            if (!trait) {
                return undefined;
            }

            let resultantTrait: ResolvedTrait | ICdmTraitRef;
            if (typeof (trait) === 'string') {
                let iTrait: number;
                iTrait = getTraitRefIndex(this.traits, trait);
                if (iTrait === -1) {
                    return undefined;
                }
                resultantTrait = this.traits[iTrait];
            } else {
                resultantTrait = trait;
            }

            const locEntRef: ICdmObject = getTraitRefArgumentValue(resultantTrait, argName) as ICdmObject;
            if (locEntRef) {
                return locEntRef.getObjectDef(undefined) as ICdmConstantEntityDef;
            }
        }
        // return p.measure(bodyCode);
    }

    public setLocalizedTraitTable(traitName: string, sourceText: string): void {
        // let bodyCode = () =>
        {
            this.setTraitTable(traitName, 'localizedDisplayText', 'localizedTable', (cEnt: ICdmConstantEntityDef, created: boolean) => {
                if (created) {
                    cEnt.setConstantValues([['en', sourceText]]);
                } else {
                    cEnt.setWhere(undefined, 1, sourceText, 0, 'en');
                }  // need to use ordinals because no binding done yet
            });
        }
        // return p.measure(bodyCode);
    }

    public getLocalizedTraitTable(trait: string | ICdmTraitRef): string {
        // let bodyCode = () =>
        {
            const cEnt: ICdmConstantEntityDef = this.getTraitTable(trait, 'localizedDisplayText');
            if (cEnt) {
                return cEnt.lookupWhere(undefined, 1, 0, 'en');
            } // need to use ordinals because no binding done yet
        }
        // return p.measure(bodyCode);
    }

    public setSingleAttTraitTable(trait: string | ICdmTraitRef, argName: string, entityName: string, sourceText: string[]): void {
        this.setTraitTable(trait, argName, entityName, (cEnt: ICdmConstantEntityDef, created: boolean) => {
            // turn array of strings into array of array of strings;
            const vals : (string[])[] = [];
            sourceText.forEach((v: string) => { const r: string[] = []; r.push(v); vals.push(r); });
            cEnt.setConstantValues(vals);
        });
    }
    public getSingleAttTraitTable(trait: string | ICdmTraitRef, argName: string): string[] {
        const cEnt : ICdmConstantEntityDef = this.getTraitTable(trait, argName);
        if (cEnt) {
            // turn array of arrays into single array of strings
            const result : (string)[] = [];
            cEnt.getConstantValues()
                .forEach((v: string[]) => { result.push(v[0]); });

            return result;
        }
    }

    public getDefaultValue(): any {
        const trait: ICdmTraitRef = this.getTrait('does.haveDefault', false);
        if (trait) {
            let defVal: any = getTraitRefArgumentValue(trait, 'default');
            if (defVal !== undefined) {
                if (typeof (defVal) === 'string') {
                    return defVal;
                }
                if (defVal.getObjectType() === cdmObjectType.entityRef) {
                    // no doc or directives should work ?
                    const cEnt: ICdmConstantEntityDef = defVal.getObjectDef(undefined) as ICdmConstantEntityDef;

                    if (cEnt) {
                        const esName: string = cEnt.getEntityShape()
                            .getObjectDefName();
                        const corr: boolean = esName === 'listLookupCorrelatedValues';
                        const lookup: boolean = esName === 'listLookupValues';
                        if (esName === 'localizedTable' || lookup || corr) {
                            const result : (object)[] = [];
                            const rawValues: string[][] = cEnt.getConstantValues();
                            const l: number = rawValues.length;
                            for (let i: number = 0; i < l; i++) {
                                const row : any = {};
                                const rawRow: string[] = rawValues[i];
                                if (rawRow.length === 2 || (lookup && rawRow.length === 4) || (corr && rawRow.length === 5)) {
                                    row.languageTag = rawRow[0];
                                    row.displayText = rawRow[1];
                                    if (lookup || corr) {
                                        row.attributeValue = rawRow[2];
                                        row.displayOrder = rawRow[3];
                                        if (corr) {
                                            row.correlatedValue = rawRow[4];
                                        }
                                    }
                                }
                                result.push(row);
                            }

                            return result;
                        } else {
                            // an unknown entity shape. only thing to do is serialize the object
                            defVal = defVal.copyData(undefined, undefined);
                        }
                    }
                } else {
                    // is it a cdm object?
                    if (defVal.getObjectType !== undefined) {
                        defVal = defVal.copyData(undefined, undefined);
                    }
                }
            }

            return defVal;
        }
    }

    public setDefaultValue(newDefault: any): void {
        const trait: ICdmTraitRef = this.getTrait('does.haveDefault', true, false);
        if (newDefault instanceof Array) {
            const a: any[] = newDefault;
            const l: number = a.length;
            if (l && a[0].languageTag !== undefined && a[0].displayText !== undefined) {
                // looks like something we understand
                const tab : (string[])[] = [];
                const corr: boolean = (a[0].correlatedValue !== undefined);
                const lookup: boolean = (a[0].displayOrder !== undefined && a[0].attributeValue !== undefined);
                for (let i: number = 0; i < l; i++) {
                    const row : (string)[] = [];
                    row.push(a[i].languageTag);
                    row.push(a[i].displayText);
                    if (lookup || corr) {
                        row.push(a[i].attributeValue);
                        row.push(a[i].displayOrder);
                        if (corr) {
                            row.push(a[i].correlatedValue);
                        }
                    }
                    tab.push(row);
                }
                const cEnt: ICdmConstantEntityDef = this.ctx.corpus.MakeObject<ICdmConstantEntityDef>(cdmObjectType.constantEntityDef);
                cEnt.setEntityShape(
                    this.ctx.corpus.MakeRef(cdmObjectType.entityRef, corr ? 'listLookupCorrelatedValues' : 'listLookupValues', true));
                cEnt.setConstantValues(tab);
                newDefault = this.ctx.corpus.MakeRef(cdmObjectType.entityRef, cEnt, false);
            }
        }
        this.setTraitArgument(trait, 'default', newDefault);
    }

}
