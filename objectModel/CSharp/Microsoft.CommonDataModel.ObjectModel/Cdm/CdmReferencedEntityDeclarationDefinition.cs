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
    using System.Threading.Tasks;

    /// <summary>
    /// The object model implementation for referenced entity declaration.
    /// </summary>
    public class CdmReferencedEntityDeclarationDefinition : CdmObjectDefinitionBase, CdmEntityDeclarationDefinition
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CdmReferencedEntityDeclarationDefinition"/> class.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="entityName">The entity name.</param>
        public CdmReferencedEntityDeclarationDefinition(CdmCorpusContext ctx, string entityName)
            : base(ctx)
        {
            this.ObjectType = CdmObjectType.ReferencedEntityDeclarationDef;
            this.EntityName = entityName;
        }

        /// <summary>
        /// Gets or sets the entity name.
        /// </summary>
        public string EntityName { get; set; }

        /// <summary>
        /// Gets or sets the last file status check time.
        /// </summary>
        public DateTimeOffset? LastFileStatusCheckTime { get; set; }

        /// <summary>
        /// Gets or sets the last file modified time.
        /// </summary>
        public DateTimeOffset? LastFileModifiedTime { get; set; }

        /// <summary>
        /// Gets or sets the entity path.
        /// </summary>
        public string EntityPath { get; set; }

        /// <inheritdoc />
        public CdmCollection<CdmDataPartitionDefinition> DataPartitions => null;

        /// <inheritdoc />
        public CdmCollection<CdmDataPartitionPatternDefinition> DataPartitionPatterns => null;

        /// <summary>
        /// Gets or sets the last child file modified time.
        /// </summary>
        public DateTimeOffset? LastChildFileModifiedTime { get; set; }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.ReferencedEntityDeclarationDef;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmReferencedEntityDeclarationDefinition>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmReferencedEntityDeclarationDefinition copy;
            if (host == null)
            {
                copy = new CdmReferencedEntityDeclarationDefinition(this.Ctx, this.EntityName);
            }
            else
            {
                copy = host as CdmReferencedEntityDeclarationDefinition;
                copy.Ctx = this.Ctx;
                copy.EntityName = this.EntityName;
            }

            copy.EntityPath = this.EntityPath;
            copy.LastFileStatusCheckTime = this.LastFileStatusCheckTime;
            copy.LastFileModifiedTime = this.LastFileModifiedTime;

            this.CopyDef(resOpt, copy);

            return copy;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();
            if (string.IsNullOrWhiteSpace(this.EntityName))
                missingFields.Add("EntityName");
            if (string.IsNullOrWhiteSpace(this.EntityPath))
                missingFields.Add("EntityPath");

            if (missingFields.Count > 0)
            {
                Logger.Error(nameof(CdmReferencedEntityDeclarationDefinition), this.Ctx, Errors.ValidateErrorString(this.AtCorpusPath, missingFields), nameof(Validate));
                return false;
            }
            return true;
        }


        /// <inheritdoc />
        public override string GetName()
        {
            return this.EntityName;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            return false;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseObj, ResolveOptions resOpt = null)
        {
            return false;
        }

        /// <inheritdoc />
        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            this.ConstructResolvedTraitsDef(null, rtsb, resOpt);
        }

        /// <inheritdoc />
        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(
            ResolveOptions resOpt,
            CdmAttributeContext under = null)
        {
            return null;
        }

        /// <inheritdoc />
        public async Task FileStatusCheckAsync()
        {
            string fullPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(this.EntityPath, this.InDocument);
            DateTimeOffset? modifiedTime = await (this.Ctx.Corpus as CdmCorpusDefinition).ComputeLastModifiedTimeAsync(fullPath, this);

            // update modified times
            this.LastFileStatusCheckTime = DateTimeOffset.UtcNow;
            this.LastFileModifiedTime = TimeUtils.MaxTime(modifiedTime, this.LastFileModifiedTime);

            await this.ReportMostRecentTimeAsync(this.LastFileModifiedTime);
        }

        /// <inheritdoc />
        public async Task ReportMostRecentTimeAsync(DateTimeOffset? childTime)
        {
            if (this.Owner is CdmFileStatus && childTime != null)
                await (this.Owner as CdmFileStatus).ReportMostRecentTimeAsync(childTime);
        }
    }
}
