// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
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
        private static readonly string Tag = nameof(CdmLocalEntityDeclarationDefinition);
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
            this.IncrementalPartitions = new CdmCollection<CdmDataPartitionDefinition>(this.Ctx, this, CdmObjectType.DataPartitionDef);
            this.IncrementalPartitionPatterns = new CdmCollection<CdmDataPartitionPatternDefinition>(this.Ctx, this, CdmObjectType.DataPartitionPatternDef);
            this.LastFileModifiedTime = null;
            this.LastFileModifiedOldTime = null;
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

        private DateTimeOffset? lastFileModifiedTime;
        /// <summary>
        /// Gets or sets the last file modified time.
        /// </summary>
        public DateTimeOffset? LastFileModifiedTime { get { return lastFileModifiedTime; } 
            set { LastFileModifiedOldTime = lastFileModifiedTime; lastFileModifiedTime = value; } }

        internal DateTimeOffset? LastFileModifiedOldTime { get; private set; }

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

        /// <summary>
        /// Gets the incremental partitions.
        /// </summary>
        public CdmCollection<CdmDataPartitionDefinition> IncrementalPartitions { get; }

        /// <summary>
        /// Gets the incremental partition patterns.
        /// </summary>
        public CdmCollection<CdmDataPartitionPatternDefinition> IncrementalPartitionPatterns { get; }

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
                IEnumerable<string> missingFields = new List<string> { "EntityName" };
                Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnIntegrityCheckFailure, this.AtCorpusPath, string.Join(", ", missingFields.Select((s) => $"'{s}'")));
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
                copy.EntityName = this.EntityName;
                copy.DataPartitionPatterns.Clear();
                copy.DataPartitions.Clear();
                copy.IncrementalPartitions.Clear();
                copy.IncrementalPartitionPatterns.Clear();
            }

            copy.EntityPath = this.EntityPath;
            copy.LastFileStatusCheckTime = this.LastFileStatusCheckTime;
            copy.LastFileModifiedTime = this.LastFileModifiedTime;
            copy.LastChildFileModifiedTime = this.LastChildFileModifiedTime;

            foreach (var partition in this.DataPartitions)
                copy.DataPartitions.Add(partition.Copy(resOpt) as CdmDataPartitionDefinition);
            foreach (var pattern in this.DataPartitionPatterns)
                copy.DataPartitionPatterns.Add(pattern.Copy(resOpt) as CdmDataPartitionPatternDefinition);
            foreach (var incrementalPartitions in this.IncrementalPartitions)
                copy.IncrementalPartitions.Add(incrementalPartitions.Copy(resOpt) as CdmDataPartitionDefinition);
            foreach (var incrementalPartitionPatterns in this.IncrementalPartitionPatterns)
                copy.IncrementalPartitionPatterns.Add(incrementalPartitionPatterns.Copy(resOpt) as CdmDataPartitionPatternDefinition);
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
            string path = this.UpdateDeclaredPath(pathFrom);

            if (preChildren != null && preChildren.Invoke(this, path))
                return false;

            if (this.DataPartitions != null)
                if (this.DataPartitions.VisitList(path + "/dataPartitions/", preChildren, postChildren))
                    return true;

            if (this.DataPartitionPatterns != null)
                if (this.DataPartitionPatterns.VisitList(path + "/dataPartitionPatterns/", preChildren, postChildren))
                    return true;

            if (this.IncrementalPartitions != null)
                if (this.IncrementalPartitions.VisitList(path + "/incrementalPartitions/", preChildren, postChildren))
                    return true;

            if (this.IncrementalPartitionPatterns != null)
                if (this.IncrementalPartitionPatterns.VisitList(path + "/incrementalPartitionPatterns/", preChildren, postChildren))
                    return true;

            if (this.VisitDef(path, preChildren, postChildren))
                return true;

            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
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
            await this.FileStatusCheckAsync(PartitionFileStatusCheckType.Full);
        }

        /// <inheritdoc />
        public async Task FileStatusCheckAsync(PartitionFileStatusCheckType partitionFileStatusCheckType = PartitionFileStatusCheckType.Full, CdmIncrementalPartitionType incrementalType = CdmIncrementalPartitionType.None)
        {
            using ((this.Ctx.Corpus.Storage.FetchAdapter(this.InDocument.Namespace) as StorageAdapterBase)?.CreateFileQueryCacheContext())
            {
                string fullPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(this.EntityPath, this.InDocument);
                DateTimeOffset? modifiedTime = await this.Ctx.Corpus.ComputeLastModifiedTimeAsync(fullPath, this);

                // check patterns first as this is a more performant way of querying file modification times 
                // from ADLS and we can cache the times for reuse in the individual partition checks below

                if (partitionFileStatusCheckType == PartitionFileStatusCheckType.Full || partitionFileStatusCheckType == PartitionFileStatusCheckType.FullAndIncremental)
                {
                    foreach (var pattern in this.DataPartitionPatterns)
                    {
                        if (pattern.IsIncremental)
                        {
                            Logger.Error(pattern.Ctx, Tag, nameof(FileStatusCheckAsync), pattern.AtCorpusPath, CdmLogCode.ErrUnexpectedIncrementalPartitionTrait,
                                nameof(CdmDataPartitionPatternDefinition), pattern.FetchObjectDefinitionName(), Constants.IncrementalTraitName, nameof(DataPartitionPatterns));
                        }
                        else
                        {
                            await pattern.FileStatusCheckAsync();
                        }
                    }

                    foreach (var partition in this.DataPartitions)
                    {
                        if (partition.IsIncremental)
                        {
                            Logger.Error(partition.Ctx, Tag, nameof(FileStatusCheckAsync), partition.AtCorpusPath, CdmLogCode.ErrUnexpectedIncrementalPartitionTrait,
                                nameof(CdmDataPartitionDefinition), partition.FetchObjectDefinitionName(), Constants.IncrementalTraitName, nameof(DataPartitions));
                        }
                        else
                        {
                            await partition.FileStatusCheckAsync();
                        }
                    }
                }

                if (partitionFileStatusCheckType == PartitionFileStatusCheckType.Incremental || partitionFileStatusCheckType == PartitionFileStatusCheckType.FullAndIncremental)
                {
                    foreach (var pattern in this.IncrementalPartitionPatterns)
                    {
                        if (this.ShouldCallFileStatusCheck(incrementalType, true, pattern)) {
                            await pattern.FileStatusCheckAsync();
                        }
                    }

                    foreach (var partition in this.IncrementalPartitions)
                    if (this.ShouldCallFileStatusCheck(incrementalType, false, partition))
                    {
                        await partition.FileStatusCheckAsync();
                    }
                }

                // update modified times
                this.LastFileStatusCheckTime = DateTimeOffset.UtcNow;
                this.LastFileModifiedTime = TimeUtils.MaxTime(modifiedTime, this.LastFileModifiedTime);

                await this.ReportMostRecentTimeAsync(this.LastFileModifiedTime);
            }
        }

        /// <summary>
        /// Determine if calling FileStatusCheckAsync on the given pattern or the given partition is needed.
        /// </summary>
        /// <param name="incrementalType">The incremental type.</param>
        /// <param name="isPattern">Whether the object is a pattern object or a partition object.</param>
        /// <param name="patternOrPartitionObj">The pattern object if isPattern is true, otherwise the partition object.</param>
        private bool ShouldCallFileStatusCheck(CdmIncrementalPartitionType incrementalType, bool isPattern, CdmObjectDefinitionBase patternOrPartitionObj)
        {
            var update = true;

            CdmTraitReference traitRef = patternOrPartitionObj.ExhibitsTraits.Item(Constants.IncrementalTraitName) as CdmTraitReference;
            if (traitRef == null)
            {
                Logger.Error(patternOrPartitionObj.Ctx, Tag, nameof(ShouldCallFileStatusCheck), patternOrPartitionObj.AtCorpusPath, CdmLogCode.ErrMissingIncrementalPartitionTrait, 
                    isPattern ? nameof(CdmDataPartitionPatternDefinition) : nameof(CdmDataPartitionDefinition), patternOrPartitionObj.FetchObjectDefinitionName(), 
                    Constants.IncrementalTraitName, isPattern ? nameof(IncrementalPartitionPatterns) : nameof(IncrementalPartitions));
            }
            else
            {
                // None means update by default
                if (incrementalType == CdmIncrementalPartitionType.None)
                {
                    return update;
                }
                var traitRefIncrementalTypeValue = traitRef.Arguments?.FetchValue("type");
                if (traitRefIncrementalTypeValue == null)
                {
                    update = false;
                    Logger.Error(patternOrPartitionObj.Ctx, Tag, nameof(ShouldCallFileStatusCheck), patternOrPartitionObj.AtCorpusPath, CdmLogCode.ErrTraitArgumentMissing, 
                        "type", Constants.IncrementalTraitName, patternOrPartitionObj.FetchObjectDefinitionName());
                }
                else if (traitRefIncrementalTypeValue is string == false)
                {
                    update = false;
                    Logger.Error(patternOrPartitionObj.Ctx, Tag, nameof(ShouldCallFileStatusCheck), patternOrPartitionObj.AtCorpusPath, CdmLogCode.ErrTraitInvalidArgumentValueType,
                        "type", Constants.IncrementalTraitName, patternOrPartitionObj.FetchObjectDefinitionName());
                }
                else
                {
                    bool success = Enum.TryParse(traitRefIncrementalTypeValue.ToString(), out CdmIncrementalPartitionType traitRefIncrementalType);
                    if (success)
                    {
                        update = traitRefIncrementalType == incrementalType;
                    }
                    else
                    {
                        update = false;
                        Logger.Error(patternOrPartitionObj.Ctx, Tag, nameof(ShouldCallFileStatusCheck), patternOrPartitionObj.AtCorpusPath, CdmLogCode.ErrEnumConversionFailure,
                            traitRefIncrementalTypeValue, nameof(CdmIncrementalPartitionType), 
                            $"parameter 'type' of trait '{Constants.IncrementalTraitName}' from '{patternOrPartitionObj.FetchObjectDefinitionName()}'");
                    }
                }
            }

            return update;
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
        /// This function doesn't check if the data partition exists.
        /// </summary>
        /// <param name="filePath">The file path.</param>
        /// <param name="exhibitsTraits">The exihibits traits of the caller DataPartitionPattern object.</param>
        /// <param name="args">The arguments of capture groups for the regular expression from the caller DataPartitionPattern object.</param>
        /// <param name="schema">The specialized schema.</param>
        /// <param name="modifiedTime">The last modified time.</param>
        /// <param name="isIncrementalPartition">True if this is an incremental partition.</param>
        /// <param name="incrementPartitionPatternName">The name of caller DataPartitionPattern object if this is an incremental partition.</param>
        internal void CreateDataPartitionFromPattern(string filePath, CdmTraitCollection exhibitsTraits, Dictionary<string, List<string>> args, string schema, DateTimeOffset? modifiedTime, bool isIncrementalPartition = false, string incrementPartitionPatternName = null)
        {
            var newPartition = this.Ctx.Corpus.MakeObject<CdmDataPartitionDefinition>(CdmObjectType.DataPartitionDef);
            newPartition.Location = filePath;
            newPartition.SpecializedSchema = schema;
            newPartition.LastFileModifiedTime = modifiedTime;
            newPartition.LastFileStatusCheckTime = DateTimeOffset.UtcNow;
            foreach (var trait in exhibitsTraits)
                newPartition.ExhibitsTraits.Add((CdmTraitReferenceBase)trait.Copy());
            foreach (KeyValuePair<string, List<string>> entry in args)
                newPartition.Arguments[entry.Key] = entry.Value;

            if (!isIncrementalPartition)
            {
                this.DataPartitions.Add(newPartition);
            }
            else
            {
                if (!string.IsNullOrWhiteSpace(incrementPartitionPatternName))
                {
                    (newPartition.ExhibitsTraits.Item(Constants.IncrementalTraitName) as CdmTraitReference).Arguments.Add(Constants.IncrementalPatternParameterName, incrementPartitionPatternName);
                }
                this.IncrementalPartitions.Add(newPartition);
            }
        }

        /// <summary>
        /// Reset LastFileModifiedOldTime.
        /// </summary>
        internal void ResetLastFileModifiedOldTime()
        {
            this.LastFileModifiedOldTime = null;
        }
    }
}
