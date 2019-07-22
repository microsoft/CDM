import {
    ArgumentValue,
    CdmCorpusContext,
    cdmObjectType,
    ICdmConstantEntityDef,
    ICdmEntityRef,
    ICdmObject,
    ICdmObjectDef,
    ICdmParameterDef,
    ResolvedAttributeSet,
    resolveOptions,
    spewCatcher
} from '../internal';

export class ParameterValue {
    public get name(): string {
        // let bodyCode = () =>
        {
            return this.parameter.getName();
        }
        // return p.measure(bodyCode);
    }
    public parameter: ICdmParameterDef;
    public value: ArgumentValue;
    public ctx: CdmCorpusContext;
    constructor(ctx: CdmCorpusContext, param: ICdmParameterDef, value: ArgumentValue) {
        // let bodyCode = () =>
        {
            this.parameter = param;
            this.value = value;
            this.ctx = ctx;
        }
        // return p.measure(bodyCode);
    }
    public static getReplacementValue(resOpt: resolveOptions, oldValue: ArgumentValue,
                                      newValue: ArgumentValue, wasSet: boolean): ArgumentValue {
        // let bodyCode = () =>
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

            if (typeof (oldValue) === 'string') {
                return newValue;
            }
            const ov: ICdmObject = oldValue;
            const nv: ICdmObject = newValue as ICdmObject;
            // replace an old table with a new table? actually just mash them together
            if (ov && ov.getObjectType() === cdmObjectType.entityRef &&
                nv && typeof (nv) !== 'string' && nv.getObjectType() === cdmObjectType.entityRef) {
                const oldEnt: ICdmConstantEntityDef = ov.getObjectDef(resOpt) as ICdmConstantEntityDef;
                const newEnt: ICdmConstantEntityDef = nv.getObjectDef(resOpt) as ICdmConstantEntityDef;

                // check that the entities are the same shape
                if (!newEnt) {
                    return ov;
                }
                if (!oldEnt || (oldEnt.getEntityShape()
                    .getObjectDef(resOpt) !== newEnt.getEntityShape()
                        .getObjectDef(resOpt))) {
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
                let l: number = oldCv.length;
                for (let i: number = 0; i < l; i++) {
                    const row: string[] = oldCv[i];
                    const key: string = row.reduce((prev: string, curr: string) => `${(prev ? prev : '')}::${curr}`);
                    unionedRows.set(key, row);
                }
                l = newCv.length;
                for (let i: number = 0; i < l; i++) {
                    const row: string[] = newCv[i];
                    const key: string = row.reduce((prev: string, curr: string) => `${(prev ? prev : '')}::${curr}`);
                    unionedRows.set(key, row);
                }

                if (unionedRows.size === oldCv.length) {
                    return nv;
                }

                const allRows: string[][] = Array.from(unionedRows.values());
                const replacementEnt: ICdmConstantEntityDef = oldEnt.copy(resOpt) as ICdmConstantEntityDef;
                replacementEnt.setConstantValues(allRows);

                return resOpt.wrtDoc.ctx.corpus.MakeRef(cdmObjectType.entityRef, replacementEnt, false);
            }

            return newValue;
        }
        // return p.measure(bodyCode);
    }
    public getValueString(resOpt: resolveOptions): string {
        // let bodyCode = () =>
        {
            if (typeof (this.value) === 'string') {
                return this.value;
            }
            const value: ICdmObject = this.value;
            if (value) {
                // if this is a constant table, then expand into an html table
                const def: ICdmObjectDef = value.getObjectDef(resOpt);
                if (value.getObjectType() === cdmObjectType.entityRef && def && def.getObjectType() === cdmObjectType.constantEntityDef) {
                    const entShape: ICdmEntityRef = (def as ICdmConstantEntityDef).getEntityShape();
                    const entValues: string[][] = (def as ICdmConstantEntityDef).getConstantValues();
                    if (!entValues && entValues.length === 0) {
                        return '';
                    }

                    const rows : (object)[] = [];
                    const shapeAtts: ResolvedAttributeSet = entShape.getResolvedAttributes(resOpt);

                    for (const entVal of entValues) {
                        const rowData: string[] = entVal;
                        if (rowData && rowData.length) {
                            const row: any = {};
                            for (let c: number = 0; c < rowData.length; c++) {
                                const tvalue: string = rowData[c];
                                row[shapeAtts.set[c].resolvedName] = tvalue;
                            }
                            rows.push(row);
                        }
                    }

                    return JSON.stringify(rows);
                }
                // should be a reference to an object
                const data: any = value.copyData(resOpt, { stringRefs: false });
                if (typeof (data) === 'string') {
                    return data;
                }

                return JSON.stringify(data);
            }

            return '';
        }
        // return p.measure(bodyCode);
    }
    public setValue(resOpt: resolveOptions, newValue: ArgumentValue): void {
        // let bodyCode = () =>
        {
            this.value = ParameterValue.getReplacementValue(resOpt, this.value, newValue, true);
        }
        // return p.measure(bodyCode);
    }
    public spew(resOpt: resolveOptions, to: spewCatcher, indent: string): void {
        // let bodyCode = () =>
        {
            to.spewLine(`${indent}${this.name}:${this.getValueString(resOpt)}`);
        }
        // return p.measure(bodyCode);
    }

}
