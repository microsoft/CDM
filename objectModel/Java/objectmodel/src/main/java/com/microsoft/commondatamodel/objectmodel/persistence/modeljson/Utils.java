// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.TraitReferencePersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Annotation;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.CsvFormatSettings;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.MetadataObject;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

/**
 * Utility methods for model.json persistence.
 */
public class Utils {
  private static final Map<String, String> annotationToTraitMap = new LinkedHashMap<String, String>() {
    private static final long serialVersionUID = 1863481726936L;

    {
      put("version", "is.CDM.entityVersion");
    }
  };

  public static final Set<String> ignoredTraits = new LinkedHashSet<String>() {
    private static final long serialVersionUID = 1987129612639L;

    {
      add("is.propertyContent.multiTrait");
      add("is.modelConversion.referenceModelMap");
      add("is.modelConversion.modelVersion");
      add("means.measurement.version");
      add("is.CDM.entityVersion");
      add("is.partition.format.CSV");
      add("is.partition.culture");
      add("is.managedBy");
      add("is.hidden");
    }
  };

  // Traits to ignore if they come from properties.
  // These traits become properties on the model.json. To avoid persisting both a trait
  // and a property on the model.json, we filter these traits out.
  public static final Set<String> modelJsonPropertyTraits = new LinkedHashSet<String>() {
    private static final long serialVersionUID = 1560087956924063099L;

    {
      add("is.localized.describedAs");
    }
  };

  public static CompletableFuture<Void> processAnnotationsFromData(
      final CdmCorpusContext ctx,
      final MetadataObject obj,
      final CdmTraitCollection traits) {
    return CompletableFuture.runAsync(() -> {
      final List<Annotation> multiTraitAnnotations = new ArrayList<>();

      if (obj.getAnnotations() != null) {

        for (final Annotation element : obj.getAnnotations()) {
          if (!shouldAnnotationGoIntoASingleTrait(element.getName())) {
            multiTraitAnnotations.add(element);
          } else {
            final CdmTraitReference innerTrait = ctx.getCorpus()
                    .makeObject(CdmObjectType.TraitRef, convertAnnotationToTrait(element.getName()),
                            false);
            innerTrait.getArguments().add(ArgumentPersistence.fromData(ctx, element).join());
            traits.add(innerTrait);
          }
        }

        if (multiTraitAnnotations.size() > 0) {
          final CdmTraitReference trait = ctx.getCorpus()
              .makeRef(CdmObjectType.TraitRef, "is.modelConversion.otherAnnotations", false);
          trait.setFromProperty(false);

          final CdmArgumentDefinition annotationsArgument =
              new CdmArgumentDefinition(ctx, "annotations");
          annotationsArgument.setValue(multiTraitAnnotations);

          trait.getArguments().add(annotationsArgument);
          traits.add(trait);
        }
      }

      if (obj.getTraits() != null) {
        for (final JsonNode trait : obj.getTraits()) {
          final CdmTraitReference traitInstance = TraitReferencePersistence.fromData(ctx, JMapper.MAP.valueToTree(trait));
          traits.add(traitInstance);
        }
      }
    });
  }

  static void processTraitsAndAnnotationsToData(
      final CdmCorpusContext ctx,
      final MetadataObject obj,
      final CdmTraitCollection traits) {
        if (traits == null) {
          return;
        }
  
        final List<Annotation> annotations = new ArrayList<>();
        final List<JsonNode> extensions = new ArrayList<>();
  
        for (final CdmTraitReference trait : traits) {
          if (ExtensionHelper.traitRefIsExtension(trait)) {
            ExtensionHelper.processExtensionTraitToObject(trait, obj);
            continue;
          }
  
          if ("is.modelConversion.otherAnnotations".equals(trait.getNamedReference())) {
            final Object traitArgument = trait.getArguments().get(0).getValue();
            Iterable<?> traitArguments = new ArrayList<>();
            if (traitArgument instanceof List<?>) {
              traitArguments = (ArrayList<?>) traitArgument;
            } else if (traitArgument instanceof JsonNode && ((JsonNode) traitArgument).isArray()) {
              traitArguments =  (JsonNode) traitArgument;
            } else {
              Logger.error(Utils.class.getSimpleName(), ctx, "Unsupported annotation type.");
            }
            for (final Object annotation : traitArguments) {
              if (annotation instanceof JsonNode) {
                final JsonNode jAnnotation = (JsonNode) annotation;
                annotations.add(JMapper.MAP.convertValue(jAnnotation, Annotation.class));
              } else if (annotation instanceof Annotation) {
                annotations.add((Annotation) annotation);
              } else {
                Logger.warning(Utils.class.getSimpleName(), ctx, "Unsupported annotation type.");
              }
            }
          } else if (!ignoredTraits.contains(trait.getNamedReference())
                  && !trait.getNamedReference().startsWith("is.dataFormat")
                  && !(modelJsonPropertyTraits.contains(trait.getNamedReference()) && trait.isFromProperty())
          ) {
            final Object extension = TraitReferencePersistence.toData(trait, null, null);
            extensions.add(JMapper.MAP.valueToTree(extension));
          }
        }
  
        if (!annotations.isEmpty()) {
          obj.setAnnotations(annotations);
        }
  
        if (!extensions.isEmpty()) {
          obj.setTraits(extensions);
        }
  }

