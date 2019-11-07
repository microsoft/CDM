// --------------------------------------------------------------------------------------------------------------------
// <copyright file="CdmReferencedEntityDeclarationDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
// <summary>
//   The object model implementation for referenced entity declaration.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Threading.Tasks;

    /// <summary>
    /// The object model implementation for referenced entity declaration.
    /// </summary>
    public class CdmReferencedEntityDeclarationDefinition : CdmObjectDefinitionBase, CdmEntityDeclarationDefinition
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CdmReferencedEntityDeclarationDefinition"/> class.
        /// </summary>
        /// <param name="ctx"> The context. </param>
        /// <param name="entityName"> The entity name. </param>
        public CdmReferencedEntityDeclarationDefinition(CdmCorpusContext ctx, string entityName)
            : base(ctx)
        {
            this.ObjectType = CdmObjectType.ReferencedEntityDeclarationDef;
            this.EntityName = entityName;
        }

        /// <inheritdoc />
        public string EntityName { get; set; }

        /// <inheritdoc />
        public DateTimeOffset? LastFileStatusCheckTime { get; set; }

        /// <inheritdoc />
        public DateTimeOffset? LastFileModifiedTime { get; set; }

        /// <summary>
        /// Gets or sets the entity path.
        /// </summary>
        public string EntityPath { get; set; }

        public CdmCollection<CdmDataPartitionDefinition> DataPartitions => null;

        public CdmCollection<CdmDataPartitionPatternDefinition> DataPartitionPatterns => null;

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
        public override CdmObject Copy(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            var copy =
                new CdmReferencedEntityDeclarationDefinition(this.Ctx, this.EntityName)
                {
                    EntityPath = this.EntityPath,
                    LastFileStatusCheckTime = this.LastFileStatusCheckTime,
                    LastFileModifiedTime = this.LastFileModifiedTime
                };
            this.CopyDef(resOpt, copy);

            return copy;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            return !string.IsNullOrWhiteSpace(this.EntityName) && !string.IsNullOrWhiteSpace(this.EntityPath);
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
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

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
            string nameSpace = this.InDocument.Namespace;
            string fullPath = $"{nameSpace}:{this.EntityPath}";

            DateTimeOffset? modifiedTime = await (this.Ctx.Corpus as CdmCorpusDefinition).ComputeLastModifiedTimeAsync(fullPath);

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