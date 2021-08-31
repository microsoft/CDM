// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttributeContext,
    cdmAttributeContextType,
    ProjectionAttributeState,
    ProjectionContext,
    ResolvedAttribute,
    StringUtils
} from '../../internal';

/**
 * Attribute context tree builder for projection operations that involve a search for a previously held attribute name.
 * There are three types of attribute context nodes created out of such operations:
 *
 *     Search For:
 *         The name of the attribute to search for, whether it's the current name of the attribute or a previously held name.
 *         Ex. A name in the "includeAttributes" list (for Include) or the name specified in "applyTo" (for Rename)
 *
 *     Found:
 *         The name of the attribute that was found out of the search for name. Because this is the current name of the attribute,
 *         the search for name and the found name can be different. The search for name can return multiple found names.
 *         Ex. Given Rename(A->a) and then Include(A), searchFor = "A" and found = "a"
 *
 *     Action:
 *         The name of the attribute resulting out of the action (operation).
 *         Ex. Given Rename(A->a), the action/operation is to rename "A" to "a" so action (the resulting attribute) = "a"
 *
 * Put together, the resulting attribute context will look like "../operation/index{n}/[name of operation]/[searchFor]/[found]/[action]"
 *     Ex. ../operation/index1/operationRenameAttributes/A/a/aa, given searchFor = "A", found = "a", action = "aa"
 *
 * If searchFor and found or found and action have the same name, then we just collapse the nodes
 *     Ex. ../operation/index1/operationRenameAttributes/A/a/a -> ../operation/index1/operationRenameAttributes/A/a/
 *     Ex. ../operation/index1/operationIncludeAttributes/B/B -> ../operation/index1/operationIncludeAttributes/B
 *
 * @internal
 */
export class ProjectionAttributeContextTreeBuilder {
    /**
     * Root node to build the attribute context tree under
     */
    private root: CdmAttributeContext;

    /**
     * Mapping between a "search for" string to the attribute context parameter created out of it
     */
    private searchForToSearchForAttrCtxParam: Map<string, AttributeContextParameters>;

    /**
     * Mapping between a "search for" attribute context parameter to all attribute context parameters created out of the
     * "found" attributes
     */
    private searchForAttrCtxParamToFoundAttrCtxParam: Map<AttributeContextParameters, AttributeContextParameters[]>;

    /**
     * Mapping between a "found" attribute context parameter to the attribute context parameter created out of the
     * "action" attribute
     */
    private foundAttrCtxParamToActionAttrCtxParam: Map<AttributeContextParameters, AttributeContextParameters>;

    /**
     * Mapping between an "action" attribute context parameter to the resolved attribute resulting out of the action
     */
    private actionAttrCtxParamToResAttr: Map<AttributeContextParameters, ResolvedAttribute>;

    /**
     * Mapping between an "action" attribute context parameter to the context to consider 'where from' lineage
     */
    private actionAttrCtxParamToLineageOut: Map<AttributeContextParameters, CdmAttributeContext>;

    /**
     * Mapping between an "action" attribute context parameter to the context that wants to point here for lineage
     */
    private actionAttrCtxParamToLineageIn: Map<AttributeContextParameters, CdmAttributeContext>;

    constructor(root: CdmAttributeContext) {
        this.root = root;
        this.searchForToSearchForAttrCtxParam = new Map<string, AttributeContextParameters>();
        this.searchForAttrCtxParamToFoundAttrCtxParam = new Map<AttributeContextParameters, AttributeContextParameters[]>();
        this.foundAttrCtxParamToActionAttrCtxParam = new Map<AttributeContextParameters, AttributeContextParameters>();
        this.actionAttrCtxParamToResAttr = new Map<AttributeContextParameters, ResolvedAttribute>();
        this.actionAttrCtxParamToLineageOut = new Map<AttributeContextParameters, CdmAttributeContext>();
        this.actionAttrCtxParamToLineageIn = new Map<AttributeContextParameters, CdmAttributeContext>();
    }

