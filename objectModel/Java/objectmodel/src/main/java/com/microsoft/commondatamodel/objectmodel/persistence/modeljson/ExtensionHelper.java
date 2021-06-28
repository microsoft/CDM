// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.MetadataObject;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;
import org.apache.commons.lang3.tuple.Pair;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

final class ExtensionHelper {
  private static final String TAG = ExtensionHelper.class.getSimpleName();

  public static final String EXTENSION_DOC_NAME = "custom.extension.cdm.json";
  /**
   * Dictionary used to cache documents with trait definitions by file name.
   * Needs to be a concurrent dictionary since it is a static property and there might be multiple corpus running on the same environment.
   */
  private static final ConcurrentMap<Pair<CdmCorpusContext, String>, CdmDocumentDefinition> cachedDefDocs = new ConcurrentHashMap<>();
  /**
   * Set of extensions that are officially supported and have their definitions in the extensions
   * folder.
   */
  private static final Set<String> SUPPORTED_EXTENSIONS =
      new HashSet<>(Collections.singletonList("pbi"));
  /**
   * Constant used to store the prefix that is the mark of extension traits.
   */
  private static final String extensionTraitNamePrefix = "is.extension.";

  /**
   * Adds the list of documents with extensions schema definitions to the manifest.
   *
   * @param ctx        The context.
   * @param importDocs The list of paths of documents with relevant schema definitions.
   * @param document   The manifest that needs to import the docs.
   */
  static void addImportDocsToManifest(
      final CdmCorpusContext ctx,
      final List<CdmImport> importDocs,
      final CdmDocumentDefinition document) {
    importDocs.forEach(importDoc -> {
      if (document.getImports()
          .getAllItems()
          .parallelStream()
          .noneMatch(importPresent ->
              Objects.equals(importPresent.getCorpusPath(), importDoc.getCorpusPath()))) {
        document.getImports().add(importDoc);
      }
    });
  }

  /**
   * For all the definitions (name, type) we have found for extensions, search in CDM Standard
   * Schema for definition files. If we find a definition in a CDM Standard Schema file, we add that
   * file to importsList. At the same time, the found definition is removed from
   * extensionTraitDefList. When this function returns, extensionTraitDefList only contains
   * definitions that are not present in any CDM Standard Schema file, and a list of CDM Standard
   * Schema files with relevant definitions is returned.
   *
   * @param ctx                   The context
   * @param extensionTraitDefList The list of all definitions for all found extensions. Function
   *                              modifies this list by removing definitions found in CDM Standard Schema files.
   * @return A list of CDM Standard Schema files to import.
   */
  static CompletableFuture<List<CdmImport>> standardImportDetection(
      final CdmCorpusContext ctx,
      final List<CdmTraitDefinition> extensionTraitDefList,
      final List<CdmTraitDefinition> localExtensionTraitDefList) {
    return CompletableFuture.supplyAsync(() -> {
      final List<CdmImport> importsList = new ArrayList<>();
      boolean hasCustomExtensionImport = false;

      // Have to go from end to start because I might remove elements.
      for (int traitIndex = localExtensionTraitDefList.size() - 1; traitIndex >= 0; traitIndex--) {
        final CdmTraitDefinition extensionTraitDef = localExtensionTraitDefList.get(traitIndex);
        if (!traitDefIsExtension(extensionTraitDef)) {
          Logger.error(ctx, TAG, "standardImportDetection", extensionTraitDef.getAtCorpusPath(), CdmLogCode.ErrPersistInvalidExtensionTrait, extensionTraitDef.getTraitName(), extensionTraitNamePrefix);
          return null;
        }

        final String[] extensionBreakdown = removeExtensionTraitNamePrefix(
            extensionTraitDef.getTraitName())
            .split("[:]", -1);
        if (extensionBreakdown.length > 1) {
          final String extensionName = extensionBreakdown[0];

          if (!SUPPORTED_EXTENSIONS.contains(extensionName)) {
            if (!hasCustomExtensionImport) {
              CdmImport importObject = ctx.getCorpus().makeObject(CdmObjectType.Import);
              importObject.setCorpusPath(EXTENSION_DOC_NAME);
              importsList.add(importObject);
              hasCustomExtensionImport = true;
            }
            continue;
          }

          final String fileName = String.format("%1$s.extension.cdm.json", extensionName);
          final String fileCorpusPath = String.format("cdm:/extensions/%1$s", fileName);

          final CdmDocumentDefinition extensionDoc = fetchDefDoc(ctx, fileName).join();

          // If no document was found for that extensionName,
          // the trait does not have a document with it's definition. CdmTraitDefinition will be
          // kept in extensionTraitDefList (a document with its definition will be created locally).
          if (null == extensionDoc) {
            continue;
          }

          // There is a document with extensionName, now we search for the
          // trait in the document. If we find it, we remove the trait from extensionTraitDefList
          // and add the document to imports.
          CdmObjectDefinition cdmObjectDefinition = extensionDoc.getDefinitions()
              .getAllItems()
              .parallelStream()
              .filter(item ->
                  CdmObjectType.TraitDef == item.getObjectType()
                      && extensionTraitDef.getTraitName().equals(item.fetchObjectDefinitionName()))
              .findAny()
              .orElse(null);
          for (final CdmObjectDefinition item : extensionDoc.getDefinitions()) {
            if (CdmObjectType.TraitDef == item.getObjectType()
                && extensionTraitDef.getTraitName().equals(item.fetchObjectDefinitionName())) {
              cdmObjectDefinition = item;
            }
          }

          final CdmTraitDefinition matchingTrait =
              cdmObjectDefinition instanceof CdmTraitDefinition ? (CdmTraitDefinition) cdmObjectDefinition : null;

          if (null != matchingTrait) {
            final List<CdmParameterDefinition> parameterList = matchingTrait.getParameters().getAllItems();

            if (extensionTraitDef.getParameters().getAllItems().parallelStream().allMatch(
                extensionParameter -> (parameterList.parallelStream().anyMatch(
                    defParameter -> defParameter.getName().equalsIgnoreCase(
                        extensionParameter.getName()))))) {
              extensionTraitDefList.remove(extensionTraitDef);

              if (importsList.parallelStream().noneMatch(
                  importDoc -> importDoc.getCorpusPath().equalsIgnoreCase(fileCorpusPath))) {
                final CdmImport importObject =
                    ctx.getCorpus().makeObject(CdmObjectType.Import);

                importObject.setCorpusPath(fileCorpusPath);
                importsList.add(importObject);
              }
            }
          }
        }
      }
      return importsList;
    });
  }

