// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { isArray, isObject } from 'util';
import {
    ArgumentValue,
    CdmConstantEntityDefinition,
    CdmCorpusContext,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmObject,
    CdmObjectDefinition,
    cdmObjectType,
    CdmParameterDefinition,
    ResolvedAttributeSet,
    resolveOptions,
    spewCatcher
} from '../internal';

/**
 * @internal
 */
export class ParameterValue {
    public get name(): string {
        // const bodyCode = () =>
        {
            return this.parameter.name;
        }
        // return p.measure(bodyCode);
    }
    public parameter: CdmParameterDefinition;
    public value: ArgumentValue;
    public ctx: CdmCorpusContext;
    constructor(ctx: CdmCorpusContext, param: CdmParameterDefinition, value: ArgumentValue) {
        // const bodyCode = () =>
        {
            this.parameter = param;
            this.value = value;
            this.ctx = ctx;
        }
        // return p.measure(bodyCode);
    }
    public static fetchReplacementValue(
        resOpt: resolveOptions,
        oldValue: ArgumentValue,
        newValue: ArgumentValue,
        wasSet: boolean
    ): ArgumentValue {
        // const bodyCode = () =>
        {
            if (!oldValue) {
                return newValue;
            }

            if (!wasSet) {
                // must explicitly set a value to override
                // if a new value is not set, then newValue holds nothing or the default.
                // in this case, if there was already a value in this argument then just keep using it.
                return oldValue;
            }

            if (typeof oldValue === 'string' || (typeof oldValue === 'object' && !('getObjectType' in oldValue))) {
                return newValue;
            }

            const ov: CdmObject = oldValue;
            const nv: CdmObject = newValue as CdmObject;
            // replace an old table with a new table? actually just mash them together
            if (
                ov &&
                ov.getObjectType() === cdmObjectType.entityRef &&
                nv &&
                typeof nv !== 'string' &&
                nv.getObjectType() === cdmObjectType.entityRef
            ) {
                const oldEnt: CdmConstantEntityDefinition = ov.fetchObjectDefinition(resOpt);
                const newEnt: CdmConstantEntityDefinition = nv.fetchObjectDefinition(resOpt);

                // check that the entities are the same shape
                if (!newEnt) {
                    return ov;
                }
                // BUG
                const entDefShape: CdmEntityDefinition = oldEnt.getEntityShape().fetchObjectDefinition(resOpt);
                if (!oldEnt || entDefShape !== newEnt.getEntityShape().fetchObjectDefinition(resOpt)) {
                    return nv;
                }

                const oldCv: string[][] = oldEnt.getConstantValues();
                const newCv: string[][] = newEnt.getConstantValues();
                // rows in old?
                if (!oldCv || oldCv.length === 0) {
                    return nv;
                }
                // rows in new?
                if (!newCv || newCv.length === 0) {
                    return ov;
                }

                // make a set of rows in the old one and add the new ones. this will union the two
                // find rows in the new one that are not in the old one. slow, but these are small usually
                const unionedRows: Map<string, string[]> = new Map<string, string[]>();

                // see if any of the entity atts are the primary key, meaning, the only thing that causes us to merge dups unique.
                // i know this makes you think about a snake eating its own tail, but fetch the resolved attributes of the constant shape
                let pkAtt: number = -1;
                if (entDefShape) {
                    var resOptShape = new resolveOptions(entDefShape.inDocument);
                    var resAttsShape = entDefShape.fetchResolvedAttributes(resOptShape);
                    if (resAttsShape) {
                        pkAtt = resAttsShape.set.findIndex((ra) => ra.resolvedTraits.find(resOptShape, 'is.identifiedBy') != null);
                    }
                }

                for (let i: number = 0; i < oldCv.length; i++) {
                    const row: string[] = oldCv[i];
                    let key: string;
                    // the entity might have a PK, if so, only look at that values as the key
                    if (pkAtt !== -1) {
                        key = row[pkAtt];
                    }
                    else {
                        key = row.join('::');
                    }
                    unionedRows.set(key, row);
                }

                for (let i: number = 0; i < newCv.length; i++) {
                    const row: string[] = newCv[i];
                    let key: string;
                    // the entity might have a PK, if so, only look at that values as the key
                    if (pkAtt !== -1) {
                        key = row[pkAtt];
                    }
                    else {
                        key = row.join('::');
                    }
                    unionedRows.set(key, row);
                }

                if (unionedRows.size === oldCv.length) {
                    return ov;
                }

                const allRows: string[][] = Array.from(unionedRows.values());
                const replacementEnt: CdmConstantEntityDefinition = oldEnt.copy(resOpt) as CdmConstantEntityDefinition;
                replacementEnt.setConstantValues(allRows);

                return resOpt.wrtDoc.ctx.corpus.MakeRef(cdmObjectType.entityRef, replacementEnt, false);
            }

            return newValue;
        }
        // return p.measure(bodyCode);
    }

