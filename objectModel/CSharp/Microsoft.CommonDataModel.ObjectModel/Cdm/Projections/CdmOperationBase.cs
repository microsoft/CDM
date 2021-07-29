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

        internal CdmOperationBase CopyProj(ResolveOptions resOpt, CdmOperationBase copy)
        {
            copy.Index = this.Index;
            copy.Condition = this.Condition;
            copy.SourceInput = this.SourceInput;

            this.CopyDef(resOpt, copy);
            return copy;
        }

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
        /// <param name="projAttrStateSet"></param>
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

        /// <summary>
        /// Projections require a new resolved attribute to be created multiple times
        /// This function allows us to create new resolved attributes based on a input attribute
        /// </summary>
        /// <param name="projCtx"></param>
        /// <param name="attrCtxUnder"></param>
        /// <param name="oldResolvedAttribute">
        /// For some attributes obtained from the previous projection operation, they may have a different set of traits comparing to the resolved attribute target. 
        /// We would want to take the set of traits from the resolved attribute.
        /// </param>
        /// <param name="overrideDefaultName"></param>
        /// <param name="addedSimpleRefTraits"></param>
        /// <returns></returns>
        internal static ResolvedAttribute CreateNewResolvedAttribute(
            ProjectionContext projCtx,
            CdmAttributeContext attrCtxUnder,
            ResolvedAttribute oldResolvedAttribute,
            string overrideDefaultName = null,
            List<string> addedSimpleRefTraits = null)
        {
            var targetAttr = oldResolvedAttribute.Target.Copy() as CdmAttribute;

            ResolvedAttribute newResAttr = new ResolvedAttribute(
                projCtx.ProjectionDirective.ResOpt,
                targetAttr,
                !string.IsNullOrWhiteSpace(overrideDefaultName) ? overrideDefaultName : targetAttr.GetName(), attrCtxUnder);

            targetAttr.InDocument = projCtx.ProjectionDirective.Owner.InDocument;

            newResAttr.ResolvedTraits = oldResolvedAttribute.ResolvedTraits.DeepCopy();

            if (addedSimpleRefTraits != null)
            {
                foreach (string trait in addedSimpleRefTraits)
                {
                    var tr = new CdmTraitReference(targetAttr.Ctx, trait, true, false);
                    newResAttr.ResolvedTraits = newResAttr.ResolvedTraits.MergeSet(tr.FetchResolvedTraits());
                }
            }
            

            return newResAttr;
        }

        /// <summary>
        /// Replace the wildcard character. {a/A} will be replaced with the current attribute name. {m/M} will be replaced with the entity attribute name. {o} will be replaced with the index of the attribute after an array expansion
        /// </summary>
        /// <param name="format">The original text.</param>
        /// <param name="baseAttributeName">The entity attribute name, it may be empty string if it's not avaialble (type attribute).</param>
        /// <param name="ordinal">The ordinal number, it may be empty string if it's not available (not expanded).</param>
        /// <param name="memberAttributeName">The current attribute name, It may be empty string if the source is a ResolvedAttributeSet.</param>
        /// <returns></returns>
        internal static string ReplaceWildcardCharacters(string format, string baseAttributeName, string ordinal, string memberAttributeName)
        {
            if (string.IsNullOrEmpty(format))
            {
                return "";
            }

            string attributeName = StringUtils.Replace(format, 'a', baseAttributeName);
            attributeName = StringUtils.Replace(attributeName, 'o', ordinal);
            attributeName = StringUtils.Replace(attributeName, 'm', memberAttributeName);

            return attributeName;
        }
    }
}
