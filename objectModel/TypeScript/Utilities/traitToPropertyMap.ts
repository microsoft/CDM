// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    ArgumentValue,
    CdmArgumentDefinition,
    CdmCollection,
    CdmConstantEntityDefinition,
    CdmCorpusContext,
    cdmDataFormat,
    CdmEntityReference,
    CdmObject,
    CdmObjectDefinition,
    CdmObjectReference,
    cdmObjectType,
    cdmLogCode,
    CdmTraitCollection,
    CdmTraitReference,
    CdmTraitGroupReference,
    CdmTypeAttributeDefinition,
    Logger,
    ResolvedTrait
} from '../internal';

const traitToListOfProperties: Map<string, string[]> =
    new Map([
        ['is.CDM.entityVersion', ['version']],
        ['is.CDM.attributeGroup', ['cdmSchemas']],
        ['is.CDM.sourceNamed', ['sourceName']],
        ['is.localized.displayedAs', ['displayName']],
        ['is.localized.describedAs', ['description']],
        ['is.CDS.ordered', ['sourceOrdering']],
        ['is.readOnly', ['isReadOnly']],
        ['is.nullable', ['isNullable']],
        ['is.constrainedList', ['valueConstrainedToList']],
        ['is.constrained', ['maximumValue', 'minimumValue', 'maximumLength']]
    ]);

const dataFormatTraitNames: string[] = [
    'is.dataFormat.integer',
    'is.dataFormat.small',
    'is.dataFormat.big',
    'is.dataFormat.floatingPoint',
    'is.dataFormat.guid',
    'is.dataFormat.character',
    'is.dataFormat.array',
    'is.dataFormat.byte',
    'is.dataFormat.time',
    'is.dataFormat.date',
    'is.dataFormat.timeOffset',
    'is.dataFormat.boolean',
    'is.dataFormat.numeric.shaped',
    'means.content.text.JSON'
];

/**
 * @internal
 * attribute and entity traits that are represented as properties
 * this entire class is gross. it is a different abstraction level than all of the rest of this om.
 * however, it does make it easier to work with the consumption object model so ... i will hold my nose.
 */
export class traitToPropertyMap {
    private TAG: string = traitToPropertyMap.name;
    
    private host: CdmObject;

    private get ctx(): CdmCorpusContext {
        return this.host.ctx;
    }

    private get traits(): CdmTraitCollection {
        if ('appliedTraits' in this.host) {
            return (this.host as CdmObjectReference).appliedTraits;
        }
        if ('exhibitsTraits' in this.host) {
            return (this.host as CdmObjectDefinition).exhibitsTraits;
        }
    }

    constructor(host: CdmObject) {
        this.host = host;
    }

    /**
     * @internal
     */
    public updatePropertyValue(propertyName: string, newValue: any | ArgumentValue | string[]): void {
        const traitName: string = this.mapTraitName(propertyName);
        const listOfProps: string[] = traitToListOfProperties.get(traitName);
        const multipleProperties: boolean = listOfProps && listOfProps.length > 1;

        if (newValue === undefined && !multipleProperties) {
            this.removeTrait(traitName);
        } else {
            switch (propertyName) {
                case 'version':
                    this.updateTraitArgument('is.CDM.entityVersion', 'versionNumber', newValue as ArgumentValue);
                    break;
                case 'cdmSchemas':
                    this.updateSingleAttributeTraitTable('is.CDM.attributeGroup', 'groupList', 'attributeGroupSet', newValue as string[]);
                    break;
                case 'sourceName':
                    this.updateTraitArgument('is.CDS.sourceNamed', 'name', newValue as ArgumentValue);
                    break;
                case 'displayName':
                    this.constructLocalizedTraitTable('is.localized.displayedAs', newValue as string);
                    break;
                case 'description':
                    this.constructLocalizedTraitTable('is.localized.describedAs', newValue as string);
                    break;
                case 'sourceOrdering':
                    this.updateTraitArgument('is.CDS.ordered', 'ordinal', newValue.toString());
                    break;
                case 'isPrimaryKey':
                    this.updateTraitArgument('is.identifiedBy', '', newValue);
                    break;
                case 'isReadOnly':
                    this.mapBooleanTrait('is.readOnly', newValue as boolean);
                    break;
                case 'isNullable':
                    this.mapBooleanTrait('is.nullable', newValue as boolean);
                    break;
                case 'valueConstrainedToList':
                    this.mapBooleanTrait('is.constrainedList', newValue as boolean);
                    break;
                case 'maximumValue':
                    this.updateTraitArgument('is.constrained', 'maximumValue', newValue as ArgumentValue);
                    break;
                case 'minimumValue':
                    this.updateTraitArgument('is.constrained', 'minimumValue', newValue as ArgumentValue);
                    break;
                case 'maximumLength':
                    this.updateTraitArgument('is.constrained', 'maximumLength', newValue !== undefined ? newValue.toString() : undefined);
                    break;
                case 'dataFormat':
                    this.dataFormatToTraits(newValue);
                    break;
                case 'defaultValue':
                    this.updateDefaultValue(newValue);
                    break;
                default:
            }
        }
    }

