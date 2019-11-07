// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmImport;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmParameterDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.MetadataObject;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class ExtensionHelper {
  private static final Logger LOGGER = LoggerFactory.getLogger(ExtensionHelper.class);

  /**
   * Dictionary used to cache documents with trait definitions by file name.
   */
  private static final Map<String, CdmDocumentDefinition> cachedDefDocs = new HashMap<>();

  /**
   * Constant used to store the prefix that is the mark of extension traits.
   */
  public static final String extensionTraitNamePrefix = "is.extension.";

  /**
   * For all the definitions (name, type) we have found for extensions, search in CDM Standard
   * Schema for definition files. If we find a definition in a CDM Standard Schema file, we add that
   * file to importsList. At the same time, the found definition is removed from
   * extensionTraitDefList. When this function returns, extensionTraitDefList only contains
   * definitions that are not present in any CDM Standard Schema file, and a list of CDM Standard
   * Schema files with relevant definitions is returned.
   *
   * @param ctx The context
   * @param extensionTraitDefList The list of all definitions for all found extensions. Function
   * modifies this list by removing definitions found in CDM Standard Schema files.
   * @return A list of CDM Standard Schema files to import.
   */
  public static CompletableFuture<List<CdmImport>> standardImportDetection(
          final CdmCorpusContext ctx,
          final CdmCollection<CdmTraitDefinition> extensionTraitDefList) {
    return CompletableFuture.supplyAsync(() -> {
      final List<CdmImport> importsList = new ArrayList<>();

      // Have to go from end to start because I might remove elements.
      for (int traitIndex = extensionTraitDefList.getCount() - 1; traitIndex >= 0; traitIndex--) {
        final CdmTraitDefinition extensionTraitDef = extensionTraitDefList.get(traitIndex);
        if (!traitDefIsExtension(extensionTraitDef)) {
          LOGGER.error(
              "Invalid extension trait name '{}', expected prefix '{}'",
              extensionTraitDef.getTraitName(),
              extensionTraitNamePrefix);

          return null;
        }

        final String[] extensionBreakdown = removeExtensionTraitNamePrefix(
            extensionTraitDef.getTraitName())
            .split("[:]", -1);
        if (extensionBreakdown.length > 1) {
          final String extensionName = extensionBreakdown[0];
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
          CdmObjectDefinition cdmObjectDefinition = null;
          for (final CdmObjectDefinition item : extensionDoc.getDefinitions().getAllItems()) {
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
              extensionTraitDefList.remove(extensionTraitDefList.get(traitIndex));

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
   * extension found, it's value (name, value) is added to traitRefSet, and it's definition (name,
   * type) is added to extensionTraitDefList.
   *
   * @param ctx The context
   * @param sourceObject The object obtained from "model.json" file.
   * @param traitRefSet The list of extensions found, in the form of (name & value).
   * @param extensionTraitDefList The list of definitions# For each extension, it's definition is
   * added to this list (name & type).
   */
  public static void processExtensionFromJson(final CdmCorpusContext ctx,
                                              final MetadataObject sourceObject,
                                              final CdmTraitCollection traitRefSet,
                                              final CdmCollection<CdmTraitDefinition> extensionTraitDefList) {
    for (final Map.Entry<String, Object> extension : sourceObject.getExtensionFields().entrySet()) {
      final JsonNode jsonNode = JMapper.MAP.valueToTree(extension.getValue());
      final String traitName = addExtensionTraitNamePrefix(extension.getKey());

      final CdmTraitReference extensionTraitRef = ctx.getCorpus().makeObject(CdmObjectType.TraitRef,
          traitName);

      CdmTraitDefinition extensionTraitDef = extensionTraitDefList.getAllItems().parallelStream()
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
                    convertJSONNodeTypeToExpectedString(field.getValue()),
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
              convertJSONNodeTypeToExpectedString(jsonNode),
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

      traitRefSet.add(extensionTraitRef);
    }
  }

  /**
   * Used as helper for converting a CdmManifestDefinition to a Model. Adds an extension stored in "CdmManifestDefinition" format to
   * the data structure representing a <see cref="Model"/>
   *
   * @param extensionTraitRef The data structure containing the extension in the format used by the
   * CdmManifestDefinition
   * @param destination The data structure used by <see cref="Model"/> where the data will be added
   * to. There are multiple data structures that can have extensions, and any of these can be used
   * here (assuming they are used by Model.Json data format)
   */
  public static void processExtensionTraitToObject(
          final CdmTraitReference extensionTraitRef,
          final MetadataObject destination) {
    if (null == destination.getExtensionFields()) {
      destination.setOverrideExtensionFields(new HashMap<String, Object>() {{
        put(UUID.randomUUID().toString(), JsonNodeFactory.instance.objectNode());
      }});
    }

    final String originalExtensionName = removeExtensionTraitNamePrefix(extensionTraitRef.getNamedReference());
    final JsonNode extensionValue;

    if (extensionTraitRef.getArguments().getCount() == 1 &&
        extensionTraitRef.getArguments().get(0).getName().equals(extensionTraitRef.getNamedReference())) {
      extensionValue = JMapper.MAP.valueToTree(extensionTraitRef.getArguments().get(0).getValue());
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
  public static boolean traitNameHasExtensionMark(final String traitName) {
    if (Strings.isNullOrEmpty(traitName)) {
      return false;
    }

    return traitName.startsWith(extensionTraitNamePrefix);
  }

  /**
   * Checks whether a <see cref="CdmTraitReference"/> is an extension.
   *
   * @param trait The trait to be checked whether it is an extension.
   * @return Whether the trait is an extension.
   */
  public static boolean traitRefIsExtension(final CdmTraitReference trait) {
    return traitNameHasExtensionMark(trait.getNamedReference());
  }

  /**
   * Checks whether a <see cref="CdmTraitDefinition"/> is an extension.
   *
   * @param trait The trait to be checked whether it is an extension.
   * <return>Whether the trait is an extension.</return>
   */
  public static boolean traitDefIsExtension(final CdmTraitDefinition trait) {
    return traitNameHasExtensionMark(trait.getTraitName());
  }

  /**
   * Tries to fetch the document with expected fileName. Caches results in <see
   * cref="CachedDefDocs"/>.
   *
   * @param ctx The context
   * @param fileName The name of the file that needs to be fetchd.
   * @return The content of the definition file with the expected fileName, or null if no such file
   * was found.
   */
  private static CompletableFuture<CdmDocumentDefinition> fetchDefDoc(final CdmCorpusContext ctx,
                                                                      final String fileName) {
    if (cachedDefDocs.containsKey(fileName)) {
      return CompletableFuture.completedFuture(cachedDefDocs.get(fileName));
    }

    final String path = String.format("/extensions/%1$s", fileName);

    return ctx.getCorpus().fetchObjectAsync(
        path,
        ctx.getCorpus()
            .getStorage()
            .fetchRootFolder("cdm"))
        .thenCompose((document) -> {
      final CdmDocumentDefinition extensionDoc =
              document instanceof CdmDocumentDefinition ? (CdmDocumentDefinition) document : null;

      cachedDefDocs.put(fileName, extensionDoc);

      return CompletableFuture.completedFuture(extensionDoc);
    });
  }

  /**
   * Converts JsonNode to a string representing the type as expected in a CdmManifestDefinition.
   *
   * @param type The type of the extension in the format used to deserialize Model.Json (JsonNode)
   * @return One of the allowed strings representing a type in a CdmManifestDefinition.
   */
  private static String convertJSONNodeTypeToExpectedString(final JsonNode type) {
    return type.getNodeType().name().toLowerCase();
  }

  /**
   * Context: To mark a trait as an extension, a prefix is added to the trait name. This function
   * does the oposite; given a trait name with the extension prefix, it removes the prefix.
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
