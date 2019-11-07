package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DataType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DocumentContent;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Import;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.DynamicObjectExtensions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public class DocumentPersistence {

  public static CdmDocumentDefinition fromData(final CdmCorpusContext ctx, final String name, final String nameSpace,
                                               final String path, final DocumentContent obj) {
    final CdmDocumentDefinition doc = ctx.getCorpus().makeObject(CdmObjectType.DocumentDef);
    doc.setFolderPath(path);
    doc.setNamespace(nameSpace);

    // set this as the current doc of the context for this operation
    ctx.updateDocumentContext(doc);

    if (!Strings.isNullOrEmpty(obj.getSchema())) {
      doc.setSchema(obj.getSchema());
    }
    if (DynamicObjectExtensions.hasProperty(obj, "JsonSchemaSemanticVersion") && !Strings
            .isNullOrEmpty(obj.getJsonSchemaSemanticVersion())) {
      doc.setJsonSchemaSemanticVersion(obj.getJsonSchemaSemanticVersion());
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

    ctx.updateDocumentContext(null);

    return doc;
  }

  public static DocumentContent toData(final CdmDocumentDefinition instance, final ResolveOptions resOpt,
                                       final CopyOptions options) {
    final DocumentContent documentContent = new DocumentContent();

    documentContent.setSchema(instance.getSchema());
    documentContent.setJsonSchemaSemanticVersion(instance.getJsonSchemaSemanticVersion());
    documentContent.setImports(Utils.listCopyDataAsCdmObject(instance.getImports(), resOpt, options));
    documentContent.setDefinitions(Utils.listCopyDataAsCdmObject(instance.getDefinitions(), resOpt, options));
    return documentContent;
  }
}
