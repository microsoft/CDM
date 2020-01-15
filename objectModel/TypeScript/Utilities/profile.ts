// tslint:disable
// import { performance } from 'perf_hooks';
import {
    CdmArgumentDefinition,
    CdmAttributeContext,
    CdmAttributeContextReference,
    CdmAttributeGroupDefinition,
    CdmAttributeGroupReference,
    CdmAttribute,
    CdmAttributeReference,
    callData,
    CdmObjectBase,
    CdmObjectDefinitionBase,
    CdmObjectReferenceBase,
    cdmObjectSimple,
    CdmConstantEntityDefinition,
    CdmCorpusDefinition,
    CdmDataTypeDefinition,
    CdmDataTypeReference,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    ICdmProfiler,
    CdmImport,
    ParameterCollection,
    CdmParameterDefinition,
    ParameterValue,
    ParameterValueSet,
    refCounted,
    CdmPurposeDefinition,
    CdmPurposeReference,
    resolveContext,
    ResolvedAttribute,
    ResolvedAttributeSet,
    ResolvedAttributeSetBuilder,
    ResolvedEntity,
    ResolvedEntityReference,
    ResolvedEntityReferenceSet,
    ResolvedEntityReferenceSide,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    AttributeResolutionDirectiveSet,
    CdmTraitDefinition,
    CdmTraitReference,
    traitToPropertyMap,
    CdmTypeAttributeDefinition
} from '../internal';

export class CdmProfiler implements ICdmProfiler {
    public calls: Map<string, callData> = new Map<string, callData>();
    public callStack: string[] = [];
    public on: boolean = false;

    public static getInternalClassList(): any[] {
        return [
            CdmArgumentDefinition,
            CdmAttributeContext,
            CdmAttributeContextReference,
            CdmAttributeGroupDefinition,
            CdmAttributeGroupReference,
            CdmAttribute,
            CdmAttributeReference,
            CdmObjectDefinitionBase,
            CdmObjectReferenceBase,
            cdmObjectSimple,
            CdmObjectBase,
            CdmConstantEntityDefinition,
            CdmCorpusDefinition,
            CdmDataTypeDefinition,
            CdmDataTypeReference,
            CdmEntityAttributeDefinition,
            CdmEntityDefinition,
            CdmEntityReference,
            CdmFolderDefinition,
            CdmImport,
            CdmParameterDefinition,
            CdmPurposeDefinition,
            CdmPurposeReference,
            CdmTraitDefinition,
            CdmTraitReference,
            CdmTypeAttributeDefinition,
            ParameterCollection,
            ParameterValueSet,
            ParameterValue,
            ResolvedAttributeSetBuilder,
            ResolvedAttributeSet,
            ResolvedAttribute,
            ResolvedEntityReferenceSet,
            ResolvedEntityReferenceSide,
            ResolvedEntityReference,
            ResolvedEntity,
            ResolvedTraitSetBuilder,
            ResolvedTraitSet,
            refCounted,
            resolveContext,
            AttributeResolutionDirectiveSet,
            traitToPropertyMap
        ];
    }

    public measure(code: () => any, funcName: string): any {
        if (this.on) {
            const loc: string = funcName;
            this.callStack.push(loc);

            let cnt: callData = this.calls.get(loc);
            if (!cnt) {
                cnt = { calls: 0, timeTotal: 0, timeExl: 0 };
                this.calls.set(loc, cnt);
            }
            cnt.calls++;
            const n: number = 0;
            //const n: number = performance.now();
            const retVal: any = code();
            let elaspsed: number = 1;
            //let elaspsed: number = performance.now() - n;
            if (elaspsed < 0) {
                elaspsed = 0.00001;
            }
            cnt.timeTotal += elaspsed;

            this.callStack.pop();

            if (this.callStack.length) {
                const locFrom: string = this.callStack[this.callStack.length - 1];
                cnt = this.calls.get(locFrom);
                cnt.timeExl += elaspsed;
            }

            return retVal;
        } else {
            return code();
        }
    }

    public report(): string[] {
        const results: string[] = [];
        this.calls.forEach((v: callData, k: string) => {
            results.push(`${v.calls},${v.timeTotal},${v.timeTotal - v.timeExl},${k}`);
        });

        return results;
    }

    public getCallData(): Map<string, callData> {
        return this.calls;
    }

    public clearData(): void {
        this.calls = new Map<string, callData>();
    }

    public addProfilingCode(classes: any[]): void {
        const ignoreStaticMembers: string[] = [];
        const ignoreMembers: string[] = ['constructor'];

        // Capture the profiler variables since the reference to 'this' changes inside the lambda function
        const profiler: CdmProfiler = this;
        let replaceFunction = (currClass: any, funcName: string, displayName: string) =>{
            const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(currClass, funcName);
            if (descriptor.get || descriptor.set) {
                return;
            }
            const oldFn: Function = currClass[funcName];
            if (typeof oldFn === 'function') {
                // We need to capture the 'this' variable that is used to make the function call
                currClass[funcName] = function (): any {
                    return profiler.measure(() => oldFn.apply(this, arguments), `${displayName}`);
                };
            }
        }

        classes.forEach((currClass: any) => {
            Object.getOwnPropertyNames(currClass.prototype)
                .filter((funcName: string) => ignoreMembers.indexOf(funcName) === -1)
                .forEach((funcName: string) => replaceFunction(currClass.prototype, funcName, `${currClass.name}:${funcName}`));

            Object.getOwnPropertyNames(currClass)
                .filter((funcName: string) => ignoreStaticMembers.indexOf(funcName) === -1)
                .forEach((funcName: string) => replaceFunction(currClass, funcName, `${currClass.name}:${funcName}`));
        });
    }

}

const p: CdmProfiler = new CdmProfiler();
export { p };
