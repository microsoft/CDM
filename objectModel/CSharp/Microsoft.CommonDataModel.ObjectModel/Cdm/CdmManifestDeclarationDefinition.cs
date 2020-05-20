// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    /// <summary>
    /// The object model implementation for manifest declaration.
    /// </summary>
    public class CdmManifestDeclarationDefinition : CdmObjectDefinitionBase, CdmFileStatus
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CdmManifestDeclarationDefinition"/> class.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="manifestName">The manifest name.</param>
        public CdmManifestDeclarationDefinition(CdmCorpusContext ctx, string name) : base(ctx)
        {
            this.ObjectType = CdmObjectType.ManifestDeclarationDef;
            this.ManifestName = name;
        }

        /// <summary>
        /// Gets or sets the name of the manifest declared.
        /// </summary>
        public string ManifestName { get; set; }

        /// <summary>
        /// Gets or sets the manifest's definition.
        /// </summary>
        public string Definition { get; set; }


        /// <summary>
        /// Gets or sets the last file status check time.
        /// </summary>
        public DateTimeOffset? LastFileStatusCheckTime { get; set; }

        /// <summary>
        /// Gets or sets the last file modified time.
        /// </summary>
        public DateTimeOffset? LastFileModifiedTime { get; set; }

        /// <summary>
        /// Gets or sets the last child file modified time.
        /// </summary>
        public DateTimeOffset? LastChildFileModifiedTime { get; set; }

        /// <summary>
        /// Creates an instance from object of folder declaration type.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="obj">The object to read data from.</param>
        /// <returns> The <see cref="CdmManifestDeclarationDefinition"/> instance generated. </returns>
        [Obsolete("InstanceFromData is deprecated. Please use the Persistence Layer instead.")]
        public static CdmManifestDeclarationDefinition InstanceFromData(CdmCorpusContext ctx, ManifestDeclaration obj)
        {
            return CdmObjectBase.InstanceFromData<CdmManifestDeclarationDefinition, ManifestDeclaration>(ctx, obj);
        }

        /// <inheritdoc />
        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.ManifestDeclarationDef;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmManifestDeclarationDefinition>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmManifestDeclarationDefinition copy;
            if (host == null)
            {
                copy = new CdmManifestDeclarationDefinition(this.Ctx, this.ManifestName);
            }
            else
            {
                copy = host as CdmManifestDeclarationDefinition;
                copy.Ctx = this.Ctx;
                copy.ManifestName = this.ManifestName;
            }

            copy.Definition = this.Definition;
            copy.LastFileStatusCheckTime = this.LastFileStatusCheckTime;
            copy.LastFileModifiedTime = this.LastFileModifiedTime;

            this.CopyDef(resOpt, copy);

            return copy;
        }
       
        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();
            if (string.IsNullOrWhiteSpace(this.ManifestName))
                missingFields.Add("ManifestName");
            if (string.IsNullOrWhiteSpace(this.Definition))
                missingFields.Add("Definition");
            if (missingFields.Count > 0)
            {
                Logger.Error(nameof(CdmManifestDeclarationDefinition), this.Ctx, Errors.ValidateErrorString(this.AtCorpusPath, missingFields), nameof(Validate));
                return false;
            }
            return true;
        }


        /// <inheritdoc />
        public override string GetName()
        {
            return this.ManifestName;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = string.Empty;
            if (this.Ctx.Corpus.blockDeclaredPathChanges == false)
            {
                path = this.DeclaredPath;
                if (path == null)
                {
                    path = pathFrom + this.GetName();
                    this.DeclaredPath = path;
                }
            }

            if (preChildren != null && preChildren.Invoke(this, path))
            {
                return false;
            }

            if (this.VisitDef(path, preChildren, postChildren))
                return true;

            if (postChildren != null && postChildren.Invoke(this, path))
            {
                return false;
            }
            return false;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseName, ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            return false;
        }

        /// <inheritdoc />
        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            return;
        }

        /// <inheritdoc />
        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            return null;
        }

        /// <inheritdoc />
        public async Task FileStatusCheckAsync()
        {
            string fullPath = this.Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(this.Definition, this.InDocument);
            DateTimeOffset? modifiedTime = await (this.Ctx.Corpus as CdmCorpusDefinition).ComputeLastModifiedTimeAsync(fullPath, this);

            // update modified times
            this.LastFileStatusCheckTime = DateTimeOffset.UtcNow;
            this.LastFileModifiedTime = TimeUtils.MaxTime(modifiedTime, this.LastFileModifiedTime);

            await this.ReportMostRecentTimeAsync(this.LastFileModifiedTime);
        }

        /// <inheritdoc />
        public async Task ReportMostRecentTimeAsync(DateTimeOffset? childTime)
        {
            if (this.Owner is CdmFileStatus && childTime != null)
                await (this.Owner as CdmFileStatus).ReportMostRecentTimeAsync(childTime);
        }
    }
}
