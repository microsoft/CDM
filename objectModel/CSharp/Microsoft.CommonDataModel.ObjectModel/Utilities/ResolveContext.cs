//-----------------------------------------------------------------------
// <copyright file="ResolveContext.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using System.Collections.Concurrent;
    using System.Collections.Generic;

    public class ResolveContext : CdmCorpusContext
    {
        internal Stack<ResolveContextScope> ScopeStack;
        internal ResolveContextScope CurrentScope;
        internal CdmStatusLevel ReportAtLevel;
        internal CdmDocumentDefinition CurrentDoc { get; set; }
        public CdmCorpusDefinition Corpus { get; set; }
        public EventCallback StatusEvent { get; set; }

        internal string RelativePath;
        internal string CorpusPathRoot;
        internal int Errors;
        internal IDictionary<string, dynamic> Cache;

        public ResolveContext(CdmCorpusDefinition corpus, EventCallback statusEvent, CdmStatusLevel? reportAtLevel = null)
        {
            this.ReportAtLevel = reportAtLevel != null ? reportAtLevel.Value : CdmStatusLevel.Info;
            this.StatusEvent = statusEvent;
            this.Cache = new ConcurrentDictionary<string, object>();
            this.Corpus = corpus;
        }

        public void UpdateDocumentContext(CdmDocumentDefinition currentDoc, string corpusPathRoot)
        {
            if (currentDoc != null)
                this.CurrentDoc = (CdmDocumentDefinition)currentDoc;

            if (!string.IsNullOrEmpty(corpusPathRoot))
                this.CorpusPathRoot = corpusPathRoot;
        }

        internal void PushScope(CdmTraitDefinition currentTrait)
        {
            if (this.ScopeStack == null)
                this.ScopeStack = new Stack<ResolveContextScope>();

            ResolveContextScope ctxNew = new ResolveContextScope
            {
                CurrentTrait = currentTrait != null ? currentTrait : this.CurrentScope?.CurrentTrait,
                CurrentParameter = 0
            };

            this.CurrentScope = ctxNew;
            this.ScopeStack.Push(ctxNew);
        }

        internal void PopScope()
        {
            this.ScopeStack.Pop();
            this.CurrentScope = this.ScopeStack.Count > 0 ? this.ScopeStack.Peek() : null;
        }

        internal dynamic FetchCache(CdmObjectBase forObj, ResolveOptions resOpt, string kind)
        {
            string key = forObj.Id.ToString() + "_" + (resOpt?.WrtDoc != null ? resOpt.WrtDoc.Id.ToString() : "NULL") + "_" + kind;
            if (this.Cache.ContainsKey(key))
            {
                return this.Cache[key];
            }
            return null;
        }

        internal void UpdateCache(CdmObjectBase forObj, ResolveOptions resOpt, string kind, dynamic value)
        {
            string key = forObj.Id.ToString() + "_" + (resOpt?.WrtDoc != null ? resOpt.WrtDoc.Id.ToString() : "NULL") + "_" + kind;
            if (!this.Cache.ContainsKey(key))
            {
                this.Cache.Add(key, value);
            }
            else
            {
                this.Cache[key] = value;
            }
        }
    }
}
