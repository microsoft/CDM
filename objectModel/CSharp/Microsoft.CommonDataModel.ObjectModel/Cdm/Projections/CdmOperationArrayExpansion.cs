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
    using System.Linq;

    /// <summary>
    /// Class to handle ArrayExpansion operations
    /// </summary>
    public class CdmOperationArrayExpansion : CdmOperationBase
    {
        private static readonly string Tag = nameof(CdmOperationArrayExpansion);

        public int? StartOrdinal { get; set; }

        public int? EndOrdinal { get; set; }

        public CdmOperationArrayExpansion(CdmCorpusContext ctx) : base(ctx)
        {
            this.ObjectType = CdmObjectType.OperationArrayExpansionDef;
            this.Type = CdmOperationType.ArrayExpansion;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            var copy = host == null ? new CdmOperationArrayExpansion(this.Ctx) : host as CdmOperationArrayExpansion;

            copy.StartOrdinal = this.StartOrdinal;
            copy.EndOrdinal = this.EndOrdinal;

            this.CopyProj(resOpt, copy);
            return copy;
        }

        /// <inheritdoc />
        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null)
        {
            return CdmObjectBase.CopyData<CdmOperationArrayExpansion>(this, resOpt, options);
        }

        public override string GetName()
        {
            return "operationArrayExpansion";
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.OperationArrayExpansionDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();

            if (this.StartOrdinal == null)
            {
                missingFields.Add("StartOrdinal");
            }

            if (this.EndOrdinal == null)
            {
                missingFields.Add("EndOrdinal");
            }

            if (missingFields.Count > 0)
            {
                Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnIntegrityCheckFailure, this.AtCorpusPath, string.Join(", ", missingFields.Select((s) => $"'{s}'")));
                return false;
            }

            return true;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = this.UpdateDeclaredPath(pathFrom);

            if (preChildren?.Invoke(this, path) == true)
                return false;

            if (postChildren != null && postChildren.Invoke(this, path))
                return true;

            return false;
        }

        /// <inheritdoc />
        internal override ProjectionAttributeStateSet AppendProjectionAttributeState(
            ProjectionContext projCtx,
            ProjectionAttributeStateSet projOutputSet,
            CdmAttributeContext attrCtx)
        {
            // Create a new attribute context for the operation
            AttributeContextParameters attrCtxOpArrayExpansionParam = new AttributeContextParameters
            {
                under = attrCtx,
                type = CdmAttributeContextType.OperationArrayExpansion,
                Name = $"operation/index{Index}/operationArrayExpansion"
            };
            CdmAttributeContext attrCtxOpArrayExpansion = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxOpArrayExpansionParam);

            // Expansion steps start at round 0
            int round = 0;
            List<ProjectionAttributeState> projAttrStatesFromRounds = new List<ProjectionAttributeState>();

            // Ordinal validation
            if (this.StartOrdinal > this.EndOrdinal)
            {
                Logger.Warning(this.Ctx, Tag, nameof(AppendProjectionAttributeState), this.AtCorpusPath, CdmLogCode.WarnValdnOrdinalStartEndOrder, this.StartOrdinal.ToString(), this.EndOrdinal.ToString());
            }
            else
            {
                // Ordinals should start at startOrdinal or 0, whichever is larger.
                int startingOrdinal = Math.Max(0, (int)this.StartOrdinal);

                // Ordinals should end at endOrdinal or the maximum ordinal allowed (set in resolve options), whichever is smaller.
                if (this.EndOrdinal > projCtx.ProjectionDirective.ResOpt.MaxOrdinalForArrayExpansion)
                {
                    Logger.Warning(this.Ctx, Tag, nameof(AppendProjectionAttributeState), this.AtCorpusPath, CdmLogCode.WarnValdnMaxOrdinalTooHigh, this.EndOrdinal.ToString(), projCtx.ProjectionDirective.ResOpt.MaxOrdinalForArrayExpansion.ToString());
                }
                int endingOrdinal = Math.Min(projCtx.ProjectionDirective.ResOpt.MaxOrdinalForArrayExpansion, (int)this.EndOrdinal);

                // For each ordinal, create a copy of the input resolved attribute
                for (int i = startingOrdinal; i <= endingOrdinal; i++)
                {
                    // Create a new attribute context for the round
                    AttributeContextParameters attrCtxRoundParam = new AttributeContextParameters
                    {
                        under = attrCtxOpArrayExpansion,
                        type = CdmAttributeContextType.GeneratedRound,
                        Name = $"_generatedAttributeRound{round}"
                    };
                    CdmAttributeContext attrCtxRound = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxRoundParam);

                    // Iterate through all the projection attribute states generated from the source's resolved attributes
                    // Each projection attribute state contains a resolved attribute that it is corresponding to
                    foreach (ProjectionAttributeState currentPAS in projCtx.CurrentAttributeStateSet.States)
                    {
                        // Create a new attribute context for the expanded attribute with the current ordinal
                        AttributeContextParameters attrCtxExpandedAttrParam = new AttributeContextParameters
                        {
                            under = attrCtxRound,
                            type = CdmAttributeContextType.AttributeDefinition,
                            Name = $"{currentPAS.CurrentResolvedAttribute.ResolvedName}@{i}"
                        };
                        CdmAttributeContext attrCtxExpandedAttr = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxExpandedAttrParam);

                        if (currentPAS.CurrentResolvedAttribute.Target is ResolvedAttributeSet)
                        {
                            Logger.Error(this.Ctx, Tag, nameof(AppendProjectionAttributeState), this.AtCorpusPath, CdmLogCode.ErrProjUnsupportedAttrGroups);
                            projAttrStatesFromRounds.Clear();
                            break;
                        }

                        // Create a new resolved attribute for the expanded attribute
                        ResolvedAttribute newResAttr = CreateNewResolvedAttribute(projCtx, attrCtxExpandedAttr, currentPAS.CurrentResolvedAttribute, currentPAS.CurrentResolvedAttribute.ResolvedName);

                        // Create a projection attribute state for the expanded attribute
                        ProjectionAttributeState newPAS = new ProjectionAttributeState(projOutputSet.Ctx)
                        {
                            CurrentResolvedAttribute = newResAttr,
                            PreviousStateList = new List<ProjectionAttributeState> { currentPAS },
                            Ordinal = i
                        };

                        projAttrStatesFromRounds.Add(newPAS);
                    }

                    if (i == endingOrdinal)
                    {
                        break;
                    }

                    // Increment the round
                    round++;
                }
            }

            if (projAttrStatesFromRounds.Count == 0)
            {
                // No rounds were produced from the array expansion - input passes through
                foreach (ProjectionAttributeState pas in projCtx.CurrentAttributeStateSet.States)
                {
                    projOutputSet.Add(pas);
                }
            }
            else
            {
                // Add all the projection attribute states containing the expanded attributes to the output
                foreach (ProjectionAttributeState pas in projAttrStatesFromRounds)
                {
                    projOutputSet.Add(pas);
                }
            }

            return projOutputSet;
        }
    }
}
