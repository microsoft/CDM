// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmCorpusContext,
    CdmEntityReference,
    CdmObject,
    CdmObjectDefinition,
    CdmObjectDefinitionBase,
    cdmObjectType,
    CdmOperationBase,
    CdmOperationCollection,
    cdmLogCode,
    Logger,
    ProjectionAttributeState,
    ProjectionAttributeStateSet,
    ProjectionContext,
    ProjectionDirective,
    ProjectionResolutionCommonUtil,
    ResolvedAttributeSet,
    ResolvedTraitSet,
    resolveOptions,
    VisitCallback,
    StringUtils
} from '../../internal';
import { ExpressionTree } from '../../ResolvedModel/ExpressionParser/ExpressionTree';
import { InputValues } from '../../ResolvedModel/ExpressionParser/InputValues';

/**
 * Class for projection
 */
export class CdmProjection extends CdmObjectDefinitionBase {
    private TAG: string = CdmProjection.name;

    /**
     * Property of a projection that holds the condition expression string
     */
    public condition: string;

    /**
     * Property of a projection that holds a collection of operations
     */
    public operations: CdmOperationCollection;

    private _source: CdmEntityReference;

    /**
     * If true, runs the operations sequentially so each operation receives the result of the previous one
     */
    runSequentially?: boolean;

    /**
     * Property of a projection that holds the source of the operation
     */
    public get source(): CdmEntityReference {
        return this._source;
    }

    public set source(source: CdmEntityReference) {
        if (source) {
            source.owner = this;
        }
        this._source = source;
    }

    /**
     * Projection constructor
     */
    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.projectionDef;
        this.operations = new CdmOperationCollection(ctx, this);
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        let copy: CdmProjection;

        if (!host) {
            copy = new CdmProjection(this.ctx);
        } else {
            copy = host as CdmProjection;
            copy.ctx = this.ctx;
            copy.operations.clear();
        }

        copy.condition = this.condition;
        copy.source = this.source ? this.source.copy() as CdmEntityReference : null;

        for (const operation of this.operations) {
            copy.operations.push(operation.copy() as CdmOperationBase);
        }

