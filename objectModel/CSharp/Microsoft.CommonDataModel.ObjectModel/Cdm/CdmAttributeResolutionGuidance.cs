// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;

    public class CdmAttributeResolutionGuidance : CdmObjectSimple
    {
        /// <summary>
        /// If true, this attribute definition will be removed from the entity's final resolved attribute list.
        /// </summary>
        public bool? removeAttribute { get; set; }

        /// <summary>
        /// A list of strings, one for each 'directive' that should be always imposed at this attribute definition.
        /// </summary>
        public List<string> imposedDirectives { get; set; }

        /// <summary>
        /// A list of strings, one for each 'directive' that should be removed if previously imposed.
        /// </summary>
        public List<string> removedDirectives { get; set; }

        /// <summary>
        /// A guidance that this attribute definition should be added to the final set of attributes and should be marked as 'supporting' the attribute that has the guidance set on it.
        /// </summary>
        public CdmTypeAttributeDefinition addSupportingAttribute { get; set; }

        /// <summary>
        /// If 'one', then there is a single instance of the attribute or entity used. If 'many', there are multiple instances used, in which case the 'expansion' properties will describe array enumeration to use when needed.
        /// </summary>
        public string cardinality { get; set; }

        /// <summary>
        /// Format specifier for generated attribute names. May contain a single occurence of ('{a} or 'A'), ('{m}' or '{M}'), and '{o}', for the base (a/A)ttribute name, any (m/M)ember attributes from entities and array (o)rdinal. examples: '{a}{o}.{m}' could produce 'address2.city', '{a}{o}' gives 'city1'. Using '{A}' or '{M}' will uppercase the first letter of the name portions.
        /// </summary>
        public string renameFormat { get; set; }

        /// <summary>
        /// Parameters that control array expansion if inline repeating of attributes is needed.
        /// </summary>
        public class Expansion
        {
            /// <summary>
            /// The index to start counting from when an array is being expanded for a repeating set of attributes. 
            /// </summary>
            public int? startingOrdinal { get; set; }

            /// <summary>
            /// The maximum number of times that the attribute pattern should be repeated.
            /// </summary>
            public int? maximumExpansion { get; set; }

            /// <summary>
            /// The supplied attribute definition will be added to the Entity to represent the total number of instances found in the data.
            /// </summary>
            public CdmTypeAttributeDefinition countAttribute { get; set; }
        }
        public Expansion expansion { get; set; }
        public Expansion makeExpansion()
        {
            return new Expansion();
        }

        /// <summary>
        /// Parameters that control the use of foreign keys to reference entity instances instead of embedding the entity in a nested way.
        /// </summary>
        public class CdmAttributeResolutionGuidance_EntityByReference
        {
            /// <summary>
            /// Whether a reference to an entity is allowed through the use of a foreign key to the entity.
            /// </summary>
            public bool? allowReference { get; set; }

            /// <summary>
            /// If true, a foreign key attribute will be added to the entity even when the entity attribute is embedded in a nested way.
            /// </summary>
            public bool? alwaysIncludeForeignKey { get; set; }

            /// <summary>
            /// After a given depth of non-reference nesting using entity attributes, the 'referenceOnly' directive will be imposed.
            /// </summary>
            public int? referenceOnlyAfterDepth { get; set; }

            /// <summary>
            /// The supplied attribute definition will be added to the Entity to hold a foreign key value for the referenced entity.
            /// </summary>
            public CdmTypeAttributeDefinition foreignKeyAttribute { get; set; }
        }
        public CdmAttributeResolutionGuidance_EntityByReference entityByReference { get; set; }
        public CdmAttributeResolutionGuidance_EntityByReference makeEntityByReference()
        {
            return new CdmAttributeResolutionGuidance_EntityByReference();
        }

        /// <summary>
        /// Used to indicate that this attribute select either 'one' or 'all' of the sub-attributes from an entity. If the 'structured' directive is set, this trait causes resolved attributes to end up in groups rather than a flattend list.
        /// </summary>
        public class CdmAttributeResolutionGuidance_SelectsSubAttribute
        {
            /// <summary>
            /// Used to indicate either 'one' or 'all' sub-attributes selected. 
            /// </summary>
            public string selects { get; set; }

            /// <summary>
            /// The supplied attribute definition will be added to the Entity to hold a description of the single attribute that was selected from the sub-entity when selects is 'one'
            /// </summary>
            public CdmTypeAttributeDefinition selectedTypeAttribute { get; set; }

            /// <summary>
            /// The list of sub-attributes from an entity that should be added.
            /// </summary>
            public List<string> selectsSomeTakeNames { get; set; }

            /// <summary>
            /// The list of sub-attributes from an entity that should not be added.
            /// </summary>
            public List<string> selectsSomeAvoidNames { get; set; }
        }
        public CdmAttributeResolutionGuidance_SelectsSubAttribute selectsSubAttribute { get; set; }
        public CdmAttributeResolutionGuidance_SelectsSubAttribute makeSelectsSubAttribute()
        {
            return new CdmAttributeResolutionGuidance_SelectsSubAttribute();
        }

        // object implemention requirements
        public CdmAttributeResolutionGuidance(CdmCorpusContext ctx)
            : base(ctx)
        {
            this.ObjectType = CdmObjectType.AttributeResolutionGuidanceDef;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.AttributeResolutionGuidanceDef;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmAttributeResolutionGuidance copy;
            if (host == null)
            {
                copy = new CdmAttributeResolutionGuidance(this.Ctx);
            }
            else
            {
                copy = host as CdmAttributeResolutionGuidance;
                copy.Ctx = this.Ctx;
                copy.expansion = null;
                copy.entityByReference = null;
                copy.selectsSubAttribute = null;
            }

            copy.removeAttribute = this.removeAttribute;
            if (this.imposedDirectives != null)
            {
                copy.imposedDirectives = new List<string>(this.imposedDirectives);
            }

            if (this.removedDirectives != null)
            {
                copy.removedDirectives = new List<string>(this.removedDirectives);
            }

            copy.addSupportingAttribute = this.addSupportingAttribute;
            copy.cardinality = this.cardinality;
            copy.renameFormat = this.renameFormat;

            if (this.expansion != null)
            {
                copy.expansion = new Expansion()
                {
                    startingOrdinal = this.expansion.startingOrdinal,
                    maximumExpansion = this.expansion.maximumExpansion,
                    countAttribute = this.expansion.countAttribute
                };
            }
            if (this.entityByReference != null)
            {
                copy.entityByReference = new CdmAttributeResolutionGuidance_EntityByReference()
                {
                    alwaysIncludeForeignKey = this.entityByReference.alwaysIncludeForeignKey,
                    referenceOnlyAfterDepth = this.entityByReference.referenceOnlyAfterDepth,
                    allowReference = this.entityByReference.allowReference,
                    foreignKeyAttribute = this.entityByReference.foreignKeyAttribute
                };
            }
            if (this.selectsSubAttribute != null)
            {
                copy.selectsSubAttribute = new CdmAttributeResolutionGuidance_SelectsSubAttribute()
                {
                    selects = this.selectsSubAttribute.selects,
                    selectedTypeAttribute = this.selectsSubAttribute.selectedTypeAttribute,
                    selectsSomeTakeNames = this.selectsSubAttribute.selectsSomeTakeNames,
                    selectsSomeAvoidNames = this.selectsSubAttribute.selectsSomeAvoidNames
                };
            }
            return copy;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmAttributeResolutionGuidance>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            return true;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            if (preChildren != null && preChildren.Invoke(this, pathFrom))
                return false;

            if (this.addSupportingAttribute != null)
            {
                if (this.addSupportingAttribute.Visit(pathFrom + "addSupportingAttribute/", preChildren, postChildren))
                {
                    return true;
                }
            }
            if (this.expansion != null && this.expansion.countAttribute != null)
            {
                if (this.expansion.countAttribute.Visit(pathFrom + "countAttribute/", preChildren, postChildren))
                {
                    return true;
                }
            }
            if (this.entityByReference != null && this.entityByReference.foreignKeyAttribute != null)
            {
                if (this.entityByReference.foreignKeyAttribute.Visit(pathFrom + "foreignKeyAttribute/", preChildren, postChildren))
                {
                    return true;
                }
            }
            if (this.selectsSubAttribute != null && this.selectsSubAttribute.selectedTypeAttribute != null)
            {
                if (this.selectsSubAttribute.selectedTypeAttribute.Visit(pathFrom + "selectedTypeAttribute/", preChildren, postChildren))
                {
                    return true;
                }
            }
            if (postChildren != null && postChildren.Invoke(this, pathFrom))
                return true;
            return false;
        }

        internal void UpdateAttributeDefaults(string attName, CdmObject owner)
        {
            // handle the cardinality and expansion group.
            // default is one, but if there is some hint of an array, make it work
            if (this.cardinality == null)
            {
                if (this.expansion != null)
                    this.cardinality = "many";
                else
                    this.cardinality = "one";
            }
            if (this.cardinality == "many" && this.expansion == null)
                this.expansion = new Expansion();
            if (this.cardinality == "many" && this.expansion != null)
            {
                if (this.expansion.startingOrdinal == null)
                    this.expansion.startingOrdinal = 0;
                if (this.expansion.maximumExpansion == null)
                    this.expansion.maximumExpansion = 5;
                if (this.expansion.countAttribute == null)
                {
                    this.expansion.countAttribute = this.Ctx.Corpus.FetchArtifactAttribute("count");
                    this.expansion.countAttribute.Owner = owner;
                    this.expansion.countAttribute.InDocument = owner.InDocument;
                }
            }
            // entity by ref. anything mentioned?
            if (this.entityByReference != null)
            {
                if (this.entityByReference.allowReference == null)
                    this.entityByReference.allowReference = true;
                if (this.entityByReference.allowReference == true)
                {
                    if (this.entityByReference.alwaysIncludeForeignKey == null)
                        this.entityByReference.alwaysIncludeForeignKey = false;
                    if (this.entityByReference.foreignKeyAttribute == null)
                    {
                        // make up a fk
                        this.entityByReference.foreignKeyAttribute = this.Ctx.Corpus.FetchArtifactAttribute("id");
                        this.entityByReference.foreignKeyAttribute.Owner = owner;
                        this.entityByReference.foreignKeyAttribute.InDocument = owner.InDocument;
                    }
                }
            }
            // selects one>
            if (this.selectsSubAttribute != null)
            {
                if (this.selectsSubAttribute.selects == null)
                    this.selectsSubAttribute.selects = "one";
                if (this.selectsSubAttribute.selects == "one")
                {
                    if (this.selectsSubAttribute.selectedTypeAttribute == null)
                    {
                        // make up a type indicator
                        this.selectsSubAttribute.selectedTypeAttribute = this.Ctx.Corpus.FetchArtifactAttribute("type");
                        this.selectsSubAttribute.selectedTypeAttribute.Owner = owner;
                        this.selectsSubAttribute.selectedTypeAttribute.InDocument = owner.InDocument;
                    }
                }
            }

            // only set a rename format if one is needed for arrays or added atts 
            if (this.renameFormat == null)
            {
                if (attName == null)
                {
                    // a type attribute, so no nesting
                    if (this.cardinality == "many")
                        this.renameFormat = "{a}{o}";
                }
                else
                {
                    if (this.cardinality == "many")
                        this.renameFormat = "{a}{o}{M}";
                    else
                        this.renameFormat = "{a}{M}";
                }
            }

            if (this.renameFormat != null)
            {
                // rename format is a lie. actually only supports sub-attribute name and ordinal as 'a' and 'o'
                if (attName != null)
                {
                    // replace the use of {a or A} with the outer attributeName
                    bool upper = false;
                    int iA = this.renameFormat.IndexOf("{a}");
                    if (iA < 0)
                    {
                        iA = this.renameFormat.IndexOf("{A}");
                        upper = true;
                    }
                    if (iA >= 0)
                    {
                        if (upper)
                            attName = attName[0].ToString().ToUpper() + attName.Substring(1);
                        this.renameFormat = this.renameFormat.Substring(0, iA) + attName + this.renameFormat.Substring(iA + 3);
                    }
                    // now, use of {m/M} should be turned to {a/A}
                    int iM = this.renameFormat.IndexOf("{m}");
                    if (iM >= 0)
                    {
                        this.renameFormat = this.renameFormat.Substring(0, iM) + "{a}" + this.renameFormat.Substring(iM + 3);
                    }
                    else
                    {
                        iM = this.renameFormat.IndexOf("{M}");
                        if (iM >= 0)
                        {
                            this.renameFormat = this.renameFormat.Substring(0, iM) + "{A}" + this.renameFormat.Substring(iM + 3);
                        }
                    }
                }
            }
        }

        internal CdmAttributeResolutionGuidance CombineResolutionGuidance(CdmAttributeResolutionGuidance addIn)
        {
            CdmAttributeResolutionGuidance startWith = this;
            if (addIn == null)
                return startWith;
            if (startWith == null)
                return addIn;

            CdmAttributeResolutionGuidance result = new CdmAttributeResolutionGuidance(this.Ctx);

            // can remove and then un-remove later
            if (startWith.removeAttribute == true)
            {
                if (addIn.removeAttribute == null || addIn.removeAttribute == true)
                    result.removeAttribute = true;
            }
            else
            {
                if (addIn.removeAttribute != null && addIn.removeAttribute == true)
                    result.removeAttribute = true;
            }

            // copy and combine if needed
            if (addIn.imposedDirectives != null)
            {
                if (startWith.imposedDirectives != null)
                    result.imposedDirectives = new List<string>(startWith.imposedDirectives);
                else
                    result.imposedDirectives = new List<string>();
                result.imposedDirectives.AddRange(addIn.imposedDirectives);
            }
            else
                result.imposedDirectives = startWith.imposedDirectives;

            if (addIn.removedDirectives != null)
            {
                if (startWith.removedDirectives != null)
                    result.removedDirectives = new List<string>(startWith.removedDirectives);
                else
                    result.removedDirectives = new List<string>();
                result.removedDirectives.AddRange(addIn.removedDirectives);
            }
            else
                result.removedDirectives = startWith.removedDirectives;

            result.addSupportingAttribute = startWith.addSupportingAttribute;
            if (addIn.addSupportingAttribute != null)
                result.addSupportingAttribute = addIn.addSupportingAttribute;

            result.cardinality = startWith.cardinality;
            if (addIn.cardinality != null)
                result.cardinality = addIn.cardinality;

            result.renameFormat = startWith.renameFormat;
            if (addIn.renameFormat != null)
                result.renameFormat = addIn.renameFormat;

            // for these sub objects, ok to just use the same objects unless something is combined. assumption is that these are static during the resolution
            if (addIn.expansion != null)
            {
                if (startWith.expansion != null)
                {
                    result.expansion = new Expansion();
                    result.expansion.startingOrdinal = startWith.expansion.startingOrdinal;
                    if (addIn.expansion.startingOrdinal != null)
                        result.expansion.startingOrdinal = addIn.expansion.startingOrdinal;
                    result.expansion.maximumExpansion = startWith.expansion.maximumExpansion;
                    if (addIn.expansion.maximumExpansion != null)
                        result.expansion.maximumExpansion = addIn.expansion.maximumExpansion;
                    result.expansion.countAttribute = startWith.expansion.countAttribute;
                    if (addIn.expansion.countAttribute != null)
                        result.expansion.countAttribute = addIn.expansion.countAttribute;
                }
                else
                    result.expansion = addIn.expansion;
            }
            else
                result.expansion = startWith.expansion;

            if (addIn.entityByReference != null)
            {
                if (startWith.entityByReference != null)
                {
                    result.entityByReference = new CdmAttributeResolutionGuidance_EntityByReference();
                    result.entityByReference.alwaysIncludeForeignKey = startWith.entityByReference.alwaysIncludeForeignKey;
                    if (addIn.entityByReference.alwaysIncludeForeignKey != null)
                        result.entityByReference.alwaysIncludeForeignKey = addIn.entityByReference.alwaysIncludeForeignKey;
                    result.entityByReference.referenceOnlyAfterDepth = startWith.entityByReference.referenceOnlyAfterDepth;
                    if (addIn.entityByReference.referenceOnlyAfterDepth != null)
                        result.entityByReference.referenceOnlyAfterDepth = addIn.entityByReference.referenceOnlyAfterDepth;
                    result.entityByReference.foreignKeyAttribute = startWith.entityByReference.foreignKeyAttribute;
                    if (addIn.entityByReference.foreignKeyAttribute != null)
                        result.entityByReference.foreignKeyAttribute = addIn.entityByReference.foreignKeyAttribute;
                    result.entityByReference.allowReference = startWith.entityByReference.allowReference;
                    if (addIn.entityByReference.allowReference != null)
                        result.entityByReference.allowReference = addIn.entityByReference.allowReference;

                }
                else
                    result.entityByReference = addIn.entityByReference;
            }
            else
                result.entityByReference = startWith.entityByReference;

            if (addIn.selectsSubAttribute != null)
            {
                if (startWith.selectsSubAttribute != null)
                {
                    result.selectsSubAttribute = new CdmAttributeResolutionGuidance_SelectsSubAttribute();
                    result.selectsSubAttribute.selectedTypeAttribute = startWith.selectsSubAttribute.selectedTypeAttribute;
                    if (addIn.selectsSubAttribute.selectedTypeAttribute != null)
                        result.selectsSubAttribute.selectedTypeAttribute = addIn.selectsSubAttribute.selectedTypeAttribute;
                    result.selectsSubAttribute.selects = startWith.selectsSubAttribute.selects;
                    if (addIn.selectsSubAttribute.selects != null)
                        result.selectsSubAttribute.selects = addIn.selectsSubAttribute.selects;
                    if (addIn.selectsSubAttribute.selectsSomeTakeNames != null)
                    {
                        if (startWith.selectsSubAttribute.selectsSomeTakeNames != null)
                            result.selectsSubAttribute.selectsSomeTakeNames = new List<string>(startWith.selectsSubAttribute.selectsSomeTakeNames);
                        else
                            result.selectsSubAttribute.selectsSomeTakeNames = new List<string>();
                        result.selectsSubAttribute.selectsSomeTakeNames.AddRange(addIn.selectsSubAttribute.selectsSomeTakeNames);
                    }
                    if (addIn.selectsSubAttribute.selectsSomeAvoidNames != null)
                    {
                        if (startWith.selectsSubAttribute.selectsSomeAvoidNames != null)
                           result.selectsSubAttribute.selectsSomeAvoidNames = new List<string>(startWith.selectsSubAttribute.selectsSomeAvoidNames);
                        else
                            result.selectsSubAttribute.selectsSomeAvoidNames = new List<string>();
                        result.selectsSubAttribute.selectsSomeAvoidNames.AddRange(addIn.selectsSubAttribute.selectsSomeAvoidNames);
                    }
                }
                else
                    result.selectsSubAttribute = addIn.selectsSubAttribute;
            }
            else
                result.selectsSubAttribute = startWith.selectsSubAttribute;

            return result;
        }

    }
}
