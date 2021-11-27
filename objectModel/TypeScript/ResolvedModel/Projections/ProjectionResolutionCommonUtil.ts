// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmConstantEntityDefinition,
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    cdmLogCode,
    CdmObject,
    CdmObjectBase,
    cdmObjectType,
    Logger,
    ProjectionAttributeState,
    ProjectionAttributeStateSet,
    ProjectionContext,
    ProjectionDirective,
    ResolvedAttribute,
    ResolvedAttributeSet,
    SearchResult,
    SearchStructure
} from '../../internal';

/**
 * A utility class to handle name based functionality for projections and operations
 * @internal
 */
export class ProjectionResolutionCommonUtil {
    private static TAG: string = ProjectionResolutionCommonUtil.name;

    /**
     * Function to initialize the input projection attribute state Set for a projection
     * @internal
     */
    public static initializeProjectionAttributeStateSet(
        projDir: ProjectionDirective,
        ctx: CdmCorpusContext,
        orgSrcRAS: ResolvedAttributeSet,
        isSourcePolymorphic: boolean = false,
        polymorphicSet: Map<string, ProjectionAttributeState[]> = null
    ): ProjectionAttributeStateSet {
        const set: ProjectionAttributeStateSet = new ProjectionAttributeStateSet(ctx);

        for (const resAttr of orgSrcRAS.set) {
            let prevSet: ProjectionAttributeState[];
            if (isSourcePolymorphic && polymorphicSet) {
                const polyList: ProjectionAttributeState[] = polymorphicSet.get(resAttr.resolvedName);
                prevSet = polyList;
            }

            const projAttrState: ProjectionAttributeState = new ProjectionAttributeState(ctx);
            projAttrState.currentResolvedAttribute = resAttr;
            projAttrState.previousStateList = prevSet;
            set.add(projAttrState);
        }

        return set;
    }

    /**
     * If a source is tagged as polymorphic source, get the list of original source
     * @internal
     */
    public static getPolymorphicSourceSet(
        projDir: ProjectionDirective,
        ctx: CdmCorpusContext,
        source: CdmEntityReference,
        rasSource: ResolvedAttributeSet
    ): Map<string, ProjectionAttributeState[]> {
        const polySources: Map<string, ProjectionAttributeState[]> = new Map<string, ProjectionAttributeState[]>();

        // TODO (sukanyas): when projection based polymorphic source is made available - the following line will have to be changed
        // for now assuming non-projections based polymorphic source
        const sourceDef: CdmEntityDefinition = source.fetchObjectDefinition(projDir.resOpt);
        for (const attr of sourceDef.attributes) {
            if (attr.objectType === cdmObjectType.entityAttributeDef) {
                // the attribute context for this entity typed attribute was already created by the `FetchResolvedAttributes` that happens before this function call.
                // we are only interested in linking the attributes to the entity that they came from and the attribute context nodes should not be taken into account.
                // create this dummy attribute context so the resolution code works properly and discard it after.
                const attrCtxParam: AttributeContextParameters = {
                    regarding: attr,
                    type: cdmAttributeContextType.passThrough,
                    under: new CdmAttributeContext(ctx, 'discard')
                };
                const raSet: ResolvedAttributeSet = (attr as CdmEntityAttributeDefinition).fetchResolvedAttributes(projDir.resOpt, attrCtxParam);
                for (const resAttr of raSet.set) {
                    // we got a null ctx because null was passed in to fetch, but the nodes are in the parent's tree
                    // so steal them based on name
                    var resAttSrc = rasSource.get(resAttr.resolvedName);
                    if (resAttSrc != null) {
                        resAttr.attCtx = resAttSrc.attCtx;
                    }

                    const projAttrState: ProjectionAttributeState = new ProjectionAttributeState(ctx);
                    projAttrState.currentResolvedAttribute = resAttr;
                    projAttrState.previousStateList = undefined;

                    // the key doesn't exist, initialize with an empty list first
                    if (!polySources.has(resAttr.resolvedName)) {
                        polySources.set(resAttr.resolvedName, []);
                    }
                    polySources.get(resAttr.resolvedName).push(projAttrState);
                }
            }
        }

        return polySources;
    }

    /**
     * Get leaf nodes of the projection state tree for polymorphic scenarios
     * @internal
     */
    public static getLeafList(projCtx: ProjectionContext, attrName: string): ProjectionAttributeState[] {
        let result: SearchResult;

        for (const top of projCtx.currentAttributeStateSet.states) {
            let st: SearchStructure = new SearchStructure();
            st = SearchStructure.buildStructure(top, top, attrName, st, false, 0);
            if (st?.result.foundFlag === true && st.result.leaf.length > 0) {
                result = st.result;
            }
        }

        return result?.leaf;
    }

