// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Runtime.CompilerServices;

#if INTERNAL_VSTS
[assembly: InternalsVisibleTo("Microsoft.CommonDataModel.ObjectModel.Tests" + Microsoft.CommonDataModel.AssemblyRef.TestPublicKey)]
#else
[assembly: InternalsVisibleTo("Microsoft.CommonDataModel.ObjectModel.Tests")]
#endif
namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System.Collections.Generic;

    internal class ResolvedEntity
    {
        public CdmEntityDefinition Entity { get; set; }
        public string ResolvedName { get; set; }
        public ResolvedTraitSet ResolvedTraits { get; set; }
        public ResolvedAttributeSet ResolvedAttributes { get; set; }
        public ResolvedEntityReferenceSet ResolvedEntityReferences { get; set; }

        public ResolvedEntity(ResolveOptions resOpt, CdmEntityDefinition entDef)
        {
            this.Entity = entDef;
            this.ResolvedName = this.Entity.GetName();
            this.ResolvedTraits = this.Entity.FetchResolvedTraits(resOpt);
            this.ResolvedAttributes = this.Entity.FetchResolvedAttributes(resOpt);
            this.ResolvedEntityReferences = this.Entity.FetchResolvedEntityReferences(resOpt);
        }

        public string SourceName
        {
            get
            {
                return this.Entity.SourceName;
            }
        }

        public string Description
        {
            get
            {
                return this.Entity.Description;
            }
        }

        public string DisplayName
        {
            get
            {
                return this.Entity.DisplayName;
            }
        }

        public string Version
        {
            get
            {
                return this.Entity.Version;
            }
        }

        public List<string> CdmSchemas
        {
            get
            {
                return this.Entity.CdmSchemas;
            }
        }

        public void SpewProperties(StringSpewCatcher to, string indent)
        {
            if (this.DisplayName != null) {
                to.SpewLine($"{indent}displayName: {this.DisplayName}");
            }
            if (this.Description != null) {
                to.SpewLine($"{indent}description: {this.Description}");
            }
            if (this.Version != null) {
                to.SpewLine($"{indent}version: {this.Version}");
            }
            if (this.SourceName != null) {
                to.SpewLine($"{indent}sourceName: {this.SourceName}");
            }
        }

        public void Spew(ResolveOptions resOpt, StringSpewCatcher to, string indent, bool nameSort)
        {
            to.SpewLine(indent + "=====ENTITY=====");
            to.SpewLine(indent + this.ResolvedName);
            to.SpewLine(indent + "================");
            to.SpewLine($"{indent}properties:");
            this.SpewProperties(to, $"{indent} ");
            to.SpewLine(indent + "traits:");
            this.ResolvedTraits.Spew(resOpt, to, indent + " ", nameSort);
            to.SpewLine("attributes:");
            if (this.ResolvedAttributes != null)
                this.ResolvedAttributes.Spew(resOpt, to, indent + " ", nameSort);
            to.SpewLine("relationships:");
            this.ResolvedEntityReferences.Spew(resOpt, to, indent + " ", nameSort);
        }
    }
}
