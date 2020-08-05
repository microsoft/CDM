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
    CdmOperationCollection,
    ConditionExpression,
    Errors,
    Logger,
    ProjectionAttributeState,
    ProjectionAttributeStateSet,
    ProjectionContext,
    ProjectionDirective,
    ProjectionResolutionCommonUtil,
    ResolvedAttributeSet,
    ResolvedTraitSet,
    resolveOptions,
    VisitCallback
} from '../../internal';
import { ExpressionTree } from '../../ResolvedModel/ExpressionParser/ExpressionTree';
import { InputValues } from '../../ResolvedModel/ExpressionParser/InputValues';
import { Node } from '../../ResolvedModel/ExpressionParser/Node';

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
     * Condition expression tree that is built out of a condition expression string
     * @internal
     */
    public conditionExpressionTreeRoot: Node;

    /**
     * Property of a projection that holds a collection of operations
     */
    public operations: CdmOperationCollection;

    /**
     * Property of a projection that holds the source of the operation
     */
    public source: CdmEntityReference;

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
        Logger.error(this.TAG, this.ctx, 'Projection operation not implemented yet.');
        return new CdmProjection(this.ctx);
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
            missingFields.push('source');
        }

        if (missingFields.length > 0) {
            Logger.error(
                this.TAG,
                this.ctx,
                Errors.validateErrorString(this.atCorpusPath, missingFields),
                this.validate.name
            );

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
    public constructProjectionContext(projDirective: ProjectionDirective, attrCtx: CdmAttributeContext): ProjectionContext {
        let projContext: ProjectionContext;

        if (!this.condition) {
            // if no condition is provided, get default condition and persist
            this.condition = ConditionExpression.getDefaultConditionExpression(this.operations, this.owner);
        }
        // create an expression tree based on the condition
        const tree: ExpressionTree = new ExpressionTree();
        this.conditionExpressionTreeRoot = tree.constructExpressionTree(this.condition);
        if (!this.conditionExpressionTreeRoot) {
            Logger.info(this.TAG, this.ctx, 'Optional expression missing. Implicit expression will automatically apply.', this.constructProjectionContext.name);
        }

        if (attrCtx) {
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

            if (this.source.fetchObjectDefinition<CdmObjectDefinition>(projDirective.resOpt).objectType === cdmObjectType.projectionDef) {
                // A Projection

                projContext = (this.source.explicitReference as CdmProjection).constructProjectionContext(projDirective, acSource);
            } else {
                // An Entity Reference

                const acpSourceProjection: AttributeContextParameters = {
                    under: acSource,
                    type: cdmAttributeContextType.entity,
                    name: this.source.namedReference ?? this.source.explicitReference.getName(),
                    regarding: this.source,
                    includeTraits: false
                };
                const ras: ResolvedAttributeSet = this.source.fetchResolvedAttributes(projDirective.resOpt, acpSourceProjection);

                // Initialize the projection context

                const ctx: CdmCorpusContext = (projDirective.owner?.ctx);

                let pasSet: ProjectionAttributeStateSet;

                // if polymorphic keep original source as previous state
                let polySourceSet: Map<string, ProjectionAttributeState[]> = null;
                if (projDirective.isSourcePolymorphic) {
                    polySourceSet = ProjectionResolutionCommonUtil.getPolymorphicSourceSet(projDirective, ctx, this.source, acpSourceProjection);
                }

                // now initialize projection attribute state
                pasSet = ProjectionResolutionCommonUtil.initializeProjectionAttributeStateSet(projDirective, ctx, ras, projDirective.isSourcePolymorphic, polySourceSet);

                projContext = new ProjectionContext(projDirective, ras.attributeContext);
                projContext.currentAttributeStateSet = pasSet;
            }

            let isConditionValid: boolean = false;
            if (this.conditionExpressionTreeRoot) {
                const input: InputValues = new InputValues();
                input.noMaxDepth = projDirective.hasNoMaximumDepth;
                input.isArray = projDirective.isArray;

                input.referenceOnly = projDirective.isReferenceOnly;
                input.normalized = projDirective.isNormalized;
                input.structured = projDirective.isStructured;

                input.nextDepth = ++projDirective.currentDepth;
                input.maxDepth = projDirective.maximumDepth;

                input.minCardinality = projDirective.cardinality?._minimumNumber;
                input.maxCardinality = projDirective.cardinality?._maximumNumber;

                isConditionValid = ExpressionTree.evaluateExpressionTree(this.conditionExpressionTreeRoot, input);
            }

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

                const acpGenAttrRound0: AttributeContextParameters = {
                    under: acGenAttrSet,
                    type: cdmAttributeContextType.generatedRound,
                    name: '_generatedAttributeRound0'
                };
                const acGenAttrRound0: CdmAttributeContext = CdmAttributeContext.createChildUnder(projDirective.resOpt, acpGenAttrRound0);

                // Start with an empty list for each projection
                let pasOperations: ProjectionAttributeStateSet = new ProjectionAttributeStateSet(projContext.currentAttributeStateSet.ctx);
                for (const operation of this.operations) {
                    // Evaluate projections and apply to empty state
                    const newPasOperations = operation.appendProjectionAttributeState(projContext, pasOperations, acGenAttrRound0);

                    // If the operations fails or it is not implemented the projection cannot be evaluated so keep previous valid state.
                    if (newPasOperations != null)
                    {
                        pasOperations = newPasOperations;
                    }
                }

                // Finally update the current state to the projection context
                projContext.currentAttributeStateSet = pasOperations;
            } else {
                // Pass Through - no operations to process
            }
        }

        return projContext;
    }

    /**
     * Create resolved attribute set based on the CurrentResolvedAttribute array
     * @internal
     */
    public extractResolvedAttributes(projCtx: ProjectionContext): ResolvedAttributeSet {
        const resolvedAttributeSet: ResolvedAttributeSet = new ResolvedAttributeSet();
        resolvedAttributeSet.attributeContext = projCtx.currentAttributeContext;

        for (const pas of projCtx.currentAttributeStateSet.values) {
            resolvedAttributeSet.merge(pas.currentResolvedAttribute, pas.currentResolvedAttribute.attCtx);
        }

        return resolvedAttributeSet;
    }
}
