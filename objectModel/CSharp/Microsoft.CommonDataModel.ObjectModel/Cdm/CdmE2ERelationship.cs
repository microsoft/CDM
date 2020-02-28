// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Enums;
using Microsoft.CommonDataModel.ObjectModel.Utilities;
using System;

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    public class CdmE2ERelationship : CdmObjectDefinitionBase
    {
        /// <summary>
        /// Gets or sets the relationship name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the corpus path to the entity the relationship is pointing from.
        /// </summary>
        public string FromEntity { get; set; }

        /// <summary>
        /// Gets or sets the entity attribute the relationship is pointing from.
        /// </summary>
        public string FromEntityAttribute { get; set; }

        /// <summary>
        /// Gets or sets the corpus path to the entity the relationship is pointing to.
        /// </summary>
        public string ToEntity { get; set; }

        /// <summary>
        /// Gets or sets the entity attribute the relationship is pointing to.
        /// </summary>
        public string ToEntityAttribute { get; set; }

        /// <summary>
        /// Constructs a CdmE2ERelationship.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="name">The relationship name.</param>
        public CdmE2ERelationship(CdmCorpusContext ctx, string name)
            : base(ctx)
        {
            this.Name = name;
            this.ObjectType = CdmObjectType.E2ERelationshipDef;
        }

        /// <inheritdoc />
        public override string GetName()
        {
            return this.Name;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            return false;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmE2ERelationship copy;
            if (host == null)
            {
                copy = new CdmE2ERelationship(this.Ctx, this.Name);
            }
            else
            {
                copy = host as CdmE2ERelationship;
                copy.Ctx = this.Ctx;
                copy.Name = this.Name;
            }

            copy.FromEntity = this.FromEntity;
            copy.FromEntityAttribute = this.FromEntityAttribute;
            copy.ToEntity = this.ToEntity;
            copy.ToEntityAttribute = this.ToEntityAttribute;

            this.CopyDef(resOpt, copy);

            return copy;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            return !string.IsNullOrEmpty(this.FromEntity) && !string.IsNullOrEmpty(this.FromEntityAttribute)
                && !string.IsNullOrEmpty(this.ToEntity) && !string.IsNullOrEmpty(this.ToEntityAttribute);
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.E2ERelationshipDef;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmE2ERelationship>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = string.Empty;
            if (this.Ctx.Corpus.blockDeclaredPathChanges == false)
            {
                if (string.IsNullOrEmpty(this.DeclaredPath))
                {
                    this.DeclaredPath = pathFrom + this.Name;
                }

                path = this.DeclaredPath;
            }

            if (preChildren != null && preChildren.Invoke(this, path))
            {
                return false;
            }

            if (this.VisitDef(path, preChildren, postChildren))
            {
                return true;
            }
            
            if (postChildren != null && postChildren.Invoke(this, path))
            {
                return true;
            }

            return false;
        }
    }
}
