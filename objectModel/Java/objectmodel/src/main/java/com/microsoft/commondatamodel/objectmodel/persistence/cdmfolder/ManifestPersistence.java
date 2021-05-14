// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.CdmConstants;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DataType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DocumentContent;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.E2ERelationship;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.EntityDeclaration;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Import;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.LocalEntityDeclaration;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestDeclaration;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.io.IOException;
import java.util.Objects;
import java.util.stream.Collectors;

public class ManifestPersistence {
  private static final String TAG = ManifestPersistence.class.getSimpleName();

  /**
   * Whether this persistence class has async methods.
   */
  public static final boolean isPersistenceAsync = false;
  
  /**
   * The file format/extension types this persistence class supports.
   */
  public static final String[] formats = { CdmConstants.MANIFEST_EXTENSION, CdmConstants.FOLIO_EXTENSION };

  public static CdmManifestDefinition fromObject(
          final CdmCorpusContext ctx,
          final String name,
          final String nameSpace,
          final String path,
          final ManifestContent dataObj) {
    final String manifestName = extractManifestName(dataObj, name);

    final CdmManifestDefinition manifest = ctx.getCorpus().makeObject(CdmObjectType.ManifestDef, manifestName);
    // this is the document name which is assumed by constructor to be related to the the manifestName, but may not be
    manifest.setName(name);
    manifest.setFolderPath(path);
    manifest.setNamespace(nameSpace);
    manifest.setExplanation(dataObj.getExplanation());

    if (!Strings.isNullOrEmpty(dataObj.getSchema())) {
      manifest.setSchema(dataObj.getSchema());
    }

    if (!Strings.isNullOrEmpty(dataObj.getJsonSchemaSemanticVersion())) {
      manifest.setJsonSchemaSemanticVersion(dataObj.getJsonSchemaSemanticVersion());
    }

    if (!Strings.isNullOrEmpty(dataObj.getDocumentVersion())) {
      manifest.setDocumentVersion(dataObj.getDocumentVersion());
    }
  
    if (!Strings.isNullOrEmpty(dataObj.getManifestName())) {
      manifest.setManifestName(dataObj.getManifestName());
    }

    Utils.addListToCdmCollection(manifest.getExhibitsTraits(),
              Utils.createTraitReferenceList(ctx, dataObj.getExhibitsTraits()));

    if (dataObj.getImports() != null) {
      for (final Import anImport : dataObj.getImports()) {
        manifest.getImports().add(Objects.requireNonNull(ImportPersistence.fromData(ctx, anImport)));
      }
    }

    if (dataObj.getDefinitions() != null) {
      for (final JsonNode node : dataObj.getDefinitions()) {
        if (node.has("dataTypeName"))
          manifest.getDefinitions().add(DataTypePersistence.fromData(ctx, JMapper.MAP.convertValue(node, DataType.class)));
        else if (node.has("purposeName"))
          manifest.getDefinitions().add(PurposePersistence.fromData(ctx, node));
        else if (node.has("attributeGroupName"))
          manifest.getDefinitions().add(AttributeGroupPersistence.fromData(ctx, node));
        else if (node.has("traitName"))
          manifest.getDefinitions().add(TraitPersistence.fromData(ctx, node));
        else if (node.has("entityShape"))
          manifest.getDefinitions().add(ConstantEntityPersistence.fromData(ctx, node));
        else if (node.has("entityName"))
          manifest.getDefinitions().add(EntityPersistence.fromData(ctx, node));
      }
    }

    if (dataObj.getLastFileStatusCheckTime() != null) {
      manifest.setLastFileStatusCheckTime(dataObj.getLastFileStatusCheckTime());
    }

    if (dataObj.getLastFileModifiedTime() != null) {
      manifest.setLastFileModifiedTime(dataObj.getLastFileModifiedTime());
    }

    if (dataObj.getLastChildFileModifiedTime() != null) {
      manifest.setLastChildFileModifiedTime(dataObj.getLastChildFileModifiedTime());
    }

    if (dataObj.getEntities() != null) {
      final String fullPath = !Strings.isNullOrEmpty(nameSpace) ? nameSpace + ":" + path : path;
      for (final JsonNode entityNode : dataObj.getEntities()) {
        CdmEntityDeclarationDefinition entity = null;
        try {
          if (entityNode.has("type")) {
            final String type = entityNode.get("type").asText();
            if (EntityDeclaration.EntityDeclarationDefinitionType.LocalEntity.equals(type)) {
              entity = LocalEntityDeclarationPersistence.fromData(
                  ctx, fullPath,
                  JMapper.MAP.treeToValue(entityNode, LocalEntityDeclaration.class));
            } else if (EntityDeclaration.EntityDeclarationDefinitionType.ReferencedEntity.equals(type)) {
              entity = ReferencedEntityDeclarationPersistence.fromData(ctx, fullPath, entityNode);
            } else {
              Logger.error(ctx, TAG, "fromObject", null, CdmLogCode.ErrPersistEntityDeclarationMissing);
            }
          } else {
            if (entityNode.has("entitySchema")) {
              entity = LocalEntityDeclarationPersistence.fromData(
                  ctx, fullPath,
                  JMapper.MAP.treeToValue(entityNode, LocalEntityDeclaration.class));
            } else {
              entity = ReferencedEntityDeclarationPersistence.fromData(ctx, fullPath, entityNode);
            }
          }
          manifest.getEntities().add(entity);
        } catch (final IOException ex) {
          Logger.error(ctx, TAG, "fromObject", null, CdmLogCode.ErrPersistDeserializeError, ex.getLocalizedMessage());
        }
      }
    }

    if (dataObj.getRelationships() != null) {
      for (final E2ERelationship rel : dataObj.getRelationships()) {
        manifest.getRelationships().add(E2ERelationshipPersistence.fromData(ctx, rel));
      }
    }

    if (dataObj.getSubManifests() == null) {
      return manifest;
    }

    for (final ManifestDeclaration subManifest : dataObj.getSubManifests()) {
      manifest.getSubManifests().add(ManifestDeclarationPersistence.fromData(ctx, subManifest));
    }

    return manifest;
  }
  
