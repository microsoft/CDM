// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel.Projections;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Class to handle IncludeAttributes operations
    /// </summary>
    public class CdmOperationIncludeAttributes : CdmOperationBase
    {
        private static readonly string Tag = nameof(CdmOperationIncludeAttributes);

        public List<string> IncludeAttributes { get; set; }

        public CdmOperationIncludeAttributes(CdmCorpusContext ctx) : base(ctx)
        {
            this.ObjectType = CdmObjectType.OperationIncludeAttributesDef;
            this.Type = CdmOperationType.IncludeAttributes;

            this.IncludeAttributes = new List<string>();
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            var copy = host == null ? new CdmOperationIncludeAttributes(this.Ctx) : host as CdmOperationIncludeAttributes;

            if (this.IncludeAttributes != null)
            {
                copy.IncludeAttributes = new List<string>(this.IncludeAttributes);
            }

            this.CopyProj(resOpt, copy);
            return copy;
        }

        /// <inheritdoc />
        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null)
        {
            return CdmObjectBase.CopyData<CdmOperationIncludeAttributes>(this, resOpt, options);
        }

        public override string GetName()
        {
            return "operationIncludeAttributes";
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.OperationIncludeAttributesDef;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();

            if (this.IncludeAttributes == null)
                missingFields.Add("IncludeAttributes");

            if (missingFields.Count > 0)
            {
                Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnIntegrityCheckFailure, this.AtCorpusPath, string.Join(", ", missingFields.Select((s) =>$"'{s}'")));
                return false;
            }

            return true;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = string.Empty;
            if (this.Ctx.Corpus.blockDeclaredPathChanges == false)
            {
                path = this.DeclaredPath;
                if (string.IsNullOrEmpty(path))
                {
                    path = pathFrom + "operationIncludeAttributes";
                    this.DeclaredPath = path;
                }
            }

            if (preChildren?.Invoke(this, path) == true)
                return false;

            if (postChildren != null && postChildren.Invoke(this, path))
                return true;

            return false;
        }

        /// <inheritdoc />
        internal override ProjectionAttributeStateSet AppendProjectionAttributeState(
            ProjectionContext projCtx,
            ProjectionAttributeStateSet projOutputSet,
            CdmAttributeContext attrCtx)
        {
            // Create a new attribute context for the operation
            AttributeContextParameters attrCtxOpIncludeAttrsParam = new AttributeContextParameters
            {
                under = attrCtx,
                type = CdmAttributeContextType.OperationIncludeAttributes,
                Name = $"operation/index{Index}/operationIncludeAttributes"
            };
            CdmAttributeContext attrCtxOpIncludeAttrs = CdmAttributeContext.CreateChildUnder(projCtx.ProjectionDirective.ResOpt, attrCtxOpIncludeAttrsParam);

            // Get the top-level attribute names for each of the included attributes
            // Since the include operation allows providing either current state resolved attribute names 
            //   or the previous state resolved attribute names, we search for the name in the PAS tree 
            //   and fetch the top level resolved attribute names.
            Dictionary<string, string> topLevelIncludeAttributeNames = ProjectionResolutionCommonUtil.GetTopList(projCtx, this.IncludeAttributes);

            // Initialize a projection attribute context tree builder with the created attribute context for the operation
            ProjectionAttributeContextTreeBuilder attrCtxTreeBuilder = new ProjectionAttributeContextTreeBuilder(attrCtxOpIncludeAttrs);

            // Index that holds the current attribute name as the key and the attribute as value
            Dictionary<string, ProjectionAttributeState> topLevelIncludeAttribute = new Dictionary<string, ProjectionAttributeState>();

            // List of attributes that were not included on the final attribute list
            List<ProjectionAttributeState> removedAttributes = new List<ProjectionAttributeState>();

            // Iterate through all the PAS in the PASSet generated from the projection source's resolved attributes
            foreach (ProjectionAttributeState currentPAS in projCtx.CurrentAttributeStateSet.States)
            {
                // Check if the current PAS's RA is in the list of attributes to include.
                if (topLevelIncludeAttributeNames.ContainsKey(currentPAS.CurrentResolvedAttribute.ResolvedName))
                {
                    topLevelIncludeAttribute.Add(currentPAS.CurrentResolvedAttribute.ResolvedName, currentPAS);
                }
                else
                {
                    removedAttributes.Add(currentPAS);
                }
            }

            // Loop through the list of attributes in the same order that was specified by the user
            foreach (KeyValuePair<string, string> entry in topLevelIncludeAttributeNames)
            {
                // Get the attribute state
                ProjectionAttributeState currentPAS = topLevelIncludeAttribute[entry.Key];

                // Get the attribute name the way it appears in the include list
                string includeAttributeName = entry.Value;

                // Create the attribute context parameters and just store it in the builder for now
                // We will create the attribute contexts at the end
                attrCtxTreeBuilder.CreateAndStoreAttributeContextParameters(includeAttributeName, currentPAS, currentPAS.CurrentResolvedAttribute,
                    CdmAttributeContextType.AttributeDefinition,
                    currentPAS.CurrentResolvedAttribute.AttCtx, // lineage is the included attribute
                    null); // don't know who will point here yet

                // Create a projection attribute state for the included attribute by creating a copy of the current state
                // Copy() sets the current state as the previous state for the new one
                // We only create projection attribute states for attributes in the include list
                ProjectionAttributeState newPAS = currentPAS.Copy();

                projOutputSet.Add(newPAS);
            }

            // Generate attribute context nodes for the attributes that were not included
            foreach (ProjectionAttributeState currentPAS in removedAttributes)
            {
                // Create the attribute context parameters and just store it in the builder for now
                // We will create the attribute contexts at the end
                attrCtxTreeBuilder.CreateAndStoreAttributeContextParameters(null, currentPAS, currentPAS.CurrentResolvedAttribute,
                    CdmAttributeContextType.AttributeExcluded,
                    currentPAS.CurrentResolvedAttribute.AttCtx, // lineage is the included attribute
                    null); // don't know who will point here yet
            }

            // Create all the attribute contexts and construct the tree
            attrCtxTreeBuilder.ConstructAttributeContextTree(projCtx);

            return projOutputSet;
        }
    }
}
