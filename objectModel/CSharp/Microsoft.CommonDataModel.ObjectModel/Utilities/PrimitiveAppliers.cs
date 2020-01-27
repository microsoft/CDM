//-----------------------------------------------------------------------
// <copyright file="PrimitiveAppliers.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using System;
    using System.Collections.Generic;

    internal class PrimitiveAppliers
    {
        internal static AttributeResolutionApplier isRemoved = new AttributeResolutionApplier
        {
            MatchName = "is.removed",
            Priority = 10,
            OverridesBase = false,
            WillRemove = (ApplierContext onStep) =>
            {
                return true;
            }
        };

        internal static AttributeResolutionApplier doesReferenceEntity = new AttributeResolutionApplier
        {
            MatchName = "does.referenceEntity",
            Priority = 4,
            OverridesBase = true,
            WillRemove = (ApplierContext appCtx) =>
            {
                var visible = true;
                if (appCtx.ResAttSource != null)
                {
                    // all others go away
                    visible = false;
                    if (appCtx.ResAttSource.Target == appCtx.ResGuide.entityByReference.foreignKeyAttribute)
                        visible = true;
                }
                return false;
            },
            WillRoundAdd = (ApplierContext appCtx) =>
            {
                return true;
            },
            DoRoundAdd = (ApplierContext appCtx) =>
            {
                // get the added attribute and applied trait
                var sub = appCtx.ResGuide.entityByReference.foreignKeyAttribute as CdmAttribute;
                appCtx.ResAttNew.Target = sub;
                // use the default name.
                appCtx.ResAttNew.ResolvedName = sub.GetName();

                // add the trait that tells them what this means
                if (sub.AppliedTraits == null || sub.AppliedTraits.AllItems.Find((atr) => { return atr.FetchObjectDefinitionName() == "is.linkedEntity.identifier"; }) == null)
                {
                    sub.AppliedTraits.Add("is.linkedEntity.identifier", true);
                }

                // get the resolved traits from attribute
                appCtx.ResGuideNew = sub.ResolutionGuidance;
                appCtx.ResAttNew.ResolvedTraits = sub.FetchResolvedTraits(appCtx.ResOpt);
                if (appCtx.ResAttNew.ResolvedTraits != null)
                {
                    appCtx.ResAttNew.ResolvedTraits = appCtx.ResAttNew.ResolvedTraits.DeepCopy();
                }
            },
            WillCreateContext = (ApplierContext appCtx) =>
            {
                return true;
            },
            DoCreateContext = (ApplierContext appCtx) =>
            {
                // make a new attributeContext to differentiate this supporting att
                AttributeContextParameters acp = new AttributeContextParameters
                {
                    under = appCtx.AttCtx,
                    type = CdmAttributeContextType.AddedAttributeIdentity,
                    Name = "_foreignKey"
                };

                appCtx.AttCtx = CdmAttributeContext.CreateChildUnder(appCtx.ResOpt, acp);
            }
        };

        internal static AttributeResolutionApplier doesAddSupportingAttribute = new AttributeResolutionApplier
        {
            MatchName = "does.addSupportingAttribute",
            Priority = 8,
            OverridesBase = true,
            WillAttributeAdd = (ApplierContext appCtx) =>
            {
                return true;
            },
            DoAttributeAdd = (ApplierContext appCtx) =>
            {
                // get the added attribute and applied trait
                var sub = appCtx.ResGuide.addSupportingAttribute as CdmTypeAttributeDefinition;
                sub = (CdmTypeAttributeDefinition)sub.Copy(appCtx.ResOpt);
                // use the default name
                appCtx.ResAttNew.ResolvedName = sub.GetName();
                // add a supporting trait to this attribute
                var supTraitRef = sub.AppliedTraits.Add("is.addedInSupportOf", false);
                var supTraitDef = supTraitRef.FetchObjectDefinition<CdmTraitDefinition>(appCtx.ResOpt);

                // get the resolved traits from attribute
                appCtx.ResAttNew.ResolvedTraits = sub.FetchResolvedTraits(appCtx.ResOpt);
                // assumes some things, like the argument name. probably a dumb design, should just take the name and assume the trait too. that simplifies the source docs
                var supporting = "(unspecified)";
                if (appCtx.ResAttSource != null)
                    supporting = appCtx.ResAttSource.ResolvedName;

                appCtx.ResAttNew.ResolvedTraits = appCtx.ResAttNew.ResolvedTraits.SetTraitParameterValue(appCtx.ResOpt, supTraitDef, "inSupportOf", supporting);

                appCtx.ResAttNew.Target = sub;
                appCtx.ResGuideNew = sub.ResolutionGuidance;
            },
            WillCreateContext = (ApplierContext appCtx) =>
            {
                return true;
            },
            DoCreateContext = (ApplierContext appCtx) =>
            {
                // make a new attributeContext to differentiate this supporting att
                AttributeContextParameters acp = new AttributeContextParameters
                {
                    under = appCtx.AttCtx,
                    type = CdmAttributeContextType.AddedAttributeSupporting,
                    Name = string.Format("supporting_{0}", appCtx.ResAttSource.ResolvedName),
                    Regarding = appCtx.ResAttSource.Target as CdmAttribute
                };
                appCtx.AttCtx = CdmAttributeContext.CreateChildUnder(appCtx.ResOpt, acp);
            }
        };
        internal static AttributeResolutionApplier doesImposeDirectives = new AttributeResolutionApplier
        {
            MatchName = "does.imposeDirectives",
            Priority = 1,
            OverridesBase = true,
            WillAlterDirectives = (ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide) =>
            {
                return true;
            },
            DoAlterDirectives = (ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide) =>
            {
                List<string> allAdded = resGuide.imposedDirectives;

                if (allAdded != null && resOpt.Directives != null)
                {
                    resOpt.Directives = resOpt.Directives.Copy();
                    foreach (string d in allAdded)
                    {
                        resOpt.Directives.Add(d);
                    }
                }
            }
        };
        internal static AttributeResolutionApplier doesRemoveDirectives = new AttributeResolutionApplier
        {
            MatchName = "does.removeDirectives",
            Priority = 2,
            OverridesBase = true,
            WillAlterDirectives = (ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide) =>
            {
                return true;
            },
            DoAlterDirectives = (ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide) =>
            {
                List<string> allRemoved = resGuide.removedDirectives;

                if (allRemoved != null && resOpt.Directives != null)
                {
                    resOpt.Directives = resOpt.Directives.Copy();
                    foreach (string d in allRemoved)
                    {
                        resOpt.Directives.Delete(d);
                    }
                }
            }
        };
        internal static AttributeResolutionApplier doesSelectAttributes = new AttributeResolutionApplier
        {
            MatchName = "does.selectAttributes",
            Priority = 4,
            OverridesBase = false,
            WillAlterDirectives = (ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide) =>
            {
                string selects = resGuide.selectsSubAttribute.selects;
                return selects == "one";
            },
            DoAlterDirectives = (ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide) =>
            {
                if (resOpt.Directives != null)
                    resOpt.Directives = resOpt.Directives.Copy();
                else
                    resOpt.Directives = new AttributeResolutionDirectiveSet();
                resOpt.Directives.Add("selectOne");
            },
            WillRoundAdd = (ApplierContext appCtx) =>
            {
                AttributeResolutionDirectiveSet dir = appCtx.ResOpt.Directives;
                bool selectsOne = dir?.Has("selectOne") == true;
                bool structured = dir?.Has("structured") == true;
                if (selectsOne && !structured)
                {
                    // when one class is being pulled from a list of them
                    // add the class attribute unless this is a structured output (assumes they know the class)
                    return true;
                }
                return false;
            },
            DoRoundAdd = (ApplierContext appCtx) =>
            {
                // get the added attribute and applied trait
                var sub = appCtx.ResGuide.selectsSubAttribute.selectedTypeAttribute;
                appCtx.ResAttNew.Target = sub;
                appCtx.ResAttNew.ApplierState.Flex_remove = false;
                // use the default name.
                appCtx.ResAttNew.ResolvedName = sub.GetName();

                // add the trait that tells them what this means
                if (sub.AppliedTraits == null || sub.AppliedTraits.AllItems.Find((atr) => { return atr.FetchObjectDefinitionName() == "is.linkedEntity.name"; }) == null)
                {
                    sub.AppliedTraits.Add("is.linkedEntity.name", true);
                }

                // get the resolved traits from attribute
                appCtx.ResAttNew.ResolvedTraits = sub.FetchResolvedTraits(appCtx.ResOpt);
                appCtx.ResGuideNew = sub.ResolutionGuidance;

                // make this code create a context for any copy of this attribute that gets repeated in an array
                appCtx.ResAttNew.ApplierState.Array_specializedContext = PrimitiveAppliers.doesSelectAttributes.DoCreateContext;
            },
            WillCreateContext = (ApplierContext appCtx) =>
            {
                AttributeResolutionDirectiveSet dir = appCtx.ResOpt.Directives;
                bool selectsOne = dir?.Has("selectOne") == true;
                bool structured = dir?.Has("structured") == true;
                if (selectsOne && !structured)
                    return true;
                return false;
            },
            DoCreateContext = (ApplierContext appCtx) =>
            {
                // make a new attributeContext to differentiate this supporting att
                AttributeContextParameters acp = new AttributeContextParameters
                {
                    under = appCtx.AttCtx,
                    type = CdmAttributeContextType.AddedAttributeSelectedType,
                    Name = "_selectedEntityName"
                };
                appCtx.AttCtx = CdmAttributeContext.CreateChildUnder(appCtx.ResOpt, acp);
            }
        };
        internal static AttributeResolutionApplier doesDisambiguateNames = new AttributeResolutionApplier
        {
            MatchName = "does.disambiguateNames",
            Priority = 9,
            OverridesBase = true,
            WillAttributeModify = (ApplierContext appCtx) =>
            {
                if (appCtx.ResAttSource != null && !appCtx.ResOpt.Directives.Has("structured"))
                    return true;
                return false;
            },
            DoAttributeModify = (ApplierContext appCtx) =>
            {
                if (appCtx.ResAttSource != null)
                {
                    string format = appCtx.ResGuide.renameFormat;
                    ApplierState state = appCtx.ResAttSource.ApplierState;
                    string ordinal = state?.Flex_currentOrdinal != null ? state.Flex_currentOrdinal.ToString() : "";
                    if (string.IsNullOrEmpty(format))
                        return;
                    int formatLength = format.Length;
                    if (formatLength == 0)
                        return;
                    // parse the format looking for positions of {n} and {o} and text chunks around them
                    // there are only 5 possibilies
                    bool upper = false;
                    int iN = format.IndexOf("{a}");
                    if (iN < 0)
                    {
                        iN = format.IndexOf("{A}");
                        upper = true;
                    }
                    int iO = format.IndexOf("{o}");
                    Func<int, int, int, string, string> replace = (start, at, length, value) =>
                    {
                        if (upper && !string.IsNullOrEmpty(value))
                            value = char.ToUpper(value[0]) + (value.Length > 1 ? value.Slice(1) : "");
                        string replaced = "";
                        if (at > start)
                            replaced = format.Slice(start, at);
                        replaced += value;
                        if (at + 3 < length)
                            replaced += format.Slice(at + 3, length);
                        return replaced;
                    };
                    string result;
                    string srcName = appCtx.ResAttSource.previousResolvedName;
                    if (iN < 0 && iO < 0)
                    {
                        result = format;
                    }
                    else if (iN < 0)
                    {
                        result = replace(0, iO, formatLength, ordinal);
                    }
                    else if (iO < 0)
                    {
                        result = replace(0, iN, formatLength, srcName);
                    }
                    else if (iN < iO)
                    {
                        result = replace(0, iN, iO, srcName);
                        result += replace(iO, iO, formatLength, ordinal);
                    }
                    else
                    {
                        result = replace(0, iO, iN, ordinal);
                        result += replace(iN, iN, formatLength, srcName);
                    }
                    appCtx.ResAttSource.ResolvedName = result;
                }
            }
        };
        internal static AttributeResolutionApplier doesReferenceEntityVia = new AttributeResolutionApplier
        {
            MatchName = "does.referenceEntityVia",
            Priority = 4,
            OverridesBase = false,
            WillRemove = (ApplierContext appCtx) =>
            {
                AttributeResolutionDirectiveSet dir = appCtx.ResOpt.Directives;
                bool isNorm = dir?.Has("normalized") == true;
                bool isArray = dir?.Has("isArray") == true;
                bool isRefOnly = dir?.Has("referenceOnly") == true;
                bool alwaysAdd = appCtx.ResGuide.entityByReference.alwaysIncludeForeignKey == true;
                bool doFKOnly = isRefOnly && (isNorm == false || isArray == false);
                bool visible = true;
                if (doFKOnly && appCtx.ResAttSource != null)
                {
                    // if in reference only mode, then remove everything that isn't marked to retain
                    visible = false;
                    if (alwaysAdd || appCtx.ResAttSource.ApplierState?.Flex_remove == false)
                        visible = true;
                }
                return !visible;
            },
            WillRoundAdd = (ApplierContext appCtx) =>
            {
                AttributeResolutionDirectiveSet dir = appCtx.ResOpt.Directives;
                bool isNorm = dir?.Has("normalized") == true;
                bool isArray = dir?.Has("isArray") == true;
                bool isRefOnly = dir?.Has("referenceOnly") == true;
                bool alwaysAdd = appCtx.ResGuide.entityByReference.alwaysIncludeForeignKey == true;
                // add a foreign key and remove everything else when asked to do so.
                // however, avoid doing this for normalized arrays, since they remove all atts anyway
                bool doFKOnly = (isRefOnly || alwaysAdd) && (isNorm == false || isArray == false);
                return doFKOnly;
            },
            DoRoundAdd = (ApplierContext appCtx) =>
            {
                // get the added attribute and applied trait
                var sub = appCtx.ResGuide.entityByReference.foreignKeyAttribute as CdmAttribute;
                appCtx.ResAttNew.Target = sub;
                appCtx.ResAttNew.ApplierState.Flex_remove = false;
                // use the default name.
                appCtx.ResAttNew.ResolvedName = sub.GetName();

                // add the trait that tells them what this means
                if (sub.AppliedTraits == null || sub.AppliedTraits.AllItems.Find((atr) => { return atr.FetchObjectDefinitionName() == "is.linkedEntity.identifier"; }) == null)
                {
                    sub.AppliedTraits.Add("is.linkedEntity.identifier", true);
                }

                // get the resolved traits from attribute, make a copy to avoid conflicting on the param values
                appCtx.ResGuideNew = sub.ResolutionGuidance;
                appCtx.ResAttNew.ResolvedTraits = sub.FetchResolvedTraits(appCtx.ResOpt);
                if (appCtx.ResAttNew.ResolvedTraits != null)
                {
                    appCtx.ResAttNew.ResolvedTraits = appCtx.ResAttNew.ResolvedTraits.DeepCopy();
                }


                // make this code create a context for any copy of this attribute that gets repeated in an array
                appCtx.ResAttNew.ApplierState.Array_specializedContext = PrimitiveAppliers.doesReferenceEntityVia.DoCreateContext;
            },
            WillCreateContext = (ApplierContext appCtx) =>
            {
                AttributeResolutionDirectiveSet dir = appCtx.ResOpt.Directives;
                bool isNorm = dir?.Has("normalized") == true;
                bool isArray = dir?.Has("isArray") == true;
                bool isRefOnly = dir?.Has("referenceOnly") == true;
                bool alwaysAdd = appCtx.ResGuide.entityByReference.alwaysIncludeForeignKey == true;
                // add a foreign key and remove everything else when asked to do so.
                // however, avoid doing this for normalized arrays, since they remove all atts anyway
                bool doFKOnly = (isRefOnly || alwaysAdd) && (isNorm == false || isArray == false);
                return doFKOnly;
            },
            DoCreateContext = (ApplierContext appCtx) =>
            {
                // make a new attributeContext to differentiate this foreign key att
                AttributeContextParameters acp = new AttributeContextParameters
                {
                    under = appCtx.AttCtx,
                    type = CdmAttributeContextType.AddedAttributeIdentity,
                    Name = "_foreignKey"
                };
                appCtx.AttCtx = CdmAttributeContext.CreateChildUnder(appCtx.ResOpt, acp);
            }
        };
        internal static AttributeResolutionApplier doesExplainArray = new AttributeResolutionApplier
        {
            MatchName = "does.explainArray",
            Priority = 6,
            OverridesBase = false,
            WillGroupAdd = (ApplierContext appCtx) =>
            {
                AttributeResolutionDirectiveSet dir = appCtx.ResOpt.Directives;
                bool isNorm = dir?.Has("normalized") == true;
                bool isArray = dir?.Has("isArray") == true;
                bool isStructured = dir?.Has("structured") == true;
                // expand array and add a count if this is an array AND it isn't structured or normalized
                // structured assumes they know about the array size from the structured data format
                // normalized means that arrays of entities shouldn't be put inline, they should reference or include from the 'other' side of that 1=M relationship
                return isArray && !isNorm && !isStructured;
            },
            DoGroupAdd = (ApplierContext appCtx) =>
            {
                var sub = appCtx.ResGuide.expansion.countAttribute as CdmAttribute;
                appCtx.ResAttNew.Target = sub;
                appCtx.ResAttNew.ApplierState.Flex_remove = false;
                // use the default name.
                appCtx.ResAttNew.ResolvedName = sub.GetName();

                // add the trait that tells them what this means
                if (sub.AppliedTraits == null || sub.AppliedTraits.AllItems.Find((atr) => { return atr.FetchObjectDefinitionName() == "is.linkedEntity.array.count"; }) == null)
                    sub.AppliedTraits.Add("is.linkedEntity.array.count", true);

                // get the resolved traits from attribute
                appCtx.ResAttNew.ResolvedTraits = sub.FetchResolvedTraits(appCtx.ResOpt);
                appCtx.ResGuideNew = sub.ResolutionGuidance;
            },
            WillCreateContext = (ApplierContext appCtx) =>
            {
                return true;
            },
            DoCreateContext = (ApplierContext appCtx) =>
            {
                if (appCtx.ResAttNew != null && appCtx.ResAttNew.ApplierState != null && appCtx.ResAttNew.ApplierState.Array_specializedContext != null)
                {
                    // this attribute may have a special context that it wants, use that instead
                    appCtx.ResAttNew.ApplierState.Array_specializedContext(appCtx);
                }
                else
                {
                    CdmAttributeContextType ctxType = CdmAttributeContextType.AttributeDefinition;
                    // if this is the group add, then we are adding the counter
                    if (appCtx.State == "group")
                    {
                        ctxType = CdmAttributeContextType.AddedAttributeExpansionTotal;
                    }
                    AttributeContextParameters acp = new AttributeContextParameters
                    {
                        under = appCtx.AttCtx,
                        type = ctxType,
                    };
                    appCtx.AttCtx = CdmAttributeContext.CreateChildUnder(appCtx.ResOpt, acp);
                }
            },
            WillAttributeAdd = (ApplierContext appCtx) =>
            {
                AttributeResolutionDirectiveSet dir = appCtx.ResOpt.Directives;
                bool isNorm = dir?.Has("normalized") == true;
                bool isArray = dir?.Has("isArray") == true;
                bool isStructured = dir?.Has("structured") == true;
                return isArray && !isNorm && !isStructured;
            },
            DoAttributeAdd = (ApplierContext appCtx) =>
            {
                appCtx.Continue = false;
                if (appCtx.ResAttSource != null)
                {
                    ApplierState state = appCtx.ResAttNew.ApplierState;
                    if (state.Array_finalOrdinal == null)
                    {
                        // get the fixed size (not set means no fixed size)
                        int fixedSize = 1;
                        if (appCtx.ResGuide.expansion != null && appCtx.ResGuide.expansion.maximumExpansion != null)
                            fixedSize = (int)appCtx.ResGuide.expansion.maximumExpansion;

                        int initial = 0;
                        if (appCtx.ResGuide.expansion != null && appCtx.ResGuide.expansion.startingOrdinal != null)
                            initial = (int)appCtx.ResGuide.expansion.startingOrdinal;
                        fixedSize += initial;
                        // marks this att as the template for expansion
                        state.Array_template = appCtx.ResAttSource;
                        if (appCtx.ResAttSource.ApplierState == null)
                            appCtx.ResAttSource.ApplierState = new ApplierState();
                        appCtx.ResAttSource.ApplierState.Flex_remove = true;
                        // give back the attribute that holds the count first
                        state.Array_initialOrdinal = initial;
                        state.Array_finalOrdinal = fixedSize - 1;
                        state.Flex_currentOrdinal = initial;
                    }
                    else
                        state.Flex_currentOrdinal = state.Flex_currentOrdinal + 1;

                    if (state.Flex_currentOrdinal <= state.Array_finalOrdinal)
                    {
                        ResolvedAttribute template = state.Array_template as ResolvedAttribute;
                        appCtx.ResAttNew.Target = template.Target;
                        // copy the template
                        appCtx.ResAttNew.ResolvedName = state.Array_template.previousResolvedName;
                        appCtx.ResAttNew.ResolvedTraits = template.ResolvedTraits.DeepCopy();
                        appCtx.ResGuideNew = appCtx.ResGuide; // just take the source, because this is not a new attribute that may have different settings
                        appCtx.Continue = state.Flex_currentOrdinal < state.Array_finalOrdinal;
                    }
                }
            },
            WillAlterDirectives = (ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide) =>
            {
                if (resGuide.cardinality == "many")
                    return true;
                return false;
            },
            DoAlterDirectives = (resOpt, resTrait) =>
            {
                if (resOpt.Directives != null)
                    resOpt.Directives = resOpt.Directives.Copy();
                else
                    resOpt.Directives = new AttributeResolutionDirectiveSet();
                resOpt.Directives.Add("isArray");
            },
            WillRemove = (ApplierContext appCtx) =>
            {
                AttributeResolutionDirectiveSet dir = appCtx.ResOpt.Directives;
                bool isNorm = dir?.Has("normalized") == true;
                bool isArray = dir?.Has("isArray") == true;

                // remove the 'template' attributes that got copied on expansion if they come here
                // also, normalized means that arrays of entities shouldn't be put inline
                // only remove the template attributes that seeded the array expansion
                bool isTemplate = appCtx.ResAttSource.ApplierState?.Flex_remove == true;
                return isArray && (isTemplate || isNorm);
            }
        };
    }
}
