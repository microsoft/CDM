// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ManifestDeclarationPersistence.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
// <summary>
//   The manifest declaration for CDM folders format.
// </summary>
// --------------------------------------------------------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    class ManifestDeclarationPersistence
    {
        public static CdmManifestDeclarationDefinition FromData(CdmCorpusContext ctx, ManifestDeclaration obj)
        {
            var newManifestDoc = ctx.Corpus.MakeObject<CdmManifestDeclarationDefinition>(CdmObjectType.ManifestDeclarationDef, obj.ManifestName);
            newManifestDoc.Definition = obj.Definition;

            if (obj.LastFileStatusCheckTime != null)
            {
                newManifestDoc.LastFileStatusCheckTime = DateTimeOffset.Parse(obj.LastFileStatusCheckTime);
            }

            if (obj.LastFileModifiedTime != null)
            {
                newManifestDoc.LastFileModifiedTime = DateTimeOffset.Parse(obj.LastFileModifiedTime);
            }

            if (obj.Explanation != null)
            {
                newManifestDoc.Explanation = obj.Explanation;
            }
            return newManifestDoc;
        }

        public static ManifestDeclaration ToData(CdmManifestDeclarationDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            var result = new ManifestDeclaration
            {
                Explanation = instance.Explanation,
                ManifestName = instance.ManifestName,
                LastFileStatusCheckTime = TimeUtils.GetFormattedDateString(instance.LastFileStatusCheckTime),
                LastFileModifiedTime = TimeUtils.GetFormattedDateString(instance.LastFileModifiedTime),
                Definition = instance.Definition
            };

            return result;
        }
    }
}
