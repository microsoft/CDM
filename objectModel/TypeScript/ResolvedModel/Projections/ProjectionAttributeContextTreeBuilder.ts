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

    constructor(root: CdmAttributeContext) {
        this.root = root;
        this.searchForToSearchForAttrCtxParam = new Map<string, AttributeContextParameters>();
        this.searchForAttrCtxParamToFoundAttrCtxParam = new Map<AttributeContextParameters, AttributeContextParameters[]>();
        this.foundAttrCtxParamToActionAttrCtxParam = new Map<AttributeContextParameters, AttributeContextParameters>();
        this.actionAttrCtxParamToResAttr = new Map<AttributeContextParameters, ResolvedAttribute>();
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
    public createAndStoreAttributeContextParameters(searchFor: string, found: ProjectionAttributeState, resAttrFromAction: ResolvedAttribute, attrCtxType: cdmAttributeContextType): void {
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
            this.searchForAttrCtxParamToFoundAttrCtxParam.set(searchForAttrCtxParam, [foundAttrCtxParam]);
        } else {
            const foundAttrCtxParams: AttributeContextParameters[] = this.searchForAttrCtxParamToFoundAttrCtxParam.get(searchForAttrCtxParam);
            foundAttrCtxParams.push(foundAttrCtxParam);
            this.searchForAttrCtxParamToFoundAttrCtxParam.set(searchForAttrCtxParam, foundAttrCtxParams);
        }

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
    }

    /**
     * Takes all the stored attribute context parameters, creates attribute contexts from them, and then constructs the tree.
     *
     * @param projCtx The projection context
     * @param setAttrCtx Whether to set the created attribute context on the associated resolved attribute
     *
     * @internal
     */
    public constructAttributeContextTree(projCtx: ProjectionContext, setAttrCtx: boolean = false): void {
        // Iterate over all the searchFor attribute context parameters
        for (const searchForAttrCtxParam of this.searchForToSearchForAttrCtxParam.values()) {
            let searchForAttrCtx: CdmAttributeContext;

            // Fetch all the found attribute context parameters associated with this searchFor
            const foundAttrCtxParams: AttributeContextParameters[] = this.searchForAttrCtxParamToFoundAttrCtxParam.get(searchForAttrCtxParam);

            // Iterate over all the found attribute context parameters
            for (const foundAttrCtxParam of foundAttrCtxParams) {
                // We should only create the searchFor node when searchFor and found have different names. Else collapse the nodes together.
                if (!StringUtils.equalsWithCase(searchForAttrCtxParam.name, foundAttrCtxParam.name)) {
                    // Create the attribute context for searchFor if it hasn't been created already and set it as the parent of found
                    if (!searchForAttrCtx) {
                        searchForAttrCtx = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, searchForAttrCtxParam);
                    }
                    foundAttrCtxParam.under = searchForAttrCtx;
                }

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

                // TODO (jibyun): For now, only set the created attribute context on the resolved attribute when specified to,
                // as pointing the resolved attribute at this attribute context won't work currently for certain operations (Include/Exclude).
                // This will be changed to always run once we work on the attribute context fix.
                if (setAttrCtx) {
                    resAttrFromAction.attCtx = actionAttrCtx;
                }
            }
        }
    }
}
