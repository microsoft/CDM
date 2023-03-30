// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttributeContext, cdmAttributeContextType, CdmAttributeGroupDefinition,
    CdmAttributeGroupReference,
    CdmAttributeItem,
    CdmAttributeReference,
    CdmCollection, cdmDataFormat,
    CdmTypeAttributeDefinition
} from '../../internal';

/**
 * Helper class that supports validation of the actual object wrt expected object.
 */
export class ObjectValidator {

    public static validateAttributeContext(expected: AttributeContextExpectedValue, actual: CdmAttributeContext): void {
        if (!expected || !actual) {
            expect(expected)
                .toBeFalsy();
            expect(actual)
                .toBeFalsy();

            return;
        }
        expect(cdmAttributeContextType[actual.type].toLowerCase())
            .toEqual(expected.type.toLowerCase());
        expect(actual.name)
            .toEqual(expected.name);

        if (actual.parent) {
            expect(actual.parent.namedReference)
                .toEqual(expected.parent);
        }
        if (expected.definition && actual.definition) {
            expect(actual.definition.namedReference)
                .toEqual(expected.definition);
        }
        let expCount: number = 0;
        if (expected.contexts && expected.contexts.length > 0) {
            expCount += expected.contexts.length;
        }
        if (expected.contextStrings && expected.contextStrings.length > 0) {
            expCount += expected.contextStrings.length;
        }
        expect(actual.contents.length)
            .toEqual(expCount);

        let ac: number = 0;
        let acs: number = 0;
        for (let i: number = 0; i < actual.contents.length; i++) {
            if (actual.contents.allItems[i] instanceof CdmAttributeContext) {
                this.validateAttributeContext(expected.contexts[ac++], actual.contents.allItems[i] as CdmAttributeContext);
            } else if (actual.contents.allItems[i] instanceof CdmAttributeReference) {
                const exp: string = expected.contextStrings[acs++];
                const act: CdmAttributeReference = actual.contents.allItems[i] as CdmAttributeReference;
                expect(act.namedReference)
                    .toEqual(exp);
            } else {
                throw new Error('validateAttributeContext: instanceof Unknown');
            }
        }
    }

    public static validateAttributesCollection(expected: AttributeExpectedValue[], actual: CdmCollection<CdmAttributeItem>): void {
        expect(actual.length)
            .toEqual(expected.length);
        for (let i: number = 0; i < actual.allItems.length; i++) {
            if (actual.allItems[i] instanceof CdmTypeAttributeDefinition) {
                const exp: AttributeExpectedValue = expected[i] as AttributeExpectedValue;
                const act: CdmTypeAttributeDefinition = actual.allItems[i] as CdmTypeAttributeDefinition;
                this.validateTypeAttributeDefinition(exp, act);
            } else if (actual.allItems[i] instanceof CdmAttributeGroupReference) {
                const exp: AttributeExpectedValue = expected[i] as AttributeExpectedValue;
                const act: CdmAttributeGroupReference = actual.allItems[i] as CdmAttributeGroupReference;
                this.validateAttributeGroupRef(exp, act);
            }
        }
    }

    public static validateTypeAttributeDefinition(expected: AttributeExpectedValue, actual: CdmTypeAttributeDefinition): void {
        expect(cdmDataFormat[actual.dataFormat].toLowerCase())
            .toEqual(expected.dataFormat.toLowerCase());
        expect(actual.dataType)
            .toEqual(expected.dataType);
        expect(actual.description)
            .toEqual(expected.description);
        expect(actual.displayName)
            .toEqual(expected.displayName);
        expect(actual.explanation)
            .toEqual(expected.explanation);
        expect(actual.isNullable)
            .toEqual(expected.isNullable);
        expect(actual.isPrimaryKey)
            .toEqual(expected.isPrimaryKey);
        expect(actual.isReadOnly)
            .toEqual(expected.isReadOnly);
        expect(actual.maximumLength)
            .toEqual(expected.maximumLength);
        expect(actual.maximumValue)
            .toEqual(expected.maximumValue);
        expect(actual.minimumValue)
            .toEqual(expected.minimumValue);
        expect(actual.name)
            .toEqual(expected.name);
        expect(actual.purpose)
            .toEqual(expected.purpose);
        expect(actual.sourceName)
            .toEqual(expected.sourceName);
        if (actual.sourceOrdering) {
            expect(actual.sourceOrdering)
                .toEqual(expected.sourceOrdering);
        }
    }

    public static validateAttributeGroupRef(expected: AttributeExpectedValue, actual: CdmAttributeGroupReference): void {
        if (expected.attributeGroupName !== undefined || expected.members !== undefined) {
            if (actual.explicitReference) {
                const actualObj: CdmAttributeGroupDefinition = actual.explicitReference as CdmAttributeGroupDefinition;
                if (expected.attributeGroupName) {
                    expect(actualObj.attributeGroupName)
                        .toEqual(expected.attributeGroupName);
                }
                if (expected.attributeContext) {
                    expect(actualObj.attributeContext.namedReference)
                        .toEqual(expected.attributeContext);
                }
                if (expected.members) {
                    expect(actualObj.members.length)
                        .toEqual(expected.members.length);
                    for (let i: number = 0; i < actualObj.members.length; i++) {
                        if (actualObj.members.allItems[i] instanceof CdmTypeAttributeDefinition) {
                            const exp: AttributeExpectedValue = expected.members[i] as AttributeExpectedValue;
                            const act: CdmTypeAttributeDefinition = actualObj.members.allItems[i] as CdmTypeAttributeDefinition;
                            this.validateTypeAttributeDefinition(exp, act);
                        } else if (actualObj.members.allItems[i] instanceof CdmAttributeGroupReference) {
                            const exp: AttributeExpectedValue = expected.members[i] as AttributeExpectedValue;
                            const act: CdmAttributeGroupReference = actualObj.members.allItems[i] as CdmAttributeGroupReference;
                            this.validateAttributeGroupRef(exp, act);
                        } else {
                            throw new Error('Unknown type!');
                        }
                    }
                }
            }
        }
    }

}

/***
 * Class to contain AttributeContext's expected values.
 */
export class AttributeContextExpectedValue {
    public type: string;
    public name: string;
    public parent: string;
    public definition: string;
    public contexts: AttributeContextExpectedValue[];
    public contextStrings: string[];
}

/***
 * Class to contain Attribute's expected values.
 */
export class AttributeExpectedValue {
    public dataFormat: string;
    public dataType: string;
    public description: string;
    public displayName: string;
    public explanation: string;
    public isNullable: boolean = false;
    public isPrimaryKey: boolean = false;
    public isReadOnly: boolean = false;
    public maximumLength: string;
    public maximumValue: string;
    public minimumValue: string;
    public name: string;
    public purpose: string;
    public sourceName: string;
    public sourceOrdering: number;
    public attributeContext: string;
    public attributeGroupName: string;
    public members: AttributeExpectedValue[];
}
