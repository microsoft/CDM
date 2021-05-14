// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Linq;

    public class ManifestPersistence
    {
        private static readonly string Tag = nameof(ManifestPersistence);
        /// <summary>
        /// Whether this persistence class has async methods.
        /// </summary>
        public static readonly bool IsPersistenceAsync = false;

        /// <summary>
        /// The file format/extension types this persistence class supports.
        /// </summary>
        public static readonly string[] Formats = { PersistenceLayer.ManifestExtension, PersistenceLayer.FolioExtension };

        public static CdmManifestDefinition FromObject(CdmCorpusContext ctx, string name, string nameSpace, string path, ManifestContent dataObj)
        {
            // Determine name of the manifest
            var manifestName = !string.IsNullOrEmpty(dataObj.ManifestName) ? dataObj.ManifestName : dataObj.FolioName;
            // We haven't found the name in the file, use one provided in the call but without the suffixes
            if (string.IsNullOrEmpty(manifestName))
                manifestName = name.Replace(PersistenceLayer.ManifestExtension, "").Replace(PersistenceLayer.FolioExtension, "");

            var manifest = ctx.Corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, manifestName);

            manifest.Name = name; // this is the document name which is assumed by constructor to be related to the the manifestName, but may not be
            manifest.FolderPath = path;
            manifest.Namespace = nameSpace;
            manifest.Explanation = dataObj.Explanation;

            if (!string.IsNullOrEmpty(dataObj.Schema))
                manifest.Schema = dataObj.Schema;
            if (DynamicObjectExtensions.HasProperty(dataObj, "JsonSchemaSemanticVersion") && !string.IsNullOrEmpty(dataObj.JsonSchemaSemanticVersion))
            {
                manifest.JsonSchemaSemanticVersion = dataObj.JsonSchemaSemanticVersion;
            }

            if (!string.IsNullOrEmpty(dataObj.DocumentVersion))
            {
                manifest.DocumentVersion = dataObj.DocumentVersion;
            }

            if (!string.IsNullOrEmpty(dataObj.ManifestName))
            {
                manifest.ManifestName = dataObj.ManifestName;
            }
            else if (!string.IsNullOrEmpty(dataObj.FolioName))
            {
                // Might be populated in the case of folio.cdm.json or manifest.cdm.json file.
                manifest.ManifestName = dataObj.FolioName;
            }

            Utils.AddListToCdmCollection(manifest.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, dataObj.ExhibitsTraits));

            if (dataObj.Imports != null)
            {
                foreach (var importObj in dataObj.Imports)
                {
                    manifest.Imports.Add(ImportPersistence.FromData(ctx, importObj));
                }
            }

            if (dataObj.Definitions != null)
            {
                for (int i = 0; i < dataObj.Definitions.Count; i++)
                {
                    dynamic d = dataObj.Definitions[i];
                    if (d["dataTypeName"] != null)
                        manifest.Definitions.Add(DataTypePersistence.FromData(ctx, d));
                    else if (d["purposeName"] != null)
                        manifest.Definitions.Add(PurposePersistence.FromData(ctx, d));
                    else if (d["attributeGroupName"] != null)
                        manifest.Definitions.Add(AttributeGroupPersistence.FromData(ctx, d));
                    else if (d["traitName"] != null)
                        manifest.Definitions.Add(TraitPersistence.FromData(ctx, d));
                    else if (d["entityShape"] != null)
                        manifest.Definitions.Add(ConstantEntityPersistence.FromData(ctx, d));
                    else if (d["entityName"] != null)
                        manifest.Definitions.Add(EntityPersistence.FromData(ctx, d));
                }
            }

            if (dataObj.LastFileStatusCheckTime != null)
            {
                manifest.LastFileStatusCheckTime = DateTimeOffset.Parse(dataObj.LastFileStatusCheckTime);
            }

            if (dataObj.LastFileModifiedTime != null)
            {
                manifest.LastFileModifiedTime = DateTimeOffset.Parse(dataObj.LastFileModifiedTime);
            }

            if (dataObj.LastChildFileModifiedTime != null)
            {
                manifest.LastChildFileModifiedTime = DateTimeOffset.Parse(dataObj.LastChildFileModifiedTime);
            }


            if (dataObj.Entities != null)
            {
                var fullPath = !string.IsNullOrEmpty(nameSpace) ? $"{nameSpace}:{path}" : path;
                foreach (var entityObj in dataObj.Entities)
                {
                    CdmEntityDeclarationDefinition entity = null;

                    if (entityObj["type"] != null)
                    {
                       if (entityObj["type"].ToString() == EntityDeclarationDefinitionType.LocalEntity)
                       {
                            entity = LocalEntityDeclarationPersistence.FromData(ctx, fullPath, entityObj);
                       }
                       else if (entityObj["type"].ToString() == EntityDeclarationDefinitionType.ReferencedEntity)
                       {
                            entity = ReferencedEntityDeclarationPersistence.FromData(ctx, fullPath, entityObj);
                       }
                       else
                       {
                            Logger.Error(ctx, Tag, nameof(FromObject), null, CdmLogCode.ErrPersistEntityDeclarationMissing);
                       }
                    } 
                    else
                    {
                        // We see old structure of entity declaration, check for entity schema/declaration.
                        if (entityObj["entitySchema"] != null)
                        {
                            // Local entity declaration used to use entity schema.
                            entity = LocalEntityDeclarationPersistence.FromData(ctx, fullPath, entityObj);
                        }
                        else
                        {
                            // While referenced entity declaration used to use entity declaration.
                            entity = ReferencedEntityDeclarationPersistence.FromData(ctx, fullPath, entityObj);
                        }
                    }
                    
                    manifest.Entities.Add(entity);
                }
            }

            if (dataObj.Relationships != null)
            {
                foreach (var rel in dataObj.Relationships)
                {
                    manifest.Relationships.Add(E2ERelationshipPersistence.FromData(ctx, rel));
                }
            }

            if (dataObj.SubManifests != null)
            {
                foreach (var subManifest in dataObj.SubManifests)
                {
                    manifest.SubManifests.Add(ManifestDeclarationPersistence.FromData(ctx, subManifest));
                }
            }
            // Might be populated in the case of folio.cdm.json or manifest.cdm.json file.
            else if (dataObj.SubFolios != null)
            {
                foreach (var subFolio in dataObj.SubFolios)
                {
                    manifest.SubManifests.Add(ManifestDeclarationPersistence.FromData(ctx, subFolio));
                }
            }

            return manifest;
        }

        public static CdmManifestDefinition FromData(CdmCorpusContext ctx, string docName, string jsonData, CdmFolderDefinition folder)
        {
            var dataObj = JsonConvert.DeserializeObject<ManifestContent>(jsonData);
            return FromObject(ctx, docName, folder.Namespace, folder.FolderPath, dataObj);
        }

        public static ManifestContent ToData(CdmManifestDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            var documentContent = DocumentPersistence.ToData(instance, resOpt, options);
            var manifestContent = new ManifestContent()
            {
                ManifestName = instance.ManifestName,
                JsonSchemaSemanticVersion = documentContent.JsonSchemaSemanticVersion,
                Schema = documentContent.Schema,
                Imports = documentContent.Imports,
                DocumentVersion = documentContent.DocumentVersion
            };

            manifestContent.ManifestName = instance.ManifestName;
            manifestContent.LastFileStatusCheckTime = TimeUtils.GetFormattedDateString(instance.LastFileStatusCheckTime);
            manifestContent.LastFileModifiedTime = TimeUtils.GetFormattedDateString(instance.LastFileModifiedTime);
            manifestContent.LastChildFileModifiedTime = TimeUtils.GetFormattedDateString(instance.LastChildFileModifiedTime);
            manifestContent.Entities = CopyDataUtils.ListCopyData(resOpt, instance.Entities, options);
            manifestContent.SubManifests = Utils.ListCopyData<ManifestDeclaration>(resOpt, instance.SubManifests, options);
            manifestContent.Explanation = instance.Explanation;
            manifestContent.ExhibitsTraits = CopyDataUtils.ListCopyData(resOpt, instance.ExhibitsTraits, options);

            if (instance.Relationships != null && instance.Relationships.Count > 0)
            {
                manifestContent.Relationships = instance.Relationships.Select(relationship => { return E2ERelationshipPersistence.ToData(relationship, resOpt, options); }).ToList();
            }

            return manifestContent;
        }
    }
}
