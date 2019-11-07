// --------------------------------------------------------------------------------------------------------------------
// <copyright file="CdmLocalEntityDeclarationDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
// <summary>
//   The object model implementation for local entity declaration.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    /// <summary>
    /// The object model implementation for local entity declaration.
    /// </summary>
    public class CdmLocalEntityDeclarationDefinition : CdmObjectDefinitionBase, CdmEntityDeclarationDefinition
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CdmLocalEntityDeclarationDefinition"/> class.
        /// </summary>
        /// <param name="ctx"> The context. </param>
        /// <param name="entityName"> The entity name. </param>
        public CdmLocalEntityDeclarationDefinition(CdmCorpusContext ctx, string entityName) : base(ctx)
        {
            this.ObjectType = CdmObjectType.LocalEntityDeclarationDef;
            this.EntityName = entityName;
        }

        /// <summary>
        /// Gets or sets the entity name.
        /// </summary>
        public string EntityName { get; set; }

        /// <summary>
        /// Gets or sets the entity path.
        /// </summary>
        public string EntityPath { get; set; }

        /// <summary>
        /// Gets or sets the data partitions.
        /// </summary>
        internal CdmCollection<CdmDataPartitionDefinition> _dataPartitions { get; set; }

        /// <summary>
        /// Gets or sets the data partition patterns.
        /// </summary>
        internal CdmCollection<CdmDataPartitionPatternDefinition> _dataPartitionPatterns { get; set; }

        /// <summary>
        /// The last file status check time.
        /// </summary>
        public DateTimeOffset? LastFileStatusCheckTime { get; set; }

        /// <summary>
        /// The last file modified time.
        /// </summary>
        public DateTimeOffset? LastFileModifiedTime { get; set; }

        /// <summary>
        /// The last child file modified time.
        /// </summary>
        public DateTimeOffset? LastChildFileModifiedTime { get; set; }

        public CdmCollection<CdmDataPartitionDefinition> DataPartitions
        {
            get
            {
                if (this._dataPartitions == null)
                    this._dataPartitions = new CdmCollection<CdmDataPartitionDefinition>(this.Ctx, this, CdmObjectType.DataPartitionDef);
                return this._dataPartitions;
            }
        }

        public CdmCollection<CdmDataPartitionPatternDefinition> DataPartitionPatterns
        {
            get
            {
                if (this._dataPartitionPatterns == null)
                    this._dataPartitionPatterns = new CdmCollection<CdmDataPartitionPatternDefinition>(this.Ctx, this, CdmObjectType.DataPartitionPatternDef);
                return this._dataPartitionPatterns;
            }
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.LocalEntityDeclarationDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            return !string.IsNullOrWhiteSpace(this.EntityName);
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            var copy = new CdmLocalEntityDeclarationDefinition(this.Ctx, this.EntityName)
            {
                EntityPath = this.EntityPath,
                LastFileStatusCheckTime = this.LastFileStatusCheckTime,
                LastFileModifiedTime = this.LastFileModifiedTime,
                LastChildFileModifiedTime = this.LastChildFileModifiedTime
            };
            foreach (var partition in this.DataPartitions)
                copy.DataPartitions.Add(partition);
            foreach (var pattern in this.DataPartitionPatterns)
                copy.DataPartitionPatterns.Add(pattern);
            this.CopyDef(resOpt, copy);

            return copy;
        }

        /// <inheritdoc />
        public override string GetName()
        {
            return this.EntityName;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmLocalEntityDeclarationDefinition>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = this.DeclaredPath;
            if (path == null)
            {
                path = pathFrom + this.EntityName;
                this.DeclaredPath = path;
            }

            if (preChildren != null && preChildren.Invoke(this, path))
            {
                return false;
            }

            if (this.DataPartitions != null)
            {
                if (this._dataPartitions.VisitList(path + "/", preChildren, postChildren))
                    return true;
            }
            return false;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseName, ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            return false; // makes no sense
        }

        /// <inheritdoc />
        public async Task FileStatusCheckAsync()
        {
            DateTimeOffset? modifiedTime = await (this.Ctx.Corpus as CdmCorpusDefinition).ComputeLastModifiedTimeAsync(this.EntityPath);

            foreach (var partition in this.DataPartitions)
                await partition.FileStatusCheckAsync();

            foreach (var pattern in this.DataPartitionPatterns)
                await pattern.FileStatusCheckAsync();

            // update modified times
            this.LastFileStatusCheckTime = DateTimeOffset.UtcNow;
            this.LastFileModifiedTime = TimeUtils.MaxTime(modifiedTime, this.LastFileModifiedTime);

            await this.ReportMostRecentTimeAsync(this.LastFileModifiedTime);
        }

        /// <inheritdoc />
        public async Task ReportMostRecentTimeAsync(DateTimeOffset? childTime)
        {
            this.LastChildFileModifiedTime = childTime;

            DateTimeOffset? mostRecentAtThisLevel = TimeUtils.MaxTime(childTime, this.LastFileModifiedTime);

            if (this.Owner is CdmFileStatus && mostRecentAtThisLevel != null)
            {
                await (this.Owner as CdmFileStatus).ReportMostRecentTimeAsync(mostRecentAtThisLevel);
            }
        }

        /// <summary>
        /// Creates a data partition object using the input, should be called by DataPartitionPattern object
        /// </summary>
        internal void CreateDataPartitionFromPattern(string filePath, CdmTraitCollection exhibitsTraits, Dictionary<string, List<string>> args, string schema, DateTimeOffset? modifiedTime)
        {
            var existingPartition = this.DataPartitions.AllItems.Find(x => x.Location == filePath);

            if (existingPartition == null)
            {
                var newPartition = this.Ctx.Corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef);
                newPartition.Location = filePath;
                newPartition.SpecializedSchema = schema;
                newPartition.LastFileModifiedTime = modifiedTime;
                newPartition.LastFileStatusCheckTime = DateTimeOffset.UtcNow;

                foreach (var trait in exhibitsTraits)
                    newPartition.ExhibitsTraits.Add(trait);
                foreach (KeyValuePair<string, List<string>> entry in args)
                    newPartition.Arguments[entry.Key] = entry.Value;

                this._dataPartitions.Add(newPartition);
            }
        }
    }
}