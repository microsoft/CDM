// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    ArgumentValue,
    CdmAttributeReference,
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmDataTypeDefinition,
    CdmDataTypeReference,
    CdmObject,
    CdmObjectBase,
    CdmObjectDefinitionBase,
    CdmObjectReferenceBase,
    cdmObjectType,
    cdmLogCode,
    Logger,
    resolveContext,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmParameterDefinition extends CdmObjectDefinitionBase {
    private TAG: string = CdmParameterDefinition.name;

    public explanation: string;
    public name: string;
    public defaultValue: ArgumentValue;
    public required: boolean;
    public dataTypeRef: CdmDataTypeReference;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.parameterDef;
    }

    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.name = name;
            this.objectType = cdmObjectType.parameterDef;
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.parameterDef;
        }
        // return p.measure(bodyCode);
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }

            let copy: CdmParameterDefinition;
            if (!host) {
                copy = new CdmParameterDefinition(this.ctx, this.name);
            } else {
                copy = host as CdmParameterDefinition;
                copy.ctx = this.ctx;
                copy.name = this.name;
            }

            let defVal: ArgumentValue;
            if (this.defaultValue) {
                if (typeof (this.defaultValue) === 'object' && 'copy' in this.defaultValue
                    && typeof (this.defaultValue.copy) === 'function') {
                    defVal = this.defaultValue.copy(resOpt);
                } else if (typeof (this.defaultValue) === 'object') {
                    defVal = { ...this.defaultValue };
                } else {
                    defVal = this.defaultValue;
                }
            }
            copy.explanation = this.explanation;
            copy.defaultValue = defVal;
            copy.required = this.required;
            copy.dataTypeRef = this.dataTypeRef ? this.dataTypeRef.copy(resOpt) as CdmDataTypeReference : undefined;

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public validate(): boolean {
        // let bodyCode = () =>
        {
            if (!this.name) {
                let missingFields: string[] = ['name'];
                Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, missingFields.map((s: string) => `'${s}'`).join(', '), this.atCorpusPath);
                return false;
            }

            return true;
        }
        // return p.measure(bodyCode);
    }

    public getExplanation(): string {
        // let bodyCode = () =>
        {
            return this.explanation;
        }
        // return p.measure(bodyCode);
    }

    public getName(): string {
        // let bodyCode = () =>
        {
            return this.name;
        }
        // return p.measure(bodyCode);
    }

    public isDerivedFrom(baseDef: string, resOpt?: resolveOptions) {
        return false;
    }

    public getDefaultValue(): ArgumentValue {
        // let bodyCode = () =>
        {
            return this.defaultValue;
        }
        // return p.measure(bodyCode);
    }

    public getRequired(): boolean {
        // let bodyCode = () =>
        {
            return this.required;
        }
        // return p.measure(bodyCode);
    }
    
    /**
     * @internal
     */
     public constTypeCheck(
        resOpt: resolveOptions,
        wrtDoc: CdmDocumentDefinition,
        argumentValue: ArgumentValue
    ): ArgumentValue {
        // let bodyCode = () =>
        {
            const ctx: resolveContext = this.ctx as resolveContext;
            let replacement: ArgumentValue = argumentValue;
            // if parameter type is entity, then the value should be an entity or ref to one
            // same is true of 'dataType' dataType
            if (!this.dataTypeRef) {
                return replacement;
            }

            const dt: CdmDataTypeDefinition = this.dataTypeRef.fetchObjectDefinition(resOpt);
            if (!dt) {
                Logger.error(this.ctx, this.TAG, this.constTypeCheck.name, this.atCorpusPath, cdmLogCode.ErrUnrecognizedDataType, this.name);
                return undefined;
            }

            // compare with passed in value or default for parameter
            let pValue: ArgumentValue = argumentValue;
            if (!pValue) {
                pValue = this.getDefaultValue();
                replacement = pValue;
            }
            if (pValue) {
                if (dt.isDerivedFrom('cdmObject', resOpt)) {
                    const expectedTypes: cdmObjectType[] = [];
                    let expected: string;
                    if (dt.isDerivedFrom('entity', resOpt)) {
                        expectedTypes.push(cdmObjectType.constantEntityDef);
                        expectedTypes.push(cdmObjectType.entityRef);
                        expectedTypes.push(cdmObjectType.entityDef);
                        expectedTypes.push(cdmObjectType.projectionDef);
                        expected = 'entity';
                    } else if (dt.isDerivedFrom('attribute', resOpt)) {
                        expectedTypes.push(cdmObjectType.attributeRef);
                        expectedTypes.push(cdmObjectType.typeAttributeDef);
                        expectedTypes.push(cdmObjectType.entityAttributeDef);
                        expected = 'attribute';
                    } else if (dt.isDerivedFrom('dataType', resOpt)) {
                        expectedTypes.push(cdmObjectType.dataTypeRef);
                        expectedTypes.push(cdmObjectType.dataTypeDef);
                        expected = 'dataType';
                    } else if (dt.isDerivedFrom('purpose', resOpt)) {
                        expectedTypes.push(cdmObjectType.purposeRef);
                        expectedTypes.push(cdmObjectType.purposeDef);
                        expected = 'purpose';
                    } else if (dt.isDerivedFrom('trait', resOpt)) {
                        expectedTypes.push(cdmObjectType.traitRef);
                        expectedTypes.push(cdmObjectType.traitDef);
                        expected = 'trait';
                    } else if (dt.isDerivedFrom('traitGroup', resOpt)) {
                        expectedTypes.push(cdmObjectType.traitGroupRef);
                        expectedTypes.push(cdmObjectType.traitGroupDef);
                        expected = 'traitGroup';
                    } else if (dt.isDerivedFrom('attributeGroup', resOpt)) {
                        expectedTypes.push(cdmObjectType.attributeGroupRef);
                        expectedTypes.push(cdmObjectType.attributeGroupDef);
                        expected = 'attributeGroup';
                    }

                    if (expectedTypes.length === 0) {
                        Logger.error(this.ctx, this.TAG, this.constTypeCheck.name, wrtDoc.atCorpusPath, cdmLogCode.ErrUnexpectedDataType, this.getName());
                    }

                    // if a string constant, resolve to an object ref.
                    let foundType: cdmObjectType = cdmObjectType.error;
                    if (typeof pValue === 'object' && 'objectType' in pValue) {
                        foundType = pValue.objectType;
                    }
                    let foundDesc: string = ctx.relativePath;
                    if (!(pValue instanceof CdmObjectBase)) {
                        // pValue is a string or object
                        pValue = pValue as string;
                        if (pValue === 'this.attribute' && expected === 'attribute') {
                            // will get sorted out later when resolving traits
                            foundType = cdmObjectType.attributeRef;
                        } else {
                            foundDesc = pValue;
                            const seekResAtt: number = CdmObjectReferenceBase.offsetAttributePromise(pValue);
                            if (seekResAtt >= 0) {
                                // get an object there that will get resolved later after resolved attributes
                                replacement = new CdmAttributeReference(this.ctx, pValue, true);
                                (replacement as CdmAttributeReference).inDocument = wrtDoc;
                                foundType = cdmObjectType.attributeRef;
                            } else {
                                const lu: CdmObjectBase = ctx.corpus.resolveSymbolReference(
                                    resOpt,
                                    wrtDoc,
                                    pValue,
                                    cdmObjectType.error,
                                    true
                                );
                                if (lu) {
                                    if (expected === 'attribute') {
                                        replacement = new CdmAttributeReference(this.ctx, pValue, true);
                                        (replacement as CdmAttributeReference).inDocument = wrtDoc;
                                        foundType = cdmObjectType.attributeRef;
                                    } else {
                                        replacement = lu;
                                        if (typeof replacement === 'object' && 'objectType' in replacement) {
                                            foundType = replacement.objectType;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (expectedTypes.indexOf(foundType) === -1) {
                        Logger.error(this.ctx, this.TAG, this.constTypeCheck.name, wrtDoc.atCorpusPath, cdmLogCode.ErrResolutionFailure, this.getName(), foundDesc, expected);
                    } else {
                        Logger.info(ctx, this.TAG, this.constTypeCheck.name, wrtDoc.atCorpusPath, `resolved '${foundDesc}'`);
                    }
                }
            }

            return replacement;
        }
        // return p.measure(bodyCode);
    }


    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            const path: string = this.fetchDeclaredPath(pathFrom);

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (typeof (this.defaultValue) === 'object' && 'visit' in this.defaultValue
                && typeof (this.defaultValue.visit) === 'function') {
                if ((this.defaultValue).visit(`${path}/defaultValue/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.dataTypeRef) {
                if (this.dataTypeRef.visit(`${path}/dataType/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (postChildren && postChildren(this, path)) {
                return true;
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    /**
     * Given an initial path, returns this object's declared path
     * @internal
     */
     public fetchDeclaredPath(pathFrom: string): string {
        return pathFrom + this.getName() ?? '';
    }
}
