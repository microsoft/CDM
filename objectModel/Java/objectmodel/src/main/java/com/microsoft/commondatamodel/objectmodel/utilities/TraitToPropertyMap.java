// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmDataFormat;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTrait;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.BiConsumer;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class TraitToPropertyMap {
  private static final String TAG = TraitToPropertyMap.class.getSimpleName();

  private CdmObject host;
  private static Map<CdmTraitName, List<CdmPropertyName>> TRAIT_TO_LIST_OF_PROPERTIES_MAP = new ConcurrentHashMap<>();
  private static String[] dataFormatTraitNames =  {
    "is.dataFormat.integer",
    "is.dataFormat.small",
    "is.dataFormat.big",
    "is.dataFormat.floatingPoint",
    "is.dataFormat.guid",
    "is.dataFormat.character",
    "is.dataFormat.array",
    "is.dataFormat.byte",
    "is.dataFormat.time",
    "is.dataFormat.date",
    "is.dataFormat.timeOffset",
    "is.dataFormat.boolean",
    "is.dataFormat.numeric.shaped",
    "means.content.text.JSON"
  };

  static {
    TRAIT_TO_LIST_OF_PROPERTIES_MAP.put(CdmTraitName.VERSION,
        Collections.singletonList(CdmPropertyName.VERSION));
    TRAIT_TO_LIST_OF_PROPERTIES_MAP.put(CdmTraitName.ATTRIBUTE_GROUP,
        Collections.singletonList(CdmPropertyName.CDM_SCHEMAS));
    TRAIT_TO_LIST_OF_PROPERTIES_MAP.put(CdmTraitName.SOURCE_NAME,
        Collections.singletonList(CdmPropertyName.SOURCE_NAME));
    TRAIT_TO_LIST_OF_PROPERTIES_MAP.put(CdmTraitName.DISPLAY_NAME,
        Collections.singletonList(CdmPropertyName.DISPLAY_NAME));
    TRAIT_TO_LIST_OF_PROPERTIES_MAP.put(CdmTraitName.DESCRIPTION,
        Collections.singletonList(CdmPropertyName.DESCRIPTION));
    TRAIT_TO_LIST_OF_PROPERTIES_MAP.put(CdmTraitName.SOURCE_ORDERING,
        Collections.singletonList(CdmPropertyName.SOURCE_ORDERING));
    TRAIT_TO_LIST_OF_PROPERTIES_MAP.put(CdmTraitName.IS_READ_ONLY,
        Collections.singletonList(CdmPropertyName.IS_READ_ONLY));
    TRAIT_TO_LIST_OF_PROPERTIES_MAP.put(CdmTraitName.IS_NULLABLE,
        Collections.singletonList(CdmPropertyName.IS_NULLABLE));
    TRAIT_TO_LIST_OF_PROPERTIES_MAP.put(CdmTraitName.VALUE_CONSTRAINED_TO_LIST,
        Collections.singletonList(CdmPropertyName.VALUE_CONSTRAINED_TO_LIST));
    TRAIT_TO_LIST_OF_PROPERTIES_MAP.put(CdmTraitName.IS_CONSTRAINED,
        Arrays.asList(
            CdmPropertyName.MAXIMUM_VALUE,
            CdmPropertyName.MINIMUM_VALUE,
            CdmPropertyName.MAXIMUM_LENGTH));
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param host CdmObject 
   */
  @Deprecated
  public TraitToPropertyMap(final CdmObject host) {
    this.host = host;
  }

  private static String asText(final JsonNode node) {
    return (null == node) ? null : node.asText();
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param propertyName CdmPropertyName 
   * @return Object
   */
  @Deprecated
  public Object fetchPropertyValue(final CdmPropertyName propertyName) {
    return this.fetchPropertyValue(propertyName, false);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param propertyName CdmPropertyName
   * @param  onlyFromProperty boolean
   * @return Object
   */
  @Deprecated
  public Object fetchPropertyValue(
      final CdmPropertyName propertyName,
      final boolean onlyFromProperty) {
    switch (propertyName) {
      case VERSION:
        return fetchTraitReferenceArgumentValue(
            this.fetchTraitReference(CdmTraitName.VERSION.toString(), onlyFromProperty),
                "versionNumber");
      case SOURCE_NAME:
        return fetchTraitReferenceArgumentValue(
            this.fetchTraitReference(CdmTraitName.SOURCE_NAME.toString(), onlyFromProperty),
                "name");
      case DISPLAY_NAME:
        return this.fetchLocalizedTraitTable(CdmTraitName.DISPLAY_NAME.toString(), onlyFromProperty);
      case DESCRIPTION:
        return this.fetchLocalizedTraitTable(CdmTraitName.DESCRIPTION.toString(), onlyFromProperty);
      case CDM_SCHEMAS:
        return this.fetchSingleAttTraitTable(CdmTraitName.ATTRIBUTE_GROUP.toString(), "groupList", onlyFromProperty);
      case SOURCE_ORDERING:
        return fetchTraitReferenceArgumentValue(
            this.fetchTraitReference(CdmTraitName.SOURCE_ORDERING.toString()),
            "ordinal");
      case IS_PRIMARY_KEY:
        if (this.host instanceof CdmTypeAttributeDefinition) {
          CdmTypeAttributeDefinition typeAttribute = (CdmTypeAttributeDefinition) this.host;
          if (!onlyFromProperty && typeAttribute.getPurpose() != null && typeAttribute.getPurpose().getNamedReference().equals("identifiedBy")) {
            return true;
          }
        }
        return this.fetchTraitReference(CdmTraitName.IS_IDENTIFIED_BY.toString(), onlyFromProperty) != null;
      case IS_NULLABLE:
        return this.fetchTraitReference(CdmTraitName.IS_NULLABLE.toString(), onlyFromProperty) != null;
      case IS_READ_ONLY:
        return this.fetchTraitReference(CdmTraitName.IS_READ_ONLY.toString(), onlyFromProperty) != null;
      case IS_RESOLVED:
        CdmTraitReference trait = this.fetchTraitReference(CdmTraitName.IS_RESOLVED.toString(), onlyFromProperty);
        return trait != null && trait.getArguments() != null && "resolved".equals(trait.getArguments().fetchValue("level"));
      case VALUE_CONSTRAINED_TO_LIST:
        return this.fetchTraitReference(CdmTraitName.VALUE_CONSTRAINED_TO_LIST.toString(), onlyFromProperty) != null;
      case MAXIMUM_VALUE:
        return fetchTraitReferenceArgumentValue
            (this.fetchTraitReference(CdmTraitName.IS_CONSTRAINED.toString(), onlyFromProperty),
                CdmPropertyName.MAXIMUM_VALUE.toString());
      case MINIMUM_VALUE:
        return fetchTraitReferenceArgumentValue(
            this.fetchTraitReference(CdmTraitName.IS_CONSTRAINED.toString(), onlyFromProperty),
                CdmPropertyName.MINIMUM_VALUE.toString());
      case MAXIMUM_LENGTH:
        final Object temp = fetchTraitReferenceArgumentValue(
            this.fetchTraitReference(CdmTraitName.IS_CONSTRAINED.toString(), onlyFromProperty),
                CdmPropertyName.MAXIMUM_LENGTH.toString());
        if (temp != null) {
          return temp;
        }
        break;
      case DATA_FORMAT:
        return this.traitsToDataFormat(onlyFromProperty);
      case PRIMARY_KEY:
        final Object attRef = fetchTraitReferenceArgumentValue(
                this.fetchTraitReference(CdmTraitName.IS_IDENTIFIED_BY.toString(), onlyFromProperty),
                "attribute");
        if (attRef != null) {
            if (attRef instanceof String) {
              return attRef;
            }
            return ((CdmTypeAttributeDefinition)attRef).fetchObjectDefinitionName();
          }
        break;
      case DEFAULT:
        return this.fetchDefaultValue(onlyFromProperty);
      case IS_INCREMENTAL:
        return this.fetchTraitReference(Constants.IncrementalTraitName) != null;
    }
    return null;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param  traitName String
   * @return CdmTraitReference
   */
  @Deprecated
  public CdmTraitReference fetchTraitReference(final String traitName) {
    return this.fetchTraitReference(traitName, false);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param  traitName String
   * @param onlyFromProperty boolean 
   * @return CdmTraitReference
   */
  @Deprecated
  private CdmTraitReference fetchTraitReference(final String traitName, final boolean onlyFromProperty) {
    final int traitIndex = this.getTraits() != null ? this.getTraits().indexOf(traitName, onlyFromProperty) : -1;
    return (traitIndex == -1) ? null : (CdmTraitReference) this.getTraits().get(traitIndex);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param propertyName CdmPropertyName
   * @param newValue Object
   */
  @Deprecated
  public void updatePropertyValue(final CdmPropertyName propertyName, final Object newValue) {
    final Enum traitName = this.mapTraitName(propertyName);
    final List<CdmPropertyName> listOfProps = TRAIT_TO_LIST_OF_PROPERTIES_MAP.get(traitName);
    final boolean multipleProperties = listOfProps != null && listOfProps.size() > 1;
    if (newValue == null && !multipleProperties) {
      this.removeTrait(traitName.toString());
    } else {
      switch (propertyName) {
        case VERSION:
          this.updateTraitArgument(CdmTraitName.VERSION.toString(), "versionNumber", newValue);
          break;
        case CDM_SCHEMAS:
          this.updateSingleAttributeTraitTable(CdmTraitName.ATTRIBUTE_GROUP.toString(), "groupList",
                  "attributeGroupSet", (List<String>) newValue);
          break;
        case SOURCE_NAME:
          this.updateTraitArgument(CdmTraitName.SOURCE_NAME.toString(), "name", newValue);
          break;
        case DISPLAY_NAME:
          this.ConstructLocalizedTraitTable(CdmTraitName.DISPLAY_NAME.toString(), (String) newValue);
          break;
        case DESCRIPTION:
          this.ConstructLocalizedTraitTable(CdmTraitName.DESCRIPTION.toString(), (String) newValue);
          break;
        case SOURCE_ORDERING:
          this.updateTraitArgument(CdmTraitName.SOURCE_ORDERING.toString(), "ordinal",
              newValue.toString()); // TODO-BQ: Check if should use toString or (String)
          break;
        case IS_PRIMARY_KEY:
          this.updateTraitArgument(CdmTraitName.IS_IDENTIFIED_BY.toString(), "", newValue);
          break;
        case IS_READ_ONLY:
          this.mapBooleanTrait(CdmTraitName.IS_READ_ONLY.toString(), (boolean) newValue);
          break;
        case IS_NULLABLE:
          this.mapBooleanTrait(CdmTraitName.IS_NULLABLE.toString(), (boolean) newValue);
          break;
        case VALUE_CONSTRAINED_TO_LIST:
          this.mapBooleanTrait(CdmTraitName.VALUE_CONSTRAINED_TO_LIST.toString(), (boolean) newValue);
          break;
        case MAXIMUM_VALUE:
          this.updateTraitArgument(CdmTraitName.IS_CONSTRAINED.toString(), CdmPropertyName.MAXIMUM_VALUE.toString(), newValue);
          break;
        case MINIMUM_VALUE:
          this.updateTraitArgument(CdmTraitName.IS_CONSTRAINED.toString(), CdmPropertyName.MINIMUM_VALUE.toString(), newValue);
          break;
        case MAXIMUM_LENGTH:
          this.updateTraitArgument(CdmTraitName.IS_CONSTRAINED.toString(), CdmPropertyName.MAXIMUM_LENGTH.toString(), newValue);
          break;
        case DATA_FORMAT:
          this.dataFormatToTraits(newValue.toString());
          break;
        case DEFAULT:
          this.updateDefaultValue(newValue);
          break;
      }
    }
  }

  private void dataFormatToTraits(final String dataFormat) {
    // reset the current dataFormat
    for (String traitName : dataFormatTraitNames) {
      this.removeTrait(traitName);
    }
    switch (CdmDataFormat.fromString(dataFormat)) {
      case Int16:
        this.fetchOrCreateTrait(CdmDataFormatTrait.INTEGER.toString(), true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.SMALL.toString(), true);
        break;
      case Int32:
        this.fetchOrCreateTrait(CdmDataFormatTrait.INTEGER.toString(), true);
        break;
      case Int64:
        this.fetchOrCreateTrait(CdmDataFormatTrait.INTEGER.toString(), true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.BIG.toString(), true);
        break;
      case Float:
        this.fetchOrCreateTrait(CdmDataFormatTrait.FLOATING_POINT.toString(), true);
        break;
      case Double:
        this.fetchOrCreateTrait(CdmDataFormatTrait.FLOATING_POINT.toString(), true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.BIG.toString(), true);
        break;
      case Guid:
        this.fetchOrCreateTrait(CdmDataFormatTrait.GUID.toString(), true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.CHARACTER.toString(), true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.ARRAY.toString(), true);
        break;
      case String:
        this.fetchOrCreateTrait(CdmDataFormatTrait.CHARACTER.toString(), true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.ARRAY.toString(), true);
        break;
      case Char:
        this.fetchOrCreateTrait(CdmDataFormatTrait.CHARACTER.toString(), true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.BIG.toString(), true);
        break;
      case Byte:
        this.fetchOrCreateTrait(CdmDataFormatTrait.BYTE.toString(), true);
        break;
      case Binary:
        this.fetchOrCreateTrait(CdmDataFormatTrait.BYTE.toString(), true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.ARRAY.toString(), true);
        break;
      case Time:
        this.fetchOrCreateTrait(CdmDataFormatTrait.TIME.toString(), true);
        break;
      case Date:
        this.fetchOrCreateTrait(CdmDataFormatTrait.DATE.toString(), true);
        break;
      case DateTime:
        this.fetchOrCreateTrait(CdmDataFormatTrait.TIME.toString(), true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.DATE.toString(), true);
        break;
      case DateTimeOffset:
        this.fetchOrCreateTrait(CdmDataFormatTrait.TIME.toString(), true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.DATE.toString(), true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.DATETIME_OFFSET.toString(), true);
        break;
      case Boolean:
        this.fetchOrCreateTrait(CdmDataFormatTrait.BOOLEAN.toString(), true);
        break;
      case Decimal:
        this.fetchOrCreateTrait(CdmDataFormatTrait.NUMERIC_SHAPED.toString(), true);
        break;
      case Json:
        this.fetchOrCreateTrait(CdmDataFormatTrait.ARRAY.toString(), true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.JSON.toString(), true);
        break;
    }
  }

  private void ConstructLocalizedTraitTable(String traitName, final String sourceText) {
    this.updateTraitTable(traitName, "localizedDisplayText", "localizedTable", (cEnt, created) -> {
      if (created) {
        final List<List<String>> list = new ArrayList<>();
        final List<String> innerList = new ArrayList<>();
        innerList.add("en");
        innerList.add(sourceText);
        list.add(innerList);
        cEnt.setConstantValues(list);
      } else {
        // search for a match
        // -1 on order gets us the last row that matches. needed because inheritence
        // chain with different descriptions stacks these up
        // need to use ordinals because no binding done yet
        cEnt.updateConstantValue(null, 1, sourceText, 0, "en", -1);
      }
    });
  }

  private Object fetchLocalizedTraitTable(final String traitName, final boolean onlyFromProperty) {
    final CdmConstantEntityDefinition cEnt = this
        .fetchTraitTable(traitName, "localizedDisplayText", onlyFromProperty);
    if (cEnt != null) {
      // search for a match
      // -1 on order gets us the last row that matches. needed because inheritence
      // chain with different descriptions stacks these up
      // need to use ordinals because no binding done yet
      return cEnt.fetchConstantValue(null, 1, 0, "en", -1);
    }
    return null;
  }

  private CdmTraitReference fetchOrCreateTrait(String traitName, final boolean simpleRef) {
    CdmTraitReference trait;

    trait = fetchTraitReference(traitName, true);
    if (trait == null) {
      trait = this.getCtx().getCorpus().makeObject(CdmObjectType.TraitRef, traitName, simpleRef);
      trait.setFromProperty(true);
      this.getTraits().add(trait);
    }
    return trait;
  }

  private List<String> fetchSingleAttTraitTable(final String traitName, final String argName, final boolean onlyFromProperty) {
    final CdmConstantEntityDefinition cEnt = this.fetchTraitTable(traitName, argName, onlyFromProperty);
    if (cEnt != null) {
      // turn array of arrays into single array of strings
      final List<String> result = new ArrayList<>();
      for (final List<String> v : cEnt.getConstantValues()) {
        result.add(v.get(0)); // TODO-BQ: revisit this, fail if size is equal 0
      }
      return result;
    }
    return null;
  }

  private Object fetchDefaultValue(final boolean onlyFromProperty) {
    final CdmTraitReference trait = this.fetchTraitReference(CdmTraitName.DOES_HAVE_DEFAULT.toString(), onlyFromProperty);
    if (trait != null) {
      Object defVal = fetchTraitReferenceArgumentValue(trait, "default");
      if (defVal != null) {
        if (defVal instanceof String) {
          return defVal;
        }
        if (defVal instanceof CdmObject) {
          final CdmObject cdmObjectDefVal = (CdmObject) defVal;
          if (cdmObjectDefVal.getObjectType() == CdmObjectType.EntityRef) {
            final CdmConstantEntityDefinition cEnt = cdmObjectDefVal.fetchObjectDefinition(null);
            if (cEnt != null) {
              final String esName = cEnt.getEntityShape().fetchObjectDefinitionName();
              final boolean corr = "listLookupCorrelatedValues".equals(esName);
              final boolean lookup = "listLookupValues".equals(esName);
              if ("localizedTable".equals(esName) || lookup || corr) {
                final List<Object> result = new ArrayList<>();
                final List<List<String>> rawValues = cEnt.getConstantValues();
                if (rawValues != null) {
                 for (final List<String> rawValue : rawValues) {
                   final Map<String, String> row = new LinkedHashMap<>();
                   if (rawValue.size() == 2
                       || (lookup && rawValue.size() == 4)
                       || (corr && rawValue.size() == 5)) {
                     row.put("languageTag", rawValue.get(0));
                     row.put("displayText", rawValue.get(1));
                     if (lookup || corr) {
                       row.put("attributeValue", rawValue.get(2));
                       row.put("displayOrder", rawValue.get(3));
                       if (corr) {
                         row.put("correlatedValue", rawValue.get(4));
                       }
                     }
                   }
                   result.add(row);
                 }
                }
                return result;
              } else {
                defVal = cdmObjectDefVal.copyData(null, null);
              }
            }
          }
        }
      }
      return defVal;
    }
    return null;
  }

  private Enum mapTraitName(final CdmPropertyName propertyName) {
    switch (propertyName) {
      case VERSION:
        return CdmTraitName.VERSION;
      case CDM_SCHEMAS:
        return CdmTraitName.ATTRIBUTE_GROUP;
      case SOURCE_NAME:
        return CdmTraitName.SOURCE_NAME;
      case DISPLAY_NAME:
        return CdmTraitName.DISPLAY_NAME;
      case DESCRIPTION:
        return CdmTraitName.DESCRIPTION;
      case SOURCE_ORDERING:
        return CdmTraitName.SOURCE_ORDERING;
      case PRIMARY_KEY:
        return CdmTraitName.IS_IDENTIFIED_BY;
      case IS_READ_ONLY:
        return CdmTraitName.IS_READ_ONLY;
      case IS_NULLABLE:
        return CdmTraitName.IS_NULLABLE;
      case VALUE_CONSTRAINED_TO_LIST:
        return CdmTraitName.VALUE_CONSTRAINED_TO_LIST;
      case MAXIMUM_VALUE:
      case MINIMUM_VALUE:
      case MAXIMUM_LENGTH:
        return CdmTraitName.IS_CONSTRAINED;
      default:
        return propertyName;
    }
  }

  private CdmConstantEntityDefinition fetchTraitTable(String traitName, final String argName,
                                                    final boolean onlyFromProperty) {
    CdmTraitReference trait;
    final int traitIndex = this.getTraits().indexOf(traitName, onlyFromProperty);
    trait = traitIndex == -1 ? null : (CdmTraitReference) getTraits().get(traitIndex);

    final Object locEntRef = fetchTraitReferenceArgumentValue(trait, argName);
    if (locEntRef != null) {
        return ((CdmObject) locEntRef).fetchObjectDefinition(null);
    }

    return null;
  }

  private void removeTrait(final String traitName) {
    this.getTraits().remove(traitName, true);
  }

  private void mapBooleanTrait(String traitName, final boolean value) {
    if (value) {
      this.fetchOrCreateTrait(traitName, true);
    } else {
      this.removeTrait(traitName);
    }
  }

  private void updateSingleAttributeTraitTable(String traitName, final String argName, final String entityName,
                                               final List<String> sourceText) {
    this.updateTraitTable(traitName, argName, entityName, (cEnt, created) -> {
      // turn array of Strings into array of array of Strings;
      final List<List<String>> vals = new ArrayList<>();
      for (final String v : sourceText) {
        final List<String> r = new ArrayList<>();
        r.add(v);
        vals.add(r);
      }
      cEnt.setConstantValues(vals);
    });
  }

  private void updateTraitArgument(String traitName, final String argName, final Object argValue) {
    final CdmTraitReference trait;
    trait = this.fetchOrCreateTrait(traitName, false);

    final CdmArgumentCollection args = trait.getArguments();
    if (args == null || args.getCount() == 0) {
      if (argValue != null) {
        trait.getArguments().add(argName, argValue);
        return;
      } else {
        this.removeTrait(traitName);
      }
    } else {
      for (int iArg = 0; iArg < args.getCount(); ++iArg) {
        final CdmArgumentDefinition arg = args.getAllItems().get(iArg);
        if (arg.getName().equals(argName)) {
          if (argValue == null) {
            args.remove(arg);
            if (trait != null && trait.getArguments() != null && trait.getArguments().size() == 0) {
              this.removeTrait(traitName);
            }
          } else {
            arg.setValue(argValue);
          }
          return;
        }
      }
    }

    if (argValue != null) {
      trait.getArguments().add(argName, argValue);
    }
  }

  String traitsToDataFormat(final boolean onlyFromProperty) {
    boolean isArray = false;
    boolean isBig = false;
    boolean isSmall = false;
    boolean isInteger = false;
    boolean probablyJson = false;
    Enum<CdmDataFormat> baseType = CdmDataFormat.Unknown;

    final CdmTraitCollection traits = this.getTraits();

    if (traits != null) {
      for (final CdmTraitReferenceBase trait : traits) {
        if (onlyFromProperty &&
                (trait instanceof CdmTraitGroupReference || !((CdmTraitReference)trait).isFromProperty())) {
          continue;
        }

        final String traitName = trait.fetchObjectDefinitionName();
        if (traitName != null) {
          switch (CdmDataFormatTrait.fromString(traitName)) {
            case ARRAY:
              isArray = true;
              break;
            case BIG:
              isBig = true;
              break;
            case SMALL:
              isSmall = true;
              break;
            case INTEGER:
              isInteger = true;
              break;
            case FLOATING_POINT:
              baseType = CdmDataFormat.Float;
              break;
            case CHARACTER:
              if (!CdmDataFormat.Guid.equals(baseType)) {
                baseType = CdmDataFormat.Char;
              }
              break;
            case BYTE:
              baseType = CdmDataFormat.Byte;
              break;
            case DATE:
              if (CdmDataFormat.Time.equals(baseType)) {
                baseType = CdmDataFormat.DateTime;
              } else {
                baseType = CdmDataFormat.Date;
              }
              break;
            case TIME:
              if (CdmDataFormat.Date.equals(baseType)) {
                baseType = CdmDataFormat.DateTime;
              } else {
                baseType = CdmDataFormat.Time;
              }
              break;
            case DATETIME_OFFSET:
              if (CdmDataFormat.DateTime.equals(baseType)) {
                baseType = CdmDataFormat.DateTimeOffset;
              }
              break;
            case BOOLEAN:
              baseType = CdmDataFormat.Boolean;
              break;
            case NUMERIC_SHAPED:
              baseType = CdmDataFormat.Decimal;
              break;
            case GUID:
              baseType = CdmDataFormat.Guid;
              break;
            case JSON:
              baseType = isArray ? CdmDataFormat.Json : CdmDataFormat.Unknown;
              probablyJson = true;
              break;
            case DEFAULT:
            default:
              break;
          }
        }
      }

      if (isArray) {
        if (probablyJson) {
          baseType = CdmDataFormat.Json;
        } else if (CdmDataFormat.Char.equals(baseType)) {
          baseType = CdmDataFormat.String;
        } else if (CdmDataFormat.Byte.equals(baseType)) {
          baseType = CdmDataFormat.Binary;
        } else if (!CdmDataFormat.Guid.equals(baseType)) {
          baseType = CdmDataFormat.Unknown;
        }
      }

      if (CdmDataFormat.Float.equals(baseType) && isBig) {
        baseType = CdmDataFormat.Double;
      }
      if (isInteger && isBig) {
        baseType = CdmDataFormat.Int64;
      }
      else if (isInteger && isSmall) {
        baseType = CdmDataFormat.Int16;
      }
      else if (isInteger) {
        baseType = CdmDataFormat.Int32;
      }
    }

    return baseType.name();
  }

  //  // TODO-BQ: try to resolve Object trait, because it is dynamic now.
  private void updateTraitTable(String traitName, final String argName, final String entityName,
                             final BiConsumer<CdmConstantEntityDefinition, Boolean> action) {

    CdmTraitReference trait = this.fetchOrCreateTrait(traitName, false);
    final CdmTraitReference traitRef = (CdmTraitReference) trait; // TODO-BQ: This cast is very likely to fail. Suggestion is to make extend an interface like "canGetArguments" or something.
    if (traitRef.getArguments() == null || traitRef.getArguments().getCount() == 0) {
      // make the argument nothing but a ref to a constant entity, safe since there is only one param for the trait and it looks cleaner
      final CdmConstantEntityDefinition cEnt = this.getCtx().getCorpus()
          .makeObject(CdmObjectType.ConstantEntityDef, null, false);
      cEnt.setEntityShape(this.getCtx().getCorpus()
          .makeRef(CdmObjectType.EntityRef, entityName, true));
      action.accept(cEnt, true);
      traitRef.getArguments().add(argName,
          this.getCtx().getCorpus().makeRef(CdmObjectType.EntityRef, cEnt, false));
    } else {
      final Object locEntRef = fetchTraitReferenceArgumentValue((CdmTraitReference) trait, argName);
      if (locEntRef != null) {
        final CdmConstantEntityDefinition locEnt =
            locEntRef instanceof CdmObjectBase ? ((CdmObjectBase) locEntRef).fetchObjectDefinition(null) : null;
        if (locEnt != null) {
          action.accept(locEnt, false);
        }
      }
    }
  }

  private CdmObject getHost() {
    return this.host;
  }

  private void setHost(final CdmObject host) {
    this.host = host;
  }

  private CdmTraitCollection getTraits() {
    if (this.host instanceof CdmObjectReference) {
      return ((CdmObjectReference) this.host).getAppliedTraits();
    } else if (this.host instanceof CdmAttribute) {
      return ((CdmAttribute) this.host).getAppliedTraits();
    } else {
      return ((CdmObjectDefinition) this.host).getExhibitsTraits();
    }
  }

  private CdmCorpusContext getCtx() {
    return this.host.getCtx();
  }

  private void updateDefaultValue(Object newDefault) {
    if (newDefault instanceof ArrayNode) {
      final ArrayNode array = (ArrayNode) newDefault;
      final int l = array.size();
      if (l > 0 && array.get(0).get("languageTag") != null
          && array.get(0).get("displayText") != null) {
        // looks like something we understand
        final List<List<String>> tab = new ArrayList<>();
        final boolean corr = (array.get(0).get("correlatedValue") != null);
        for (int i = 0; i < l; i++) {
          final List<String> row = new ArrayList<>();
          row.add(asText(array.get(i).get("languageTag")));
          row.add(asText(array.get(i).get("displayText")));
          row.add(asText(array.get(i).get("attributeValue")));
          row.add(asText(array.get(i).get("displayOrder")));
          if (corr) {
            row.add(asText(array.get(i).get("correlatedValue")));
          }
          tab.add(row);
        }
        final CdmConstantEntityDefinition cEnt = this.getCtx().getCorpus()
            .makeObject(CdmObjectType.ConstantEntityDef, null, false);
        cEnt.setEntityShape(this.getCtx().getCorpus().makeObject(CdmObjectType.EntityRef,
            corr ? "listLookupCorrelatedValues" : "listLookupValues", true));
        cEnt.setConstantValues(tab);

        newDefault = this.getCtx().getCorpus().makeRef(CdmObjectType.EntityRef, cEnt, false);
        this.updateTraitArgument(CdmTraitName.DOES_HAVE_DEFAULT.toString(), "default", newDefault);
      } else {
        Logger.error(this.host.getCtx(), TAG, "updateDefaultValue", null, CdmLogCode.ErrValdnMissingLanguageTag);
      }
    } else {
      Logger.error(this.host.getCtx(), TAG, "updateDefaultValue", null, CdmLogCode.ErrUnsupportedType);
    }
  }

  private static Object fetchTraitReferenceArgumentValue(final Object traitRef, final String argName) {
    if (traitRef instanceof ResolvedTrait) {
      return fetchTraitReferenceArgumentValue((ResolvedTrait) traitRef, argName);
    }
    if (traitRef instanceof CdmTraitReference) {
      return fetchTraitReferenceArgumentValue((CdmTraitReference) traitRef, argName);
    }
    return null;
  }

  private static Object fetchTraitReferenceArgumentValue(final ResolvedTrait traitRef, final String argName) {
    return traitRef == null ? null
        : traitRef.getParameterValues().fetchParameterValue(argName).getValue();
  }

  private static Object fetchTraitReferenceArgumentValue(final CdmTraitReference traitRef, final String argName) {
    return traitRef == null ? null : traitRef.getArguments().fetchValue(argName);
  }
}
