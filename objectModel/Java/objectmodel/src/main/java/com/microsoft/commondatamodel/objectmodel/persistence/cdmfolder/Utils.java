// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.BooleanNode;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeItem;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.util.ArrayList;
import java.util.List;

public class Utils {
  // TODO-BQ: This class needs to be removed, as it is not sustainable.
  public static class CopyIdentifierRef {
    @JsonProperty("atCorpusPath")
    private String atCorpusPath;
    @JsonProperty("identifier")
    private String identifier;

    public CopyIdentifierRef() {
    }

    public String getAtCorpusPath() {
      return atCorpusPath;
    }

    public void setAtCorpusPath(final String atCorpusPath) {
      this.atCorpusPath = atCorpusPath;
    }

    public String getIdentifier() {
      return identifier;
    }

    public void setIdentifier(final String identifier) {
      this.identifier = identifier;
    }
  }



  /**
   * Create a copy of the reference object.
   * @param objRef CdmObjectReference
   * @param resOpt ResolveOptions
   * @param options CopyOptions
   * @return Object
   */
  public static Object copyIdentifierRef(final CdmObjectReference objRef, final ResolveOptions resOpt,
                                         final CopyOptions options) {
    // TODO-BQ: This function's return type is different than the C#, because Java does not support "anonymous class" like c# does.
    final String identifier = objRef.getNamedReference();
    if (options == null || options.getIsStringRefs() == null || !options.getIsStringRefs()) {
      return identifier;
//      CopyIdentifierRef result = new CopyIdentifierRef();
//      result.setIdentifier(identifier);
//      return result;
    }

    final CdmObjectDefinition resolved = objRef.fetchObjectDefinition(resOpt);
    if (resolved == null) {
      return identifier;
//      CopyIdentifierRef result = new CopyIdentifierRef();
//      result.setIdentifier(identifier);
//      return result;
    }

    final CopyIdentifierRef result = new CopyIdentifierRef();
    result.setAtCorpusPath(resolved.getAtCorpusPath());
    result.setIdentifier(identifier);
    return result;
  }

  /**
   * Creates a JSON object in the correct shape given an instance of a CDM object.
   * @param instance Object
   * @param resOpt ResolveOptions
   * @param options CopyOptions
   * @return JsonNode
   */
  public static JsonNode jsonForm(final Object instance, final ResolveOptions resOpt, final CopyOptions options) {
    if (instance == null) {
      return null;
    }
    if (instance instanceof CdmObject) {
      final Object dataForm = ((CdmObject) instance).copyData(resOpt, options);
      if (dataForm == null) {
        throw new RuntimeException("serializationError");
      }
      if (dataForm instanceof String) {
        return JMapper.MAP.valueToTree(dataForm);
      }
      return JMapper.MAP.valueToTree(dataForm);
    }

    throw new ClassCastException("Fail to find cast instance, Class Name: " + instance.getClass().getName());
  }

  /**
   * Converts a JSON object to an CdmAttribute object.
   * @param ctx CdmCorpusContext
   * @param obj Object
   * @return CdmAttributeItem
   */
  public static CdmAttributeItem createAttribute(final CdmCorpusContext ctx, final Object obj) {
    return createAttribute(ctx, obj, null);
  }

  /**
   * Converts a JSON object to an CdmAttribute object.
   * @param ctx CdmCorpusContext
   * @param obj Object
   * @param entityName String
   * @return CdmAttributeItem
   */
  public static CdmAttributeItem createAttribute(final CdmCorpusContext ctx, final Object obj, final String entityName) {
    if (obj == null) {
      return null;
    }

    if (obj instanceof JsonNode && ((JsonNode) obj).isValueNode()) {
      return AttributeGroupReferencePersistence.fromData(ctx, (JsonNode) obj);
    }

    if (obj instanceof JsonNode) { // TODO-BQ: This part is different from C#
      final JsonNode jsonObject = (JsonNode) obj;
      if (jsonObject.get("attributeGroupReference") != null) {
        return AttributeGroupReferencePersistence.fromData(ctx, (JsonNode) obj, entityName);
      } else if (jsonObject.get("entity") != null) {
        return EntityAttributePersistence.fromData(ctx, (JsonNode) obj);
      } else if (jsonObject.get("name") != null) {
        return TypeAttributePersistence.fromData(ctx, (JsonNode) obj, entityName);
      }
    }
    return null;
  }

