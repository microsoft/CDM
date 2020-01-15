package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Attribute;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class TypeAttributePersistence {

  public static CompletableFuture<CdmTypeAttributeDefinition> fromData(
      final CdmCorpusContext ctx,
      final Attribute obj,
      final List<CdmTraitDefinition> extensionTraitDefList,
      final List<CdmTraitDefinition> localExtensionTraitDefList) {
    final CdmTypeAttributeDefinition attribute = ctx.getCorpus().makeObject(CdmObjectType.TypeAttributeDef, obj.getName());
    // Do a conversion between CDM data format and model.json data type.
    attribute.updateDataFormat(dataTypeFromData(obj.getDataType()));
    attribute.updateDescription(obj.getDescription());

    if (obj.isHidden() != null && obj.isHidden()) {
      final CdmTraitReference isHiddenTrait = ctx.getCorpus().makeObject(CdmObjectType.TraitRef, "is.hidden");
      isHiddenTrait.setFromProperty(true);
      attribute.getAppliedTraits().add(isHiddenTrait);
    }

    return Utils.processAnnotationsFromData(ctx, obj, attribute.getAppliedTraits())
        .thenCompose(v -> {
          ExtensionHelper.processExtensionFromJson(
              ctx,
              obj,
              attribute.getAppliedTraits(),
              extensionTraitDefList,
              localExtensionTraitDefList);
          return CompletableFuture.completedFuture(attribute);
        });
  }

  public static CompletableFuture<Attribute> toData(final CdmTypeAttributeDefinition instance, final ResolveOptions resOpt,
                                                    final CopyOptions options) {
    final Attribute attribute = new Attribute();
    attribute.setName(instance.getName());
    attribute.setDataType(dataTypeToData(instance.fetchDataFormat()));
    attribute.setDescription(instance.fetchDescription());

    return Utils.processAnnotationsToData(instance.getCtx(), attribute, instance.getAppliedTraits()).thenCompose(v -> {
      final TraitToPropertyMap t2pm = new TraitToPropertyMap(instance);
      final CdmTraitReference isHiddenTrait = t2pm.fetchTraitReferenceName("is.hidden");

      if (isHiddenTrait != null) {
        attribute.setHidden(true);
      }

      return CompletableFuture.completedFuture(attribute);
    });
  }

  private static String dataTypeFromData(final String dataType) {
    switch (dataType.toLowerCase()) {
      case "string":
        return "String";
      case "int64":
        return "Int64";
      case "double":
        return "Double";
      case "datetime":
        return "DateTime";
      case "datetimeoffset":
        return "DateTimeOffset";
      case "decimal":
        return "Decimal";
      case "boolean":
        return "Boolean";
      case "guid":
        return "Guid";
      case "json":
        return "json";
      default:
        return null;
    }
  }

  private static String dataTypeToData(final String dataType) {
    switch (dataType.toLowerCase()) {
      case "int16":
      case "int32":
      case "int64":
        return "int64";
      case "float":
      case "double":
        return "double";
      case "char":
      case "string":
        return "string";
      case "guid":
        return "guid";
      case "binary":
        return "boolean";
      case "time":
      case "date":
      case "datetime":
        return "dateTime";
      case "datetimeoffset":
        return "dateTimeOffset";
      case "boolean":
        return "boolean";
      case "decimal":
        return "decimal";
      case "json":
        return "json";
      default:
        return "unclassified";
    }
  }
}