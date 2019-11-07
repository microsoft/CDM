// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.TraitReferencePersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Annotation;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.CsvFormatSettings;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.MetadataObject;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Utility methods for model.json persistence.
 */
public class Utils {

  private static final Logger LOGGER = LoggerFactory.getLogger(Utils.class);

  private static final Map<String, String> annotationToTraitMap = new HashMap<String, String>() {
    private static final long serialVersionUID = 1863481726936L;

    {
      put("version", "is.CDM.entityVersion");
    }
  };

  private static final Set<String> ignoredTraits = new LinkedHashSet<String>() {
    private static final long serialVersionUID = 1987129612639L;

    {
      add("is.modelConversion.otherAnnotations");
      add("is.propertyContent.multiTrait");
      add("is.modelConversion.referenceModelMap");
      add("is.modelConversion.modelVersion");
      add("means.measurement.version");
      add("is.partition.format.CSV");
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

        final CdmTraitReference trait = ctx.getCorpus()
                .makeRef(CdmObjectType.TraitRef, "is.modelConversion.otherAnnotations", false);
        trait.setFromProperty(true);

        final CdmArgumentDefinition annotationsArgument =
            new CdmArgumentDefinition(ctx, "annotations");
        annotationsArgument.setValue(multiTraitAnnotations);

        trait.getArguments().add(annotationsArgument);
        traits.add(trait);
      }

      if (obj.getTraits() != null) {
        for (final JsonNode trait : obj.getTraits()) {
          final CdmTraitReference traitInstance = TraitReferencePersistence.fromData(ctx, JMapper.MAP.valueToTree(trait));
          traits.add(traitInstance);
        }
      }
    });
  }

  static CompletableFuture<Void> processAnnotationsToData(
      final CdmCorpusContext ctx,
      final MetadataObject obj,
      final CdmTraitCollection traits) {
    return CompletableFuture.runAsync(() -> {
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
            LOGGER.error("Unsupported annotation type.");
          }
          for (final Object annotation : traitArguments) {
            if (annotation instanceof JsonNode) {
              final JsonNode jAnnotation = (JsonNode) annotation;
              annotations.add(JMapper.MAP.convertValue(jAnnotation, Annotation.class));
            } else if (annotation instanceof Annotation) {
              annotations.add((Annotation) annotation);
            } else {
              LOGGER.warn("Unsupported annotation type.");
            }
          }
        } else if (!trait.isFromProperty()) {
          final String annotationName = traitToAnnotationName(trait.getNamedReference());
          if (annotationName != null
              && trait.getArguments() != null
              && trait.getArguments().getAllItems().size() == 1) {
            final Annotation argument =
                ArgumentPersistence.toData(
                    trait.getArguments().get(0),
                    null,
                    null).join();
            if (argument != null) {
              argument.setName(annotationName);
              annotations.add(argument);
            }
          } else if (!ignoredTraits.contains(trait.getNamedReference())) {
            final Object extension = TraitReferencePersistence.toData(trait, null, null);
            extensions.add(JMapper.MAP.valueToTree(extension));
          }
        }
      }

      if (!annotations.isEmpty()) {
        obj.setAnnotations(annotations);
      }

      if (!extensions.isEmpty()) {
        obj.setTraits(extensions);
      }
    });
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
}
