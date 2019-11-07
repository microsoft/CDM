//-----------------------------------------------------------------------
// <copyright file="ResolveOptions.cs" company="Microsoft">
//      All rights reserved.
// </copyright>

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using System.Collections.Generic;

    public class ResolveOptions
    {
        public CdmDocumentDefinition WrtDoc { get; set; } // the document to use as a point of reference when resolving relative paths and symbol names.
        public AttributeResolutionDirectiveSet Directives { get; set; } // a set of string flags that direct how attribute resolving traits behave
        internal int? RelationshipDepth { get; set; } // tracks the number of entity attributes that have been travered when collecting resolved traits or attributes. prevents run away loops
        internal bool SaveResolutionsOnCopy { get; set; } // when references get copied, use previous resolution results if available (for use with copy method)
        internal SymbolSet SymbolRefSet { get; set; } // set of set of symbol that the current chain of resolution depends upon. used with importPriority to find what docs and versions of symbols to use
        internal CdmDocumentDefinition LocalizeReferencesFor { get; set; } // forces symbolic references to be re-written to be the precicely located reference based on the wrtDoc
        internal CdmDocumentDefinition IndexingDoc { get; set; } // document currently being indexed
        internal string FromMoniker { get; set; } // moniker that was found on the ref         

        /// <summary>
        /// Creates a new instance of Resolve Options using most common parameters.
        /// </summary>
        /// <param name="cdmDocument">Document to use as point of reference when resolving relative paths and symbol names.</param>
        public ResolveOptions(CdmDocumentDefinition cdmDocument)
        {
            WrtDoc = cdmDocument;
            // avoid one to many relationship nesting and to use foreign keys for many to one refs.
            Directives = new AttributeResolutionDirectiveSet(new HashSet<string>(){ "normalized", "referenceOnly" });
            SymbolRefSet = new SymbolSet();
        }

        /// <summary>
        /// Creates a new instance of Resolve Options using most common parameters.
        /// </summary>
        /// <param name="cdmObject"></param>
        public ResolveOptions(CdmObject cdmObject)
        {
            WrtDoc = FetchDocument(cdmObject);
            // avoid one to many relationship nesting and to use foreign keys for many to one refs.
            Directives = new AttributeResolutionDirectiveSet(new HashSet<string>() { "normalized", "referenceOnly" });
            SymbolRefSet = new SymbolSet();
        }

        /// <summary>
        /// Creates a new instance of Resolve Options.
        /// </summary>
        public ResolveOptions()
        {
        }

        /// <summary>
        /// Fetches the document that contains the owner of the CdmObject.
        /// </summary>
        /// <param name="obj">CdmObject to fetch the document for.</param>
        /// <returns> Document to be used as starting point when resolving the CdmObject passed as argument.</returns>
        internal static CdmDocumentDefinition FetchDocument(CdmObject obj)
        {
            if (obj == null || obj.Owner == null)
            {
                return null;
            }

            return obj.Owner.InDocument;
        }
    }
}