  /**
   * Processes extensions from an object which was obtained from a "model.json" file. From every
   * extension found, its value (name, value) is added to traitRefSet, and its definition (name,
   * type) is added to extensionTraitDefList.
   *
   * @param ctx                   The context
   * @param sourceObject          The object obtained from "model.json" file.
   * @param traitRefSet           The list of extensions found, in the form of (name & value).
   * @param extensionTraitDefList The list of definitions# For each extension, it's definition is
   *                              added to this list (name & type).
   */
  static void processExtensionFromJson(
      final CdmCorpusContext ctx,
      final MetadataObject sourceObject,
      final CdmTraitCollection traitRefSet,
      final List<CdmTraitDefinition> extensionTraitDefList) {
    processExtensionFromJson(ctx, sourceObject, traitRefSet, extensionTraitDefList, null);
  }

  /**
   * Processes extensions from an object which was obtained from a "model.json" file. From every
   * extension found, its value (name, value) is added to traitRefSet, and its definition (name,
   * type) is added to extensionTraitDefList.
   *
   * @param ctx                        The context
   * @param sourceObject               The object obtained from "model.json" file.
   * @param traitRefSet                The list of extensions found, in the form of (name & value).
   * @param extensionTraitDefList      The list of definitions# For each extension, it's definition
   *                                   is added to this list (name & type).
   * @param localExtensionTraitDefList Same as extensionTraitDefList but limited to extensions
   *                                   inside one document.
   */
  static void processExtensionFromJson(
      final CdmCorpusContext ctx,
      final MetadataObject sourceObject,
      final CdmTraitCollection traitRefSet,
      final List<CdmTraitDefinition> extensionTraitDefList,
      final List<CdmTraitDefinition> localExtensionTraitDefList) {
    for (final Map.Entry<String, Object> extension : sourceObject.getExtensionFields().entrySet()) {
      final JsonNode jsonNode = JMapper.MAP.valueToTree(extension.getValue());
      final String traitName = addExtensionTraitNamePrefix(extension.getKey());

      CdmTraitDefinition extensionTraitDef =
          extensionTraitDefList
              .parallelStream()
              .filter(trait -> trait.getTraitName().equalsIgnoreCase(traitName))
              .findFirst()
              .orElse(null);

      final boolean isTraitExists = null != extensionTraitDef;
      if (!isTraitExists) {
        extensionTraitDef = ctx.getCorpus().makeObject(CdmObjectType.TraitDef,
            traitName);

        extensionTraitDef.setExtendsTrait(ctx.getCorpus().makeObject(
            CdmObjectType.TraitRef,
            "is.extension", true));
      }

      final CdmTraitReference extensionTraitRef =
          ctx.getCorpus().makeObject(CdmObjectType.TraitRef, traitName);

      if (jsonNode.isObject()) {
        final Iterator<Map.Entry<String, JsonNode>> fields = jsonNode.fields();
        while (fields.hasNext()) {
          final Map.Entry<String, JsonNode> field = fields.next();
          final String extensionProperty = field.getKey();
          final JsonNode extensionPropertyValue = field.getValue();

          if (extensionPropertyValue == null) {
            continue;
          }

          final CdmArgumentDefinition extensionArgument = ctx.getCorpus()
              .makeObject(CdmObjectType.ArgumentDef, extensionProperty);

          final List<CdmParameterDefinition> parameters = extensionTraitDef.getParameters().getAllItems();
          CdmParameterDefinition extensionParameter = parameters.parallelStream()
              .filter(parameter -> null != parameter && parameter.getName().equalsIgnoreCase(extensionProperty))
              .findFirst().orElse(null);
          final boolean parameterExists = null != extensionParameter;

          if (!parameterExists) {
            extensionParameter = ctx.getCorpus().makeObject(CdmObjectType.ParameterDef, extensionProperty);

            extensionParameter.setDataTypeRef(ctx.getCorpus().makeObject(
                CdmObjectType.DataTypeRef,
                convertJsonNodeTypeToExpectedString(field.getValue()),
                true));
          }

          extensionArgument.setValue(extensionPropertyValue);
          extensionTraitRef.getArguments().add(extensionArgument);

          if (!parameterExists) {
            extensionTraitDef.getParameters().add(extensionParameter);
          }
        }
      } else {
        final CdmArgumentDefinition extensionArgument = ctx.getCorpus().makeObject(
            CdmObjectType.ArgumentDef, traitName);

        CdmParameterDefinition extensionParameter = extensionTraitDef.getParameters()
            .getAllItems().parallelStream()
            .filter(parameter -> parameter.getName().equalsIgnoreCase(traitName))
            .findFirst()
            .orElse(null);

        final boolean parameterExists = null != extensionParameter;
        if (!parameterExists) {
          extensionParameter = ctx.getCorpus().makeObject(
              CdmObjectType.ParameterDef,
              traitName);

          extensionParameter.setDataTypeRef(ctx.getCorpus().makeObject(
              CdmObjectType.DataTypeRef,
              convertJsonNodeTypeToExpectedString(jsonNode),
              true));
        }

        extensionArgument.setValue(jsonNode);
        extensionTraitRef.getArguments().add(extensionArgument);

        if (!parameterExists) {
          extensionTraitDef.getParameters().add(extensionParameter);
        }
      }

      if (!isTraitExists) {
        extensionTraitDefList.add(extensionTraitDef);
      }

      if (localExtensionTraitDefList != null) {
        localExtensionTraitDefList.add(extensionTraitDef);
      }

      traitRefSet.add(extensionTraitRef);
    }
  }

