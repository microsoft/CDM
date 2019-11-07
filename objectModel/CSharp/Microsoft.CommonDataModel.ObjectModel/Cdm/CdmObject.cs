//-----------------------------------------------------------------------
// <copyright file="CdmObject.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
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
        string AtCorpusPath { get; set;  }

        /// <summary>
        /// Gets or sets the object type.
        /// </summary>
        CdmObjectType ObjectType { get; set; }

        /// <summary>
        /// The object that owns or contains this object
        /// </summary>
        CdmObject Owner { get; set; }

        /// <summary>
        /// Returns the resolved object reference.
        /// </summary>
        T FetchObjectDefinition<T>(ResolveOptions resOpt = null) where T : CdmObjectDefinition;

        /// <summary>
        /// Returns the name of the object if this is a defintion or the name of the 
        /// referenced object if this is an object reference.
        /// </summary>
        string FetchObjectDefinitionName();

        [Obsolete()]
        /// <summary>
        /// Runs the preChildren and postChildren input functions with this object as input, also calls recursively on any objects this one contains
        /// </summary>
        bool Visit(string pathRoot, VisitCallback preChildren, VisitCallback postChildren);

        /// <summary>
        /// returns true if the object (or the referenced object) is an extension in some way from the specified symbol name
        /// </summary>
        bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null);

        bool Validate();

        [Obsolete()]
        CdmObjectType GetObjectType();

        [Obsolete()]
        dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null);

        CdmObject Copy(ResolveOptions resOpt);

        CdmObjectReference CreateSimpleReference(ResolveOptions resOpt = null);
    }
}
