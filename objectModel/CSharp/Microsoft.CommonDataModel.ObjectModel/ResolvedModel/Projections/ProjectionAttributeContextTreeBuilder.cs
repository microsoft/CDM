// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Cdm;
using Microsoft.CommonDataModel.ObjectModel.Enums;
using Microsoft.CommonDataModel.ObjectModel.Utilities;
using System.Collections.Generic;

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel.Projections
{
    /// <summary>
    /// Attribute context tree builder for projection operations that involve a search for a previously held attribute name.
    /// There are three types of attribute context nodes created out of such operations:
    /// 
    ///     Search For:
    ///         The name of the attribute to search for, whether it's the current name of the attribute or a previously held name.
    ///         Ex. A name in the "includeAttributes" list (for Include) or the name specified in "applyTo" (for Rename)
    ///         
    ///     Found:
    ///         The name of the attribute that was found out of the search for name. Because this is the current name of the attribute,
    ///         the search for name and the found name can be different. The search for name can return multiple found names.
    ///         Ex. Given Rename(A->a) and then Include(A), searchFor = "A" and found = "a"
    ///         
    ///     Action:
    ///         The name of the attribute resulting out of the action (operation).
    ///         Ex. Given Rename(A->a), the action/operation is to rename "A" to "a" so action (the resulting attribute) = "a"
    ///         
    /// Put together, the resulting attribute context will look like "../operation/index{n}/[name of operation]/[searchFor]/[found]/[action]"
    ///     Ex. ../operation/index1/operationRenameAttributes/A/a/aa, given searchFor = "A", found = "a", action = "aa"
    ///     
    /// If searchFor and found or found and action have the same name, then we just collapse the nodes
    ///     Ex. ../operation/index1/operationRenameAttributes/A/a/a -> ../operation/index1/operationRenameAttributes/A/a/
    ///     Ex. ../operation/index1/operationIncludeAttributes/B/B -> ../operation/index1/operationIncludeAttributes/B
    /// </summary>
    internal class ProjectionAttributeContextTreeBuilder
    {
        /// <summary>
        /// Root node to build the attribute context tree under
        /// </summary>
        private CdmAttributeContext root;

        /// <summary>
        /// Mapping between a "search for" string to the attribute context parameter created out of it
        /// </summary>
        private Dictionary<string, AttributeContextParameters> searchForToSearchForAttrCtxParam;

        /// <summary>
        /// Mapping between a "search for" attribute context parameter to all attribute context parameters created out of the
        /// "found" attributes
        /// </summary>
        private Dictionary<AttributeContextParameters, List<AttributeContextParameters>> searchForAttrCtxParamToFoundAttrCtxParam;

        /// <summary>
        /// Mapping between a "found" attribute context parameter to the attribute context parameter created out of the
        /// "action" attribute
        /// </summary>
        private Dictionary<AttributeContextParameters, AttributeContextParameters> foundAttrCtxParamToActionAttrCtxParam;

        /// <summary>
        /// Mapping between an "action" attribute context parameter to the resolved attribute resulting out of the action
        /// </summary>
        private Dictionary<AttributeContextParameters, ResolvedAttribute> actionAttrCtxParamToResAttr;

        /// <summary>
        /// Mapping between an "action" attribute context parameter to the context to consider 'where from' lineage
        /// </summary>
        private Dictionary<AttributeContextParameters, CdmAttributeContext> actionAttrCtxParamToLineageOut;

        /// <summary>
        /// Mapping between an "action" attribute context parameter to the context that wants to point here for lineage
        /// </summary>
        private Dictionary<AttributeContextParameters, CdmAttributeContext> actionAttrCtxParamToLineageIn;

        public ProjectionAttributeContextTreeBuilder(CdmAttributeContext root)
        {
            this.root = root;
            this.searchForToSearchForAttrCtxParam = new Dictionary<string, AttributeContextParameters>();
            this.searchForAttrCtxParamToFoundAttrCtxParam = new Dictionary<AttributeContextParameters, List<AttributeContextParameters>>();
            this.foundAttrCtxParamToActionAttrCtxParam = new Dictionary<AttributeContextParameters, AttributeContextParameters>();
            this.actionAttrCtxParamToResAttr = new Dictionary<AttributeContextParameters, ResolvedAttribute>();
            this.actionAttrCtxParamToLineageOut = new Dictionary<AttributeContextParameters, CdmAttributeContext>();
            this.actionAttrCtxParamToLineageIn = new Dictionary<AttributeContextParameters, CdmAttributeContext>();
        }

        /// <summary>
        /// Creates the attribute context parameters for the searchFor, found, and action nodes and then stores them in different maps.
        /// The maps are used when constructing the actual attribute context tree.
        /// </summary>
        /// <param name="searchFor">The "search for" string</param>
        /// <param name="found">The projection attribute state that contains the "found" attribute</param>
        /// <param name="resAttrFromAction">The resolved attribute that resulted from the action</param>
        /// <param name="attrCtxType">The attribute context type to give the "action" attribute context parameter</param>
        /// <param name="lineageOut">normally lineage goes from new context to the found. false means don't and maybe even flip it</param>
        /// <param name="lineageIn"></param>
        internal void CreateAndStoreAttributeContextParameters(string searchFor, ProjectionAttributeState found, ResolvedAttribute resAttrFromAction, 
                            CdmAttributeContextType attrCtxType, CdmAttributeContext lineageOut, CdmAttributeContext lineageIn)
        {
            // searchFor is null when we have to construct attribute contexts for the excluded attributes in Include or the included attributes in Exclude, 
            // as these attributes weren't searched for with a searchFor name.
            // If searchFor is null, just set it to have the same name as found so that it'll collapse in the final tree.
            if (searchFor == null)
            {
                searchFor = found.CurrentResolvedAttribute.ResolvedName;
            }

            // Create the attribute context parameter for the searchFor node and store it in the map as [searchFor name]:[attribute context parameter]
            AttributeContextParameters searchForAttrCtxParam = null;
            if (!searchForToSearchForAttrCtxParam.ContainsKey(searchFor))
            {
                searchForAttrCtxParam = new AttributeContextParameters
                {
                    under = root,
                    type = CdmAttributeContextType.AttributeDefinition,
                    Name = searchFor
                };

                searchForToSearchForAttrCtxParam.Add(searchFor, searchForAttrCtxParam);
            }
            else
            {
                searchForToSearchForAttrCtxParam.TryGetValue(searchFor, out searchForAttrCtxParam);
            }

            // Create the attribute context parameter for the found node
            AttributeContextParameters foundAttrCtxParam = new AttributeContextParameters
            {
                under = root, // Set this to be under the root for now, as we may end up collapsing this node
                type = CdmAttributeContextType.AttributeDefinition,
                Name = $"{found.CurrentResolvedAttribute.ResolvedName}{(found.Ordinal != null ? "@" + found.Ordinal : "")}"
            };

            // Store this in the map as [searchFor attribute context parameter]:[found attribute context parameters]
            // We store it this way so that we can create the found nodes under their corresponding searchFor nodes.
            if (!searchForAttrCtxParamToFoundAttrCtxParam.ContainsKey(searchForAttrCtxParam))
            {
                searchForAttrCtxParamToFoundAttrCtxParam.Add(searchForAttrCtxParam, new List<AttributeContextParameters>());
            }

            List<AttributeContextParameters> foundAttrCtxParams = searchForAttrCtxParamToFoundAttrCtxParam[searchForAttrCtxParam];
            foundAttrCtxParams.Add(foundAttrCtxParam);

            // Create the attribute context parameter for the action node
            AttributeContextParameters actionAttrCtxParam = new AttributeContextParameters
            {
                under = root, // Set this to be under the root for now, as we may end up collapsing this node
                type = attrCtxType, // This type will be updated once we implement the new attribute context types
                Name = resAttrFromAction.ResolvedName
            };

            // Store this in the map as [found attribute context parameter]:[action attribute context parameter]
            // We store it this way so that we can create the action nodes under their corresponding found nodes.
            foundAttrCtxParamToActionAttrCtxParam[foundAttrCtxParam] = actionAttrCtxParam;

            // Store the action attribute context parameter with the resolved attribute resulting out of the action.
            // This is so that we can point the action attribute context to the correct resolved attribute once the attribute context is created.
            actionAttrCtxParamToResAttr[actionAttrCtxParam] = resAttrFromAction;

            // store the current resAtt as the lineage of the new one
            // of note, if no lineage is stored AND the resolved Att associated above holds an existing context? we will
            // flip the lineage when we make a new context and point 'back' to this new node. this means this new node should
            // point 'back' to the context of the source attribute
            if (lineageOut != null)
            {
                actionAttrCtxParamToLineageOut[actionAttrCtxParam] = lineageOut;
            }
            if (lineageIn != null)
            {
                actionAttrCtxParamToLineageIn[actionAttrCtxParam] = lineageIn;
            }

        }

        /// <summary>
        /// Takes all the stored attribute context parameters, creates attribute contexts from them, and then constructs the tree.
        /// </summary>
        /// <param name="projCtx">The projection context</param>
        internal void ConstructAttributeContextTree(ProjectionContext projCtx)
        {
            // Iterate over all the searchFor attribute context parameters
            foreach (AttributeContextParameters searchForAttrCtxParam in this.searchForToSearchForAttrCtxParam.Values)
            {
                // Fetch all the found attribute context parameters associated with this searchFor
                List<AttributeContextParameters> foundAttrCtxParams = searchForAttrCtxParamToFoundAttrCtxParam[searchForAttrCtxParam];

                // Iterate over all the found attribute context parameters
                foreach (AttributeContextParameters foundAttrCtxParam in foundAttrCtxParams)
                {
                    // Fetch the action attribute context parameter associated with this found
                    AttributeContextParameters actionAttrCtxParam = foundAttrCtxParamToActionAttrCtxParam[foundAttrCtxParam];

                    // We should only create the found node when found and action have different names. Else collapse the nodes together.
                    if (!StringUtils.EqualsWithCase(foundAttrCtxParam.Name, actionAttrCtxParam.Name))
                    {
                        // Create the attribute context for found and set it as the parent of action
                        CdmAttributeContext foundAttrCtx = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, foundAttrCtxParam);
                        actionAttrCtxParam.under = foundAttrCtx;
                    }

                    // Create the attribute context for action
                    CdmAttributeContext actionAttrCtx = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, actionAttrCtxParam);

                    // Fetch the resolved attribute that should now point at this action attribute context
                    ResolvedAttribute resAttrFromAction = actionAttrCtxParamToResAttr[actionAttrCtxParam];

                    // make sure the lineage of the attribute stays linked up
                    // there can be either (or both) a lineageOut and a lineageIn.
                    // out lineage is where this attribute came from
                    // in lineage should be pointing back at this context as a source
                    CdmAttributeContext lineageOut;
                    if (actionAttrCtxParamToLineageOut.TryGetValue(actionAttrCtxParam, out lineageOut))
                    {
                        if (actionAttrCtx != null && lineageOut != null)
                        {
                            actionAttrCtx.AddLineage(lineageOut);
                        }
                        resAttrFromAction.AttCtx = actionAttrCtx; // probably the right context for this resAtt, unless ...
                    }
                    CdmAttributeContext lineageIn;
                    if (actionAttrCtxParamToLineageIn.TryGetValue(actionAttrCtxParam, out lineageIn))
                    {
                        if (actionAttrCtx != null && lineageIn != null)
                        {
                            lineageIn.AddLineage(actionAttrCtx);
                        }
                        resAttrFromAction.AttCtx = lineageIn; // if there is a lineageIn. it points to us as lineage, so it is best
                    }
                }
            }
        }
    }
}