  /**
   * Creates a CDM object from a JSON object.
   * @param ctx CdmCorpusContext
   * @param obj Object
   * @return Object
   */
  public static Object createConstant(final CdmCorpusContext ctx, final Object obj) {
    if (obj == null) {
      return null;
    }

    if (obj instanceof JsonNode && ((JsonNode) obj).isValueNode()) {
      return ((JsonNode) obj).asText();
    } else if (obj instanceof JsonNode && ((JsonNode) obj).isObject()) {
      final JsonNode newObj = (JsonNode) obj;
      if (newObj.has("purpose") || newObj.has("dataType") || newObj.has("entity")) {
        if (newObj.has("dataType")) {
          return TypeAttributePersistence.fromData(ctx, newObj);
        } else if (newObj.has("entity")) {
          return EntityAttributePersistence.fromData(ctx, newObj);
        } else {
          return null;
        }
      } else if (newObj.has("purposeReference")) {
        return PurposeReferencePersistence.fromData(ctx, newObj);
      } else if (newObj.has("traitReference")) {
        return TraitReferencePersistence.fromData(ctx, newObj);
      } else if (newObj.has("dataTypeReference")) {
        return DataTypeReferencePersistence.fromData(ctx, newObj);
      } else if (newObj.has("entityReference")) {
        return EntityReferencePersistence.fromData(ctx, newObj);
      } else if (newObj.has("attributeGroupReference")) {
        return AttributeGroupReferencePersistence.fromData(ctx, newObj);
      } else
        return newObj;
    }

    return obj;
  }

  /**
   * Converts a JSON object to a CdmCollection of attributes.
   * @param  ctx CdmCorpusContext
   * @param obj JsonNode
   * @return  ArrayList of CdmAttributeItem
   */ 
  public static ArrayList<CdmAttributeItem> createAttributeList(final CdmCorpusContext ctx,
                                                                final JsonNode obj) {
    return createAttributeList(ctx, obj, null);
  }

  /**
   * Converts a JSON object to a CdmCollection of attributes.
   * @param  ctx CdmCorpusContext
   * @param obj JsonNode
   * @param entityName String
   * @return  ArrayList of CdmAttributeItem
   */
  public static ArrayList<CdmAttributeItem> createAttributeList(final CdmCorpusContext ctx,
                                                                final JsonNode obj,
                                                                final String entityName) {
    if (obj == null) {
      return null;
    }

    final ArrayList<CdmAttributeItem> result = new ArrayList<>();

//  TODO-BQ: Further testing and validation required.
    obj.forEach((JsonNode node) -> result.add(createAttribute(ctx, node, entityName)));

    return result;
  }

  /**
   * Converts a JSON object to a CdmCollection of TraitReferences.
   * @param  ctx CdmCorpusContext
   * @param obj Object
   * @return  ArrayList of CdmAttributeItem
   */
  public static ArrayList<CdmTraitReference> createTraitReferenceList(final CdmCorpusContext ctx, final Object obj) {

    if (obj == null) {
      return null;
    }

    final ArrayList<CdmTraitReference> result = new ArrayList<>();
    ArrayNode traitRefObj = null;
    if (obj instanceof ObjectNode) {
      final ObjectNode objectNode = (ObjectNode) obj;
      if (objectNode.get("value") != null && objectNode.get("value") instanceof ArrayNode) {
        traitRefObj = (ArrayNode) objectNode.get("value");
      }
    } else {
      traitRefObj = (ArrayNode) obj;
    }

    if (traitRefObj != null) {
      for (int i = 0; i < traitRefObj.size(); i++) {
        final JsonNode tr = traitRefObj.get(i);
        result.add(TraitReferencePersistence.fromData(ctx, tr));
      }
    }

    return result;
  }

