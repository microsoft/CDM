// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.persistence.CdmConstants;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DataType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DocumentContent;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Import;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

public class DocumentPersistence {
  private static String tag = DocumentPersistence.class.getSimpleName();

  /**
   * Whether this persistence class has async methods.
   */
  public static final boolean isPersistenceAsync = false;
  
  /**
   * The file format/extension types this persistence class supports.
   */
  public static final String[] formats = { CdmConstants.CDM_EXTENSION };

  /**
   * The maximum json semantic version supported by this ObjectModel version.
   */
  public static final String jsonSemanticVersion = CdmDocumentDefinition.getCurrentJsonSchemaSemanticVersion();

  public static CdmDocumentDefinition fromObject(final CdmCorpusContext ctx, final String name, final String nameSpace,
                                               final String path, final DocumentContent obj) {
    final CdmDocumentDefinition doc = ctx.getCorpus().makeObject(CdmObjectType.DocumentDef);
    doc.setFolderPath(path);
    doc.setNamespace(nameSpace);

    if (!Strings.isNullOrEmpty(obj.getSchema())) {
      doc.setSchema(obj.getSchema());
    }

    if (!Strings.isNullOrEmpty(obj.getDocumentVersion())) {
      doc.setDocumentVersion(obj.getDocumentVersion());
    }

    if (obj.getImports() != null) {
      for (final Import imp: obj.getImports()) {
        doc.getImports().add(ImportPersistence.fromData(ctx, imp));
      }
    }

    if (obj.getDefinitions() != null) {
      for (int i = 0; i < obj.getDefinitions().size(); i++) {
        final CdmCollection<CdmObjectDefinition> definitions = doc.getDefinitions();
        final JsonNode d = obj.getDefinitions().get(i);
        if (d.has("dataTypeName")) {
          definitions.add(DataTypePersistence.fromData(ctx, JMapper.MAP.convertValue(d, DataType.class)));
        } else if (d.has("purposeName")) {
          definitions.add(PurposePersistence.fromData(ctx, d));
        } else if (d.has("attributeGroupName")) {
          definitions.add(AttributeGroupPersistence.fromData(ctx, d));
        } else if (d.has("traitName")) {
          definitions.add(TraitPersistence.fromData(ctx, d));
        } else if (d.has("entityShape")) {
          definitions.add(ConstantEntityPersistence.fromData(ctx, d));
        } else if (d.has("entityName")) {
          definitions.add(EntityPersistence.fromData(ctx, d));
        }
      }
    }

    boolean isResolvedDoc = false;
    if (doc.getDefinitions().getCount() == 1 && doc.getDefinitions().get(0).getObjectType() == CdmObjectType.EntityDef) {
      CdmEntityDefinition entity = (CdmEntityDefinition) doc.getDefinitions().get(0);
      CdmTraitReference resolvedTrait = entity.getExhibitsTraits().item("has.entitySchemaAbstractionLevel");
      // Tries to figure out if the document is in resolved form by looking for the schema abstraction trait
      // or the presence of the attribute context.
      isResolvedDoc = resolvedTrait != null && "resolved".equals(resolvedTrait.getArguments().get(0).getValue());
      isResolvedDoc = isResolvedDoc || entity.getAttributeContext() != null;
    }

    if (!Strings.isNullOrEmpty(obj.getJsonSchemaSemanticVersion())) {
      doc.setJsonSchemaSemanticVersion(obj.getJsonSchemaSemanticVersion());
      if (compareJsonSemanticVersion(ctx, doc.getJsonSchemaSemanticVersion()) > 0) {
          String message = "This ObjectModel version supports json semantic version " + jsonSemanticVersion + " at maximum.";
          message += " Trying to load a document with version " + doc.getJsonSchemaSemanticVersion() + ".";
          if (isResolvedDoc) {
            Logger.warning(ctx, tag, "fromObject", doc.getAtCorpusPath(), CdmLogCode.WarnPersistUnsupportedJsonSemVer);
          } else {
            Logger.error(ctx, tag, "fromObject", doc.getAtCorpusPath(), CdmLogCode.ErrPersistUnsupportedJsonSemVer, jsonSemanticVersion, doc.getJsonSchemaSemanticVersion());
          }
      }
    } else {
        Logger.warning(ctx, tag, "fromObject", doc.getAtCorpusPath(), CdmLogCode.WarnPersistJsonSemVerMandatory);
    }

    return doc;
  }
  
  public static CdmDocumentDefinition fromData(CdmCorpusContext ctx, String docName, String jsonData, CdmFolderDefinition folder) {
    try {
      DocumentContent obj = JMapper.MAP.readValue(jsonData, DocumentContent.class);
      return fromObject(ctx, docName, folder.getNamespace(), folder.getFolderPath(), obj);
    } catch (final Exception e) {
      Logger.error(ctx, tag, "fromData", null, CdmLogCode.ErrPersistDocConversionFailure, docName, e.getLocalizedMessage());
      return null;
    }
  }

  public static DocumentContent toData(final CdmDocumentDefinition instance, final ResolveOptions resOpt,
                                       final CopyOptions options) {
    final DocumentContent documentContent = new DocumentContent();

    documentContent.setSchema(instance.getSchema());
    documentContent.setJsonSchemaSemanticVersion(instance.getJsonSchemaSemanticVersion());
    documentContent.setImports(Utils.listCopyDataAsCdmObject(instance.getImports(), resOpt, options));
    documentContent.setDefinitions(Utils.listCopyDataAsCdmObject(instance.getDefinitions(), resOpt, options));
    documentContent.setDocumentVersion(instance.getDocumentVersion());

    return documentContent;
  }

  /**
   * Compares the document version with the json semantic version supported.
   * 1 => if documentSemanticVersion > jsonSemanticVersion
   * 0 => if documentSemanticVersion == jsonSemanticVersion or if documentSemanticVersion is invalid
   * -1 => if documentSemanticVersion < jsonSemanticVersion
   */
  private static int compareJsonSemanticVersion(CdmCorpusContext ctx, String documentSemanticVersion) {
      String[] docSemanticVersionSplit = documentSemanticVersion.split("\\.");
      String[] currSemanticVersionSplit = jsonSemanticVersion.split("\\.");

      if (docSemanticVersionSplit.length != 3) {
        Logger.warning(ctx, tag, "compareJsonSemanticVersion", null, CdmLogCode.WarnPersistJsonSemVerInvalidFormat);
        return 0;
      }

      for (int i = 0; i < 3; ++i) {
          if (!docSemanticVersionSplit[i].equals(currSemanticVersionSplit[i])) {
              try {
                int version = Integer.parseInt(docSemanticVersionSplit[i]);
                return  version < Integer.parseInt(currSemanticVersionSplit[i]) ? -1 : 1;
              } catch (NumberFormatException e) {
                Logger.warning(ctx, tag, "compareJsonSemanticVersion", null, CdmLogCode.WarnPersistJsonSemVerInvalidFormat);
                return 0;
              }
          }
      }

      return 0;
  }
}
