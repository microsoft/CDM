// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContextReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.AttributeContext;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class AttributeContextPersistence {
  public static CdmAttributeContext fromData(final CdmCorpusContext ctx, final AttributeContext obj) {
    if (obj == null)
      return null;

    final CdmAttributeContext attributeContext = ctx.getCorpus().makeObject(
            CdmObjectType.AttributeContextDef, obj.getName(), false);

    attributeContext.setType(mapTypeNameToEnum(obj.getType()));

    if (obj.getParent() != null)
      attributeContext.setParent(AttributeContextReferencePersistence.fromData(ctx, obj.getParent()));

    if (!Strings.isNullOrEmpty(obj.getExplanation()))
      attributeContext.setExplanation(obj.getExplanation());

    if (obj.getDefinition() != null) {
      switch (attributeContext.getType()) {
        case Entity:
        case EntityReferenceExtends:
          attributeContext.setDefinition(EntityReferencePersistence.fromData(ctx, JMapper.MAP.valueToTree(obj.getDefinition())));
          break;
        case AttributeGroup:
          attributeContext.setDefinition(AttributeGroupReferencePersistence.fromData(ctx, JMapper.MAP.valueToTree(obj.getDefinition())));
          break;
        case AddedAttributeSupporting:
        case AddedAttributeIdentity:
        case AddedAttributeExpansionTotal:
        case AddedAttributeSelectedType:
        case AttributeDefinition:
          attributeContext.setDefinition(AttributeReferencePersistence.fromData(ctx, JMapper.MAP.valueToTree(obj.getDefinition())));
          break;
      }
    }

    // i know the trait collection names look wrong. but I wanted to use the def baseclass
    Utils.addListToCdmCollection(attributeContext.getExhibitsTraits(), Utils.createTraitReferenceList(ctx, obj.getAppliedTraits()));

    if (obj.getContents() != null) {
      for (final JsonNode node : obj.getContents()) {
        if (node.isValueNode()) {
          attributeContext.getContents().add(AttributeReferencePersistence.fromData(ctx, node));
        } else
          try {
            attributeContext.getContents().add(fromData(ctx, JMapper.MAP.treeToValue(node, AttributeContext.class)));
          } catch (final IOException ex) {
            Logger.error(
                AttributeContextPersistence.class.getSimpleName(),
                ctx,
                Logger.format("There was an error while trying to convert from JSON to CdmAttributeContext. Reason: '{0}'", ex.getLocalizedMessage()),
                "fromData"
            );
          }
      }
    }

    if (obj.getLineage() != null) {
      attributeContext.setLineage(new CdmCollection<CdmAttributeContextReference>(ctx, attributeContext, CdmObjectType.AttributeContextRef));
      for (final JsonNode node : obj.getLineage()) {
        attributeContext.getLineage().add(AttributeContextReferencePersistence.fromData(ctx, node));
      }
    }

    return attributeContext;
  }

  public static AttributeContext toData(final CdmAttributeContext instance, final ResolveOptions resOpt, final CopyOptions options) {
    final AttributeContext result = new AttributeContext();

    result.setExplanation(instance.getExplanation());
    result.setName(instance.getName());
    result.setType(mapEnumToTypeName(instance.getType()));
    result.setParent(instance.getParent() != null ? instance.getParent().copyData(resOpt, options).toString() : null);
    final CdmObjectReference definition = instance.getDefinition();
    if (definition != null) {
      final Object resolvedDefinition = definition.copyData(resOpt, options);
      if (resolvedDefinition != null) {
        result.setDefinition(resolvedDefinition.toString());
      }
    } else {
      result.setDefinition(null);
    }

    // i know the trait collection names look wrong. but I wanted to use the def baseclass
    if (instance.getExhibitsTraits() != null) {
      final List<CdmObject> traits = new ArrayList<>();
      instance.getExhibitsTraits().forEach((CdmTraitReference trait) -> {
        if (!trait.isFromProperty())
          traits.add(trait);
      });
      result.setAppliedTraits(Utils.listCopyDataAsArrayNode(traits, resOpt, options));
    }

    if (instance.getContents() != null) {
      result.setContents(Utils.listCopyDataAsArrayNode(instance.getContents(), resOpt, options));
    }

    if (instance.getLineage() != null) {
      result.setLineage(Utils.listCopyDataAsArrayNode(instance.getLineage(), resOpt, options));
    }

    return result;
  }

  private static CdmAttributeContextType mapTypeNameToEnum(final String typeName) {
    switch (typeName) {
      case "entity":
        return CdmAttributeContextType.Entity;
      case "entityReferenceExtends":
        return CdmAttributeContextType.EntityReferenceExtends;
      case "attributeGroup":
        return CdmAttributeContextType.AttributeGroup;
      case "attributeDefinition":
        return CdmAttributeContextType.AttributeDefinition;
      case "addedAttributeSupporting":
        return CdmAttributeContextType.AddedAttributeSupporting;
      case "addedAttributeIdentity":
        return CdmAttributeContextType.AddedAttributeIdentity;
      case "addedAttributeExpansionTotal":
        return CdmAttributeContextType.AddedAttributeExpansionTotal;
      case "addedAttributeSelectedType":
        return CdmAttributeContextType.AddedAttributeSelectedType;
      case "generatedRound":
        return CdmAttributeContextType.GeneratedRound;
      case "generatedSet":
        return CdmAttributeContextType.GeneratedSet;
      case "projection":
        return CdmAttributeContextType.Projection;
      case "source":
        return CdmAttributeContextType.Source;
      case "operations":
        return CdmAttributeContextType.Operations;
      case "operationAddCountAttribute":
        return CdmAttributeContextType.OperationAddCountAttribute;
      case "operationAddSupportingAttribute":
        return CdmAttributeContextType.OperationAddSupportingAttribute;
      case "operationAddTypeAttribute":
        return CdmAttributeContextType.OperationAddTypeAttribute;
      case "operationExcludeAttributes":
        return CdmAttributeContextType.OperationExcludeAttributes;
      case "operationArrayExpansion":
        return CdmAttributeContextType.OperationArrayExpansion;
      case "operationCombineAttributes":
        return CdmAttributeContextType.OperationCombineAttributes;
      case "operationRenameAttributes":
        return CdmAttributeContextType.OperationRenameAttributes;
      case "operationReplaceAsForeignKey":
        return CdmAttributeContextType.OperationReplaceAsForeignKey;
      case "operationIncludeAttributes":
        return CdmAttributeContextType.OperationIncludeAttributes;
      case "operationAddAttributeGroup":
        return CdmAttributeContextType.OperationAddAttributeGroup;
      default:
        return null;
    }
  }

  private static String mapEnumToTypeName(final CdmAttributeContextType enumVal) {
    switch (enumVal) {
      case Entity:
        return "entity";
      case EntityReferenceExtends:
        return "entityReferenceExtends";
      case AttributeGroup:
        return "attributeGroup";
      case AttributeDefinition:
        return "attributeDefinition";
      case AddedAttributeSupporting:
        return "addedAttributeSupporting";
      case AddedAttributeIdentity:
        return "addedAttributeIdentity";
      case AddedAttributeExpansionTotal:
        return "addedAttributeExpansionTotal";
      case AddedAttributeSelectedType:
        return "addedAttributeSelectedType";
      case GeneratedRound:
        return "generatedRound";
      case GeneratedSet:
        return "generatedSet";
      case Projection:
        return "projection";
      case Source:
        return "source";
      case Operations:
        return "operations";
      case OperationAddCountAttribute:
        return "operationAddCountAttribute";
      case OperationAddSupportingAttribute:
        return "operationAddSupportingAttribute";
      case OperationAddTypeAttribute:
        return "operationAddTypeAttribute";
      case OperationExcludeAttributes:
        return "operationExcludeAttributes";
      case OperationArrayExpansion:
        return "operationArrayExpansion";
      case OperationCombineAttributes:
        return "operationCombineAttributes";
      case OperationRenameAttributes:
        return "operationRenameAttributes";
      case OperationReplaceAsForeignKey:
        return "operationReplaceAsForeignKey";
      case OperationIncludeAttributes:
        return "operationIncludeAttributes";
      case OperationAddAttributeGroup:
        return "operationAddAttributeGroup";
      default:
        return "unknown";
    }
  }
}
