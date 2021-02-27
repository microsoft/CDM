// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;

    /// <summary>
    /// The object model implementation for local entity declaration.
    /// </summary>
    public class CdmLocalEntityDeclarationDefinition : CdmObjectDefinitionBase, CdmEntityDeclarationDefinition
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CdmLocalEntityDeclarationDefinition"/> class.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="entityName">The entity name.</param>
        public CdmLocalEntityDeclarationDefinition(CdmCorpusContext ctx, string entityName) : base(ctx)
        {
            this.ObjectType = CdmObjectType.LocalEntityDeclarationDef;
            this.EntityName = entityName;
            this.DataPartitions = new CdmCollection<CdmDataPartitionDefinition>(this.Ctx, this, CdmObjectType.DataPartitionDef);
            this.DataPartitionPatterns = new CdmCollection<CdmDataPartitionPatternDefinition>(this.Ctx, this, CdmObjectType.DataPartitionPatternDef);
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
        /// Gets or sets the last file status check time.
        /// </summary>
        public DateTimeOffset? LastFileStatusCheckTime { get; set; }

        /// <summary>
        /// Gets or sets the last file modified time.
        /// </summary>
        public DateTimeOffset? LastFileModifiedTime { get; set; }

        /// <summary>
        /// Gets or sets the last child file modified time.
        /// </summary>
        public DateTimeOffset? LastChildFileModifiedTime { get; set; }

        /// <summary>
        /// Gets the data partitions.
        /// </summary>
        public CdmCollection<CdmDataPartitionDefinition> DataPartitions { get; }

        /// <summary>
        /// Gets the data partition patterns.
        /// </summary>
        public CdmCollection<CdmDataPartitionPatternDefinition> DataPartitionPatterns { get; }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.LocalEntityDeclarationDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            if (string.IsNullOrWhiteSpace(this.EntityName))
            {
                Logger.Error(nameof(CdmLocalEntityDeclarationDefinition), this.Ctx, Errors.ValidateErrorString(this.AtCorpusPath, new List<string> { "EntityName" }), nameof(Validate));
                return false;
            }
            return true;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmLocalEntityDeclarationDefinition copy;
            if (host == null)
            {
                copy = new CdmLocalEntityDeclarationDefinition(this.Ctx, this.EntityName);
            }
            else
            {
                copy = host as CdmLocalEntityDeclarationDefinition;
                copy.Ctx = this.Ctx;
                copy.EntityName = this.EntityName;
                copy.DataPartitionPatterns.Clear();
                copy.DataPartitions.Clear();
            }

            copy.EntityPath = this.EntityPath;
            copy.LastFileStatusCheckTime = this.LastFileStatusCheckTime;
            copy.LastFileModifiedTime = this.LastFileModifiedTime;
            copy.LastChildFileModifiedTime = this.LastChildFileModifiedTime;

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
            string path = string.Empty;
            if (this.Ctx.Corpus.blockDeclaredPathChanges == false)
            {
                path = this.DeclaredPath;
                if (path == null)
                {
                    path = pathFrom + this.EntityName;
                    this.DeclaredPath = path;
                }
            }

            if (preChildren != null && preChildren.Invoke(this, path))
            {
                return false;
            }

            if (this.DataPartitions != null)
            {
                if (this.DataPartitions.VisitList(path + "/dataPartitions/", preChildren, postChildren))
                    return true;
            }

            if (this.DataPartitionPatterns != null)
            {
                if (this.DataPartitionPatterns.VisitList(path + "/dataPartitionPatterns/", preChildren, postChildren))
                    return true;
            }

            if (this.VisitDef(path, preChildren, postChildren))
                return true;

            if (postChildren != null && postChildren.Invoke(this, path))
            {
                return false;
            }
            return false;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseName, ResolveOptions resOpt = null)
        {
            return false; // makes no sense
        }

        /// <inheritdoc />
        public async Task FileStatusCheckAsync()
        {
            using ((this.Ctx.Corpus.Storage.FetchAdapter(this.InDocument.Namespace) as StorageAdapterBase)?.CreateFileQueryCacheContext())
            {
                string fullPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(this.EntityPath, this.InDocument);
                DateTimeOffset? modifiedTime = await this.Ctx.Corpus.ComputeLastModifiedTimeAsync(fullPath, this);

                // check patterns first as this is a more performant way of querying file modification times 
                // from ADLS and we can cache the times for reuse in the individual partition checks below
                foreach (var pattern in this.DataPartitionPatterns)
                {
                    await pattern.FileStatusCheckAsync();
                }

                foreach (var partition in this.DataPartitions)
                {
                    await partition.FileStatusCheckAsync();
                }

                // update modified times
                this.LastFileStatusCheckTime = DateTimeOffset.UtcNow;
                this.LastFileModifiedTime = TimeUtils.MaxTime(modifiedTime, this.LastFileModifiedTime);

                await this.ReportMostRecentTimeAsync(this.LastFileModifiedTime);
            }
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
        /// Creates a data partition object using the input. Should be called by a DataPartitionPattern object.
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

                this.DataPartitions.Add(newPartition);
            }
        }
    }
}
