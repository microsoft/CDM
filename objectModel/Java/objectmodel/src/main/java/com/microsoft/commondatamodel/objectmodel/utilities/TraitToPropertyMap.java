// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttribute;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmConstantEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectBase;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmDataFormat;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTrait;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.BiConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class TraitToPropertyMap {
  private static final Logger LOGGER = LoggerFactory.getLogger(TraitToPropertyMap.class);

  private CdmObject host;
  private static Map<CdmTraitName, List<CdmPropertyName>> TRAIT_TO_LIST_OF_PROPERTIES_MAP = new ConcurrentHashMap<>();

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
   */
  @Deprecated
  public Object fetchPropertyValue(final CdmPropertyName propertyName) {
    return this.fetchPropertyValue(propertyName, false);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Object fetchPropertyValue(
      final CdmPropertyName propertyName,
      final boolean onlyFromProperty) {
    switch (propertyName) {
      case VERSION:
        return fetchTraitReferenceArgumentValue(
            this.fetchTraitReferenceName(CdmTraitName.VERSION, onlyFromProperty),
                "versionNumber");
      case SOURCE_NAME:
        return fetchTraitReferenceArgumentValue(
            this.fetchTraitReferenceName(CdmTraitName.SOURCE_NAME, onlyFromProperty),
                "name");
      case DISPLAY_NAME:
        return this.fetchLocalizedTraitTable(CdmTraitName.DISPLAY_NAME, onlyFromProperty);
      case DESCRIPTION:
        return this.fetchLocalizedTraitTable(CdmTraitName.DESCRIPTION, onlyFromProperty);
      case CDM_SCHEMAS:
        return this.getSingleAttTraitTable(CdmTraitName.ATTRIBUTE_GROUP, "groupList",
            onlyFromProperty);
      case SOURCE_ORDERING:
        return fetchTraitReferenceArgumentValue(
            this.fetchTraitReferenceName(CdmTraitName.SOURCE_ORDERING),
            "ordinal");
      case IS_PRIMARY_KEY:
        if (this.host instanceof CdmTypeAttributeDefinition) {
          CdmTypeAttributeDefinition typeAttribute = (CdmTypeAttributeDefinition) this.host;
          if (!onlyFromProperty && typeAttribute.getPurpose() != null && typeAttribute.getPurpose().getNamedReference().equals("identifiedBy")) {
            return true;
          }
        }
        return this.fetchTraitReferenceName(CdmTraitName.IS_IDENTIFIED_BY, onlyFromProperty) != null;
      case IS_NULLABLE:
        return this.fetchTraitReferenceName(CdmTraitName.IS_NULLABLE, onlyFromProperty) != null;
      case IS_READ_ONLY:
        return this.fetchTraitReferenceName(CdmTraitName.IS_READ_ONLY, onlyFromProperty) != null;
      case VALUE_CONSTRAINED_TO_LIST:
        return this.fetchTraitReferenceName(CdmTraitName.VALUE_CONSTRAINED_TO_LIST, onlyFromProperty) != null;
      case MAXIMUM_VALUE:
        return fetchTraitReferenceArgumentValue
            (this.fetchTraitReferenceName(CdmTraitName.IS_CONSTRAINED, onlyFromProperty),
                CdmPropertyName.MAXIMUM_VALUE.toString());
      case MINIMUM_VALUE:
        return fetchTraitReferenceArgumentValue(
            this.fetchTraitReferenceName(CdmTraitName.IS_CONSTRAINED, onlyFromProperty),
                CdmPropertyName.MINIMUM_VALUE.toString());
      case MAXIMUM_LENGTH:
        final Object temp = fetchTraitReferenceArgumentValue(
            this.fetchTraitReferenceName(CdmTraitName.IS_CONSTRAINED, onlyFromProperty),
                CdmPropertyName.MAXIMUM_LENGTH.toString());
        if (temp != null) {
          return temp;
        }
        break;
      case DATA_FORMAT:
        return this.traitsToDataFormat(onlyFromProperty);
      case PRIMARY_KEY:
        final CdmTypeAttributeDefinition attRef = (CdmTypeAttributeDefinition)
            fetchTraitReferenceArgumentValue(
                this.fetchTraitReferenceName(CdmTraitName.IS_IDENTIFIED_BY, onlyFromProperty),
                "attribute"); // TODO-BQ: This may break since unchecked casting
        if (attRef != null) {
          return attRef.fetchObjectDefinitionName();
        }
        break;
      case DEFAULT:
        return this.fetchDefaultValue(onlyFromProperty);
    }
    return null;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public CdmTraitReference fetchTraitReferenceName(final Object traitName) {
    return this.fetchTraitReferenceName(traitName, false);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  private CdmTraitReference fetchTraitReferenceName(final Object traitName, final boolean onlyFromProperty) {
    final int traitIndex = this.getTraits().indexOf(traitName.toString(), onlyFromProperty);
    return (traitIndex == -1) ? null : this.getTraits().get(traitIndex);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void updatePropertyValue(final CdmPropertyName propertyName, final Object newValue) {
    final Enum traitName = this.mapTraitName(propertyName);
    final List<CdmPropertyName> listOfProps = this.TRAIT_TO_LIST_OF_PROPERTIES_MAP.get(traitName);
    final boolean multipleProperties = listOfProps != null && listOfProps.size() > 1;
    if (newValue == null && !multipleProperties) {
      this.removeTrait(traitName.toString());
    } else {
      switch (propertyName) {
        case VERSION:
          this.updateTraitArgument(CdmTraitName.VERSION, "versionNumber", newValue);
          break;
        case CDM_SCHEMAS:
          this.updateSingleAttributeTraitTable(CdmTraitName.ATTRIBUTE_GROUP, "groupList", "attributeGroupSet",
              (List<String>) newValue);
          break;
        case SOURCE_NAME:
          this.updateTraitArgument(CdmTraitName.SOURCE_NAME, "name", newValue);
          break;
        case DISPLAY_NAME:
          this.setLocalizedTraitTable(CdmTraitName.DISPLAY_NAME, (String) newValue);
          break;
        case DESCRIPTION:
          this.setLocalizedTraitTable(CdmTraitName.DESCRIPTION, (String) newValue);
          break;
        case SOURCE_ORDERING:
          this.updateTraitArgument(CdmTraitName.SOURCE_ORDERING, "ordinal",
              newValue.toString()); // TODO-BQ: Check if should use toString or (String)
          break;
        case IS_PRIMARY_KEY:
          this.updateTraitArgument(CdmTraitName.IS_IDENTIFIED_BY, "", newValue);
          break;
        case IS_READ_ONLY:
          this.setBooleanTrait(CdmTraitName.IS_READ_ONLY, (boolean) newValue);
          break;
        case IS_NULLABLE:
          this.setBooleanTrait(CdmTraitName.IS_NULLABLE, (boolean) newValue);
          break;
        case VALUE_CONSTRAINED_TO_LIST:
          this.setBooleanTrait(CdmTraitName.VALUE_CONSTRAINED_TO_LIST, (boolean) newValue);
          break;
        case MAXIMUM_VALUE:
          this.updateTraitArgument(CdmTraitName.IS_CONSTRAINED, CdmPropertyName.MAXIMUM_VALUE.toString(), newValue);
          break;
        case MINIMUM_VALUE:
          this.updateTraitArgument(CdmTraitName.IS_CONSTRAINED, CdmPropertyName.MINIMUM_VALUE.toString(), newValue);
          break;
        case MAXIMUM_LENGTH:
          this.updateTraitArgument(CdmTraitName.IS_CONSTRAINED, CdmPropertyName.MAXIMUM_LENGTH.toString(), newValue);
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
    // if this is going to be called many times, then need to remove dynamic dataformat traits that are left behind.
    // but ... probably not. in fact, this is probably never used because data formats come from data type which is not an attribute
    switch (CdmDataFormat.fromString(dataFormat)) {
      case Int16:
      case Int32:
        this.fetchOrCreateTrait(CdmDataFormatTrait.INTEGER, true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.SMALL, true);
        break;
      case Int64:
        this.fetchOrCreateTrait(CdmDataFormatTrait.INTEGER, true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.BIG, true);
        break;
      case Float:
        this.fetchOrCreateTrait(CdmDataFormatTrait.FLOATING_POINT, true);
        break;
      case Double:
        this.fetchOrCreateTrait(CdmDataFormatTrait.FLOATING_POINT, true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.BIG, true);
        break;
      case Guid:
        this.fetchOrCreateTrait(CdmDataFormatTrait.GUID, true);
        break;
      case String:
        this.fetchOrCreateTrait(CdmDataFormatTrait.CHARACTER, true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.ARRAY, true);
        break;
      case Char:
        this.fetchOrCreateTrait(CdmDataFormatTrait.CHARACTER, true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.BIG, true);
        break;
      case Byte:
        this.fetchOrCreateTrait(CdmDataFormatTrait.BYTE, true);
        break;
      case Binary:
        this.fetchOrCreateTrait(CdmDataFormatTrait.ARRAY, true);
        break;
      case Time:
        this.fetchOrCreateTrait(CdmDataFormatTrait.TIME, true);
        break;
      case Date:
        this.fetchOrCreateTrait(CdmDataFormatTrait.DATE, true);
        break;
      case DateTime:
        this.fetchOrCreateTrait(CdmDataFormatTrait.TIME, true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.DATE, true);
        break;
      case DateTimeOffset:
        this.fetchOrCreateTrait(CdmDataFormatTrait.TIME, true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.DATE, true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.DATETIME_OFFSET, true);
        break;
      case Boolean:
        this.fetchOrCreateTrait(CdmDataFormatTrait.BOOLEAN, true);
        break;
      case Decimal:
        this.fetchOrCreateTrait(CdmDataFormatTrait.NUMERIC_SHAPED, true);
        break;
      case Json:
        this.fetchOrCreateTrait(CdmDataFormatTrait.ARRAY, true);
        this.fetchOrCreateTrait(CdmDataFormatTrait.JSON, true);
        break;
    }
  }

  private void setLocalizedTraitTable(final Enum traitName, final String sourceText) {
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

  private Object fetchLocalizedTraitTable(final Object trait, final boolean onlyFromProperty) {
    final CdmConstantEntityDefinition cEnt = this
        .fetchTraitTable(trait, "localizedDisplayText", onlyFromProperty);
    if (cEnt != null) {
      // search for a match
      // -1 on order gets us the last row that matches. needed because inheritence
      // chain with different descriptions stacks these up
      // need to use ordinals because no binding done yet
      return cEnt.fetchConstantValue(null, 1, 0, "en", -1);
    }
    return null;
  }

  private CdmTraitReference fetchOrCreateTrait(final Object trait) {
    return this.fetchOrCreateTrait(trait, false);
  }

  private CdmTraitReference fetchOrCreateTrait(Object traitName, final boolean simpleRef) {
    Object trait;
    if (traitName instanceof String) {
      traitName = traitName.toString();
    } else if (traitName instanceof Enum) {
      traitName = traitName.toString();
    }

    trait = fetchTraitReferenceName(traitName, true);
    if (trait == null) {
      trait = this.getCtx().getCorpus().makeObject(CdmObjectType.TraitRef, (String) traitName, false);

      if (this.host instanceof CdmObjectReference) {
        ((CdmObjectReference) this.host).getAppliedTraits().add((CdmTraitReference) trait);
      } else if (this.host instanceof CdmTypeAttributeDefinition) {
        ((CdmTypeAttributeDefinition) this.host).getAppliedTraits().add((CdmTraitReference) trait);
      } else {
        ((CdmObjectDefinition) this.host).getExhibitsTraits().add((CdmTraitReference) trait);
      }
    }
    ((CdmTraitReference) trait).setFromProperty(true);
    return (CdmTraitReference) trait;
  }

  private List<String> getSingleAttTraitTable(final Object trait, final String argName,
                                              final boolean onlyFromProperty) {
    final CdmConstantEntityDefinition cEnt = this.fetchTraitTable(trait, argName, onlyFromProperty);
    if (cEnt != null) {
      final List<String> result = new ArrayList<>();
      for (final List<String> v : cEnt.getConstantValues()) {
        result.add(v.get(0)); // TODO-BQ: revisit this, fail if size is equal 0
      }
      return result;
    }
    return null;
  }

  private Object fetchDefaultValue(final boolean onlyFromProperty) {
    final CdmTraitReference trait = this.fetchTraitReferenceName(CdmTraitName.DOES_HAVE_DEFAULT, onlyFromProperty);
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

  private CdmConstantEntityDefinition fetchTraitTable(Object trait, final String argName,
                                                    final boolean onlyFromProperty) {
    if (trait == null) {
      return null;
    }

    if (trait instanceof Enum) {
      trait = trait.toString();
    }

    if (trait instanceof String) {
      final int iTrait = this.getTraits().indexOf((String) trait, onlyFromProperty);
      if (iTrait == -1) {
        return null;
      }
      trait = this.getTraits().getAllItems().get(iTrait);
    }

    final Object locEntRef = fetchTraitReferenceArgumentValue(trait, argName);
    if (locEntRef != null) {
      // TODO-BQ: Check this implementation, this casting may not be correct, since c# is using dynamic.
      if (locEntRef instanceof CdmObject) {
        return ((CdmObject) locEntRef).fetchObjectDefinition(null);
      }
    }
    return null;
  }

  private void removeTrait(final String traitName) {
    if (this.getHost() instanceof CdmObjectReference) {
      ((CdmObjectReference) this.getHost())
          .getAppliedTraits().remove(traitName, true); // validate a known prop?
    } else if (this.getHost() instanceof CdmAttribute) {
      ((CdmAttribute) this.getHost())
          .getAppliedTraits().remove(traitName, true); // validate a known prop?
    } else {
      ((CdmObjectDefinition) this.getHost())
          .getExhibitsTraits().remove(traitName, true); // validate a known prop?
    }
  }

  private void setBooleanTrait(final Enum traitName, final boolean value) {
    if (value) {
      this.fetchOrCreateTrait(traitName, true);
    } else {
      this.removeTrait(traitName.toString());
    }
  }

  private void updateSingleAttributeTraitTable(final Object trait, final String argName, final String entityName,
                                               final List<String> sourceText) {
    this.updateTraitTable(trait, argName, entityName, (cEnt, created) -> {
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

  private void updateTraitArgument(Object inputTrait, final String argName, final Object argValue) {
    final CdmTraitReference trait;

    if (inputTrait instanceof CdmTraitName) {
      inputTrait = inputTrait.toString();
    }

    if (inputTrait instanceof String) {
      trait = this.fetchOrCreateTrait(inputTrait, false);
    } else {
      trait = (CdmTraitReference) inputTrait;
    }
    final CdmArgumentCollection args = trait.getArguments();
    if (args == null || args.getCount() == 0) {
      if (argValue != null) {
        trait.getArguments().add(argName, argValue);
        return;
      } else {
        this.removeTrait((String) inputTrait);
      }
    } else {
      for (int iArg = 0; iArg < args.getCount(); ++iArg) {
        final CdmArgumentDefinition arg = args.getAllItems().get(iArg);
        if (arg.getName().equals(argName)) {
          if (argValue == null) {
            args.remove(arg);
            if (trait != null && trait.getArguments() != null && trait.getArguments().size() == 0) {
              this.removeTrait((String) inputTrait);
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
      for (final CdmTraitReference trait : traits) {
        if (onlyFromProperty && !trait.isFromProperty()) {
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

      if (isInteger) {
          if (isBig) {
              baseType = CdmDataFormat.Int64;
          } else if (isSmall) {
              baseType = CdmDataFormat.Int16;
          } else {
              baseType = CdmDataFormat.Int32;
          }
      }
    }

    return baseType.name();
  }

  //  // TODO-BQ: try to resolve Object trait, because it is dynamic now.
  private void updateTraitTable(Object trait, final String argName, final String entityName,
                             final BiConsumer<CdmConstantEntityDefinition, Boolean> action) {
    if (trait instanceof Enum) {
      trait = trait.toString();
    }

    trait = this.fetchOrCreateTrait(trait, false);
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
      final CdmTraitReference trait = this.fetchOrCreateTrait("does.haveDefault", false);

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
        this.updateTraitArgument(trait, "default", newDefault);
      } else {
        LOGGER.error("Default value missing languageTag or displayText.");
      }
    } else {
      LOGGER.error("Default value type not supported. Please use ArrayNode.");
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
