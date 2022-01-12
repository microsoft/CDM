// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;

    /// <summary>
    /// The referenced entity declaration persistence.
    /// </summary>
    class ReferencedEntityDeclarationPersistence
    {
        private static readonly string Tag = nameof(ReferencedEntityDeclarationPersistence);

        public static async Task<CdmReferencedEntityDeclarationDefinition> FromData(CdmCorpusContext ctx, ReferenceEntity obj, string location)
        {
            var referencedEntity = ctx.Corpus.MakeObject<CdmReferencedEntityDeclarationDefinition>(CdmObjectType.ReferencedEntityDeclarationDef, obj.Name);
            referencedEntity.EntityName = obj.Name;

            var corpusPath = ctx.Corpus.Storage.AdapterPathToCorpusPath(location);

            if (corpusPath == null)
            {
                Logger.Error((ResolveContext)ctx, Tag, nameof(FromData), null, CdmLogCode.ErrPersistModelJsonRefEntityInvalidLocation, location, referencedEntity.EntityName);
                return null;
            }

            referencedEntity.EntityPath = $"{corpusPath}/{obj.Source}";
            referencedEntity.Explanation = obj.Description;
            referencedEntity.LastFileModifiedTime = obj.LastFileModifiedTime;
            referencedEntity.LastFileStatusCheckTime = obj.LastFileStatusCheckTime;

            await Utils.ProcessAnnotationsFromData(ctx, obj, referencedEntity.ExhibitsTraits);

            if (obj.IsHidden == true)
            {
                var isHiddenTrait = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "is.hidden", true);
                isHiddenTrait.IsFromProperty = true;
                referencedEntity.ExhibitsTraits.Add(isHiddenTrait);
            }

            var trait = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "is.propertyContent.multiTrait", false);
            trait.IsFromProperty = true;
            var argument = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "modelId");
            argument.Value = obj.ModelId;
            trait.Arguments.Add(argument);
            referencedEntity.ExhibitsTraits.Add(trait);

            var extensionTraitDefList = new List<CdmTraitDefinition>();
            var extensionTraits = new CdmTraitCollection(ctx, referencedEntity);
            ExtensionHelper.ProcessExtensionFromJson(ctx, obj, extensionTraits, extensionTraitDefList);

            if (extensionTraitDefList.Count > 0)
            {
                Logger.Warning(ctx, Tag, nameof(FromData), null, CdmLogCode.WarnPersistCustomExtNotSupported, referencedEntity.EntityName);
            }

            return referencedEntity;
        }

        public static async Task<ReferenceEntity> ToData(CdmReferencedEntityDeclarationDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            var sourceIndex = instance.EntityPath.LastIndexOf("/");

            if (sourceIndex == -1)
            {
                Logger.Error(instance.Ctx, Tag, nameof(ToData), instance.AtCorpusPath, CdmLogCode.ErrPersistModelJsonEntityRefConversionError, instance.EntityName);

                return null;
            }

            var referenceEntity = new ReferenceEntity
            {
                Type = "ReferenceEntity",
                Name = instance.EntityName,
                Source = instance.EntityPath.Slice(sourceIndex + 1),
                Description = instance.Explanation,
                LastFileModifiedTime = instance.LastFileModifiedTime,
                LastFileStatusCheckTime = instance.LastFileStatusCheckTime
            };

            Utils.ProcessTraitsAndAnnotationsToData(instance.Ctx, referenceEntity, instance.ExhibitsTraits);

            var t2pm = new TraitToPropertyMap(instance);

            var isHiddenTrait = t2pm.FetchTraitReference("is.hidden");
            if (isHiddenTrait != null)
            {
                referenceEntity.IsHidden = true;
            }

            var propertiesTrait = t2pm.FetchTraitReference("is.propertyContent.multiTrait");
            if (propertiesTrait != null)
            {
                referenceEntity.ModelId = propertiesTrait.Arguments.AllItems[0].Value as string;
            }

            return referenceEntity;
        }
    }
}