    /**
     * Gets the names of the top-level nodes in the projection state tree (for non-polymorphic scenarios) that match a set of attribute names
     * @internal
     */
    public static getTopList(projCtx: ProjectionContext, attrNames: string[]): Map<string, string> {
        // This dictionary contains a mapping from the top-level (most recent) name of an attribute
        // to the attribute name the top-level name was derived from (the name contained in the given list)
        const topLevelAttributeNames: Map<string, string> = new Map<string, string>();

        // Iterate through each attribute name in the list and search for their top-level names
        for (const attrName of attrNames) {
            // Iterate through each projection attribute state in the current set and check if its
            // current resolved attribute's name is the top-level name of the current attrName
            for (const top of projCtx.currentAttributeStateSet.states) {
                let st: SearchStructure = new SearchStructure();
                st = SearchStructure.buildStructure(top, top, attrName, st, false, 0);
                // Found the top-level name
                if (st?.result.foundFlag === true) {
                    // Create a mapping from the top-level name of the attribute to the name it has in the given list
                    topLevelAttributeNames.set(top.currentResolvedAttribute.resolvedName, attrName);
                }
            }
        }

        return topLevelAttributeNames;
    }

    /**
     * Convert a single value to a list
     * @internal
     */
    public static convertToList(top: ProjectionAttributeState): ProjectionAttributeState[] {
        let topList: ProjectionAttributeState[];
        if (top) {
            topList = [];
            topList.push(top);
        }

        return topList;
    }

    /**
     * Create a constant entity that contains the source mapping to a foreign key.
     * e.g.
     * an fk created to entity "Customer" based on the "customerName", would add a parameter to the "is.linkedEntity.identifier" trait as follows:
     *   [
     *     "/Customer.cdm.json/Customer",
     *     "customerName"
     *   ]
     * In the case of polymorphic source, there will be a collection of such entries.
     * @internal
     */
    public static createForeignKeyLinkedEntityIdentifierTraitParameter(projDir: ProjectionDirective, corpus: CdmCorpusDefinition, refFoundList: ProjectionAttributeState[]): CdmEntityReference {
        let traitParamEntRef: CdmEntityReference;

        const entRefAndAttrNameList: [string, string][] = [];

        for (const refFound of refFoundList) {
            const resAttr: ResolvedAttribute = refFound.currentResolvedAttribute;

            if (!resAttr.owner) {
                const atCorpusPath: string = resAttr.target instanceof CdmObjectBase ?  resAttr.target.atCorpusPath: resAttr.resolvedName;
                Logger.warning(corpus.ctx, this.TAG, this.createForeignKeyLinkedEntityIdentifierTraitParameter.name, atCorpusPath, cdmLogCode.WarnProjCreateForeignKeyTraits, resAttr.resolvedName);
            } else if ((resAttr.target as CdmObject).objectType === cdmObjectType.typeAttributeDef || (resAttr.target as CdmObject).objectType === cdmObjectType.entityAttributeDef) {
                // find the linked entity
                const owner: CdmObject = resAttr.owner;

                // find where the projection is defined
                const projectionDoc: CdmDocumentDefinition = projDir.owner !== undefined ? projDir.owner.inDocument : undefined;

                if (owner && owner.objectType === cdmObjectType.entityDef && projectionDoc) {
                    const entDef: CdmEntityDefinition = owner.fetchObjectDefinition(projDir.resOpt);
                    if (entDef) {
                        // should contain relative path without the namespace
                        const relativeEntPath: string =
                            entDef.ctx.corpus.storage.createRelativeCorpusPath(entDef.atCorpusPath, projectionDoc);
                        entRefAndAttrNameList.push([relativeEntPath, resAttr.resolvedName]);
                    }
                }
            }
        }

        if (entRefAndAttrNameList.length > 0) {
            const constantEntity: CdmConstantEntityDefinition = corpus.MakeObject(cdmObjectType.constantEntityDef);
            constantEntity.entityShape = corpus.MakeRef(cdmObjectType.entityRef, 'entitySet', true);

            const constantValues: string[][] = [];
            for (const entRefAndAttrName of entRefAndAttrNameList) {
                const originalSourceEntityAttributeName = projDir.originalSourceAttributeName || '';
                constantValues.push([entRefAndAttrName[0], entRefAndAttrName[1], `${originalSourceEntityAttributeName}_${entRefAndAttrName[0].substring(entRefAndAttrName[0].lastIndexOf('/') + 1)}`]);
            }
            constantEntity.constantValues = constantValues;

            traitParamEntRef = corpus.MakeRef(cdmObjectType.entityRef, constantEntity, false);
        }

        return traitParamEntRef;
    }
}
