// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
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
        private static readonly string Tag = nameof(CdmDataPartitionPatternDefinition);

        /// <summary>
        /// Regex timeout value
        /// </summary>
        private static TimeSpan DefaultRegexTimeoutValue = TimeSpan.FromSeconds(1);

        private TraitToPropertyMap TraitToPropertyMap { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="CdmDataPartitionPatternDefinition"/> class.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="name">The name.</param>
        public CdmDataPartitionPatternDefinition(CdmCorpusContext ctx, string name) : base(ctx)
        {
            this.ObjectType = CdmObjectType.DataPartitionPatternDef;
            this.Name = name;
            this.TraitToPropertyMap = new TraitToPropertyMap(this);
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
        /// Gets or sets the glob pattern string to use to search for partitions.
        /// If both globPattern and regularExpression is set, globPattern will be used.
        /// </summary>
        public string GlobPattern { get; set; }

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
        /// LastChildFileModifiedTime is not valid for DataPartitionPatterns since they do not contain any children objects.
        /// </summary>
        public DateTimeOffset? LastChildFileModifiedTime { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        /// <summary>
        /// Gets or sets whether the data partition pattern is incremental.
        /// </summary>
        public bool IsIncremental { get => this.TraitToPropertyMap.FetchPropertyValue(nameof(IsIncremental).Substring(0, 1).ToLower() + nameof(IsIncremental).Substring(1)); }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.DataPartitionPatternDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            if (string.IsNullOrWhiteSpace(this.RootLocation))
            {
                IEnumerable<string> missingFields = new List<string>() { "RootLocation" };
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

            CdmDataPartitionPatternDefinition copy;
            if (host == null)
            {
                copy = new CdmDataPartitionPatternDefinition(this.Ctx, this.Name);
            }
            else
            {
                copy = host as CdmDataPartitionPatternDefinition;
                copy.Name = this.Name;
            }

            copy.RootLocation = this.RootLocation;
            copy.GlobPattern = this.GlobPattern;
            copy.RegularExpression = this.RegularExpression;
            copy.Parameters = this.Parameters != null ? new List<String>(this.Parameters) : null;
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
            string path = this.UpdateDeclaredPath(pathFrom);

            if (preChildren != null && preChildren.Invoke(this, path))
                return false;

            if (this.VisitDef(path, preChildren, postChildren))
                return true;

            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
            return false;
        }

        /// <inheritdoc />
        internal override string UpdateDeclaredPath(string pathFrom)
        {
            return pathFrom + this.GetName() ?? "UNNAMED";
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseName, ResolveOptions resOpt)
        {
            return false;
        }

        /// <inheritdoc />
        public async Task FileStatusCheckAsync(FileStatusCheckOptions fileStatusCheckOptions)
        {
            await this.FileStatusCheckAsyncInternal(fileStatusCheckOptions);
        }

        internal async Task<bool> FileStatusCheckAsyncInternal(FileStatusCheckOptions fileStatusCheckOptions)
        {
            using (Logger.EnterScope(nameof(CdmDataPartitionPatternDefinition), Ctx, nameof(FileStatusCheckAsync)))
            {
                string nameSpace = null;
                StorageAdapterBase adapter = null;

                // make sure the root is a good full corpus path
                string rootCleaned = this.RootLocation?.EndsWith("/") == true ? this.RootLocation.Substring(0, this.RootLocation.Length - 1) : this.RootLocation;
                if (rootCleaned == null)
                {
                    rootCleaned = "";
                }
                string rootCorpus = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(rootCleaned, this.InDocument);

                IDictionary<string, CdmFileMetadata> fileInfoList = null;
                try
                {
                    // Remove namespace from path
                    Tuple<string, string> pathTuple = StorageUtils.SplitNamespacePath(rootCorpus);
                    if (pathTuple == null)
                    {
                        Logger.Error(this.Ctx, Tag, nameof(FileStatusCheckAsync), this.AtCorpusPath, CdmLogCode.ErrStorageNullCorpusPath);
                        return true;
                    }

                    nameSpace = pathTuple.Item1;
                    adapter = this.Ctx.Corpus.Storage.FetchAdapter(nameSpace);

                    if (adapter == null)
                    {
                        Logger.Error(this.Ctx, Tag, nameof(FileStatusCheckAsync), this.AtCorpusPath, CdmLogCode.ErrDocAdapterNotFound, this.InDocument.Name);
                        return true;
                    }

                    // get a list of all corpusPaths under the root
                    fileInfoList = await adapter.FetchAllFilesMetadataAsync(pathTuple.Item2);
                }
                catch (Exception e)
                {
                    Logger.Warning(this.Ctx, Tag, nameof(FileStatusCheckAsync), this.AtCorpusPath, CdmLogCode.WarnPartitionFileFetchFailed, rootCorpus, e.Message);
                }

                // update modified times
                this.LastFileStatusCheckTime = DateTimeOffset.UtcNow;

                if (fileInfoList == null)
                {
                    Logger.Error(this.Ctx, Tag, nameof(FileStatusCheckAsync), this.AtCorpusPath, CdmLogCode.ErrFetchingFileMetadataNull, nameSpace);
                    return true;
                }

                if (nameSpace != null)
                {
                    // remove root of the search from the beginning of all paths so anything in the root is not found by regex
                    IDictionary<string, CdmFileMetadata> cleanedFileList = new Dictionary<string, CdmFileMetadata>();

                    foreach (var entry in fileInfoList)
                    {
                        string newFileName = $"{nameSpace}:{entry.Key}";
                        newFileName = newFileName.Slice(rootCorpus.Length);
                        cleanedFileList.Add(newFileName, entry.Value);
                    }

                    if (this.Owner is CdmLocalEntityDeclarationDefinition localEntDecDefOwner)
                    {
                        // if both are present log warning and use glob pattern, otherwise use regularExpression
                        if (!String.IsNullOrWhiteSpace(this.GlobPattern) && !String.IsNullOrWhiteSpace(this.RegularExpression))
                        {
                            Logger.Warning(this.Ctx,
                                Tag,
                                nameof(FileStatusCheckAsync),
                                this.AtCorpusPath,
                                CdmLogCode.WarnPartitionGlobAndRegexPresent,
                                this.GlobPattern,
                                this.RegularExpression);
                        }
                        string regularExpression = !String.IsNullOrWhiteSpace(this.GlobPattern) ? this.GlobPatternToRegex(this.GlobPattern) : this.RegularExpression;
                        Regex regexPattern = null;

                        TimeSpan regexTimeoutValue = fileStatusCheckOptions?.RegexTimeoutSeconds != null ? TimeSpan.FromSeconds(fileStatusCheckOptions.RegexTimeoutSeconds.Value) : DefaultRegexTimeoutValue;

                        try
                        {
                            regexPattern = new Regex(regularExpression, RegexOptions.None, regexTimeoutValue);
                        }
                        catch (ArgumentOutOfRangeException rangeEx)
                        {
                            Logger.Error(
                                this.Ctx,
                                Tag,
                                nameof(FileStatusCheckAsync),
                                this.AtCorpusPath,
                                CdmLogCode.ErrRegexTimeoutOutOfRange, regexTimeoutValue.ToString(), rangeEx.Message);
                        }
                        catch (Exception e)
                        {
                            Logger.Error(this.Ctx, Tag,
                                nameof(FileStatusCheckAsync),
                                this.AtCorpusPath,
                                CdmLogCode.ErrValdnInvalidExpression, !String.IsNullOrWhiteSpace(this.GlobPattern) ? "glob pattern" : "regular expression",
                                !String.IsNullOrWhiteSpace(this.GlobPattern) ? this.GlobPattern : this.RegularExpression, e.Message);
                        }

                        if (regexPattern != null)
                        {
                            // a hashset to check if the data partition exists
                            HashSet<string> dataPartitionPathHashSet = new HashSet<string>();
                            if (localEntDecDefOwner.DataPartitions != null)
                            {
                                foreach (var dataPartition in localEntDecDefOwner.DataPartitions)
                                {
                                    var fullPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(dataPartition.Location, this.InDocument);
                                    dataPartitionPathHashSet.Add(fullPath);
                                }
                            }

                            HashSet<string> incrementalPartitionPathHashSet = new HashSet<string>();
                            if (localEntDecDefOwner.IncrementalPartitions != null)
                            {
                                foreach (var incrementalPartition in localEntDecDefOwner.IncrementalPartitions)
                                {
                                    var fullPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(incrementalPartition.Location, this.InDocument);
                                    incrementalPartitionPathHashSet.Add(fullPath);
                                }
                            }

                            foreach (var fi in cleanedFileList)
                            {
                                string fileName = fi.Key;
                                CdmFileMetadata partitionMetadata = fi.Value;

                                Match m;

                                try
                                {
                                    m = regexPattern.Match(fileName);
                                }
                                catch (RegexMatchTimeoutException e)
                                {
                                    Logger.Error(this.Ctx, Tag, nameof(FileStatusCheckAsync), this.AtCorpusPath, CdmLogCode.ErrRegexTimeout, e.Message);

                                    // do not continue processing the manifest/entity/partition pattern if timeout
                                    return false;
                                }

                                if (m.Success && m.Length > 1 && m.Value == fileName)
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
                                    string locationCorpusPath = $"{rootCleaned}{fileName}";
                                    string fullPath = $"{rootCorpus}{fileName}";
                                    // Remove namespace from path
                                    Tuple<string, string> pathTuple = StorageUtils.SplitNamespacePath(fullPath);
                                    if (pathTuple == null)
                                    {
                                        Logger.Error(this.Ctx, Tag, nameof(FileStatusCheckAsync), this.AtCorpusPath, CdmLogCode.ErrStorageNullCorpusPath, this.AtCorpusPath);
                                        return true;
                                    }

                                    CdmTraitCollection exhibitsTraits = this.ExhibitsTraits;
                                    if (fileStatusCheckOptions?.IncludeDataPartitionSize == true && partitionMetadata?.FileSizeBytes != null)
                                    {
                                        exhibitsTraits = new CdmTraitCollection(this.Ctx, this);
                                        foreach (var trait in this.ExhibitsTraits)
                                        {
                                            exhibitsTraits.Add(trait);
                                        }
                                        exhibitsTraits.Add("is.partition.size", new List<Tuple<string, dynamic>> { new Tuple<string, dynamic>("value", partitionMetadata.FileSizeBytes) });
                                    }

                                    try
                                    {
                                        DateTimeOffset? lastModifiedTime = await adapter.ComputeLastModifiedTimeAsync(pathTuple.Item2);
                                        if (this.IsIncremental && !incrementalPartitionPathHashSet.Contains(fullPath))
                                        {
                                            localEntDecDefOwner.CreateDataPartitionFromPattern(locationCorpusPath, exhibitsTraits, args, this.SpecializedSchema, lastModifiedTime, true, this.Name);
                                            incrementalPartitionPathHashSet.Add(fullPath);
                                        }
                                        else if (!this.IsIncremental && !dataPartitionPathHashSet.Contains(fullPath))
                                        {
                                            localEntDecDefOwner.CreateDataPartitionFromPattern(locationCorpusPath, exhibitsTraits, args, this.SpecializedSchema, lastModifiedTime);
                                            dataPartitionPathHashSet.Add(fullPath);
                                        }
                                    }
                                    catch (Exception e)
                                    {
                                        Logger.Error(this.Ctx, Tag, nameof(FileStatusCheckAsync), this.AtCorpusPath, CdmLogCode.ErrPartitionFileModTimeFailure, pathTuple.Item2, e.Message);
                                    }
                                }
                            }
                        }
                    }
                }
                return true;
            }
        }

        /// <inheritdoc />
        public async Task FileStatusCheckAsync()
        {
            await this.FileStatusCheckAsync(null);
        }

        /// <inheritdoc />
        public async Task ReportMostRecentTimeAsync(DateTimeOffset? childTime)
        {
            if (this.Owner is CdmFileStatus && childTime != null)
                await (this.Owner as CdmFileStatus).ReportMostRecentTimeAsync(childTime);
        }

        /// <summary>
        /// Converts a glob pattern to a regular expression 
        /// </summary>
        private string GlobPatternToRegex(string pattern)
        {
            List<string> newPattern = new List<string>();

            // all patterns should start with a slash
            newPattern.Add("[/\\\\]");

            // if pattern starts with slash, skip the first character. We already added it above
            for (int i = (pattern[0] == '/' || pattern[0] == '\\' ? 1 : 0); i < pattern.Length; i++)
            {
                char currChar = pattern[i];

                switch (currChar)
                {
                    case '.':
                        // escape '.' characters
                        newPattern.Add("\\.");
                        break;
                    case '\\':
                        // convert backslash into slash
                        newPattern.Add("[/\\\\]");
                        break;
                    case '?':
                        // question mark in glob matches any single character
                        newPattern.Add(".");
                        break;
                    case '*':
                        char? nextChar = i + 1 < pattern.Length ? pattern[i + 1] : (char?)null;
                        if (nextChar != null && nextChar == '*')
                        {
                            char? prevChar = i - 1 >= 0 ? pattern[i - 1] : (char?)null;
                            char? postChar = i + 2 < pattern.Length ? pattern[i + 2] : (char?)null;

                            // globstar must be at beginning of pattern, end of pattern, or wrapped in separator characters
                            if ((prevChar == null || prevChar == '/' || prevChar == '\\')
                            && (postChar == null || postChar == '/' || postChar == '\\'))
                            {
                                newPattern.Add(".*");

                                // globstar can match zero or more subdirectories. If it matches zero, then there should not be
                                // two consecutive '/' characters so make the second one optional
                                if (prevChar != null && postChar != null &&
                                (prevChar == '/' || prevChar == '\\') && (postChar == '/' || postChar == '\\'))
                                {
                                    newPattern.Add("/?");
                                    i++;
                                }
                            }
                            else
                            {
                                // otherwise, treat the same as '*'
                                newPattern.Add("[^/\\\\]*");
                            }
                            i++;
                        }
                        else
                        {
                            // *
                            newPattern.Add("[^/\\\\]*");
                        }
                        break;
                    default:
                        newPattern.Add(currChar.ToString());
                        break;
                }
            }

            return string.Join("", newPattern);
        }
    }
}