    /**
     * @internal
     */
    public fetchPropertyValue(propertyName: string, fromProperty: boolean = false): ArgumentValue | string[] | number | boolean | any {
        switch (propertyName) {
            case 'version':
                return this.fetchTraitReferenceArgumentValue(this.fetchTraitReference('is.CDM.entityVersion', fromProperty), 'versionNumber');
            case 'sourceName':
                return this.fetchTraitReferenceArgumentValue(this.fetchTraitReference('is.CDS.sourceNamed', fromProperty), 'name');
            case 'displayName':
                return this.fetchLocalizedTraitTable('is.localized.displayedAs', fromProperty);
            case 'description':
                return this.fetchLocalizedTraitTable('is.localized.describedAs', fromProperty);
            case 'cdmSchemas':
                return this.fetchSingleAttTraittable('is.CDM.attributeGroup', 'groupList', fromProperty);
            case 'sourceOrdering':
                return parseInt(this.fetchTraitReferenceArgumentValue(this.fetchTraitReference('is.CDS.ordered', fromProperty), 'ordinal') as string, 10);
            case 'isPrimaryKey':
                if (this.host instanceof CdmTypeAttributeDefinition) {
                    const typeAttribute: CdmTypeAttributeDefinition = this.host;
                    if (!fromProperty && typeAttribute.purpose && typeAttribute.purpose.namedReference === 'identifiedBy') {
                        return true;
                    }
                }

                return this.fetchTraitReference('is.identifiedBy', fromProperty) !== undefined;
            case 'isNullable':
                return this.fetchTraitReference('is.nullable', fromProperty) !== undefined;
            case 'isReadOnly':
                return this.fetchTraitReference('is.readOnly', fromProperty) !== undefined;
            case 'isResolved':
                const trait = this.fetchTraitReference('has.entitySchemaAbstractionLevel', fromProperty)
                return  trait?.arguments?.fetchValue('level') === 'resolved'
            case 'valueConstrainedToList':
                return this.fetchTraitReference('is.constrainedList', fromProperty) !== undefined;
            case 'maximumValue':
                return this.fetchTraitReferenceArgumentValue(this.fetchTraitReference('is.constrained', fromProperty), 'maximumValue');
            case 'minimumValue':
                return this.fetchTraitReferenceArgumentValue(this.fetchTraitReference('is.constrained', fromProperty), 'minimumValue');
            case 'maximumLength':
                const temp: string = this.fetchTraitReferenceArgumentValue(this.fetchTraitReference('is.constrained', fromProperty), 'maximumLength') as string;
                if (temp !== undefined) {
                    return parseInt(temp, 10);
                }
                break;
            case 'dataFormat':
                return this.traitsToDataFormat(fromProperty);
            case 'primaryKey':
                const attRef: ArgumentValue = this.fetchTraitReferenceArgumentValue(this.fetchTraitReference('is.identifiedBy', fromProperty), 'attribute');
                if (attRef) {
                    return (attRef as CdmObject).fetchObjectDefinitionName();
                }
                break;
            case 'defaultValue':
                return this.fetchDefaultValue(fromProperty);
            default:
        }
    }

    /**
     * @internal
     */
    public fetchTraitReference(traitName: string, fromProperty: boolean = false): CdmTraitReference {
        const traitIndex: number = this.traits === undefined ? -1 : this.traits.indexOf(traitName, fromProperty);

        return traitIndex !== -1 ? this.traits.allItems[traitIndex] as CdmTraitReference : undefined;
    }

