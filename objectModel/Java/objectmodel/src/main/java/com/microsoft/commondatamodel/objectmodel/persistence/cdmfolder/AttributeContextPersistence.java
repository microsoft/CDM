package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
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
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AttributeContextPersistence {
  private static final Logger LOGGER = LoggerFactory.getLogger(AttributeContextPersistence.class);

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
            LOGGER.error("There was an error while trying to convert from JSON to CdmAttributeContext. Reason: '{}'", ex.getLocalizedMessage());
          }
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
      default:
        return "unknown";
    }
  }
}