    public fetchValueString(resOpt: resolveOptions): string {
        // const bodyCode = () =>
        {
            if (typeof this.value === 'string') {
                return this.value;
            } else if (typeof this.value === 'object' && !('getObjectType' in this.value)) {
                return this.serializeFieldsInAlphabeticalOrder(this.value);
            }

            const value: CdmObject = this.value;
            if (value) {
                // if this is a constant table, then expand into an html table
                const def: CdmObjectDefinition = value.fetchObjectDefinition(resOpt);
                if (value.getObjectType() === cdmObjectType.entityRef && def && def.getObjectType() === cdmObjectType.constantEntityDef) {
                    const entShape: CdmEntityReference = (def as CdmConstantEntityDefinition).getEntityShape();
                    const entValues: string[][] = (def as CdmConstantEntityDefinition).getConstantValues();
                    if (!entValues || entValues.length === 0) {
                        return '';
                    }

                    const rows: (object)[] = [];
                    const shapeAtts: ResolvedAttributeSet = entShape.fetchResolvedAttributes(resOpt);

                    if (shapeAtts && shapeAtts.set && shapeAtts.set.length > 0) {
                        for (const entVal of entValues) {
                            const rowData: string[] = entVal;
                            if (rowData && rowData.length) {
                                const row: any = {};
                                for (let c: number = 0; c < rowData.length; c++) {
                                    const tvalue: string = rowData[c];
                                    let colAtt = shapeAtts.set[c];
                                    if (colAtt != undefined) {
                                        row[colAtt.resolvedName] = tvalue;
                                    }
                                }
                                rows.push(row);
                            }
                        }
                    }

                    return this.serializeFieldsInAlphabeticalOrder(rows);
                }
                // should be a reference to an object
                const data: any = value.copyData(resOpt, { stringRefs: false });
                if (typeof data === 'string') {
                    return data;
                }

                return this.serializeFieldsInAlphabeticalOrder(data);
            }

            return '';
        }
        // return p.measure(bodyCode);
    }

    public setValue(resOpt: resolveOptions, newValue: ArgumentValue): void {
        // const bodyCode = () =>
        {
            this.value = ParameterValue.fetchReplacementValue(resOpt, this.value, newValue, true);
        }
        // return p.measure(bodyCode);
    }
    public spew(resOpt: resolveOptions, to: spewCatcher, indent: string): void {
        // const bodyCode = () =>
        {
            to.spewLine(`${indent}${this.name}:${this.fetchValueString(resOpt)}`);
        }
        // return p.measure(bodyCode);
    }

    /**
     * Generates a set of all the fields of the passed parameter. And all its children's fields.
     * @param data The object to retrieve the fields from.
     */
    // tslint:disable-next-line: no-any
    private getFieldsNames(data: any): Set<string> {
        const fieldNames: Set<string> = new Set<string>();
        if (isObject(data)) {
            Object.keys(data as Object)
                .forEach((field: string) => {
                    fieldNames.add(field);
                    if (isObject(data[field])) {
                        this.getFieldsNames(data[field])
                            .forEach((fieldName: string) => fieldNames.add(fieldName));
                    }
                });
        }

        if (isArray(data)) {
            // tslint:disable-next-line: no-any
            data.forEach((element: any) => {
                this.getFieldsNames(element)
                    .forEach((fieldName: string) => fieldNames.add(fieldName));
            });
        }

        return fieldNames;
    }

    /**
     * Serializes parameter 'data' writing fields in alphabetical order.
     * @param data Object to be serialized
     * @returns String representing the serialized parameter
     */
    // tslint:disable-next-line: no-any
    private serializeFieldsInAlphabeticalOrder(data: any): string {
        const fieldNamesList: string[] = Array.from(this.getFieldsNames(data)
            .values());
        const sortedFieldNames: string[] = fieldNamesList.sort();

        return JSON.stringify(data, sortedFieldNames);
    }
}