    /**
     * @internal
     */
    public removeTrait(traitName: string): void {
        this.traits.remove(traitName, true);
    }

    /**
     * @internal
     */
    public mapBooleanTrait(traitName: string, value: boolean): void {
        if (value === true) {
            this.fetchOrCreateTrait(traitName, true);
        } else {
            this.removeTrait(traitName);
        }
    }

    /**
     * @internal
     */
    public dataFormatToTraits(dataFormat: cdmDataFormat): void {
        // reset the current dataFormat
        for (const traitName of dataFormatTraitNames) {
            this.removeTrait(traitName);
        }
        switch (dataFormat) {
            case cdmDataFormat.int16:
                this.fetchOrCreateTrait('is.dataFormat.integer', true);
                this.fetchOrCreateTrait('is.dataFormat.small', true);
                break;
            case cdmDataFormat.int32:
                this.fetchOrCreateTrait('is.dataFormat.integer', true);
                break;
            case cdmDataFormat.int64:
                this.fetchOrCreateTrait('is.dataFormat.integer', true);
                this.fetchOrCreateTrait('is.dataFormat.big', true);
                break;
            case cdmDataFormat.float:
                this.fetchOrCreateTrait('is.dataFormat.floatingPoint', true);
                break;
            case cdmDataFormat.double:
                this.fetchOrCreateTrait('is.dataFormat.floatingPoint', true);
                this.fetchOrCreateTrait('is.dataFormat.big', true);
                break;
            case cdmDataFormat.guid:
                this.fetchOrCreateTrait('is.dataFormat.guid', true);
                this.fetchOrCreateTrait('is.dataFormat.character', true);
                this.fetchOrCreateTrait('is.dataFormat.array', true);
                break;
            case cdmDataFormat.string:
                this.fetchOrCreateTrait('is.dataFormat.character', true);
                this.fetchOrCreateTrait('is.dataFormat.array', true);
                break;
            case cdmDataFormat.char:
                this.fetchOrCreateTrait('is.dataFormat.character', true);
                this.fetchOrCreateTrait('is.dataFormat.big', true);
                break;
            case cdmDataFormat.byte:
                this.fetchOrCreateTrait('is.dataFormat.byte', true);
                break;
            case cdmDataFormat.binary:
                this.fetchOrCreateTrait('is.dataFormat.byte', true);
                this.fetchOrCreateTrait('is.dataFormat.array', true);
                break;
            case cdmDataFormat.time:
                this.fetchOrCreateTrait('is.dataFormat.time', true);
                break;
            case cdmDataFormat.date:
                this.fetchOrCreateTrait('is.dataFormat.date', true);
                break;
            case cdmDataFormat.dateTime:
                this.fetchOrCreateTrait('is.dataFormat.time', true);
                this.fetchOrCreateTrait('is.dataFormat.date', true);
                break;
            case cdmDataFormat.dateTimeOffset:
                this.fetchOrCreateTrait('is.dataFormat.time', true);
                this.fetchOrCreateTrait('is.dataFormat.date', true);
                this.fetchOrCreateTrait('is.dataFormat.timeOffset', true);
                break;
            case cdmDataFormat.boolean:
                this.fetchOrCreateTrait('is.dataFormat.boolean', true);
                break;
            case cdmDataFormat.decimal:
                this.fetchOrCreateTrait('is.dataFormat.numeric.shaped', true);
                break;
            case cdmDataFormat.json:
                this.fetchOrCreateTrait('is.dataFormat.array', true);
                this.fetchOrCreateTrait('means.content.text.JSON', true);
                break;
            default:
        }
    }

    /**
     * @internal
     */
    public mapTraitName(propertyName: string): string {
        switch (propertyName) {
            case 'version':
                return 'is.CDM.entityVersion';
            case 'cdmSchemas':
                return 'is.CDM.attributeGroup';
            case 'sourceName':
                return 'is.CDS.sourceNamed';
            case 'displayName':
                return 'is.localized.displayedAs';
            case 'description':
                return 'is.localized.describedAs';
            case 'sourceOrdering':
                return 'is.CDS.ordered';
            case 'isPrimaryKey':
                return 'is.identifiedBy';
            case 'isReadOnly':
                return 'is.readOnly';
            case 'isNullable':
                return 'is.nullable';
            case 'valueConstrainedToList':
                return 'is.constrainedList';
            case 'maximumValue':
            case 'minimumValue':
            case 'maximumLength':
                return 'is.constrained';
            default:
                return propertyName;
        }
    }