  /**
   * Adds all elements of a list to a CdmCollection.
   * @param cdmCollection CdmCollection of type T 
   * @param list List of T
   * @param <T> Type
   */
  public static <T extends CdmObject> void addListToCdmCollection(final CdmCollection<T> cdmCollection,
                                                                  final List<T> list) {
    if (cdmCollection != null && list != null) {
      for (final T element : list) {
        cdmCollection.add(element);
      }
    }
  }

  /**
   * Creates a list object that is a copy of the input Iterable object.
   * @param source Iterable of U
   * @param resOpt ResolveOptions
   * @param options CopyOptions 
   * @param <T> Type
   * @param <U> Type
   * @return Arraylist of CdmObject 
   */
  public static <T, U extends CdmObject> ArrayList<T> listCopyDataAsCdmObject(
      final Iterable<U> source,
      final ResolveOptions resOpt,
      final CopyOptions options) {
    if (source == null) {
      return null;
    }

    final ArrayList<T> casted = new ArrayList<>();
    for (final Object element : source) {
      if (element instanceof CdmObject) {
        casted.add((T) ((CdmObject) element).copyData(resOpt, options));
      }
    }

    if (casted.size() == 0) {
      return null;
    }
    return casted;
  }


  
  /** 
   * @param source Iterable
   * @param resOpt Resolve Options
   * @param options Copy options
   * @param <T> Type
   * @return ArrayNode
   */
  public static <T> ArrayNode listCopyDataAsArrayNode(
      final Iterable<T> source,
      final ResolveOptions resOpt,
      final CopyOptions options) {
    if (source == null) {
      return null;
    }

    final ArrayNode casted = JsonNodeFactory.instance.arrayNode();
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

  /**
   * Converts dynamic input into a string for a property (ints are converted to string)
   * @param value The value that should be converted to a string.
   * @return The value converted into a string
   */
  static String propertyFromDataToString(final Object value) {
    final String stringValue = getStringFromJson(value);
    if (stringValue != null && !stringValue.equals("")) {
      return stringValue;
    } 

    final Integer intValue = getIntFromJson(value);
    if (intValue != null) {
      return Integer.toString(intValue);
    }

    return null;
  }

  /**
   * Converts dynamic input into an int for a property (numbers represented as strings are converted to int)
   * @param value The value that should be converted to an Integer.
   * @return The value converted into an Integer
   */
  static Integer propertyFromDataToInt(final Object value) {
    final Integer intValue = getIntFromJson(value);
    if (intValue != null) {
      return intValue;
    }

    final String stringValue = getStringFromJson(value);
    if (stringValue != null) {
      try{
        return Integer.valueOf(stringValue);
      } catch (NumberFormatException ex) {
      }
    }

    return null;
  }

  /**
   * Converts dynamic input into a boolean for a property (booleans represented as strings are converted to boolean)
   * @param value The value that should be converted to a boolean.
   * @return The value converted into a boolean
   */
  static Boolean propertyFromDataToBoolean(final Object value) {
    if (value == null || value instanceof Boolean) {
      return (Boolean)value;
    } else if (value instanceof BooleanNode) {
      return ((BooleanNode)value).asBoolean();
    }

    final String stringValue = getStringFromJson(value);
    if (stringValue.equals("True") || stringValue.equals("true")) {
      return true;
    } else if (stringValue.equals("False") || stringValue.equals("false")) {
      return false;
    }

    return null;
  }

  /**
   * Helper function to extract string value from a JsonNode object
   * @param value A JsonNode that contains a string or a JsonNode object
   * @return The string value inside of the JsonNode
   */
  static String getStringFromJson(final Object value) {
    if (value instanceof String) {
      return (String)value;
    } else if (value instanceof TextNode) {
      return ((TextNode)value).asText();
    }
    return null;
  }

  /**
   * Helper function to extract Integer value from a JsonNode object
   * @param value A JsonNode that contains an Integer or a JsonNode object
   * @return The Integer value inside of the JsonNode
   */
  static Integer getIntFromJson(final Object value) {
    if (value instanceof Integer) {
      return (Integer)value;
    } else if (value instanceof IntNode) {
      return (Integer)((IntNode)value).intValue();
    }
    return null;
  }
}
