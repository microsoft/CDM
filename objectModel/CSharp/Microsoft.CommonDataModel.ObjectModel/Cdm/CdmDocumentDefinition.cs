// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    internal class ImportPriorities
    {
        internal IDictionary<CdmDocumentDefinition, ImportInfo> ImportPriority;
        internal IDictionary<string, CdmDocumentDefinition> MonikerPriorityMap;
        
        /// <summary>
        /// True if one of the document's imports import this document back.
        /// Ex.: A.cdm.json -> B.cdm.json -> A.cdm.json
        /// </summary>
        internal bool hasCircularImport;

        internal ImportPriorities()
        {
            this.ImportPriority = new Dictionary<CdmDocumentDefinition, ImportInfo>();
            this.MonikerPriorityMap = new Dictionary<string, CdmDocumentDefinition>();
            this.hasCircularImport = false;
        }

        internal ImportPriorities Copy()
        {
            ImportPriorities copy = new ImportPriorities();
            if (this.ImportPriority != null)
            {
                foreach (KeyValuePair<CdmDocumentDefinition, ImportInfo> pair in this.ImportPriority)
                {
                    copy.ImportPriority[pair.Key] = pair.Value;
                }
            }
            if (this.MonikerPriorityMap != null)
            {
                foreach (KeyValuePair<string, CdmDocumentDefinition> pair in this.MonikerPriorityMap)
                {
                    copy.MonikerPriorityMap[pair.Key] = pair.Value;
                }
            }
            copy.hasCircularImport = this.hasCircularImport;
            return copy;
        }
    }

    public class CdmDocumentDefinition : CdmObjectSimple, CdmContainerDefinition
    {
        internal ConcurrentDictionary<string, CdmObjectBase> InternalDeclarations;
        internal ImportPriorities ImportPriorities;
        internal bool NeedsIndexing;
        internal bool IsDirty = true;
        /// <summary>
        /// The maximum json semantic version supported by this ObjectModel version.
        /// </summary>
        public static string CurrentJsonSchemaSemanticVersion = "1.1.0";

        [Obsolete("Only for internal use")]
        public string FolderPath { get; set; }

        [Obsolete("Only for internal use")]
        public string Namespace { get; set; }
        internal bool ImportsIndexed { get; set; }
        internal bool DeclarationsIndexed { get; set; }
        internal bool CurrentlyIndexing { get; set; }
        internal bool IsValid { get; set; }
        internal DateTimeOffset? _fileSystemModifiedTime { get; set; }

        /// <summary>
        /// Constructs a CdmDocumentDefinition.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="name">The document name.</param>
        public CdmDocumentDefinition(CdmCorpusContext ctx, string name)
            : base(ctx)
        {
            this.InDocument = this;
            this.ObjectType = CdmObjectType.DocumentDef;
            this.Name = name;
            this.JsonSchemaSemanticVersion = CurrentJsonSchemaSemanticVersion;
            this.DocumentVersion = null;
            this.NeedsIndexing = true;
            this.IsDirty = true;
            this.ImportsIndexed = false;
            this.CurrentlyIndexing = false;
            this.IsValid = true;

            this.ClearCaches();

            this.Imports = new CdmImportCollection(this.Ctx, this);
            this.Definitions = new CdmDefinitionCollection(this.Ctx, this);
        }

        /// <summary>
        /// Gets or sets the document name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the document schema.
        /// </summary>
        public string Schema { get; set; }

        /// <summary>
        /// Gets or sets the document json schema semantic version.
        /// </summary>
        public string JsonSchemaSemanticVersion { get; set; }

        /// <summary>
        /// Gets or sets the document folder.
        /// </summary>
        [Obsolete("Use the Owner property instead")]
        public CdmFolderDefinition Folder { get; set; }

        /// <summary>
        /// Gets the document definitions.
        /// </summary>
        public CdmDefinitionCollection Definitions { get; }

        /// <inheritdoc />
        public CdmImportCollection Imports { get; }

        /// <summary>
        /// Gets or sets the document version.
        /// </summary>
        public string DocumentVersion { get; set; }

        internal void ClearCaches()
        {
            this.InternalDeclarations = new ConcurrentDictionary<string, CdmObjectBase>();
            // remove all of the cached paths
            this.Visit("", null, new VisitCallback
            {
                Invoke = (iObject, path) =>
                {
                    ((CdmObjectBase)iObject).DeclaredPath = null;
                    return false;
                }
            });
        }

        /// <summary>
        /// finds any relative corpus paths that are held within this document and makes them relative to the new folder instead
        /// </summary>
        internal bool LocalizeCorpusPaths(CdmFolderDefinition newFolder)
        {
            bool allWentWell = true;
            bool wasBlocking = this.Ctx.Corpus.blockDeclaredPathChanges;
            this.Ctx.Corpus.blockDeclaredPathChanges = true;

            // shout into the void
            Logger.Info(nameof(CdmDocumentDefinition), (ResolveContext)this.Ctx, $"Localizing corpus paths in document '{this.Name}'", nameof(LocalizeCorpusPaths));

            // find anything in the document that is a corpus path
            this.Visit("", new VisitCallback
            {
                Invoke = (iObject, path) =>
                {
                    // i don't like that document needs to know a little about these objects
                    // in theory, we could create a virtual function on cdmObject that localizes properties
                    // but then every object would need to know about the documents and paths and such ...
                    // also, i already wrote this code.
                    switch (iObject.ObjectType)
                    {
                        case CdmObjectType.Import:
                            {
                                CdmImport typeObj = iObject as CdmImport;
                                typeObj.CorpusPath = LocalizeCorpusPath(typeObj.CorpusPath, newFolder, ref allWentWell) ?? typeObj.CorpusPath;
                                break;
                            }
                        case CdmObjectType.LocalEntityDeclarationDef:
                        case CdmObjectType.ReferencedEntityDeclarationDef:
                            {
                                CdmEntityDeclarationDefinition typeObj = iObject as CdmEntityDeclarationDefinition;
                                typeObj.EntityPath = LocalizeCorpusPath(typeObj.EntityPath, newFolder, ref allWentWell) ?? typeObj.EntityPath;
                                break;
                            }
                        case CdmObjectType.DataPartitionDef:
                            {
                                CdmDataPartitionDefinition typeObj = iObject as CdmDataPartitionDefinition;
                                typeObj.Location = LocalizeCorpusPath(typeObj.Location, newFolder, ref allWentWell) ?? typeObj.Location;
                                typeObj.SpecializedSchema = LocalizeCorpusPath(typeObj.SpecializedSchema, newFolder, ref allWentWell) ?? typeObj.SpecializedSchema;
                                break;
                            }
                        case CdmObjectType.DataPartitionPatternDef:
                            {
                                CdmDataPartitionPatternDefinition typeObj = iObject as CdmDataPartitionPatternDefinition;
                                typeObj.RootLocation = LocalizeCorpusPath(typeObj.RootLocation, newFolder, ref allWentWell) ?? typeObj.RootLocation;
                                typeObj.SpecializedSchema = LocalizeCorpusPath(typeObj.SpecializedSchema, newFolder, ref allWentWell) ?? typeObj.SpecializedSchema;
                                break;
                            }
                        case CdmObjectType.E2ERelationshipDef:
                            {
                                CdmE2ERelationship typeObj = iObject as CdmE2ERelationship;
                                typeObj.ToEntity = LocalizeCorpusPath(typeObj.ToEntity, newFolder, ref allWentWell) ?? typeObj.ToEntity;
                                typeObj.FromEntity = LocalizeCorpusPath(typeObj.FromEntity, newFolder, ref allWentWell) ?? typeObj.FromEntity;
                                break;
                            }
                        case CdmObjectType.ManifestDeclarationDef:
                            {
                                CdmManifestDeclarationDefinition typeObj = iObject as CdmManifestDeclarationDefinition;
                                typeObj.Definition = LocalizeCorpusPath(typeObj.Definition, newFolder, ref allWentWell) ?? typeObj.Definition;
                                break;
                            }
                    }
                    return false;
                }
            }, null);

            this.Ctx.Corpus.blockDeclaredPathChanges = wasBlocking;

            return allWentWell;
        }

        /// <summary>
        /// changes a relative corpus path to be relative to the new folder
        /// </summary>
        private string LocalizeCorpusPath(string path, CdmFolderDefinition newFolder, ref bool allWentWell)
        {
            // if this isn't a local path, then don't do anything to it
            if (string.IsNullOrWhiteSpace(path))
            {
                return path;
            }

            // but first, if there was no previous folder (odd) then just localize as best we can
            var oldFolder = this.Owner as CdmFolderDefinition;
            string newPath;
            if (oldFolder == null)
            {
                newPath = this.Ctx.Corpus.Storage.CreateRelativeCorpusPath(path, newFolder);
            }
            else
            {
                // if the current value != the absolute path, then assume it is a relative path
                string absPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(path, oldFolder);
                if (absPath == path)
                    newPath = absPath; // leave it alone
                else
                {
                    // make it relative to the new folder then
                    newPath = this.Ctx.Corpus.Storage.CreateRelativeCorpusPath(absPath, newFolder);
                }
            }

            if (newPath == null)
            {
                allWentWell = false;
            }

            return newPath;
        }


        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmDocumentDefinition copy;
            if (host == null)
            {
                copy = new CdmDocumentDefinition(this.Ctx, this.Name);
            }
            else
            {
                copy = host as CdmDocumentDefinition;
                copy.Ctx = this.Ctx;
                copy.Name = this.Name;
                copy.Definitions.Clear();
                copy.DeclarationsIndexed = false;
                copy.InternalDeclarations = new ConcurrentDictionary<string, CdmObjectBase>();
                copy.NeedsIndexing = true;
                copy.Imports.Clear();
                copy.ImportsIndexed = false;
                copy.ImportPriorities = null;
            }

            copy.InDocument = copy;
            copy.IsDirty = true;
            copy.FolderPath = this.FolderPath;
            copy.Schema = this.Schema;
            copy.JsonSchemaSemanticVersion = this.JsonSchemaSemanticVersion;
            copy.DocumentVersion = this.DocumentVersion;

            foreach (var def in this.Definitions)
                copy.Definitions.Add(def);
            foreach (var imp in this.Imports)
                copy.Imports.Add(imp);
            return copy;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmDocumentDefinition>(this, resOpt, options);
        }

        internal CdmObject FetchObjectFromDocumentPath(string objectPath, ResolveOptions resOpt)
        {
            // in current document?
            if (this.InternalDeclarations.ContainsKey(objectPath))
            {
                return this.InternalDeclarations[objectPath];
            }
            else
            {
                // this might be a request for an object def drill through of a reference.
                // path/(object)/paths
                // there can be several such requests in one path AND some of the requested
                // defintions might be defined inline inside a reference meaning the declared path
                // includes that reference name and could still be inside this document. example:
                // /path/path/refToInline/(object)/member1/refToSymbol/(object)/member2
                // the full path is not in this doc but /path/path/refToInline/(object)/member1/refToSymbol
                // is declared in this document. we then need to go to the doc for refToSymbol and
                // search for refToSymbol/member2

                // work backward until we find something in this document
                int lastObj = objectPath.LastIndexOf("/(object)");
                string thisDocPart = objectPath;
                while (lastObj > 0)
                {
                    thisDocPart = objectPath.Substring(0, lastObj);
                    if (this.InternalDeclarations.ContainsKey(thisDocPart))
                    {
                        CdmObjectReferenceBase thisDocObjRef = this.InternalDeclarations[thisDocPart] as CdmObjectReferenceBase;
                        CdmObjectDefinitionBase thatDocObjDef = thisDocObjRef.FetchObjectDefinition<CdmObjectDefinitionBase>(resOpt);
                        if (thatDocObjDef != null)
                        {
                            // get from other document.
                            // but first fix the path to look like it is relative to that object as declared in that doc
                            string thatDocPart = objectPath.Substring(lastObj + "/(object)".Length);
                            thatDocPart = $"{thatDocObjDef.DeclaredPath}{thatDocPart}";
                            if (thatDocPart == objectPath)
                            {
                                // we got back to were we started. probably because something is just not found.
                                return null;
                            }

                            return thatDocObjDef.InDocument.FetchObjectFromDocumentPath(thatDocPart, resOpt);
                        }

                        return null;
                    }
                    lastObj = thisDocPart.LastIndexOf("/(object)");
                }
            }
            return null;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.DocumentDef;
        }

        /// <inheritdoc />
        public override T FetchObjectDefinition<T>(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            return default(T);
        }

        public override string FetchObjectDefinitionName()
        {
            return this.Name;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            if (string.IsNullOrWhiteSpace(this.Name))
            {
                Logger.Error(nameof(CdmDocumentDefinition), this.Ctx, Errors.ValidateErrorString(this.AtCorpusPath, new List<string> { "Name" }), nameof(Validate));
                return false;
            }
            return true;
        }

        /// <inheritdoc />
        public override string AtCorpusPath
        {
            get
            {
                if (this.Folder == null)
                {
                    return $"NULL:/{this.Name}";
                }
                else
                {
                    return this.Folder.AtCorpusPath + this.Name;
                }
            }
        }        

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            if (preChildren != null && preChildren.Invoke(this, pathFrom))
                return false;
            if (this.Definitions != null)
                if (this.Definitions.VisitList(pathFrom, preChildren, postChildren))
                    return true;
            if (postChildren != null && postChildren.Invoke(this, pathFrom))
                return true;
            return false;
        }

        /// <summary>
        /// Saves the document back through the adapter in the requested format.
        /// Format is specified via document name/extension based on conventions:
        /// 'model.json' for the back compatible model, '*.manifest.cdm.json' for manifest, '*.folio.cdm.json' for folio, *.cdm.json' for CDM definitions.
        /// saveReferenced (default false) when true will also save any schema defintion documents that are
        /// linked from the source doc and that have been modified. existing document names are used for those.
        /// Returns false on any failure.
        /// </summary>
        public async Task<bool> SaveAsAsync(string newName, bool saveReferenced = false, CopyOptions options = null)
        {
            using (Logger.EnterScope(nameof(CdmDocumentDefinition), Ctx, nameof(SaveAsAsync)))
            {
                if (options == null)
                {
                    options = new CopyOptions();
                }

                ResolveOptions resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
                if (!await this.IndexIfNeeded(resOpt))
                {
                    Logger.Error(nameof(CdmDocumentDefinition), (ResolveContext)this.Ctx, $"Failed to index document prior to save '{this.Name}'", nameof(SaveAsAsync));
                    return false;
                }

                // if save to the same document name, then we are no longer 'dirty'
                if (newName == this.Name)
                    this.IsDirty = false;

                if (await this.Ctx.Corpus.Persistence.SaveDocumentAsAsync(this, options, newName, saveReferenced) == false)
                {
                    return false;
                }
                return true;
            }
        }

        /// <summary>
        /// Updates indexes for the document content. Call this after modifying objects in the document.
        /// </summary>
        public async Task<bool> RefreshAsync(ResolveOptions resOpt)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            this.DeclarationsIndexed = false;
            this.NeedsIndexing = true;
            this.IsValid = true;

            return await this.IndexIfNeeded(resOpt, true);
        }

        internal async Task<bool> IndexIfNeeded(ResolveOptions resOpt, bool loadImports = false)
        {
            if (this.NeedsIndexing && !this.CurrentlyIndexing)
            {
                if (this.Folder == null)
                {
                    Logger.Error(nameof(CdmDocumentDefinition), (ResolveContext)this.Ctx, $"Document '{this.Name}' is not in a folder", nameof(IndexIfNeeded));
                    return false;
                }

                var corpus = this.Folder.Corpus;
                
                // If the imports load strategy is "LazyLoad", loadImports value will be the one sent by the called function.
                if (resOpt.ImportsLoadStrategy == ImportsLoadStrategy.DoNotLoad)
                {
                    loadImports = false;
                }
                else if (resOpt.ImportsLoadStrategy == ImportsLoadStrategy.Load)
                {
                    loadImports = true;
                }

                if (loadImports)
                {
                    await corpus.ResolveImportsAsync(this, resOpt);
                }

                // make the corpus internal machinery pay attention to this document for this call.
                corpus.documentLibrary.MarkDocumentForIndexing(this);

                return corpus.IndexDocuments(resOpt, loadImports);
            }

            return true;
        }

        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            return null;
        }

        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            return;
        }

        [Obsolete("InstanceFromData is deprecated. Please use the Persistence Layer instead.")]
        public static CdmDocumentDefinition InstanceFromData(CdmCorpusContext ctx, dynamic obj)
        {
            return CdmObjectBase.InstanceFromData<CdmDocumentDefinition, DocumentContent>(ctx, obj);
        }

        internal ImportPriorities GetImportPriorities()
        {
            if (this.ImportPriorities == null)
            {
                var importPriorities = new ImportPriorities();
                importPriorities.ImportPriority.Add(this, new ImportInfo(0, false));
                this.PrioritizeImports(new HashSet<CdmDocumentDefinition>(), importPriorities, 1, false);
                this.ImportPriorities = importPriorities;
            }
            // make a copy so the caller doesn't mess these up
            return this.ImportPriorities.Copy();
        }

        private int PrioritizeImports(HashSet<CdmDocumentDefinition> processedSet, ImportPriorities importPriorities, int sequence, bool skipMonikered)
        {
            // goal is to make a map from the reverse order of imports (breadth first) to the first (aka last) sequence number in that list.
            // This gives the semantic that the 'last/shallowest' definition for a duplicate symbol wins,
            // the lower in this list a document shows up, the higher priority its definitions are for resolving conflicts.
            // for 'moniker' imports, keep track of the 'last/shallowest' use of each moniker tag.

            // maps document to priority.
            IDictionary<CdmDocumentDefinition, ImportInfo> priorityMap = importPriorities.ImportPriority;

            // maps moniker to document.
            IDictionary<string, CdmDocumentDefinition> monikerMap = importPriorities.MonikerPriorityMap;

            // if already in list, don't do this again
            if (processedSet.Contains(this))
            {
                // if the first document in the priority map is this then the document was the starting point of the recursion.
                // and if this document is present in the processedSet we know that there is a circular list of imports.
                if (priorityMap.ContainsKey(this) && priorityMap[this].Priority == 0)
                {
                    importPriorities.hasCircularImport = true;
                }

                return sequence;
            }
            processedSet.Add(this);

            if (this.Imports != null)
            {
                var reversedImports = this.Imports.Reverse();
                var monikerImports = new List<CdmDocumentDefinition>();

                // first add the imports done at this level only in reverse order.
                foreach (var imp in reversedImports)
                {
                    var impDoc = imp.Document;
                    bool isMoniker = !string.IsNullOrWhiteSpace(imp.Moniker);

                    // moniker imports will be added to the end of the priority list later.
                    if (impDoc != null)
                    {
                        if (!isMoniker && !priorityMap.ContainsKey(impDoc))
                        {
                            // add doc.
                            priorityMap.Add(impDoc, new ImportInfo(sequence, false));
                            sequence++;
                        }
                        else
                        {
                            monikerImports.Add(impDoc);
                        }
                    } 
                    else
                    {
                        Logger.Warning(nameof(CdmDocumentDefinition), this.Ctx, $"Import document {imp.CorpusPath} not loaded. This might cause an unexpected output.");
                    }
                }

                // now add the imports of the imports.
                foreach (var imp in reversedImports)
                {
                    CdmDocumentDefinition impDoc = imp.Document;
                    bool isMoniker = !string.IsNullOrWhiteSpace(imp.Moniker);

                    if (impDoc == null)
                    {
                        Logger.Warning(nameof(CdmDocumentDefinition), this.Ctx, $"Import document {imp.CorpusPath} not loaded. This might cause an unexpected output.");
                    }

                    // if the document has circular imports its order on the impDoc.ImportPriorities list is not correct.
                    // since the document itself will always be the first one on the list.
                    if (impDoc?.ImportPriorities != null && impDoc?.ImportPriorities.hasCircularImport == false)
                    {
                        // lucky, already done so avoid recursion and copy.
                        ImportPriorities impPriSub = impDoc.GetImportPriorities();
                        impPriSub.ImportPriority.Remove(impDoc); // because already added above.

                        foreach (var ip in impPriSub.ImportPriority)
                        {
                            // if the document is imported with moniker in another document do not include it in the priority list of this one.
                            // moniker imports are only added to the priority list of the document that directly imports them.
                            if (!priorityMap.ContainsKey(ip.Key) && !ip.Value.IsMoniker)
                            {
                                // add doc.
                                priorityMap.Add(ip.Key, new ImportInfo(sequence, false));
                                sequence++;
                            }
                        }

                        // if the import is not monikered then merge its monikerMap to this one.
                        if (!isMoniker)
                        {
                            foreach (var mp in impPriSub.MonikerPriorityMap)
                            {
                                monikerMap[mp.Key] = mp.Value;
                            }
                        }
                    }
                    else if (impDoc != null)
                    {
                        // skip the monikered imports from here if this is a monikered import itself and we are only collecting the dependencies.
                        sequence = impDoc.PrioritizeImports(processedSet, importPriorities, sequence, isMoniker);
                    }
                }

                // skip the monikered imports from here if this is a monikered import itself and we are only collecting the dependencies.
                if (!skipMonikered)
                {
                    // moniker imports are prioritized by the 'closest' use of the moniker to the starting doc. so last one found in this recursion.
                    foreach (var imp in this.Imports)
                    {
                        bool isMoniker = !string.IsNullOrWhiteSpace(imp.Moniker);
                        if (imp.Document != null && isMoniker)
                        {
                            monikerMap[imp.Moniker] = imp.Document;
                        }
                    }

                    // if the document index is zero, the document being processed is the root of the imports chain.
                    // in this case add the monikered imports to the end of the priorityMap.
                    if (priorityMap.ContainsKey(this) && priorityMap[this].Priority == 0)
                    {
                        foreach (var imp in monikerImports)
                        {
                            if (!priorityMap.ContainsKey(imp))
                            {
                                priorityMap.Add(imp, new ImportInfo(sequence, true));
                                sequence++;
                            }
                        }
                    }
                }
            }

            return sequence;
        }

        internal string ImportPathToDoc(CdmDocumentDefinition docDest)
        {
            HashSet<CdmDocumentDefinition> avoidLoop = new HashSet<CdmDocumentDefinition>();
            Func<CdmDocumentDefinition, string, string> InternalImportPathToDoc = null;
            InternalImportPathToDoc = (docCheck, path) => 
            {
                if (docCheck == docDest)
                {
                    return "";
                }
                if (avoidLoop.Contains(docCheck))
                {
                    return null;
                }
                avoidLoop.Add(docCheck);
                // if the docDest is one of the monikered imports of docCheck, then add the moniker and we are cool
                if (docCheck.ImportPriorities?.MonikerPriorityMap?.Count > 0)
                {
                    foreach(var monPair in docCheck.ImportPriorities?.MonikerPriorityMap)
                    {
                        if (monPair.Value == docDest)
                        {
                            return $"{path}{monPair.Key}/";
                        }
                    }
                }
                // ok, what if the document can be reached directly from the imports here
                ImportInfo impInfo = null;
                if (docCheck.ImportPriorities?.ImportPriority?.TryGetValue(docDest, out impInfo) == false)
                {
                    impInfo = null;
                }
                if (impInfo != null && impInfo.IsMoniker == false)
                {
                    // good enough
                    return path;
                }

                // still nothing, now we need to check those docs deeper
                if (docCheck.ImportPriorities?.MonikerPriorityMap?.Count > 0)
                {
                    foreach(var monPair in docCheck.ImportPriorities?.MonikerPriorityMap)
                    {
                        string pathFound = InternalImportPathToDoc(monPair.Value, $"{path}{monPair.Key}/");
                        if (pathFound != null)
                        {
                            return pathFound;
                        }
                    }
                }
                if (docCheck.ImportPriorities?.ImportPriority?.Count > 0)
                {
                    foreach(var impInfoPair in docCheck.ImportPriorities.ImportPriority)
                    {
                        if (!impInfoPair.Value.IsMoniker)
                        {
                            string pathFound = InternalImportPathToDoc(impInfoPair.Key, path);
                            if (pathFound != null)
                            {
                                return pathFound;
                            }
                        }
                    }
                }
                return null;
               
            };

            return InternalImportPathToDoc(this, "");

        }

        internal async Task Reload()
        {
            await this.Ctx.Corpus.FetchObjectAsync<CdmDocumentDefinition>(this.AtCorpusPath, null, null, true);
        }

        virtual internal async Task<bool> SaveLinkedDocuments(CopyOptions options = null)
        {
            if (options == null)
            {
                options = new CopyOptions();
            }

            // the only linked documents would be the imports
            if (this.Imports != null)
            {
                foreach (CdmImport imp in this.Imports)
                {
                    // get the document object from the import
                    string docPath = Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(imp.CorpusPath, this);
                    var docImp = await Ctx.Corpus.FetchObjectAsync<CdmDocumentDefinition>(docPath);
                    if (docImp != null && docImp.IsDirty)
                    {
                        // save it with the same name
                        if (await docImp.SaveAsAsync(docImp.Name, true, options) == false)
                        {
                            Logger.Error(nameof(CdmDocumentDefinition), (ResolveContext)this.Ctx, $"Failed to save import '{docImp.Name}'", nameof(SaveLinkedDocuments));
                            return false;
                        }
                    }
                }
            }
            return true;
        }
    }
}