    /**
     * @internal
     */
    public traitsToDataFormat(onlyFromProperty: boolean = false): cdmDataFormat {
        let isArray: boolean = false;
        let isBig: boolean = false;
        let isSmall: boolean = false;
        let isInteger: boolean = false;
        let probablyJson: boolean = false;
        if (!this.traits) {
            return undefined;
        }

        let baseType: cdmDataFormat = 0;
        for (const trait of this.traits) {
            if (onlyFromProperty && 
                (trait instanceof CdmTraitGroupReference || !(trait as CdmTraitReference).isFromProperty)) {
                continue;
            }
            const traitName: string = trait.fetchObjectDefinitionName();
            // tslint:disable:switch-default
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
                    isInteger = true;
                    break;
                case 'is.dataFormat.floatingPoint':
                    baseType = cdmDataFormat.float;
                    break;
                case 'is.dataFormat.character':
                    baseType = baseType !== cdmDataFormat.guid ? cdmDataFormat.char : baseType;
                    break;
                case 'is.dataFormat.byte':
                    baseType = cdmDataFormat.byte;
                    break;
                case 'is.dataFormat.date':
                    baseType = baseType === cdmDataFormat.time ? cdmDataFormat.dateTime : cdmDataFormat.date;
                    break;
                case 'is.dataFormat.time':
                    baseType = baseType === cdmDataFormat.date ? cdmDataFormat.dateTime : cdmDataFormat.time;
                    break;
                case 'is.dataFormat.timeOffset':
                    baseType = baseType === cdmDataFormat.dateTime ? cdmDataFormat.dateTimeOffset : baseType;
                    break;
                case 'is.dataFormat.boolean':
                    baseType = cdmDataFormat.boolean;
                    break;
                case 'is.dataFormat.numeric.shaped':
                    baseType = cdmDataFormat.decimal;
                    break;
                case 'is.dataFormat.guid':
                    baseType = cdmDataFormat.guid;
                    break;
                case 'means.content.text.JSON':
                    baseType = isArray ? cdmDataFormat.json : cdmDataFormat.unknown;
                    probablyJson = true;
            }
        }

        if (isArray) {
            if (probablyJson) {
                baseType = cdmDataFormat.json;
            } else if (baseType === cdmDataFormat.char) {
                baseType = cdmDataFormat.string;
            } else if (baseType === cdmDataFormat.byte) {
                baseType = cdmDataFormat.binary;
            } else if (baseType !== cdmDataFormat.guid) {
                baseType = cdmDataFormat.unknown;
            }
        }

        if (baseType === cdmDataFormat.float && isBig) {
            baseType = cdmDataFormat.double;
        }
        if (isInteger && isBig) {
            baseType = cdmDataFormat.int64;
        } else if (isInteger && isSmall) {
            baseType = cdmDataFormat.int16;
        } else if (isInteger) {
            baseType = cdmDataFormat.int32;
        }