    /**
     * Creates the attribute context parameters for the searchFor, found, and action nodes and then stores them in different maps.
     * The maps are used when constructing the actual attribute context tree.
     * @param searchFor The 'search for' string
     * @param found The projection attribute state that contains the "found" attribute
     * @param resAttrFromAction The attribute context type to give the "action" attribute context parameter
     * @param attrCtxType The attribute context type to give the "action" attribute context parameter
     *
     * @internal
     */
    public createAndStoreAttributeContextParameters(
        searchFor: string,
        found: ProjectionAttributeState,
        resAttrFromAction: ResolvedAttribute,
        attrCtxType: cdmAttributeContextType,
        lineageOut: CdmAttributeContext,
        lineageIn: CdmAttributeContext): void {
        // searchFor is null when we have to construct attribute contexts for the excluded attributes in Include or the included attributes in Exclude,
        // as these attributes weren't searched for with a searchFor name.
        // If searchFor is null, just set it to have the same name as found so that it'll collapse in the final tree.
        if (searchFor === undefined) {
            searchFor = found.currentResolvedAttribute.resolvedName;
        }

        // Create the attribute context parameter for the searchFor node and store it in the map as [searchFor name]:[attribute context parameter]
        let searchForAttrCtxParam: AttributeContextParameters;
        if (!this.searchForToSearchForAttrCtxParam.has(searchFor)) {
            searchForAttrCtxParam = {
                under: this.root,
                type: cdmAttributeContextType.attributeDefinition,
                name: searchFor
            };

            this.searchForToSearchForAttrCtxParam.set(searchFor, searchForAttrCtxParam);
        } else {
            searchForAttrCtxParam = this.searchForToSearchForAttrCtxParam.get(searchFor);
        }

        // Create the attribute context parameter for the found node
        const foundAttrCtxParam: AttributeContextParameters = {
            under: this.root, // Set this to be under the root for now, as we may end up collapsing this node
            type: cdmAttributeContextType.attributeDefinition,
            name: `${found.currentResolvedAttribute.resolvedName}${found.ordinal !== undefined ? '@' + found.ordinal : ''}`
        };

        // Store this in the map as [searchFor attribute context parameter]:[found attribute context parameters]
        // We store it this way so that we can create the found nodes under their corresponding searchFor nodes.
        if (!this.searchForAttrCtxParamToFoundAttrCtxParam.has(searchForAttrCtxParam)) {
            this.searchForAttrCtxParamToFoundAttrCtxParam.set(searchForAttrCtxParam, []);
        }

        const foundAttrCtxParams: AttributeContextParameters[] = this.searchForAttrCtxParamToFoundAttrCtxParam.get(searchForAttrCtxParam);
        foundAttrCtxParams.push(foundAttrCtxParam);

        // Create the attribute context parameter for the action node
        const actionAttrCtxParam: AttributeContextParameters = {
            under: this.root, // Set this to be under the root for now, as we may end up collapsing this node
            type: attrCtxType, // This type will be updated once we implement the new attribute context types
            name: resAttrFromAction.resolvedName
        };

        // Store this in the map as [found attribute context parameter]:[action attribute context parameter]
        // We store it this way so that we can create the action nodes under their corresponding found nodes.
        this.foundAttrCtxParamToActionAttrCtxParam.set(foundAttrCtxParam, actionAttrCtxParam);

        // Store the action attribute context parameter with the resolved attribute resulting out of the action.
        // This is so that we can point the action attribute context to the correct resolved attribute once the attribute context is created.
        this.actionAttrCtxParamToResAttr.set(actionAttrCtxParam, resAttrFromAction);

        // store the current resAtt as the lineage of the new one
        // of note, if no lineage is stored AND the resolved Att associated above holds an existing context? we will
        // flip the lineage when we make a new context and point 'back' to this new node. this means this new node should
        // point 'back' to the context of the source attribute
        if (lineageOut) {
            this.actionAttrCtxParamToLineageOut.set(actionAttrCtxParam, lineageOut);
        }
        if (lineageIn) {
            this.actionAttrCtxParamToLineageIn.set(actionAttrCtxParam, lineageIn);
        }
    }

    /**
     * Takes all the stored attribute context parameters, creates attribute contexts from them, and then constructs the tree.
     *
     * @param projCtx The projection context
     *
     * @internal
     */
    public constructAttributeContextTree(projCtx: ProjectionContext): void {
        // Iterate over all the searchFor attribute context parameters
        for (const searchForAttrCtxParam of this.searchForToSearchForAttrCtxParam.values()) {
            // Fetch all the found attribute context parameters associated with this searchFor
            const foundAttrCtxParams: AttributeContextParameters[] = this.searchForAttrCtxParamToFoundAttrCtxParam.get(searchForAttrCtxParam);

            // Iterate over all the found attribute context parameters
            for (const foundAttrCtxParam of foundAttrCtxParams) {
                // Fetch the action attribute context parameter associated with this found
                const actionAttrCtxParam: AttributeContextParameters = this.foundAttrCtxParamToActionAttrCtxParam.get(foundAttrCtxParam);

                // We should only create the found node when found and action have different names. Else collapse the nodes together.
                if (!StringUtils.equalsWithCase(foundAttrCtxParam.name, actionAttrCtxParam.name)) {
                    // Create the attribute context for found and set it as the parent of action
                    const foundAttrCtx: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, foundAttrCtxParam);
                    actionAttrCtxParam.under = foundAttrCtx;
                }

                // Create the attribute context for action
                const actionAttrCtx: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, actionAttrCtxParam);

                // Fetch the resolved attribute that should now point at this action attribute context
                const resAttrFromAction: ResolvedAttribute = this.actionAttrCtxParamToResAttr.get(actionAttrCtxParam);

                // make sure the lineage of the attribute stays linked up
                // there can be either (or both) a lineageOut and a lineageIn.
                // out lineage is where this attribute came from
                // in lineage should be pointing back at this context as a source
                if (this.actionAttrCtxParamToLineageOut.has(actionAttrCtxParam)) {
                    if (actionAttrCtx) {
                        actionAttrCtx.addLineage(this.actionAttrCtxParamToLineageOut.get(actionAttrCtxParam));
                    }
                    resAttrFromAction.attCtx = actionAttrCtx; // probably the right context for this resAtt, unless ...
                }
                if (this.actionAttrCtxParamToLineageIn.has(actionAttrCtxParam)) {
                    const lineageIn: CdmAttributeContext = this.actionAttrCtxParamToLineageIn.get(actionAttrCtxParam);
                    if (actionAttrCtx) {
                        lineageIn.addLineage(actionAttrCtx);
                    }
                    resAttrFromAction.attCtx = lineageIn; // if there is a lineageIn. it points to us as lineage, so it is best
                }
            }
        }
    }
}
