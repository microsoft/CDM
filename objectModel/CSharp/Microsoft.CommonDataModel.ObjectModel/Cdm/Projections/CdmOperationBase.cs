// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Base class for all operations
    /// </summary>
    public abstract class CdmOperationBase : CdmObjectDefinitionBase
    {
        /// <summary>
        /// The index of an operation
        /// In a projection's operation collection, 2 same type of operation may cause duplicate attribute context
        /// To avoid that we add an index
        /// </summary>
        internal int Index { get; set; }

        public CdmOperationType Type { get; internal set; }

        /// <summary>
        /// Property of an operation that holds the condition expression string
        /// </summary>
        public string Condition { get; set; }

        /// <summary>
        /// Property of an operation that defines if the operation receives the input from previous operation or from source entity
        /// </summary>
        public bool? SourceInput { get; set; }

        public CdmOperationBase(CdmCorpusContext ctx) : base(ctx)
        {
        }

        /// <inheritdoc />
        public abstract override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null);

        /// <inheritdoc />
        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public abstract override dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null);

        /// <inheritdoc />
        public abstract override string GetName();

        /// <inheritdoc />
        [Obsolete]
        public abstract override CdmObjectType GetObjectType();

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            return false;
        }

        /// <inheritdoc />
        public abstract override bool Validate();

        /// <inheritdoc />
        public abstract override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren);

        /// <summary>
        /// A function to cumulate the projection attribute states
        /// </summary>
        /// <param name="projCtx"></param>
        /// <param name="projAttrStateList"></param>
        /// <param name="attrCtx"></param>
        /// <returns></returns>
        internal abstract ProjectionAttributeStateSet AppendProjectionAttributeState(
            ProjectionContext projCtx,
            ProjectionAttributeStateSet projAttrStateSet,
            CdmAttributeContext attrCtx);

        /// <summary>
        /// Projections require a new resolved attribute to be created multiple times
        /// This function allows us to create new resolved attributes based on a input attribute
        /// </summary>
        /// <param name="projCtx"></param>
        /// <param name="attrCtxUnder"></param>
        /// <param name="targetAttr"></param>
        /// <param name="overrideDefaultName"></param>
        /// <param name="addedSimpleRefTraits"></param>
        /// <returns></returns>
        internal static ResolvedAttribute CreateNewResolvedAttribute(
            ProjectionContext projCtx,
            CdmAttributeContext attrCtxUnder,
            CdmAttribute targetAttr,
            string overrideDefaultName = null,
            List<string> addedSimpleRefTraits = null)
        {
            targetAttr = targetAttr.Copy() as CdmAttribute;

            ResolvedAttribute newResAttr = new ResolvedAttribute(
                projCtx.ProjectionDirective.ResOpt,
                targetAttr,
                !string.IsNullOrWhiteSpace(overrideDefaultName) ? overrideDefaultName : targetAttr.GetName(), attrCtxUnder);

            targetAttr.InDocument = projCtx.ProjectionDirective.Owner.InDocument;

            if (addedSimpleRefTraits != null)
            {
                foreach (string trait in addedSimpleRefTraits)
                {
                    if (targetAttr.AppliedTraits.Item(trait) == null)
                    {
                        targetAttr.AppliedTraits.Add(trait, true);
                    }
                }
            }

            ResolvedTraitSet resTraitSet = targetAttr.FetchResolvedTraits(projCtx.ProjectionDirective.ResOpt);

            // Create deep a copy of traits to avoid conflicts in case of parameters
            if (resTraitSet != null)
            {
                newResAttr.ResolvedTraits = resTraitSet.DeepCopy();
            }

            return newResAttr;
        }
    }
}