        return baseType;
    }

    /**
     * @internal
     */
    public fetchOrCreateTrait(traitName: string, simpleRef: boolean = false): CdmTraitReference {
        let trait: CdmTraitReference = this.fetchTraitReference(traitName, true);
        if (!trait) {
            trait = this.ctx.corpus.MakeObject<CdmTraitReference>(cdmObjectType.traitRef, traitName);
            this.traits.push(trait);
            trait.isFromProperty = true;
        }

        return trait;
    }

    /**
     * @internal
     */
    public updateTraitArgument(traitName: string, argName: string, value: ArgumentValue): void {
        const trait: CdmTraitReference = this.fetchOrCreateTrait(traitName, false);

        const args: CdmCollection<CdmArgumentDefinition> = trait.arguments;
        if (!args || !args.length) {
            if (value !== undefined) {
                trait.arguments.push(argName, value);

                return;
            } else {
                this.removeTrait(traitName);
            }
        } else {
            for (const arg of args) {
                if (arg.getName() === argName) {
                    if (!value) {
                        args.remove(arg);
                        if (trait.arguments && trait.arguments.length === 0) {
                            this.removeTrait(traitName);
                        }
                    } else {
                        arg.setValue(value);
                    }

                    return;
                }
            }
        }
        if (value !== undefined) {
            trait.arguments.push(argName, value);
        }
    }

    /**
     * @internal
     */
    public updateTraitTable(traitName: string, argName: string, entityName: string,
        action: (cEnt: CdmConstantEntityDefinition, created: boolean) => void): void {
        const resultantTrait: CdmTraitReference = this.fetchOrCreateTrait(traitName, false);
        if (!resultantTrait.arguments || !resultantTrait.arguments.length) {
            // make the argument nothing but a ref to a constant entity
            // safe since there is only one param for the trait and it looks cleaner
            const cEnt: CdmConstantEntityDefinition =
                this.ctx.corpus.MakeObject<CdmConstantEntityDefinition>(cdmObjectType.constantEntityDef);
            cEnt.setEntityShape(this.ctx.corpus.MakeRef(cdmObjectType.entityRef, entityName, true));
            action(cEnt, true);
            resultantTrait.arguments.push(argName, this.ctx.corpus.MakeRef<CdmEntityReference>(cdmObjectType.entityRef, cEnt, false));
        } else {
            const locEntRef: CdmObject = this.fetchTraitReferenceArgumentValue(resultantTrait, argName) as CdmObject;
            if (locEntRef) {
                const locEnt: CdmConstantEntityDefinition = locEntRef.fetchObjectDefinition(undefined);
                if (locEnt) {
                    action(locEnt, false);
                }
            }
        }
    }

    /**
     * @internal
     */
    public fetchTraitTable(traitName: string, argName: string, fromProperty: boolean): CdmConstantEntityDefinition {
        let trait: CdmTraitReference;
        const traitIndex: number = this.traits.indexOf(traitName, fromProperty);
        trait = traitIndex !== -1 ? this.traits.allItems[traitIndex] as CdmTraitReference : undefined;

        const locEntRef: CdmObject = this.fetchTraitReferenceArgumentValue(trait, argName) as CdmObject;
        if (locEntRef) {
            return locEntRef.fetchObjectDefinition(undefined);
        }
    }

    /**
     * @internal
     */
    public constructLocalizedTraitTable(traitName: string, sourceText: string): void {
        this.updateTraitTable(
            traitName,
            'localizedDisplayText',
            'localizedTable',
            (cEnt: CdmConstantEntityDefinition, created: boolean) => {
                if (created) {
                    cEnt.setConstantValues([['en', sourceText]]);
                } else {
                    /**
                     * search for a match
                     * -1 or order gets us last row that matches. needed because inheritence
                     * chain with different descriptions stacks these up
                     * need to use ordinals because no binding done yet
                     */
                    cEnt.updateConstantValue(undefined, 1, sourceText, 0, 'en', -1);
                }  // need to use ordinals because no binding done yet
            });
    }

    /**
     * @internal
     */
    public fetchLocalizedTraitTable(traitName: string, fromProperty: boolean): string {
        const cEnt: CdmConstantEntityDefinition = this.fetchTraitTable(traitName, 'localizedDisplayText', fromProperty);
        if (cEnt) {
            /**
             * search for a match
             * -1 or order gets us last row that matches. needed because inheritence
             * chain with different descriptions stacks these up
             * need to use ordinals because no binding done yet
             */
            return cEnt.fetchConstantValue(undefined, 1, 0, 'en', -1);
        }
    }

    /**
     * @internal
     */
    public updateSingleAttributeTraitTable(traitName: string, argName: string, entityName: string, sourceText: string[]): void {
        this.updateTraitTable(traitName, argName, entityName, (cEnt: CdmConstantEntityDefinition, created: boolean) => {
            // turn array of strings into array of array of strings;
            const vals: (string[])[] = [];
            sourceText.forEach((v: string) => { const r: string[] = []; r.push(v); vals.push(r); });
            cEnt.setConstantValues(vals);
        });
    }

    /**
     * @internal
     */
    public fetchSingleAttTraittable(traitName: string, argName: string, fromProperty: boolean): string[] {
        const cEnt: CdmConstantEntityDefinition = this.fetchTraitTable(traitName, argName, fromProperty);
        if (cEnt) {
            // turn array of arrays into single array of strings
            const result: (string)[] = [];
            cEnt.getConstantValues()
                .forEach((v: string[]) => { result.push(v[0]); });

            return result;
        }
    }

    /**
     * @internal
     */
    public fetchDefaultValue(fromProperty: boolean): any {
        const trait: CdmTraitReference = this.fetchTraitReference('does.haveDefault', fromProperty);
        if (trait) {
            let defVal: any = this.fetchTraitReferenceArgumentValue(trait, 'default');
            if (defVal !== undefined) {
                if (typeof (defVal) === 'string') {
                    return defVal;
                }
                if (defVal.getObjectType() === cdmObjectType.entityRef) {
                    // no doc or directives should work ?
                    const cEnt: CdmConstantEntityDefinition = defVal.fetchObjectDefinition() as CdmConstantEntityDefinition;

                    if (cEnt) {
                        const esName: string = cEnt.getEntityShape()
                            .fetchObjectDefinitionName();
                        const corr: boolean = esName === 'listLookupCorrelatedValues';
                        const lookup: boolean = esName === 'listLookupValues';
                        if (esName === 'localizedTable' || lookup || corr) {
                            const result: (object)[] = [];
                            const rawValues: string[][] = cEnt.getConstantValues();
                            if (rawValues) {
                                const l: number = rawValues.length;
                                for (let i: number = 0; i < l; i++) {
                                    const row: any = {};
                                    const rawRow: string[] = rawValues[i];
                                    if (rawRow.length === 2 || (lookup && rawRow.length === 4) || (corr && rawRow.length === 5)) {
                                        row.languageTag = rawRow[0] !== undefined ? rawRow[0] : null;
                                        row.displayText = rawRow[1] !== undefined ? rawRow[1] : null;
                                        if (lookup || corr) {
                                            row.attributeValue = rawRow[2] !== undefined ? rawRow[2] : null;
                                            row.displayOrder = rawRow[3] !== undefined ? rawRow[3] : null;
                                            if (corr) {
                                                row.correlatedValue = rawRow[4] !== undefined ? rawRow[4] : null;
                                            }
                                        }
                                    }
                                    result.push(row);
                                }

                                return result;
                            }
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

    /**
     * @internal
     */
    public updateDefaultValue(newDefault: any): void {
        if (newDefault instanceof Array) {
            const a: any[] = newDefault;
            const l: number = a.length;
            if (l && a[0].languageTag !== undefined && a[0].displayText !== undefined) {
                // looks like something we understand
                const tab: (string[])[] = [];
                const corr: boolean = (a[0].correlatedValue !== undefined);
                const lookup: boolean = (a[0].displayOrder !== undefined && a[0].attributeValue !== undefined);
                for (let i: number = 0; i < l; i++) {
                    const row: (string)[] = [];
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
                const cEnt: CdmConstantEntityDefinition =
                    this.ctx.corpus.MakeObject<CdmConstantEntityDefinition>(cdmObjectType.constantEntityDef);
                cEnt.setEntityShape(
                    this.ctx.corpus.MakeRef(cdmObjectType.entityRef, corr ? 'listLookupCorrelatedValues' : 'listLookupValues', true));
                cEnt.setConstantValues(tab);
                newDefault = this.ctx.corpus.MakeRef(cdmObjectType.entityRef, cEnt, false);
                this.updateTraitArgument('does.haveDefault', 'default', newDefault);
            } else {
                Logger.error(this.host.ctx, this.TAG, this.updateDefaultValue.name, null, cdmLogCode.ErrValdnMissingLanguageTag);
            }
        } else {
            Logger.error(this.host.ctx, this.TAG, this.updateDefaultValue.name, null, cdmLogCode.ErrUnsupportedType);
        }
    }

    private fetchTraitReferenceArgumentValue(tr: CdmTraitReference | ResolvedTrait, argName: string): ArgumentValue {
        {
            if (tr) {
                let av: ArgumentValue;
                if ((tr as ResolvedTrait).parameterValues) {
                    av = (tr as ResolvedTrait).parameterValues.fetchParameterValueByName(argName).value;
                } else {
                    av = (tr as CdmTraitReference).arguments.fetchValue(argName);
                }

                return av;
            }
        }
    }
}
