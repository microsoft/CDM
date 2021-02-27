// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public interface CdmObject
    {
        /// <summary>
        /// Gets or sets the object id.
        /// </summary>
        int Id { get; set; }

        /// <summary>
        /// Gets or sets the object context.
        /// </summary>
        CdmCorpusContext Ctx { get; set; }

        /// <summary>
        /// Gets or sets the declaration document of the object.
        /// </summary>
        CdmDocumentDefinition InDocument { get; set; }

        /// <summary>
        /// Gets the object declared path.
        /// </summary>
        string AtCorpusPath { get; }

        /// <summary>
        /// Gets or sets the object type.
        /// </summary>
        CdmObjectType ObjectType { get; set; }

        /// <summary>
        /// Gets or sets the object that owns or contains this object.
        /// </summary>
        CdmObject Owner { get; set; }

        /// <summary>
        /// Returns the resolved object reference.
        /// </summary>
        T FetchObjectDefinition<T>(ResolveOptions resOpt = null) where T : CdmObjectDefinition;

        /// <summary>
        /// Returns the name of the object if this is a defintion or the name of the referenced object if this is an object reference.
        /// </summary>
        string FetchObjectDefinitionName();

        /// <summary>
        /// Runs the preChildren and postChildren input functions with this object as input, also calls recursively on any objects this one contains.
        /// </summary>
        bool Visit(string pathRoot, VisitCallback preChildren, VisitCallback postChildren);

        /// <summary>
        /// Returns true if the object (or the referenced object) is an extension in some way from the specified symbol name.
        /// </summary>
        bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null);

        /// <summary>
        /// Validates that the object is configured properly.
        /// </summary>
        bool Validate();

        [Obsolete()]
        CdmObjectType GetObjectType();

        [Obsolete()]
        dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null);

        /// <summary>
        /// Creates a copy of this object.
        /// </summary>
        /// <param name="resOpt">The resolve options.</param>
        /// <param name="host"> For CDM internal use. Copies the object INTO the provided host instead of creating a new object instance.</param>
        CdmObject Copy(ResolveOptions resOpt, CdmObject host = null);

        /// <summary>
        /// Takes an object definition and returns the object reference that points to the definition.
        /// </summary>
        /// <param name="resOpt">The resolve options.</param>
        CdmObjectReference CreateSimpleReference(ResolveOptions resOpt = null);
    }
}
