// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmAttribute, CdmCorpusContext, Logger, StringUtils, cdmLogCode } from '../../internal';
import { CdmTypeAttributeDefinition } from '../CdmTypeAttributeDefinition';

/**
 * Class for attribute cardinality
 */
// tslint:disable:variable-name
export class CardinalitySettings {
    private TAG: string = CardinalitySettings.name;

    // By default all attributes in CDM are Not Nullable and hence setting the default value to be 1:1
    private static readonly defaultMinimum: number = 1;
    private static readonly defaultMaximum: number = 1;
    private static readonly infiniteMaximum: number = -1;

    private ctx: CdmCorpusContext;
    private owner: CdmAttribute;

    /**
     * @internal
     */
    public _minimumNumber: number = CardinalitySettings.defaultMinimum;
    /**
     * @internal
     */
    public _maximumNumber: number = CardinalitySettings.defaultMaximum;

    private _minimum: string;
    private _maximum: string;

    /**
     * CardinalitySettings constructor
     */
    constructor(owner: CdmAttribute) {
        this.owner = owner;
        this.ctx = owner?.ctx;
    }

    /**
     * Minimum cardinality (range -->> "0" .. "n")
     */
    public get minimum(): string {
        return this._minimum;
    }

    public set minimum(value: string) {
        if (StringUtils.isNullOrWhiteSpace(value)) {
            Logger.error(this.ctx, this.TAG, 'minimum', this.owner.atCorpusPath, cdmLogCode.ErrPersistCardinalityPropMissing);
        } else if (!CardinalitySettings.isMinimumValid(value)) {
            Logger.error(this.ctx, this.TAG, 'minimum', this.owner.atCorpusPath, cdmLogCode.ErrValdnInvalidMinCardinality, value);
        } else {
            this._minimum = value;
            this._minimumNumber = this.getNumber(this._minimum, CardinalitySettings.defaultMinimum);

            // In the case of type attributes, a '0' minimum cardinality represents a nullable attribute
            if (this.owner && this.owner instanceof CdmTypeAttributeDefinition) {
                (this.owner as CdmTypeAttributeDefinition).isNullable = (this._minimumNumber === 0);
            }
        }
    }

    /**
     * Maximum cardinality (range -->> "1" .. "*")
     */
    public get maximum(): string {
        return this._maximum;
    }

    public set maximum(value: string) {
        if (StringUtils.isNullOrWhiteSpace(value)) {
            Logger.error(this.ctx, this.TAG, 'maximum', this.owner.atCorpusPath, cdmLogCode.ErrPersistCardinalityPropMissing);
        } else if (!CardinalitySettings.isMaximumValid(value)) {
            Logger.error(this.ctx, this.TAG, 'maximum', this.owner.atCorpusPath, cdmLogCode.ErrValdnInvalidMaxCardinality, value);
        } else {
            this._maximum = value;
            this._maximumNumber = this.getNumber(this._maximum, CardinalitySettings.defaultMaximum);
        }
    }

    /**
     * Converts the string cardinality to number
     */
    private getNumber(value: string, defaultValue: number): number {
        if (StringUtils.equalsWithIgnoreCase(value, '*')) {
            return CardinalitySettings.infiniteMaximum;
        }
        const number: number = Number(value);
        if (!isNaN(number)) {
            return number;
        } else {
            // defaults to min:max DefaultMinimum:DefaultMaximum in the invalid values
            Logger.error(this.ctx, this.TAG, this.getNumber.name, undefined, cdmLogCode.ErrProjStringError, value, defaultValue);

            return defaultValue;
        }
    }

    /**
     * Validate if the minimum cardinality is valid
     * Min Cardinality valid options are as follows -- '0'..Int.MaxValue.ToString()
     * By default Min Cardinality is '1'
     * @internal
     */
    public static isMinimumValid(minimum: string): boolean {
        if (minimum) {
            // By default Min Cardinality is 1
            const minNumber: number = Number(minimum);
            // Min Cardinality valid options are as follows -- '0'..Int.MaxValue.ToString()
            if (isNaN(minNumber)) {
                return false;
            }

            return minNumber >= 0 && minNumber <= Number.MAX_SAFE_INTEGER;
        }

        return false;
    }

    /**
     * Validate if the maximum cardinality is valid
     * Max Cardinality valid options are as follows -- '1'..Int.MaxValue.ToString(), or can be '*' to define Infinity
     * By default Max Cardinality is '1'
     * @internal
     */
    public static isMaximumValid(maximum: string): boolean {
        if (maximum) {
            // By default Max Cardinality is 1

            // Max Cardinality can be '*' to define Infinity
            // If not '*', an explicit value can be provided, but is limited to '1'..Int.MaxValue.ToString()
            if (StringUtils.equalsWithIgnoreCase(maximum, '*')) {
                return true;
            }

            const maxNumber: number = Number(maximum);
            if (isNaN(maxNumber)) {
                return false;
            }

            return maxNumber >= CardinalitySettings.defaultMaximum && maxNumber <= Number.MAX_SAFE_INTEGER;
        }

        return false;
    }
}
