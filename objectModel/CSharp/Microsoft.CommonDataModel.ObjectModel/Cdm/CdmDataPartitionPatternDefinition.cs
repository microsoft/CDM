// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using System;
    using System.Collections.Generic;
    using System.IO;
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
                Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnIntegrityCheckFailure, this.AtCorpusPath, string.Join(", ", missingFields.Select((s) =>$"'{s}'")));
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
                return false;

            if (this.VisitDef(path, preChildren, postChildren))
                return true;

            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
            return false;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseName, ResolveOptions resOpt)
        {
            return false;
        }

        /// <inheritdoc />
        public async Task FileStatusCheckAsync()
        {
            using (Logger.EnterScope(nameof(CdmDataPartitionPatternDefinition), Ctx, nameof(FileStatusCheckAsync)))
            {
                string nameSpace = null;
                StorageAdapter adapter = null;

                // make sure the root is a good full corpus path
                string rootCleaned = this.RootLocation?.EndsWith("/") == true ? this.RootLocation.Substring(0, this.RootLocation.Length - 1) : this.RootLocation;
                if (rootCleaned == null)
                {
                    rootCleaned = "";
                }
                string rootCorpus = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(rootCleaned, this.InDocument);

                List<string> fileInfoList = null;
                try
                {
                    // Remove namespace from path
                    Tuple<string, string> pathTuple = StorageUtils.SplitNamespacePath(rootCorpus);
                    if (pathTuple == null)
                    {
                        Logger.Error(this.Ctx, Tag, nameof(FileStatusCheckAsync), this.AtCorpusPath, CdmLogCode.ErrStorageNullCorpusPath);
                        return;
                    }

                    nameSpace = pathTuple.Item1;
                    adapter = this.Ctx.Corpus.Storage.FetchAdapter(nameSpace);

                    if (adapter == null)
                    {
                        Logger.Error(this.Ctx, Tag, nameof(FileStatusCheckAsync), this.AtCorpusPath, CdmLogCode.ErrDocAdapterNotFound, this.InDocument.Name);
                        return;
                    }

                    // get a list of all corpusPaths under the root
                    fileInfoList = await adapter.FetchAllFilesAsync(pathTuple.Item2);
                }
                catch (Exception e)
                {
                    Logger.Warning(this.Ctx, Tag, nameof(FileStatusCheckAsync), this.AtCorpusPath, CdmLogCode.WarnPartitionFileFetchFailed, rootCorpus, e.Message);
                }

                if (fileInfoList != null && nameSpace != null)
                {
                    // remove root of the search from the beginning of all paths so anything in the root is not found by regex
                    for (int i = 0; i < fileInfoList.Count; i++)
                    {
                        fileInfoList[i] = $"{nameSpace}:{fileInfoList[i]}";
                        fileInfoList[i] = fileInfoList[i].Slice(rootCorpus.Length);
                    }

                    if (this.Owner is CdmLocalEntityDeclarationDefinition)
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

                        try
                        {
                            regexPattern = new Regex(regularExpression);
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
                                    // Remove namespace from path
                                    Tuple<string, string> pathTuple = StorageUtils.SplitNamespacePath(fullPath);
                                    if (pathTuple == null)
                                    {
                                        Logger.Error(this.Ctx, Tag, nameof(FileStatusCheckAsync), this.AtCorpusPath, CdmLogCode.ErrStorageNullCorpusPath, this.AtCorpusPath);
                                        return;
                                    }

                                    try
                                    {
                                        DateTimeOffset? lastModifiedTime = await adapter.ComputeLastModifiedTimeAsync(pathTuple.Item2);
                                        (this.Owner as CdmLocalEntityDeclarationDefinition).CreateDataPartitionFromPattern(locationCorpusPath, this.ExhibitsTraits, args, this.SpecializedSchema, lastModifiedTime);
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

                // update modified times
                this.LastFileStatusCheckTime = DateTimeOffset.UtcNow;
            }
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
