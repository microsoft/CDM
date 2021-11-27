// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    /// <summary>
    /// Directives to pass to the top level projection on resolution
    /// ProjectionDirective contains all the inputs for a projection towards resolution.
    /// ProjectionContext is the context that initializes, lives and evolves through the projection resolution process.
    /// ProjectionContext contains an instance of ProjectionDirective.
    /// </summary>
    internal sealed class ProjectionDirective
    {
        /// <summary>
        /// Resolution option used
        /// </summary>
        internal ResolveOptions ResOpt { get; private set; }

        /// <summary>
        /// The calling referencing EntityDef, the EntityAttributeDef, or the TypeAttributeDef that contains this projection
        /// </summary>
        internal CdmObjectDefinitionBase Owner { get; private set; }

        /// <summary>
        /// The EntityRef to the owning EntityDef, EntityAttributeDef, or TypeAttributeDef
        /// </summary>
        internal CdmObjectReference OwnerRef { get; private set; }

        /// <summary>
        /// The entity/type attribute name or "{a/A}"
        /// This may pass through at each opertaion action/transformation
        /// </summary>
        internal string OriginalSourceAttributeName
        {
            get
            {
                return (Owner?.ObjectType == CdmObjectType.EntityAttributeDef || Owner?.ObjectType == CdmObjectType.TypeAttributeDef) ? Owner.GetName() : null;
            }
        }

        /// <summary>
        /// If EntityAttributeDef - then the Cardinality from the Owner EntityAttributeDef
        /// This is ignored for EntityDef and will default to min:max = 0:1
        /// </summary>
        internal CardinalitySettings Cardinality { get; private set; }

        /// <summary>
        /// For entity attribute - get if the source is polymorphic
        /// </summary>
        internal bool IsSourcePolymorphic { get; private set; }

        /// <summary>
        /// Has maximum depth override flag
        /// </summary>
        internal bool HasNoMaximumDepth { get; private set; }

        /// <summary>
        /// Allowed maximum depth of reference
        /// </summary>
        internal int? MaximumDepth { get; private set; }

        /// <summary>
        /// Is array
        /// </summary>
        internal bool? IsArray { get; private set; }

        /// <summary>
        /// Is referenceOnly
        /// </summary>
        internal bool IsReferenceOnly { get; private set; }

        /// <summary>
        /// Is normalized
        /// </summary>
        internal bool IsNormalized { get; private set; }

        /// <summary>
        /// Is structured
        /// </summary>
        internal bool IsStructured { get; private set; }

        /// <summary>
        /// Is virtual
        /// </summary>
        internal bool IsVirtual { get; private set; }

        public ProjectionDirective(ResolveOptions resOpt, CdmObjectDefinitionBase owner, CdmObjectReference ownerRef = null)
        {
            this.ResOpt = resOpt;

            // Owner information
            this.Owner = owner;
            this.OwnerRef = ownerRef;

            if (owner?.ObjectType == CdmObjectType.EntityAttributeDef)
            {
                // Entity Attribute

                CdmEntityAttributeDefinition _owner = (CdmEntityAttributeDefinition)owner;
                this.Cardinality = _owner.Cardinality != null ? _owner.Cardinality : new CardinalitySettings(_owner);
                this.IsSourcePolymorphic = (_owner.IsPolymorphicSource != null && _owner.IsPolymorphicSource == true);
            }
            else
            {
                // Entity Def or Type Attribute

                this.Cardinality = null;
                this.IsSourcePolymorphic = false;
            }

            this.IsReferenceOnly = (resOpt.Directives?.Has("referenceOnly") == true);
            this.IsNormalized = (resOpt.Directives?.Has("normalized") == true);
            this.IsStructured = (resOpt.Directives?.Has("structured") == true);
            this.IsVirtual = (resOpt.Directives?.Has("virtual") == true);
            this.HasNoMaximumDepth = (resOpt.Directives?.Has("noMaxDepth") == true);
            this.IsArray = (resOpt.Directives?.Has("isArray") == true);

            // if noMaxDepth directive the max depth is 32 else defaults to what was set by the user
            // these depths were arbitrary and were set for the resolution guidance
            // re-using the same for projections as well
            this.MaximumDepth = this.HasNoMaximumDepth ? DepthInfo.MaxDepthLimit : resOpt.MaxDepth;
        }
    }
}