  /**
   * Used as helper for converting a CdmManifestDefinition to a Model. Adds an extension stored in "CdmManifestDefinition" format to
   * the data structure representing a <see cref="Model"/>
   *
   * @param extensionTraitRef The data structure containing the extension in the format used by the
   *                          CdmManifestDefinition
   * @param destination       The data structure used by <see cref="Model"/> where the data will be added
   *                          to. There are multiple data structures that can have extensions, and any of these can be used
   *                          here (assuming they are used by Model.Json data format)
   */
  static void processExtensionTraitToObject(
      final CdmTraitReference extensionTraitRef,
      final MetadataObject destination) {
    if (null == destination.getExtensionFields()) {
      destination.setOverrideExtensionFields(new LinkedHashMap<String, Object>() {{
        put(UUID.randomUUID().toString(), JsonNodeFactory.instance.objectNode());
      }});
    }

    final String originalExtensionName = removeExtensionTraitNamePrefix(extensionTraitRef.getNamedReference());
    final JsonNode extensionValue;

    if (extensionTraitRef.getArguments().getCount() == 1 &&
        extensionTraitRef.getArguments().get(0).getName().equals(extensionTraitRef.getNamedReference())) {
      extensionValue = (JsonNode) extensionTraitRef.getArguments().get(0).getValue();
    } else {
      final ObjectNode extensionValueAsJObject = JsonNodeFactory.instance.objectNode();
      for (final CdmArgumentDefinition argument : extensionTraitRef.getArguments()) {
        final String propertyName = argument.getName();
        final Object propertyValue = argument.getValue();

        extensionValueAsJObject.put(propertyName, JMapper.MAP.valueToTree(propertyValue));
      }

      extensionValue = extensionValueAsJObject;
    }

    (destination.getExtensionFields()).put(originalExtensionName, extensionValue);
  }

