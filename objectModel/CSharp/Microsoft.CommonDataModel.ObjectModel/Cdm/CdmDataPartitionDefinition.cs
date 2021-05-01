// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;

    /// <summary>
    /// The object model implementation for Data Partition.
    /// </summary>
    public class CdmDataPartitionDefinition : CdmObjectDefinitionBase, CdmFileStatus
    {
        /// <summary>
        /// Gets or sets the description of the data partition.
        /// </summary>
        public string Description
        {
            get
            {
                return TraitToPropertyMap.FetchPropertyValue("description");
            }
            set
            {
                TraitToPropertyMap.UpdatePropertyValue("description", value);
            }
        }

        private TraitToPropertyMap TraitToPropertyMap { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="CdmDataPartitionDefinition"/> class.
        /// </summary>
        /// <param name="ctx">The context.</param>
        public CdmDataPartitionDefinition(CdmCorpusContext ctx, string name) : base(ctx)
        {
            this.Name = name;
            this.ObjectType = CdmObjectType.DataPartitionDef;
            this.Arguments = new Dictionary<string, List<string>>();
            this.Inferred = false;
            this.TraitToPropertyMap = new TraitToPropertyMap(this);
        }

        /// <summary>
        /// Gets or sets the corpus path for the data file location.
        /// </summary>
        public string Location { get; set; }

        /// <summary>
        /// Gets or sets whether the data partition is inferred.
        /// </summary>
        public bool Inferred { get; set; }

        /// <summary>
        /// Gets or sets the list of key value pairs to give names for the replacement values from the RegEx.
        /// </summary>
        public Dictionary<string, List<string>> Arguments { get; set; }

        /// <summary>
        /// Gets or sets the path of a specialized schema to use specifically for the partitions generated.
        /// </summary>
        public string SpecializedSchema { get; set; }

        /// Gets or sets the last file status check time.
        public DateTimeOffset? LastFileStatusCheckTime { get; set; }

        /// Gets or sets the last file modified time.
        public DateTimeOffset? LastFileModifiedTime { get; set; }

        /// <summary>
        /// Gets or sets the name of the data partition.
        /// </summary>
        public string Name { get; set; }

        /// Gets or sets the data partition's refresh time.
        public DateTimeOffset? RefreshTime { get; set; }

        /// LastChildFileModifiedTime is not valid for DataPartitions since they do not contain any children objects.
        public DateTimeOffset? LastChildFileModifiedTime { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.DataPartitionDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            return true;
        }

 
        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmDataPartitionDefinition copy;
            if (host == null)
            {
                copy = new CdmDataPartitionDefinition(this.Ctx, this.Name);
            }
            else
            {
                copy = host as CdmDataPartitionDefinition;
                copy.Ctx = this.Ctx;
                copy.Name = this.Name;
            }

            copy.Description = this.Description;
            copy.Location = this.Location;
            copy.LastFileStatusCheckTime = this.LastFileStatusCheckTime;
            copy.LastFileModifiedTime = this.LastFileModifiedTime;
            copy.Inferred = this.Inferred;
            copy.Arguments = this.Arguments;
            copy.SpecializedSchema = this.SpecializedSchema;

            this.CopyDef(resOpt, copy);

            return copy;
        }

        /// <inheritdoc />
        public override string GetName()
        {
            return this.Name;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmDataPartitionDefinition>(this, resOpt, options);
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
                    path = pathFrom + (this.GetName() ?? "UNNAMED");
                    this.DeclaredPath = path;
                }
            }

            if (preChildren != null && preChildren.Invoke(this, path))
                return false;

            if (this.VisitDef(path, preChildren, postChildren))
                return true;

            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
            return false;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            return false;
        }

        /// <inheritdoc />
        public async Task FileStatusCheckAsync()
        {
            using (Logger.EnterScope(nameof(CdmDataPartitionDefinition), Ctx, nameof(FileStatusCheckAsync)))
            {
                string fullPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(this.Location, this.InDocument);
                DateTimeOffset? modifiedTime = await this.Ctx.Corpus.GetLastModifiedTimeAsyncFromPartitionPath(fullPath);

                // update modified times
                this.LastFileStatusCheckTime = DateTimeOffset.UtcNow;
                this.LastFileModifiedTime = TimeUtils.MaxTime(modifiedTime, this.LastFileModifiedTime);

                await this.ReportMostRecentTimeAsync(this.LastFileModifiedTime);
            }
        }

        /// <inheritdoc />
        public async Task ReportMostRecentTimeAsync(DateTimeOffset? childTime)
        {
            if (this.Owner is CdmFileStatus && childTime != null)
                await (this.Owner as CdmFileStatus).ReportMostRecentTimeAsync(childTime);
        }
    }
}
