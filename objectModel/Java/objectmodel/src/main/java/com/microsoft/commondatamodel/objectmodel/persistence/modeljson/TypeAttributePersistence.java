// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmDataFormat;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Attribute;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;

import java.util.List;
import java.util.stream.Collectors;
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
    if (!StringUtils.isNullOrTrimEmpty(obj.getDescription())) {
      attribute.updateDescription(obj.getDescription());
    }

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
    attribute.setDescription((String) instance.fetchProperty(CdmPropertyName.DESCRIPTION));

    return Utils.processTraitsAndAnnotationsToData(instance.getCtx(), attribute, instance.getAppliedTraits()).thenCompose(v -> {
      final TraitToPropertyMap t2pm = new TraitToPropertyMap(instance);
      final CdmTraitReference isHiddenTrait = t2pm.fetchTraitReferenceName("is.hidden");

      if (isHiddenTrait != null) {
        attribute.setHidden(true);
      }

      return CompletableFuture.completedFuture(attribute);
    });
  }

  private static CdmDataFormat dataTypeFromData(final String dataType) {
    switch (dataType.toLowerCase()) {
      case "string":
        return CdmDataFormat.String;
      case "int64":
        return CdmDataFormat.Int64;
      case "double":
        return CdmDataFormat.Double;
      case "datetime":
        return CdmDataFormat.DateTime;
      case "datetimeoffset":
        return CdmDataFormat.DateTimeOffset;
      case "decimal":
        return CdmDataFormat.Decimal;
      case "boolean":
        return CdmDataFormat.Boolean;
      case "guid":
        return CdmDataFormat.Guid;
      case "json":
        return CdmDataFormat.Json;
      default:
        return null;
    }
  }

  private static String dataTypeToData(final CdmDataFormat dataType) {
    switch (dataType) {
      case Int16:
      case Int32:
      case Int64:
        return "int64";
      case Float:
      case Double:
        return "double";
      case Char:
      case String:
        return "string";
      case Guid:
        return "guid";
      case Binary:
        return "boolean";
      case Time:
      case Date:
      case DateTime:
        return "dateTime";
      case DateTimeOffset:
        return "dateTimeOffset";
      case Boolean:
        return "boolean";
      case Decimal:
        return "decimal";
      case Json:
        return "json";
      default:
        return "unclassified";
    }
  }
}