  public static CdmManifestDefinition fromData(CdmCorpusContext ctx, String docName, String jsonData, CdmFolderDefinition folder) {
    try {
      ManifestContent dataObj = JMapper.MAP.readValue(jsonData, ManifestContent.class);
      return fromObject(ctx, docName, folder.getNamespace(), folder.getFolderPath(), dataObj);
    } catch (final Exception e) {
      Logger.error(ctx, TAG, "fromData", null, CdmLogCode.ErrPersistConversionError, docName, e.getLocalizedMessage());
      return null;
    }
  }

  public static ManifestContent toData(final CdmManifestDefinition instance, final ResolveOptions resOpt, final CopyOptions options) {
    final DocumentContent documentContent = DocumentPersistence.toData(instance, resOpt, options);

    final ManifestContent manifestContent = new ManifestContent();

    manifestContent.setManifestName(instance.getManifestName());
    manifestContent.setJsonSchemaSemanticVersion(documentContent.getJsonSchemaSemanticVersion());
    manifestContent.setDocumentVersion(documentContent.getDocumentVersion());
    manifestContent.setSchema(documentContent.getSchema());
    manifestContent.setImports(documentContent.getImports());
    manifestContent.setLastFileStatusCheckTime(instance.getLastFileStatusCheckTime());
    manifestContent.setLastFileModifiedTime(instance.getLastFileModifiedTime());
    manifestContent.setLastChildFileModifiedTime(instance.getLastChildFileModifiedTime());
    manifestContent.setEntities(Utils.listCopyDataAsArrayNode(instance.getEntities().getAllItems(), resOpt, options));
    manifestContent.setSubManifests(Utils.listCopyDataAsCdmObject(instance.getSubManifests(), resOpt, options));
    manifestContent.setExplanation(instance.getExplanation());
    manifestContent.setExhibitsTraits(Utils.listCopyDataAsArrayNode(instance.getExhibitsTraits(), resOpt, options));

    if (instance.getRelationships() != null && instance.getRelationships().getCount() > 0) {
      manifestContent.setRelationships(
              instance.getRelationships().getAllItems()
                      .stream()
                      .map(rel -> E2ERelationshipPersistence.toData(rel, resOpt, options))
                      .collect(Collectors.toList()));
    }

    return manifestContent;
  }

  private static String extractManifestName(final ManifestContent dataObj, final String name) {
    final String manifestName = dataObj.getManifestName();
    if (!Strings.isNullOrEmpty(manifestName)) {
      return manifestName;
    }

    return name.contains(CdmConstants.MANIFEST_EXTENSION)
            ? name.replace(CdmConstants.MANIFEST_EXTENSION, "")
            : name.replace(CdmConstants.FOLIO_EXTENSION, "");
  }
}
