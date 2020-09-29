// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Class for projection
    /// </summary>
    public class CdmProjection : CdmObjectDefinitionBase
    {
        /// <summary>
        /// Property of a projection that holds the condition expression string
        /// </summary>
        public string Condition { get; set; }

        /// <summary>
        /// Condition expression tree that is built out of a condition expression string
        /// </summary>
        internal Node ConditionExpressionTreeRoot { get; set; }

        /// <summary>
        /// Property of a projection that holds a collection of operations
        /// </summary>
        public CdmOperationCollection Operations { get; }

        /// <summary>
        /// Property of a projection that holds the source of the operation
        /// </summary>
        public CdmEntityReference Source { get; set; }

        /// <summary>
        /// Projection constructor
        /// </summary>
        /// <param name="ctx"></param>
        public CdmProjection(CdmCorpusContext ctx)
            : base(ctx)
        {
            this.ObjectType = CdmObjectType.ProjectionDef;
            this.Operations = new CdmOperationCollection(ctx, this);
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            Logger.Error(nameof(CdmProjection), this.Ctx, "Projection operation not implemented yet.", nameof(Copy));
            return new CdmProjection(this.Ctx);
        }

        /// <inheritdoc />
        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null)
        {
            return CdmObjectBase.CopyData<CdmProjection>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override string GetName()
        {
            return "projection";
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.ProjectionDef;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            // Since projections don't support inheritance, return false
            return false;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();

            if (this.Source == null)
                missingFields.Add("Source");

            if (missingFields.Count > 0)
            {
                Logger.Error(nameof(CdmProjection), this.Ctx, Errors.ValidateErrorString(this.AtCorpusPath, missingFields), nameof(Validate));
                return false;
            }

            return true;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = string.Empty;
            if (this.Ctx.Corpus.blockDeclaredPathChanges == false)
            {
                path = this.DeclaredPath;
                if (string.IsNullOrEmpty(path))
                {
                    path = pathFrom + "projection";
                    this.DeclaredPath = path;
                }
            }

            if (preChildren?.Invoke(this, path) == true)
                return false;

            if (this.Source != null)
                if (this.Source.Visit(path + "/source/", preChildren, postChildren))
                    return true;

            bool result = false;
            if (this.Operations != null && this.Operations.Count > 0)
            {
                // since this.Operations.VisitList results is non-unique attribute context paths if there are 2 or more operations of the same type.
                // e.g. with composite keys
                // the solution is to add a unique identifier to the path by adding the operation index or opIdx
                for (int opIndex = 0; opIndex < this.Operations.Count; opIndex++)
                {
                    this.Operations[opIndex].Index = opIndex + 1;
                    if ((this.Operations.AllItems[opIndex] != null) &&
                        (this.Operations.AllItems[opIndex].Visit($"{path}/operation/index{opIndex + 1}/", preChildren, postChildren)))
                    {
                        result = true;
                    }
                    else
                    {
                        result = false;
                    }
                }
                if (result)
                    return true;
            }

            if (postChildren != null && postChildren.Invoke(this, path))
                return true;

            return false;
        }

        /// <inheritdoc />
        internal override ResolvedTraitSet FetchResolvedTraits(ResolveOptions resOpt = null)
        {
            return this.Source.FetchResolvedTraits(resOpt);
        }

        /// <summary>
        /// A function to construct projection context and populate the resolved attribute set that ExtractResolvedAttributes method can then extract
        /// This function is the entry point for projection resolution.
        /// This function is expected to do the following 3 things:
        /// - Create an condition expression tree & default if appropriate
        /// - Create and initialize Projection Context
        /// - Process operations
        /// </summary>
        /// <param name="projDirective"></param>
        /// <param name="attrCtx"></param>
        /// <returns></returns>
        internal ProjectionContext ConstructProjectionContext(ProjectionDirective projDirective, CdmAttributeContext attrCtx)
        {
            ProjectionContext projContext = null;

            if (string.IsNullOrWhiteSpace(this.Condition))
            {
                // if no condition is provided, get default condition and persist
                this.Condition = ConditionExpression.GetDefaultConditionExpression(this.Operations, this.Owner);
            }
            // create an expression tree based on the condition
            ExpressionTree tree = new ExpressionTree();
            this.ConditionExpressionTreeRoot = tree.ConstructExpressionTree(this.Condition);
            if (this.ConditionExpressionTreeRoot == null)
            {
                Logger.Info(nameof(CdmProjection), this.Ctx, $"Optional expression missing. Implicit expression will automatically apply.", nameof(ConstructProjectionContext));
            }

            if (attrCtx != null)
            {
                // Add projection to context tree
                AttributeContextParameters acpProj = new AttributeContextParameters
                {
                    under = attrCtx,
                    type = CdmAttributeContextType.Projection,
                    Name = this.FetchObjectDefinitionName(),
                    Regarding = projDirective.OwnerRef,
                    IncludeTraits = false
                };
                CdmAttributeContext acProj = CdmAttributeContext.CreateChildUnder(projDirective.ResOpt, acpProj);

                AttributeContextParameters acpSource = new AttributeContextParameters
                {
                    under = acProj,
                    type = CdmAttributeContextType.Source,
                    Name = "source",
                    Regarding = null,
                    IncludeTraits = false
                };
                CdmAttributeContext acSource = CdmAttributeContext.CreateChildUnder(projDirective.ResOpt, acpSource);

                if (this.Source.FetchObjectDefinition<CdmObjectDefinition>(projDirective.ResOpt).ObjectType == CdmObjectType.ProjectionDef)
                {
                    // A Projection

                    projContext = ((CdmProjection)this.Source.ExplicitReference).ConstructProjectionContext(projDirective, acSource);
                }
                else
                {
                    // An Entity Reference

                    AttributeContextParameters acpSourceProjection = new AttributeContextParameters
                    {
                        under = acSource,
                        type = CdmAttributeContextType.Entity,
                        Name = this.Source.NamedReference ?? this.Source.ExplicitReference.GetName(),
                        Regarding = this.Source,
                        IncludeTraits = false
                    };
                    ResolvedAttributeSet ras = this.Source.FetchResolvedAttributes(projDirective.ResOpt, acpSourceProjection);

                    // Initialize the projection context

                    CdmCorpusContext ctx = (projDirective.Owner?.Ctx);

                    ProjectionAttributeStateSet pasSet = null;

                    // if polymorphic keep original source as previous state
                    Dictionary<string, List<ProjectionAttributeState>> polySourceSet = null;
                    if (projDirective.IsSourcePolymorphic)
                    {
                        polySourceSet = ProjectionResolutionCommonUtil.GetPolymorphicSourceSet(projDirective, ctx, this.Source, acpSourceProjection);
                    }

                    // now initialize projection attribute state
                    pasSet = ProjectionResolutionCommonUtil.InitializeProjectionAttributeStateSet(
                        projDirective,
                        ctx,
                        ras,
                        isSourcePolymorphic: projDirective.IsSourcePolymorphic,
                        polymorphicSet: polySourceSet);

                    projContext = new ProjectionContext(projDirective, ras.AttributeContext)
                    {
                        CurrentAttributeStateSet = pasSet
                    };
                }

                bool isConditionValid = false;
                if (this.ConditionExpressionTreeRoot != null)
                {
                    InputValues input = new InputValues()
                    {
                        noMaxDepth = projDirective.HasNoMaximumDepth,
                        isArray = projDirective.IsArray,

                        referenceOnly = projDirective.IsReferenceOnly,
                        normalized = projDirective.IsNormalized,
                        structured = projDirective.IsStructured,

                        nextDepth = ++projDirective.CurrentDepth,
                        maxDepth = projDirective.MaximumDepth,

                        minCardinality = projDirective.Cardinality?._MinimumNumber,
                        maxCardinality = projDirective.Cardinality?._MaximumNumber
                    };

                    isConditionValid = ExpressionTree.EvaluateExpressionTree(this.ConditionExpressionTreeRoot, input);
                }

                if (isConditionValid && this.Operations != null && this.Operations.Count > 0)
                {
                    // Just in case new operations were added programmatically, reindex operations
                    for (int i = 0; i < this.Operations.Count; i++)
                    {
                        this.Operations[i].Index = i + 1;
                    }

                    // Operation

                    AttributeContextParameters acpGenAttrSet = new AttributeContextParameters
                    {
                        under = attrCtx,
                        type = CdmAttributeContextType.GeneratedSet,
                        Name = "_generatedAttributeSet"
                    };
                    CdmAttributeContext acGenAttrSet = CdmAttributeContext.CreateChildUnder(projDirective.ResOpt, acpGenAttrSet);

                    // Start with an empty list for each projection
                    ProjectionAttributeStateSet pasOperations = new ProjectionAttributeStateSet(projContext.CurrentAttributeStateSet.Ctx);
                    foreach (CdmOperationBase operation in this.Operations)
                    {
                        // Evaluate projections and apply to empty state
                        ProjectionAttributeStateSet newPasOperations = operation.AppendProjectionAttributeState(projContext, pasOperations, acGenAttrSet);

                        // If the operations fails or it is not implemented the projection cannot be evaluated so keep previous valid state
                        if (newPasOperations != null)
                        {
                            pasOperations = newPasOperations;
                        }
                    }

                    // Finally update the current state to the projection context
                    projContext.CurrentAttributeStateSet = pasOperations;
                }
                else
                {
                    // Pass Through - no operations to process
                }
            }

            return projContext;
        }

        /// <summary>
        /// Create resolved attribute set based on the CurrentResolvedAttribute array
        /// </summary>
        /// <param name="projCtx"></param>
        /// <returns></returns>
        internal ResolvedAttributeSet ExtractResolvedAttributes(ProjectionContext projCtx)
        {
            ResolvedAttributeSet resolvedAttributeSet = new ResolvedAttributeSet
            {
                AttributeContext = projCtx.CurrentAttributeContext
            };

            foreach (var pas in projCtx.CurrentAttributeStateSet.States)
            {
                resolvedAttributeSet.Merge(pas.CurrentResolvedAttribute, pas.CurrentResolvedAttribute.AttCtx);
            }

            return resolvedAttributeSet;
        }
    }
}
