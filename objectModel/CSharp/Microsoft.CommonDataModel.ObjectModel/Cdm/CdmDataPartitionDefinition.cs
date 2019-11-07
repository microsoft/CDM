// --------------------------------------------------------------------------------------------------------------------
// <copyright file="CdmDataPartitionDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
// <summary>
//   The object model implementation for Data Partition.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    /// <summary>
    /// The object model implementation for Data Partition.
    /// </summary>
    public class CdmDataPartitionDefinition : CdmObjectDefinitionBase, CdmFileStatus
    {
        /// <summary>
        /// Gets or sets the description of a data partition.
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
        /// <param name="ctx"> The context. </param>
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
        /// Gets or sets a value indicating whether inferred.
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

        /// <inheritdoc />
        public DateTimeOffset? LastFileStatusCheckTime { get; set; }

        /// <inheritdoc />
        public DateTimeOffset? LastFileModifiedTime { get; set; }

        /// <summary>
        /// Gets or sets the name of a data partition.
        /// </summary>
        public string Name { get; set; }

        /// <inheritdoc />
        public DateTime? RefreshTime { get; set; }

        /// <inheritdoc />
        public DateTimeOffset? LastChildFileModifiedTime { get; set; }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.DataPartitionDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            return !string.IsNullOrWhiteSpace(this.Location);
        }

 
        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            var copy = new CdmDataPartitionDefinition(this.Ctx, this.Name)
            {
                Description = this.Description,
                Location = this.Location,
                LastFileStatusCheckTime = this.LastFileStatusCheckTime,
                LastFileModifiedTime = this.LastFileModifiedTime,
                Inferred = this.Inferred,
                Arguments = this.Arguments,
                SpecializedSchema = this.SpecializedSchema
            };
            this.CopyDef(resOpt, copy);

            return copy;
        }

        /// <inheritdoc />
        public override string GetName()
        {
            return null;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmDataPartitionDefinition>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            return false;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            return false;
        }

        /// <inheritdoc />
        public async Task FileStatusCheckAsync()
        {
            string nameSpace = this.InDocument.Namespace;
            string fullPath = this.Location.Contains(":") ? this.Location : $"{nameSpace}:{this.Location}";

            DateTimeOffset? modifiedTime = await (this.Ctx.Corpus as CdmCorpusDefinition).GetLastModifiedTimeAsyncFromPartitionPath(fullPath);

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