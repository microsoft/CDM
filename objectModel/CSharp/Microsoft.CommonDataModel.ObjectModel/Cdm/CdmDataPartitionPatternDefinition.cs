// --------------------------------------------------------------------------------------------------------------------
// <copyright file="CdmDataPartitionPatternDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;

    /// <summary>
    /// The object model implementation for Data Partition Pattern.
    /// </summary>
    public class CdmDataPartitionPatternDefinition : CdmObjectDefinitionBase, CdmFileStatus
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CdmDataPartitionPatternDefinition"/> class.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="name">The name.</param>
        public CdmDataPartitionPatternDefinition(CdmCorpusContext ctx, string name) : base(ctx)
        {
            this.ObjectType = CdmObjectType.DataPartitionPatternDef;
            this.Name = name;
        }

        /// <summary>
        /// Gets or sets the name of the data partition pattern.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the starting location corpus path to use to search for inferred data partitions.
        /// </summary>
        public string RootLocation { get; set; }

        /// <summary>
        /// Gets or sets the regular expression string to use to search for partitions.
        /// </summary>
        public string RegularExpression { get; set; }

        /// <summary>
        /// Gets or sets the names for replacement values from the regular expression.
        /// </summary>
        public List<string> Parameters { get; set; }

        /// <summary>
        /// Gets or sets the corpus path for the specialized schema to use for matched pattern partitions.
        /// </summary>
        public string SpecializedSchema { get; set; }

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
        public DateTimeOffset? LastChildFileModifiedTime { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.DataPartitionPatternDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            return this.RegularExpression != null || !string.IsNullOrWhiteSpace(this.RootLocation);
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            CdmDataPartitionPatternDefinition copy;
            if (host == null)
            {
                copy = new CdmDataPartitionPatternDefinition(this.Ctx, this.Name);
            }
            else
            {
                copy = host as CdmDataPartitionPatternDefinition;
                copy.Ctx = this.Ctx;
                copy.Name = this.Name;
            }

            copy.RootLocation = this.RootLocation;
            copy.RegularExpression = this.RegularExpression;
            copy.Parameters = this.Parameters;
            copy.LastFileStatusCheckTime = this.LastFileStatusCheckTime;
            copy.LastFileModifiedTime = this.LastFileModifiedTime;

            if (this.SpecializedSchema != null)
            {
                copy.SpecializedSchema = this.SpecializedSchema;
            }

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
            return CdmObjectBase.CopyData<CdmDataPartitionPatternDefinition>(this, resOpt, options);
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
                    string thisName = this.GetName();
                    if (thisName == null)
                        thisName = "UNNAMED";
                    path = pathFrom + thisName;
                    this.DeclaredPath = path;
                }
            }

            if (preChildren != null && preChildren.Invoke(this, path))
            {
                return false;
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
        public override bool IsDerivedFrom(string baseName, ResolveOptions resOpt)
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
            StorageAdapter adapter = this.Ctx.Corpus.Storage.FetchAdapter(nameSpace);

            if (adapter == null)
            {
                Logger.Error(nameof(CdmDataPartitionPatternDefinition), this.Ctx, $"Adapter not found for the document '{this.InDocument.Name}'", "FileStatusCheckAsync");
                return;
            }

            // make sure the root is a good full corpus path
            string rootCleaned = this.RootLocation;
            if (rootCleaned == null)
            {
                rootCleaned = "";
            }
            if (rootCleaned.EndsWith("/"))
            {
                rootCleaned = rootCleaned.Slice(rootCleaned.Length - 1);
            }
            string rootCorpus = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(rootCleaned, this.InDocument);

            // get a list of all corpusPaths under the root
            List<string> fileInfoList = await adapter.FetchAllFilesAsync(rootCorpus);

            // remove root of the search from the beginning of all paths so anything in the root is not found by regex
            for (int i = 0; i < fileInfoList.Count; i++)
            {
                fileInfoList[i] = $"{nameSpace}:{fileInfoList[i]}";
                fileInfoList[i] = fileInfoList[i].Slice(rootCorpus.Length);
            }

            Regex regexPattern = new Regex(this.RegularExpression);

            if (this.Owner is CdmLocalEntityDeclarationDefinition)
            {
                foreach (var fi in fileInfoList)
                {
                    Match m = regexPattern.Match(fi);
                    if (m.Success && m.Length > 1 && m.Value == fi)
                    {
                        // create a map of arguments out of capture groups
                        Dictionary<string, List<string>> args = new Dictionary<string, List<string>>();
                        int iParam = 0;
                        // captures start after the string match at m.Groups[0]
                        for (int i = 1; i < m.Groups.Count; i++)
                        {
                            CaptureCollection captures = m.Groups[i].Captures;
                            if (captures.Count > 0 && iParam < this.Parameters?.Count)
                            {
                                // to be consistent with other languages, if a capture group captures
                                // multiple things, only use the last thing that was captured
                                var singleCapture = captures[captures.Count - 1];

                                string currentParam = this.Parameters[iParam];
                                if (!args.ContainsKey(currentParam))
                                    args[currentParam] = new List<string>();
                                args[currentParam].Add(singleCapture.ToString());
                                iParam++;
                            }
                            else
                            {
                                break;
                            }
                        }
                        // put the original but cleaned up root back onto the matched doc as the location stored in the partition
                        string locationCorpusPath = $"{rootCleaned}{fi}";
                        string fullPath = $"{rootCorpus}{fi}";
                        DateTimeOffset? lastModifiedTime = await adapter.ComputeLastModifiedTimeAsync(fullPath);
                        (this.Owner as CdmLocalEntityDeclarationDefinition).CreateDataPartitionFromPattern(locationCorpusPath, this.ExhibitsTraits, args, this.SpecializedSchema, lastModifiedTime);
                    }
                }
            }

            // update modified times
            this.LastFileStatusCheckTime = DateTimeOffset.UtcNow;
        }

        /// <inheritdoc />
        public async Task ReportMostRecentTimeAsync(DateTimeOffset? childTime)
        {
            if (this.Owner is CdmFileStatus && childTime != null)
                await (this.Owner as CdmFileStatus).ReportMostRecentTimeAsync(childTime);
        }
    }
}
