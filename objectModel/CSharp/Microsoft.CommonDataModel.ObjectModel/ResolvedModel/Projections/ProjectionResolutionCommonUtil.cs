// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// A utility class to handle name based functionality for projections and operations
    /// </summary>
    internal sealed class ProjectionResolutionCommonUtil
    {
        /// <summary>
        /// Function to initialize the input projection attribute state Set for a projection
        /// </summary>
        /// <param name="projDir"></param>
        /// <param name="ctx"></param>
        /// <param name="orgSrcRAS"></param>
        /// <param name="isSourcePolymorphic"></param>
        /// <param name="polymorphicSet"></param>
        /// <returns></returns>
        internal static ProjectionAttributeStateSet InitializeProjectionAttributeStateSet(
            ProjectionDirective projDir,
            CdmCorpusContext ctx,
            ResolvedAttributeSet orgSrcRAS,
            bool isSourcePolymorphic = false,
            Dictionary<string, List<ProjectionAttributeState>> polymorphicSet = null)
        {
            ProjectionAttributeStateSet set = new ProjectionAttributeStateSet(ctx);

            foreach (ResolvedAttribute resAttr in orgSrcRAS.Set)
            {
                List<ProjectionAttributeState> prevSet = null;
                if (isSourcePolymorphic && polymorphicSet != null)
                {
                    polymorphicSet.TryGetValue(resAttr.ResolvedName, out prevSet);
                }

                ProjectionAttributeState projAttrState = new ProjectionAttributeState(ctx)
                {
                    CurrentResolvedAttribute = resAttr,
                    PreviousStateList = prevSet
                };
                set.Add(projAttrState);
            }

            return set;
        }

        /// <summary>
        /// If a source is tagged as polymorphic source, get the list of original source
        /// </summary>
        /// <param name="projDir"></param>
        /// <param name="ctx"></param>
        /// <param name="source"></param>
        /// <param name="attrCtxParam"></param>
        /// <returns></returns>
        internal static Dictionary<string, List<ProjectionAttributeState>> GetPolymorphicSourceSet(
            ProjectionDirective projDir,
            CdmCorpusContext ctx,
            CdmEntityReference source,
            ResolvedAttributeSet rasSource,
            AttributeContextParameters attrCtxParam)
        {
            Dictionary<string, List<ProjectionAttributeState>> polySources = new Dictionary<string, List<ProjectionAttributeState>>();

            // TODO (sukanyas): when projection based polymorphic source is made available - the following line will have to be changed
            // for now assuming non-projections based polymorphic source
            CdmEntityDefinition sourceDef = source.FetchObjectDefinition<CdmEntityDefinition>(projDir.ResOpt);
            foreach (CdmAttributeItem attr in sourceDef.Attributes)
            {
                if (attr.ObjectType == CdmObjectType.EntityAttributeDef)
                {
                    ResolvedAttributeSet raSet = ((CdmEntityAttributeDefinition)attr).FetchResolvedAttributes(projDir.ResOpt, null);
                    foreach (ResolvedAttribute resAttr in raSet.Set)
                    {
                        // we got a null ctx because null was passed in to fetch, but the nodes are in the parent's tree
                        // so steal them based on name
                        var resAttSrc = rasSource.Get(resAttr.ResolvedName);
                        if (resAttSrc != null)
                        {
                            resAttr.AttCtx = resAttSrc.AttCtx;
                        }

                        ProjectionAttributeState projAttrState = new ProjectionAttributeState(ctx)
                        {
                            CurrentResolvedAttribute = resAttr,
                            PreviousStateList = null
                        };

                        // the key already exists, just add to the existing list
                        if (polySources.ContainsKey(resAttr.ResolvedName))
                        {
                            List<ProjectionAttributeState> exisitingSet = polySources[resAttr.ResolvedName];
                            exisitingSet.Add(projAttrState);
                            polySources[resAttr.ResolvedName] = exisitingSet;
                        }
                        else
                        {
                            List<ProjectionAttributeState> pasList = new List<ProjectionAttributeState>();
                            pasList.Add(projAttrState);
                            polySources.Add(resAttr.ResolvedName, pasList);
                        }
                    }
                }
            }

            return polySources;
        }

        /// <summary>
        /// Get leaf nodes of the projection state tree for polymorphic scenarios
        /// </summary>
        /// <param name="projCtx"></param>
        /// <param name="attrName"></param>
        /// <returns></returns>
        internal static List<ProjectionAttributeState> GetLeafList(ProjectionContext projCtx, string attrName)
        {
            SearchResult result = null;

            foreach (ProjectionAttributeState top in projCtx.CurrentAttributeStateSet.States)
            {
                SearchStructure st = new SearchStructure();
                st = SearchStructure.BuildStructure(top, top, attrName, st, false, 0);
                if (st?.Result.FoundFlag == true && st.Result.Leaf.Count > 0)
                {
                    result = st.Result;
                }
            }
            return result?.Leaf;
        }

        /// <summary>
        /// Gets the names of the top-level nodes in the projection state tree (for non-polymorphic scenarios) that match a set of attribute names 
        /// </summary>
        /// <param name="projCtx">The projection context.</param>
        /// <param name="attrNames">The list of attribute names to match from.</param>
        internal static Dictionary<string, string> GetTopList(ProjectionContext projCtx, List<string> attrNames)
        {
            // This dictionary contains a mapping from the top-level (most recent) name of an attribute 
            // to the attribute name the top-level name was derived from (the name contained in the given list)
            Dictionary<string, string> topLevelAttributeNames = new Dictionary<string, string>();

            // Iterate through each attribute name in the list and search for their top-level names
            foreach (string attrName in attrNames)
            {
                // Iterate through each projection attribute state in the current set and check if its
                // current resolved attribute's name is the top-level name of the current attrName
                foreach (ProjectionAttributeState top in projCtx.CurrentAttributeStateSet.States)
                {
                    SearchStructure st = new SearchStructure();
                    st = SearchStructure.BuildStructure(top, top, attrName, st, false, 0);
                    // Found the top-level name
                    if (st?.Result.FoundFlag == true)
                    {
                        // Create a mapping from the top-level name of the attribute to the name it has in the given list
                        topLevelAttributeNames[top.CurrentResolvedAttribute.ResolvedName] = attrName;
                    }
                }
            }
            return topLevelAttributeNames;
        }

        /// <summary>
        /// Convert a single value to a list
        /// </summary>
        /// <param name="top"></param>
        /// <returns></returns>
        internal static List<ProjectionAttributeState> ConvertToList(ProjectionAttributeState top)
        {
            List<ProjectionAttributeState> topList = null;
            if (top != null)
            {
                topList = new List<ProjectionAttributeState>();
                topList.Add(top);
            }
            return topList;
        }

        /// <summary>
        /// Create a constant entity that contains the source mapping to a foreign key.
        /// e.g.
        /// an fk created to entity "Customer" based on the "customerName", would add a parameter to the "is.linkedEntity.identifier" trait as follows:
        ///   [
        ///     "/Customer.cdm.json/Customer",
        ///     "customerName"
        ///   ]
        /// In the case of polymorphic source, there will be a collection of such entries.
        /// </summary>
        /// <param name="corpus"></param>
        /// <param name="foundResAttrList"></param>
        /// <returns></returns>
        internal static CdmEntityReference CreateForeignKeyLinkedEntityIdentifierTraitParameter(ProjectionDirective projDir, CdmCorpusDefinition corpus, List<ProjectionAttributeState> refFoundList)
        {
            CdmEntityReference traitParamEntRef = null;

            List<Tuple<string, string>> entRefAndAttrNameList = new List<Tuple<string, string>>();

            foreach (ProjectionAttributeState refFound in refFoundList)
            {
                ResolvedAttribute resAttr = refFound.CurrentResolvedAttribute;

                if (resAttr?.Target?.Owner != null &&
                    (resAttr.Target.ObjectType == CdmObjectType.TypeAttributeDef || resAttr.Target.ObjectType == CdmObjectType.EntityAttributeDef))
                {
                    // find the linked entity
                    var owner = resAttr.Target.Owner;

                    while (owner != null && owner.ObjectType != CdmObjectType.EntityDef)
                    {
                        owner = owner.Owner;
                    }

                    // find where the projection is defined
                    var projectionDoc = projDir.Owner?.InDocument;

                    if (owner?.ObjectType == CdmObjectType.EntityDef && projectionDoc != null)
                    {
                        CdmEntityDefinition entDef = owner.FetchObjectDefinition<CdmEntityDefinition>(projDir.ResOpt);
                        if (entDef != null)
                        {
                            // should contain relative path without the namespace
                            string relativeEntPath = entDef.Ctx.Corpus.Storage.CreateRelativeCorpusPath(entDef.AtCorpusPath, projectionDoc);
                            entRefAndAttrNameList.Add(new Tuple<string, string>(relativeEntPath, resAttr.ResolvedName));
                        }
                    }
                }
            }

            if (entRefAndAttrNameList.Count > 0)
            {
                CdmConstantEntityDefinition constantEntity = corpus.MakeObject<CdmConstantEntityDefinition>(CdmObjectType.ConstantEntityDef);
                constantEntity.EntityShape = corpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, "entityGroupSet", true);
                string originalSourceEntityAttributeName = projDir.OriginalSourceEntityAttributeName;
                if (originalSourceEntityAttributeName == null)
                {
                    originalSourceEntityAttributeName = "";
                }

                constantEntity.ConstantValues = entRefAndAttrNameList.Select((entAndAttrName) => new List<string> { entAndAttrName.Item1, entAndAttrName.Item2, $"{originalSourceEntityAttributeName}_{entAndAttrName.Item1.Substring(entAndAttrName.Item1.LastIndexOf("/") + 1)}" }).ToList();

                traitParamEntRef = corpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, constantEntity, false);
            }

            return traitParamEntRef;
        }
    }
}
