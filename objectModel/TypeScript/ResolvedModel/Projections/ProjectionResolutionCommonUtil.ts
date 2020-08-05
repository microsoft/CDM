// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmConstantEntityDefinition,
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmObject,
    cdmObjectType,
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
        attrCtxParam: AttributeContextParameters
    ): Map<string, ProjectionAttributeState[]> {
        const polySources: Map<string, ProjectionAttributeState[]> = new Map<string, ProjectionAttributeState[]>();

        // TODO (sukanyas): when projection based polymorphic source is made available - the following line will have to be changed
        // for now assuming non-projections based polymorphic source
        const sourceDef: CdmEntityDefinition = source.fetchObjectDefinition(projDir.resOpt);
        for (const attr of sourceDef.attributes) {
            if (attr.objectType === cdmObjectType.entityAttributeDef) {
                const raSet: ResolvedAttributeSet = (attr as CdmEntityAttributeDefinition).fetchResolvedAttributes(projDir.resOpt);
                for (const resAttr of raSet.set) {
                    const projAttrState: ProjectionAttributeState = new ProjectionAttributeState(ctx)
                    projAttrState.currentResolvedAttribute = resAttr;
                    projAttrState.previousStateList = undefined;

                    // the key already exists, just add to the existing list
                    if (polySources.has(resAttr.resolvedName)) {
                        const existingSet: ProjectionAttributeState[] = polySources.get(resAttr.resolvedName);
                        existingSet.push(projAttrState);
                        polySources.set(resAttr.resolvedName, existingSet);
                    } else {
                        const pasList: ProjectionAttributeState[] = [];
                        pasList.push(projAttrState);
                        polySources.set(resAttr.resolvedName, pasList);
                    }
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

        for (const top of projCtx.currentAttributeStateSet.values) {
            let st: SearchStructure = new SearchStructure();
            st = SearchStructure.buildStructure(top, top, attrName, st, false, 0);
            if (st?.result.foundFlag === true && st.result.leaf.length > 0) {
                result = st.result;
            }
        }

        return result?.leaf;
    }

    /**
     * Get top node of the projection state tree for non-polymorphic scenarios
     * @internal
     */
    public static getTop(projCtx: ProjectionContext, attrName: string): ProjectionAttributeState[] {
        let result: SearchResult = new SearchResult();
        for (const top of projCtx.currentAttributeStateSet.values) {
            let st: SearchStructure = new SearchStructure();
            st = SearchStructure.buildStructure(top, top, attrName, st, false, 0);
            if (st?.result.foundFlag === true) {
                result = st.result;
            }
        }

        return result?.top;
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

            if ((resAttr?.target as CdmObject)?.owner &&
                ((resAttr.target as CdmObject).objectType === cdmObjectType.typeAttributeDef || (resAttr.target as CdmObject).objectType === cdmObjectType.entityAttributeDef)) {
                let owner: CdmObject = (resAttr.target as CdmObject).owner;

                while (owner && owner.objectType !== cdmObjectType.entityDef) {
                    owner = owner.owner;
                }

                if (owner && owner.objectType === cdmObjectType.entityDef) {
                    const entDef: CdmEntityDefinition = owner.fetchObjectDefinition(projDir.resOpt);
                    if (entDef) {
                        // should contain relative path without the namespace
                        const relativeEntPath: string = entDef.ctx.corpus.storage.createRelativeCorpusPath(entDef.atCorpusPath, entDef.inDocument);
                        entRefAndAttrNameList.push([relativeEntPath, resAttr.resolvedName]);
                    }
                }
            }
        }

        if (entRefAndAttrNameList.length > 0) {
            const constantEntity: CdmConstantEntityDefinition = corpus.MakeObject(cdmObjectType.constantEntityDef);
            constantEntity.entityShape = corpus.MakeRef(cdmObjectType.entityRef, 'entityGroupSet', true);

            const constantValues: string[][] = [];
            for (const entRefAndAttrName of entRefAndAttrNameList) {
                const originalSourceEntityAttributeName = projDir.originalSourceEntityAttributeName || '';
                constantValues.push([entRefAndAttrName[0], entRefAndAttrName[1], `${originalSourceEntityAttributeName}_${entRefAndAttrName[0].substring(entRefAndAttrName[0].lastIndexOf('/') + 1)}`]);
            }
            constantEntity.constantValues = constantValues;

            traitParamEntRef = corpus.MakeRef(cdmObjectType.entityRef, constantEntity, false);
        }

        return traitParamEntRef;
    }
}
