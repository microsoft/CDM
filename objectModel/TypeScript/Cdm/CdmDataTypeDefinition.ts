// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttributeContext,
    CdmCorpusContext,
    CdmDataTypeReference,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    cdmLogCode,
    Logger,
    ResolvedAttributeSetBuilder,
    ResolvedTraitSetBuilder,
    resolveOptions,
    StringUtils,
    VisitCallback
} from '../internal';

export class CdmDataTypeDefinition extends CdmObjectDefinitionBase {
    private TAG: string = CdmDataTypeDefinition.name;

    public dataTypeName: string;
    public extendsDataType?: CdmDataTypeReference;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.dataTypeDef;
    }

    constructor(ctx: CdmCorpusContext, dataTypeName: string, extendsDataType?: CdmDataTypeReference) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.dataTypeDef;
            this.dataTypeName = dataTypeName;
            this.extendsDataType = extendsDataType;
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.dataTypeDef;
        }
        // return p.measure(bodyCode);
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmDataTypeDefinition {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }

            let copy: CdmDataTypeDefinition;
            if (!host) {
                copy = new CdmDataTypeDefinition(this.ctx, this.dataTypeName, undefined);
            } else {
                copy = host as CdmDataTypeDefinition;
                copy.dataTypeName = this.dataTypeName;
            }
            copy.extendsDataType = this.extendsDataType ? this.extendsDataType.copy(resOpt) as CdmDataTypeReference: undefined;
            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public validate(): boolean {
        // let bodyCode = () =>
        {
            if (!this.dataTypeName) {
                let missingFields: string[] = ['dataTypeName'];
                Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, missingFields.map((s: string) => `'${s}'`).join(', '), this.atCorpusPath);
                return false;
            }

            return true;
        }
        // return p.measure(bodyCode);
    }

    public getName(): string {
        // let bodyCode = () =>
        {
            return this.dataTypeName;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public getExtendsDataTypeRef(): CdmDataTypeReference {
        // let bodyCode = () =>
        {
            return this.extendsDataType;
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
            if (this.extendsDataType) {
                this.extendsDataType.owner = this;
                if (this.extendsDataType.visit(`${path}/extendsDataType/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.visitDef(path, preChildren, postChildren)) {
                return true;
            }
            if (postChildren && postChildren(this, path)) {
                return true;
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }

            return this.isDerivedFromDef(resOpt, this.getExtendsDataTypeRef(), this.getName(), base);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            this.constructResolvedTraitsDef(this.getExtendsDataTypeRef(), rtsb, resOpt);
            // rtsb.cleanUp();
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedAttributes(resOpt: resolveOptions, under?: CdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }
}
