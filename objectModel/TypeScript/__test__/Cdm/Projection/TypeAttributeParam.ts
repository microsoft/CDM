// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * Type Attribute Test Parameters
 */
export class TypeAttributeParam {
    /**
     * Attribute name property
     */
    private _attributeName: string;

    public get attributeName(): string {
        return this._attributeName;
    }

    public set attributeName(value: string) {
        this._attributeName = value
    }

    /**
     * Attribute data type property
     */
    private _attributeDataType: string;

    public get attributeDataType(): string {
        return this._attributeDataType;
    }

    public set attributeDataType(value: string) {
        this._attributeDataType = value
    }

    /**
     * Attribute purpose property
     */
    private _attributePurpose: string;

    public get attributePurpose(): string {
        return this._attributePurpose;
    }

    public set attributePurpose(value: string) {
        this._attributePurpose = value
    }

    public constructor(name: string, dataType: string, purpose: string) {
        this.attributeName = name;
        this.attributeDataType = dataType;
        this.attributePurpose = purpose;
    }
}