  private static String traitToAnnotationName(final String traitName) {
    return "is.CDM.entityVersion".equals(traitName) ? "version" : null;
  }

  static CdmTraitReference createCsvTrait(final CsvFormatSettings obj, final CdmCorpusContext ctx) {
    final CdmTraitReference csvFormatTrait = ctx.getCorpus()
            .makeRef(CdmObjectType.TraitRef, "is.partition.format.CSV", true);
    csvFormatTrait.setSimpleNamedReference(false);

    if (obj.isColumnHeaders() != null) {
      final CdmArgumentDefinition columnHeadersArg = ctx.getCorpus()
              .makeObject(CdmObjectType.ArgumentDef, "columnHeaders");
      columnHeadersArg.setValue(obj.isColumnHeaders() ? "true" : "false");
      csvFormatTrait.getArguments().add(columnHeadersArg);
    }

    if (obj.getCsvStyle() != null) {
      final CdmArgumentDefinition csvStyleArg = ctx.getCorpus()
              .makeObject(CdmObjectType.ArgumentDef, "csvStyle");
      csvStyleArg.setValue(obj.getCsvStyle());
      csvFormatTrait.getArguments().add(csvStyleArg);
    }

    if (obj.getDelimiter() != null) {
      final CdmArgumentDefinition delimiterArg = ctx.getCorpus()
              .makeObject(CdmObjectType.ArgumentDef, "delimiter");
      delimiterArg.setValue(obj.getDelimiter());
      csvFormatTrait.getArguments().add(delimiterArg);
    }

    if (obj.getQuoteStyle() != null) {
      final CdmArgumentDefinition quoteStyleArg = ctx.getCorpus()
              .makeObject(CdmObjectType.ArgumentDef, "quoteStyle");
      quoteStyleArg.setValue(obj.getQuoteStyle());
      csvFormatTrait.getArguments().add(quoteStyleArg);
    }

    if (obj.getEncoding() != null) {
      final CdmArgumentDefinition encodingArg = ctx.getCorpus()
              .makeObject(CdmObjectType.ArgumentDef, "encoding");
      encodingArg.setValue(obj.getEncoding());
      csvFormatTrait.getArguments().add(encodingArg);
    }

    return csvFormatTrait;
  }

  static CsvFormatSettings createCsvFormatSettings(final CdmTraitReference cdmTraitRef) {
    final CsvFormatSettings result = new CsvFormatSettings();

    for (final CdmArgumentDefinition argument : cdmTraitRef.getArguments()) {
      switch (argument.getName()) {
        case "columnHeaders":
          result.setColumnHeaders("true".equals(argument.getValue()));
          break;
        case "csvStyle":
          result.setCsvStyle((String) argument.getValue());
          break;
        case "delimiter":
          result.setDelimiter((String) argument.getValue());
          break;
        case "quoteStyle":
          result.setQuoteStyle((String) argument.getValue());
          break;
        case "encoding":
          result.setEncoding((String) argument.getValue());
          break;
      }
    }

    return result;
  }

  private static boolean shouldAnnotationGoIntoASingleTrait(final String name) {
    return annotationToTraitMap.containsKey(name);
  }

  private static String convertAnnotationToTrait(final String name) {
    return annotationToTraitMap.get(name);
  }


  
  /** 
   * Creates a list of JSON objects that is a copy of the input Iterable object.
   * @param source Source iterable
   * @param resOpt Resolve Options
   * @param options Copy Options
   * @param <T> Type
   * @return List of JsonNode
   */
  public static <T> List<JsonNode> listCopyData(
          final Iterable<T> source,
          final ResolveOptions resOpt,
          final CopyOptions options) {
    if (source == null) {
      return null;
    }

    final List<JsonNode> casted = new ArrayList<>();
    for (final Object element : source) {
      if (element instanceof CdmObject) {
        final Object serialized = ((CdmObject) element).copyData(resOpt, options);
        if (serialized instanceof JsonNode) {
          casted.add((JsonNode) serialized);
        } else {
          casted.add(JMapper.MAP.valueToTree(serialized));
        }
      }
    }

    if (casted.size() == 0) {
      return null;
    }

    return casted;
  }
}
