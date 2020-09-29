// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;

import java.util.*;

/**
 * A utility class to handle name based functionality for projections and operations
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public final class ProjectionResolutionCommonUtil {
    /**
     * Function to initialize the input projection attribute state Set for a projection
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param projDir ProjectionDirective
     * @param ctx CdmCorpusContext 
     * @param orgSrcRAS ResolvedAttributeSet 
     * @return ProjectionAttributeStateSet
     */
    @Deprecated
    public static ProjectionAttributeStateSet initializeProjectionAttributeStateSet(ProjectionDirective projDir, CdmCorpusContext ctx, ResolvedAttributeSet orgSrcRAS) {
        return initializeProjectionAttributeStateSet(projDir, ctx, orgSrcRAS, false);
    }

    /**
     * Function to initialize the input projection attribute state Set for a projection
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param projDir ProjectionDirective
     * @param ctx CdmCorpusContext 
     * @param orgSrcRAS ResolvedAttributeSet 
     * @param isSourcePolymorphic boolean 
     * @return ProjectionAttributeStateSet
     */
    @Deprecated
    public static ProjectionAttributeStateSet initializeProjectionAttributeStateSet(
        ProjectionDirective projDir,
        CdmCorpusContext ctx,
        ResolvedAttributeSet orgSrcRAS,
        boolean isSourcePolymorphic) {
        return initializeProjectionAttributeStateSet(projDir, ctx, orgSrcRAS, isSourcePolymorphic, null);
    }
    /**
     * Function to initialize the input projection attribute state Set for a projection
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param projDir ProjectionDirective
     * @param ctx CdmCorpusContext 
     * @param orgSrcRAS ResolvedAttributeSet 
     * @param isSourcePolymorphic boolean 
     * @param polymorphicSet Map of String and List of ProjectionAttributeState 
     * @return ProjectionAttributeStateSet
     */
    @Deprecated
    public static ProjectionAttributeStateSet initializeProjectionAttributeStateSet(
        ProjectionDirective projDir,
        CdmCorpusContext ctx,
        ResolvedAttributeSet orgSrcRAS,
        boolean isSourcePolymorphic,
        Map<String, List<ProjectionAttributeState>> polymorphicSet) {
        ProjectionAttributeStateSet set = new ProjectionAttributeStateSet(ctx);

        for (ResolvedAttribute resAttr : orgSrcRAS.getSet()) {
            List<ProjectionAttributeState> prevSet = null;
            if (isSourcePolymorphic && polymorphicSet != null) {
                List<ProjectionAttributeState> polyList = polymorphicSet.get(resAttr.getResolvedName());
                prevSet = polyList;
            }

            ProjectionAttributeState projAttrState = new ProjectionAttributeState(ctx);
            projAttrState.setCurrentResolvedAttribute(resAttr);
            projAttrState.setPreviousStateList(prevSet);
            set.add(projAttrState);
        }

        return set;
    }

    /**
     * If a source is tagged as polymorphic source, get the list of original source
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param projDir ProjectionDirective
     * @param ctx CdmCorpusContext 
     * @param source CdmEntityReference 
     * @param attrCtxParam AttributeContextParameters  
     * @return Map of String and List of ProjectionAttributeState
     */
    @Deprecated
    public static Map<String, List<ProjectionAttributeState>> getPolymorphicSourceSet(
        ProjectionDirective projDir,
        CdmCorpusContext ctx,
        CdmEntityReference source,
        AttributeContextParameters attrCtxParam) {
        Map<String, List<ProjectionAttributeState>> polySources = new HashMap<>();

        // TODO (sukanyas): when projection based polymorphic source is made available - the following line will have to be changed
        // for now assuming non-projections based polymorphic source
        CdmEntityDefinition sourceDef = source.fetchObjectDefinition(projDir.getResOpt());
        for (CdmAttributeItem attr : sourceDef.getAttributes()) {
            if (attr.getObjectType() == CdmObjectType.EntityAttributeDef) {
                ResolvedAttributeSet raSet = ((CdmEntityAttributeDefinition) attr).fetchResolvedAttributes(projDir.getResOpt(), null);
                for (ResolvedAttribute resAttr : raSet.getSet()) {
                    ProjectionAttributeState projAttrState = new ProjectionAttributeState(ctx);
                    projAttrState.setCurrentResolvedAttribute(resAttr);
                    projAttrState.setPreviousStateList(null);

                    // the key already exists, just add to the existing list
                    if (polySources.containsKey(resAttr.getResolvedName())) {
                        List<ProjectionAttributeState> existingSet = polySources.get(resAttr.getResolvedName());
                        existingSet.add(projAttrState);
                        polySources.put(resAttr.getResolvedName(), existingSet);
                    } else {
                        List<ProjectionAttributeState> pasList = new ArrayList<>();
                        pasList.add(projAttrState);
                        polySources.put(resAttr.getResolvedName(), pasList);
                    }
                }
            }
        }

        return polySources;
    }

    /**
     * Get leaf nodes of the projection state tree for polymorphic scenarios
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param projCtx ProjectionContext
     * @param attrName String
     * @return List of ProjectionAttributeState
     */
    @Deprecated
    public static List<ProjectionAttributeState> getLeafList(ProjectionContext projCtx, String attrName) {
        SearchResult result = null;

        for (ProjectionAttributeState top : projCtx.getCurrentAttributeStateSet().getStates()) {
            SearchStructure st = new SearchStructure();
            st = SearchStructure.buildStructure(top, top, attrName, st, false, 0);
            if (st != null && st.getResult().getFoundFlag() == true && st.getResult().getLeaf().size() > 0) {
                result = st.getResult();
            }
        }
        return result != null ? result.getLeaf() : null;
    }

    /**
     * Gets the names of the top-level nodes in the projection state tree (for non-polymorphic scenarios) that match a set of attribute names
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param projCtx ProjectionContext
     * @param attrNames List of String
     * @return List of ProjectionAttributeState
     */
    @Deprecated
    public static Map<String, String> getTopList(ProjectionContext projCtx, List<String> attrNames) {
        // This dictionary contains a mapping from the top-level name of an attribute
        // to the attribute name the top-level name was derived from (the name contained in the given list)
        Map<String, String> topLevelAttributeNames = new HashMap<>();

        // Iterate through each attribute name in the list and search for their top-level names
        for (String attrName : attrNames) {
            // Iterate through each projection attribute state in the current set and check if its
            // current resolved attribute's name is the top-level name of the current attrName
            for (ProjectionAttributeState top : projCtx.getCurrentAttributeStateSet().getStates()) {
                SearchStructure st = new SearchStructure();
                st = SearchStructure.buildStructure(top, top, attrName, st, false, 0);
                // Found the top-level name
                if (st != null && st.getResult().getFoundFlag() == true) {
                    // Create a mapping from the top-level name of the attribute to the name it has in the list
                    topLevelAttributeNames.put(top.getCurrentResolvedAttribute().getResolvedName(), attrName);
                }
            }
        }
        return topLevelAttributeNames;
    }

    /**
     * Convert a single value to a list
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param top ProjectionAttributeState
     * @return List of ProjectionAttributeState
     */
    @Deprecated
    public static List<ProjectionAttributeState> convertToList(ProjectionAttributeState top) {
        List<ProjectionAttributeState> topList = null;
        if (top != null) {
            topList = new ArrayList<>();
            topList.add(top);
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
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param projDir ProjectionDirective
     * @param corpus CdmCorpusDefinition
     * @param refFoundList Listof ProjectionAttributeState
     * @return CdmEntityReference
     */
    @Deprecated
    public static CdmEntityReference createForeignKeyLinkedEntityIdentifierTraitParameter(ProjectionDirective projDir, CdmCorpusDefinition corpus, List<ProjectionAttributeState> refFoundList) {
        CdmEntityReference traitParamEntRef = null;

        List<List<String>> entRefAndAttrNameList = new ArrayList<>();

        for (ProjectionAttributeState refFound : refFoundList) {
            ResolvedAttribute resAttr = refFound.getCurrentResolvedAttribute();

            if (resAttr != null && resAttr.getTarget() != null && ((CdmObject) resAttr.getTarget()).getOwner() != null &&
                (((CdmObject) resAttr.getTarget()).getObjectType() == CdmObjectType.TypeAttributeDef || ((CdmObject) resAttr.getTarget()).getObjectType() == CdmObjectType.EntityAttributeDef)) {
                CdmObject owner = ((CdmObject) resAttr.getTarget()).getOwner();

                while (owner != null && owner.getObjectType() != CdmObjectType.EntityDef) {
                    owner = owner.getOwner();
                }

                if (owner != null && owner.getObjectType() == CdmObjectType.EntityDef) {
                    CdmEntityDefinition entDef = owner.fetchObjectDefinition(projDir.getResOpt());
                    if (entDef != null) {
                        // should contain relative path without the namespace
                        String relativeEntPath = entDef.getCtx().getCorpus().getStorage().createRelativeCorpusPath(entDef.getAtCorpusPath(), entDef.getInDocument());
                        entRefAndAttrNameList.add(new ArrayList<>(Arrays.asList(relativeEntPath, resAttr.getResolvedName())));
                    }
                }
            }
        }

        if (entRefAndAttrNameList.size() > 0) {
            CdmConstantEntityDefinition constantEntity = corpus.makeObject(CdmObjectType.ConstantEntityDef);
            constantEntity.setEntityShape(corpus.makeRef(CdmObjectType.EntityRef, "entityGroupSet", true));

            List<List<String>> constantValues = new ArrayList<>();
            for (List<String> entAndAttrName : entRefAndAttrNameList) {
                String originalSourceEntityAttributeName = projDir.getOriginalSourceEntityAttributeName();
                if (originalSourceEntityAttributeName == null) {
                    originalSourceEntityAttributeName = "";
                }
                constantValues.add(new ArrayList<>(Arrays.asList(entAndAttrName.get(0), entAndAttrName.get(1), originalSourceEntityAttributeName + "_" + entAndAttrName.get(0).substring(entAndAttrName.get(0).lastIndexOf("/") + 1))));
            }
            constantEntity.setConstantValues(constantValues);

            traitParamEntRef = corpus.makeRef(CdmObjectType.EntityRef, constantEntity, false);
        }

        return traitParamEntRef;
    }
}