        // Don't do anything else after this, as it may cause InDocument to become dirty
        copy.inDocument = this.inDocument;

        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'projection';
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.projectionDef;
    }

    /**
     * @inheritdoc
     */
    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        // Since projections don't support inheritance, return false
        return false;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        if (!this.source) {
            const rootOwner: CdmObject = this.getRootOwner();
            if (rootOwner.objectType !== cdmObjectType.typeAttributeDef) {
                // If the projection is used in an entity attribute or an extends entity
                missingFields.push('source');
            }
        } else if (!this.source.explicitReference || this.source.explicitReference.objectType !== cdmObjectType.projectionDef) {
            // If reached the inner most projection
            const rootOwner: CdmObject = this.getRootOwner();
            if (rootOwner.objectType == cdmObjectType.typeAttributeDef) {
                // If the projection is used in a type attribute
                Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrProjSourceError);
            }
        }

        if (missingFields.length > 0) {
            Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, missingFields.map((s: string) => `'${s}'`).join(', '));
            return false;
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        let path: string = '';
        if (!this.ctx.corpus.blockDeclaredPathChanges) {
            path = this.declaredPath;
            if (!path) {
                path = pathFrom + 'projection';
                this.declaredPath = path;
            }
        }

        if (preChildren && preChildren(this, path)) {
            return false;
        }

        if (this.source) {
            if (this.source.visit(path + '/source/', preChildren, postChildren)) {
                return true;
            }
        }

        let result: boolean = false;
        if (this.operations && this.operations.length > 0) {
            // since this.Operations.VisitList results is non-unique attribute context paths if there are 2 or more operations of the same type.
            // e.g. with composite keys
            // the solution is to add a unique identifier to the path by adding the operation index or opIdx
            for (let opIndex: number = 0; opIndex < this.operations.length; opIndex++) {
                this.operations.allItems[opIndex].index = opIndex + 1;
                if ((this.operations.allItems[opIndex]) &&
                    (this.operations.allItems[opIndex].visit(`${path}/operation/index${opIndex + 1}/`, preChildren, postChildren))) {
                    result = true;
                } else {
                    result = false;
                }
            }
            if (result) {
                return true;
            }
        }

        if (postChildren && postChildren(this, path)) {
            return true;
        }

        return false;
    }

    /**
     * @inheritdoc
     * @internal
     */
    public fetchResolvedTraits(resOpt?: resolveOptions): ResolvedTraitSet {
        return this.source.fetchResolvedTraits(resOpt);
    }

    /**
     * A function to construct projection context and populate the resolved attribute set that ExtractResolvedAttributes method can then extract
     * This function is the entry point for projection resolution.
     * This function is expected to do the following 3 things:
     * - Create an condition expression tree & default if appropriate
     * - Create and initialize Projection Context
     * - Process operations
     * @internal
     */
    public constructProjectionContext(projDirective: ProjectionDirective, attrCtx: CdmAttributeContext, ras: ResolvedAttributeSet = undefined): ProjectionContext {
        if (!attrCtx) {
            return undefined;
        }

        let projContext: ProjectionContext;

        // Add projection to context tree
        const acpProj: AttributeContextParameters = {
            under: attrCtx,
            type: cdmAttributeContextType.projection,
            name: this.fetchObjectDefinitionName(),
            regarding: projDirective.ownerRef,
            includeTraits: false
        };
        const acProj: CdmAttributeContext = CdmAttributeContext.createChildUnder(projDirective.resOpt, acpProj);

        const acpSource: AttributeContextParameters = {
            under: acProj,
            type: cdmAttributeContextType.source,
            name: 'source',
            regarding: undefined,
            includeTraits: false
        };
        const acSource: CdmAttributeContext = CdmAttributeContext.createChildUnder(projDirective.resOpt, acpSource);

        // Initialize the projection context
        const ctx: CdmCorpusContext = (projDirective.owner?.ctx);

        if (this.source) {
            const source: CdmObjectDefinition = this.source.fetchObjectDefinition<CdmObjectDefinition>(projDirective.resOpt);
            if (source.objectType === cdmObjectType.projectionDef) {
                // A Projection

                projContext = (this.source.explicitReference as CdmProjection).constructProjectionContext(projDirective, acSource, ras);
            } else {
                // An Entity Reference

                const acpSourceProjection: AttributeContextParameters = {
                    under: acSource,
                    type: cdmAttributeContextType.entity,
                    name: this.source.namedReference ?? this.source.explicitReference.getName(),
                    regarding: this.source,
                    includeTraits: false
                };
                
                ras = this.source.fetchResolvedAttributes(projDirective.resOpt, acpSourceProjection);

                // If polymorphic keep original source as previous state
                let polySourceSet: Map<string, ProjectionAttributeState[]> = null;
                if (projDirective.isSourcePolymorphic) {
                    polySourceSet = ProjectionResolutionCommonUtil.getPolymorphicSourceSet(projDirective, ctx, this.source, ras);
                }

                // Now initialize projection attribute state
                const pasSet: ProjectionAttributeStateSet = ProjectionResolutionCommonUtil.initializeProjectionAttributeStateSet(projDirective, ctx, ras, projDirective.isSourcePolymorphic, polySourceSet);

                projContext = new ProjectionContext(projDirective, ras.attributeContext);
                projContext.currentAttributeStateSet = pasSet;
            }
        } else {
            // A type attribute

            // Initialize projection attribute state
            const pasSet: ProjectionAttributeStateSet = ProjectionResolutionCommonUtil.initializeProjectionAttributeStateSet(projDirective, ctx, ras);

            projContext = new ProjectionContext(projDirective, ras.attributeContext);
            projContext.currentAttributeStateSet = pasSet;
        }

        const inputValues: InputValues = new InputValues(projDirective);
        const isConditionValid: boolean = ExpressionTree.evaluateCondition(this.condition, inputValues);

        if (isConditionValid && this.operations && this.operations.length > 0) {
            // Just in case new operations were added programmatically, reindex operations
            for (let i: number = 0; i < this.operations.length; i++) {
                this.operations.allItems[i].index = i + 1;
            }

            // Operation

            const acpGenAttrSet: AttributeContextParameters = {
                under: attrCtx,
                type: cdmAttributeContextType.generatedSet,
                name: '_generatedAttributeSet'
            };
            const acGenAttrSet: CdmAttributeContext = CdmAttributeContext.createChildUnder(projDirective.resOpt, acpGenAttrSet);

            // Start with an empty list for each projection
            let pasOperations: ProjectionAttributeStateSet = new ProjectionAttributeStateSet(projContext.currentAttributeStateSet.ctx);

            // The attribute set that the operation will execute on
            let operationWorkingAttributeSet;

            // The attribute set containing the attributes from the source
            const sourceAttributeSet: ProjectionAttributeStateSet = projContext.currentAttributeStateSet;

            // Specifies if the operation is the first on the list to run
            let firstOperationToRun: boolean = true;
            for (const operation of this.operations) {
                const operationCondition: boolean = ExpressionTree.evaluateCondition(operation.condition, inputValues);

                if (!operationCondition) {
                    // Skip this operation if the condition does not evaluate to true
                    continue;
                }

                // If RunSequentially is not true then all the operations will receive the source input
                // Unless the operation overwrites this behavior using the SourceInput property
                const sourceInput: boolean = operation.sourceInput != null ? operation.sourceInput : !this.runSequentially;

                // If this is the first operation to run it will get the source attribute set since the operations attribute set starts empty
                if (sourceInput || firstOperationToRun) {
                    projContext.currentAttributeStateSet = sourceAttributeSet;
                    operationWorkingAttributeSet = pasOperations;
                } else {
                    // Needs to create a copy since this set can be modified by the operation
                    projContext.currentAttributeStateSet = pasOperations.copy();
                    operationWorkingAttributeSet = new ProjectionAttributeStateSet(projContext.currentAttributeStateSet.ctx);
                }
                // Evaluate projections and apply to empty state
                const newPasOperations = operation.appendProjectionAttributeState(projContext, operationWorkingAttributeSet, acGenAttrSet);

                // If the operations fails or it is not implemented the projection cannot be evaluated so keep previous valid state
                if (newPasOperations !== undefined) {
                    firstOperationToRun = false;
                    pasOperations = newPasOperations;
                }
            }

            // If no operation ran successfully pasOperations will be empty
            if (!firstOperationToRun) {
                // Finally update the current state to the projection context
                projContext.currentAttributeStateSet = pasOperations;
            }
        } else {
            // Pass Through - no operations to process
        }

        return projContext;
    }

    /**
     * Create resolved attribute set based on the CurrentResolvedAttribute array
     * @internal
     */
    public extractResolvedAttributes(projCtx: ProjectionContext, attCtxUnder: CdmAttributeContext): ResolvedAttributeSet {
        const resolvedAttributeSet: ResolvedAttributeSet = new ResolvedAttributeSet();
        resolvedAttributeSet.attributeContext = attCtxUnder;

        if (!projCtx) {
            Logger.error(this.ctx, CdmProjection.name, this.extractResolvedAttributes.name, this.atCorpusPath, cdmLogCode.ErrProjFailedToResolve, this.atCorpusPath);
            return resolvedAttributeSet;
        }

        for (const pas of projCtx.currentAttributeStateSet.states) {
            resolvedAttributeSet.merge(pas.currentResolvedAttribute);
        }

        return resolvedAttributeSet;
    }

    private getRootOwner(): CdmObject {
        let rootOwner: CdmObject = this;
        do {
            rootOwner = rootOwner.owner;
            // A projection can be inside an entity reference, so take the owner again to get the projection.
            if (rootOwner && rootOwner.owner && rootOwner.owner.objectType === cdmObjectType.projectionDef) {
                rootOwner = rootOwner.owner;
            }
        } while (rootOwner && rootOwner.objectType === cdmObjectType.projectionDef);

        return rootOwner;
    }
}
