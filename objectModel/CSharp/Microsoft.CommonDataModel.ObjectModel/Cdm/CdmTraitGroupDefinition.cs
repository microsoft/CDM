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
    /// The CDM definition of a Trait Group object, representing a collection (grouping) of one or more traits.
    /// </summary>
    public class CdmTraitGroupDefinition : CdmObjectDefinitionBase
    {
        private static readonly string Tag = nameof(CdmTraitGroupDefinition);

        /// <summary>
        /// Gets or sets the TraitGroup name.
        /// </summary>
        public string TraitGroupName { get; set; }

        /// <inheritdoc />
        public override string GetName()
        {
            return this.TraitGroupName;
        }

        /// <summary>
        /// Constructs a CdmTraitGroupDefinition.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="TraitGroupName">The TraitGroup name.</param>
        public CdmTraitGroupDefinition(CdmCorpusContext ctx, string TraitGroupName)
            : base(ctx)
        {
            this.ObjectType = CdmObjectType.TraitGroupDef;
            this.TraitGroupName = TraitGroupName;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmTraitGroupDefinition copy;
            if (host == null)
            {
                copy = new CdmTraitGroupDefinition(this.Ctx, this.TraitGroupName);
            }
            else
            {
                copy = host as CdmTraitGroupDefinition;
                copy.TraitGroupName = this.TraitGroupName;
            }

            this.CopyDef(resOpt, copy);
            return copy;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            if (string.IsNullOrWhiteSpace(this.TraitGroupName))
            {
                IEnumerable<string> missingFields = new List<string> { "TraitGroupName" };
                Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnIntegrityCheckFailure, this.AtCorpusPath, string.Join(", ", missingFields.Select((s) => $"'{s}'")));
                return false;
            }
            return true;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.TraitGroupDef;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData(this, resOpt, options);
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt)
        {
            return false;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = string.Empty;
            if (!this.Ctx.Corpus.blockDeclaredPathChanges)
            {
                path = this.DeclaredPath;
                if (string.IsNullOrEmpty(path))
                {
                    path = pathFrom + this.TraitGroupName;
                    this.DeclaredPath = path;
                }
            }

            if (preChildren?.Invoke(this, path) == true)
            {
                return false;
            }

            if (this.VisitDef(path, preChildren, postChildren))
            {
                return true;
            }

            if (postChildren != null && postChildren.Invoke(this, path))
            {
                return true;
            }

            return false;
        }

        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            this.ConstructResolvedTraitsDef(null, rtsb, resOpt);
        }

        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            return null;
        }
    }
}