  /**
   * Checks whether a trait name has the specific mark of an extension (begins with <see
   * cref="ExtensionTraitNamePrefix"/>)
   *
   * @param traitName The name of the trait to be checked.
   * @return Whether the trait is an extension.
   */
  private static boolean traitNameHasExtensionMark(final String traitName) {
    if (StringUtils.isNullOrEmpty(traitName)) {
      return false;
    }

    return traitName.startsWith(extensionTraitNamePrefix);
  }

  /**
   * Checks whether a <see cref="CdmTraitReferenceBase"/> is an extension.
   *
   * @param trait The trait to be checked whether it is an extension.
   * @return Whether the trait is an extension.
   */
  static boolean traitRefIsExtension(final CdmTraitReferenceBase trait) {
    return traitNameHasExtensionMark(trait.getNamedReference());
  }

  /**
   * Checks whether a {@link CdmTraitDefinition} is an extension.
   *
   * @param trait The trait to be checked whether it is an extension.
   * @return Whether the trait is an extension.
   */
  private static boolean traitDefIsExtension(final CdmTraitDefinition trait) {
    return traitNameHasExtensionMark(trait.getTraitName());
  }

  /**
   * Tries to fetch the document with expected fileName. Caches results in {@code cachedDefDocs}.
   *
   * @param ctx      The context
   * @param fileName The name of the file that needs to be fetched.
   * @return The content of the definition file with the expected fileName, or null if no such file
   * was found.
   */
  private static CompletableFuture<CdmDocumentDefinition> fetchDefDoc(final CdmCorpusContext ctx,
                                                                      final String fileName) {
    // Since the CachedDefDocs is a static property and there might be multiple corpus running,
    // we need to make sure that each corpus will have its own cached def document.
    // This is achieved by adding the context as part of the key to the document.
    Pair<CdmCorpusContext, String> key = Pair.of(ctx, fileName);
    if (cachedDefDocs.containsKey(key)) {
      return CompletableFuture.completedFuture(cachedDefDocs.get(key));
    }

    final String path = String.format("/extensions/%1$s", fileName);

    return ctx.getCorpus().fetchObjectAsync(
        path,
        ctx.getCorpus()
            .getStorage()
            .fetchRootFolder("cdm"))
        .thenApply(
            (document) -> {
              if (document != null) {
                final CdmDocumentDefinition extensionDoc =
                    document instanceof CdmDocumentDefinition ? (CdmDocumentDefinition) document : null;

                cachedDefDocs.put(key, extensionDoc);
                return extensionDoc;
              }
              return null;
            });
  }

  /**
   * Converts JsonNode to a string representing the type as expected in a CdmManifestDefinition.
   *
   * @param type The type of the extension in the format used to deserialize Model.Json (JsonNode)
   * @return One of the allowed strings representing a type in a CdmManifestDefinition.
   */
  private static String convertJsonNodeTypeToExpectedString(final JsonNode type) {
    String stringType = type.getNodeType().name().toLowerCase();
    if ("array".equals(stringType)) {
      stringType = "object";
    }
    return stringType;
  }

  /**
   * Context: To mark a trait as an extension, a prefix is added to the trait name. This function
   * does the opposite; given a trait name with the extension prefix, it removes the prefix.
   *
   * @param traitName The trait name with the extension prefix.
   * @return The trait name after the prefix was removed.
   */
  private static String removeExtensionTraitNamePrefix(final String traitName) {
    return traitName.substring(extensionTraitNamePrefix.length());
  }

  /**
   * Adds a prefix to a trait name, marking it as an extension (<see cref="ExtensionTraitNamePrefix"/>)
   *
   * @param traitName The name of the trait to be marked as extension.
   * @return The trait name with the prefix that marks an extension.
   */
  private static String addExtensionTraitNamePrefix(final String traitName) {
    return String.format("%1$s%2$s", extensionTraitNamePrefix, traitName);
  }
}
