// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using System;
    using System.Collections.Generic;

    public class ResolveOptions
    {
        public CdmDocumentDefinition WrtDoc { get; set; } // the document to use as a point of reference when resolving relative paths and symbol names.
        public AttributeResolutionDirectiveSet Directives { get; set; } // a set of string flags that direct how attribute resolving traits behave
        public bool ShallowValidation { get; set; } // when enabled, errors regarding references that are unable to be resolved or loaded are logged as warnings instead
        public ImportsLoadStrategy ImportsLoadStrategy { get; set; } = ImportsLoadStrategy.LazyLoad; // defines at which point the Object Model will try to load the imported documents.
        public int? ResolvedAttributeLimit { get; set; } = 4000; // the limit for the number of resolved attributes allowed per entity. if the number is exceeded, the resolution will fail 
        public int MaxOrdinalForArrayExpansion { get; set; } = 20; // the maximum value for the end ordinal in an ArrayExpansion operation
        internal int? RelationshipDepth { get; set; } // tracks the number of entity attributes that have been travered when collecting resolved traits or attributes. prevents run away loops
        internal bool SaveResolutionsOnCopy { get; set; } // when references get copied, use previous resolution results if available (for use with copy method)
        internal SymbolSet SymbolRefSet { get; set; } // set of set of symbol that the current chain of resolution depends upon. used with importPriority to find what docs and versions of symbols to use
        internal CdmDocumentDefinition LocalizeReferencesFor { get; set; } // forces symbolic references to be re-written to be the precisely located reference based on the wrtDoc
        internal CdmDocumentDefinition IndexingDoc { get; set; } // document currently being indexed
        internal string FromMoniker { get; set; } // moniker that was found on the ref

        [Obsolete("Please use ImportsLoadStrategy instead.")]
        // when enabled, all the imports will be loaded and the references checked otherwise will be delayed until the symbols are required.
        public bool? StrictValidation
        {
            get
            {
                if (this.ImportsLoadStrategy == ImportsLoadStrategy.LazyLoad)
                {
                    return null;
                }
                return this.ImportsLoadStrategy == ImportsLoadStrategy.Load;
            }
            set
            {
                if (value == null)
                {
                    this.ImportsLoadStrategy = ImportsLoadStrategy.LazyLoad;
                }
                else if (value == true)
                {
                    this.ImportsLoadStrategy = ImportsLoadStrategy.Load;
                }
                else
                {
                    this.ImportsLoadStrategy = ImportsLoadStrategy.DoNotLoad;
                }
            }
        }

        /// <summary>
        /// Creates a new instance of Resolve Options using most common parameters.
        /// </summary>
        /// <param name="cdmDocument">Document to use as point of reference when resolving relative paths and symbol names.</param>
        /// <param name="Directives">Directives to use when resolving attributes</param>
        public ResolveOptions(CdmDocumentDefinition cdmDocument, AttributeResolutionDirectiveSet Directives = null)
        {
            WrtDoc = cdmDocument;
            // provided or default to 'avoid one to many relationship nesting and to use foreign keys for many to one refs'. this is for back compat with behavior before the corpus has a default directive property
            this.Directives = Directives != null ? Directives.Copy() : new AttributeResolutionDirectiveSet(new HashSet<string>() { "normalized", "referenceOnly" });
            SymbolRefSet = new SymbolSet();
        }

        /// <summary>
        /// Creates a new instance of Resolve Options using most common parameters.
        /// </summary>
        /// <param name="cdmObject">a CdmObject from which to take the With Regards To Document</param>
        /// <param name="Directives">Directives to use when resolving attributes</param>
        public ResolveOptions(CdmObject cdmObject, AttributeResolutionDirectiveSet Directives = null)
        {
            WrtDoc = FetchDocument(cdmObject);
            // provided or default to 'avoid one to many relationship nesting and to use foreign keys for many to one refs'. this is for back compat with behavior before the corpus has a default directive property
            this.Directives = Directives != null ? Directives.Copy() : new AttributeResolutionDirectiveSet(new HashSet<string>() { "normalized", "referenceOnly" });
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

        /// <summary>
        /// Checks if the limit for the number of attributes an entity can have has been reached
        /// </summary>
        internal bool CheckAttributeCount(int amount)
        {
            if (this.ResolvedAttributeLimit != null)
            {
                if (amount > this.ResolvedAttributeLimit)
                {
                    return false;
                }
            }
            return true;
        }
    }
}
