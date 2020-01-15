// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import java.util.ArrayList;
import java.util.List;

public class CdmAttributeResolutionGuidance extends CdmObjectSimple {

  private Boolean removeAttribute;
  private List<String> imposedDirectives;
  private List<String> removedDirectives;
  private CdmTypeAttributeDefinition addSupportingAttribute;
  private String cardinality;
  private String renameFormat;
  private EntityByReference entityByReference;
  private Expansion expansion;
  private SelectsSubAttribute selectsSubAttribute;

  public CdmAttributeResolutionGuidance(final CdmCorpusContext ctx) {
    super(ctx);
    this.setObjectType(CdmObjectType.AttributeResolutionGuidanceDef);
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    if (preChildren != null && preChildren.invoke(this, pathFrom)) {
      return false;
    }

    if (this.getAddSupportingAttribute() != null) {
      if (this.getAddSupportingAttribute()
              .visit(pathFrom + "addSupportingAttribute/", preChildren, postChildren)) {
        return true;
      }
    }
    if (this.getExpansion() != null && this.getExpansion().getCountAttribute() != null) {
      if (this.getExpansion().getCountAttribute()
              .visit(pathFrom + "countAttribute/", preChildren, postChildren)) {
        return true;
      }
    }
    if (this.getEntityByReference() != null && this.getEntityByReference().getForeignKeyAttribute() != null) {
      if (this.getEntityByReference().getForeignKeyAttribute()
              .visit(pathFrom + "foreignKeyAttribute/", preChildren, postChildren)) {
        return true;
      }
    }
    if (this.getSelectsSubAttribute() != null
            && this.getSelectsSubAttribute().getSelectedTypeAttribute() != null) {
      if (this.getSelectsSubAttribute().getSelectedTypeAttribute()
              .visit(pathFrom + "selectedTypeAttribute/", preChildren, postChildren)) {
        return true;
      }
    }
    return postChildren != null && postChildren.invoke(this, pathFrom);
  }

  void updateAttributeDefaults(String attName) {
    // handle the cardinality and expansion group.
    // default is one, but if there is some hint of an array, make it work
    if (this.cardinality == null) {
      if (this.expansion != null) {
        this.cardinality = "many";
      } else {
        this.cardinality = "one";
      }
    }
    if ("many".equals(this.cardinality) && this.expansion == null) {
      this.expansion = new Expansion();
    }
    if ("many".equals(this.cardinality)) {
      if (this.expansion.getStartingOrdinal() == null) {
        this.expansion.setStartingOrdinal(0);
      }
      if (this.expansion.getMaximumExpansion() == null) {
        this.expansion.setMaximumExpansion(5);
      }
      if (this.expansion.getCountAttribute() == null) {
        this.expansion.setCountAttribute(this.getCtx().getCorpus()
                .makeObject(CdmObjectType.TypeAttributeDef, "count"));
        this.expansion.getCountAttribute()
                .setDataType(this.getCtx().getCorpus().makeObject(CdmObjectType.DataTypeRef,
                        "integer", true));
      }
    }
    // entity by ref. anything mentioned?
    if (this.entityByReference != null) {
      if (this.entityByReference.doesAllowReference() == null) {
        this.entityByReference.setAllowReference(true);
      }
      if (this.entityByReference.doesAllowReference()) {
        if (this.entityByReference.doesAlwaysIncludeForeignKey() == null) {
          this.entityByReference.setAlwaysIncludeForeignKey(false);
        }
        if (this.entityByReference.getReferenceOnlyAfterDepth() == null) {
          this.entityByReference.setReferenceOnlyAfterDepth(2);
        }
        if (this.entityByReference.getForeignKeyAttribute() == null) {
          // make up a fk
          this.entityByReference.setForeignKeyAttribute(this.getCtx().getCorpus()
                  .makeObject(CdmObjectType.TypeAttributeDef, "id"));
          this.entityByReference.getForeignKeyAttribute().setDataType(this.getCtx().getCorpus()
                  .makeObject(CdmObjectType.DataTypeRef, "entityId", true));
        }
      }
    }
    // selects one>
    if (this.selectsSubAttribute != null) {
      if (this.selectsSubAttribute.getSelects() == null) {
        this.selectsSubAttribute.setSelects("one");
      }
      if ("one".equals(this.selectsSubAttribute.getSelects())) {
        if (this.selectsSubAttribute.getSelectedTypeAttribute() == null) {
          // make up a fk
          this.selectsSubAttribute.setSelectedTypeAttribute(this.getCtx().getCorpus()
                  .makeObject(CdmObjectType.TypeAttributeDef, "type"));
          this.selectsSubAttribute.getSelectedTypeAttribute().setDataType(this.getCtx()
                  .getCorpus().makeObject(CdmObjectType.DataTypeRef, "entityName", true));
        }
      }
    }

    // only set a rename format if one is needed for arrays or added atts
    if (this.renameFormat == null) {
      if (attName == null) {
        // a type attribute, so no nesting
        if ("many".equals(this.cardinality)) {
          this.renameFormat = "{a}{o}";
        }
      } else {
        if ("many".equals(this.cardinality)) {
          this.renameFormat = "{a}{o}{M}";
        } else {
          this.renameFormat = "{a}{M}";
        }
      }
    }

    if (this.renameFormat != null) {
      // rename format is a lie. actually only supports sub-attribute name and ordinal as 'a' and 'o'
      if (attName != null) {
        // replace the use of {a or A} with the outer attributeName
        boolean upper = false;
        int iA = this.renameFormat.indexOf("{a}");
        if (iA < 0) {
          iA = this.renameFormat.indexOf("{A}");
          upper = true;
        }
        if (iA >= 0) {
          if (upper) {
            attName = Character.toString(attName.charAt(0)).toUpperCase() + attName.substring(1);
          }
          this.renameFormat = this.renameFormat.substring(0, iA) + attName + this.renameFormat.substring(iA + 3);
        }
        // now, use of {m/M} should be turned to {a/A}
        int iM = this.renameFormat.indexOf("{m}");
        if (iM >= 0) {
          this.renameFormat = this.renameFormat.substring(0, iM) + "{a}" + this.renameFormat.substring(iM + 3);
        } else {
          iM = this.renameFormat.indexOf("{M}");
          if (iM >= 0) {
            this.renameFormat = this.renameFormat.substring(0, iM) + "{A}" + this.renameFormat.substring(iM + 3);
          }
        }
      }
    }
  }

  /**
   * If true, this attribute definition will be removed from the final resolved attribute list of an
   * entity.
   */
  public Boolean getRemoveAttribute() {
    return this.removeAttribute;
  }

  public void setRemoveAttribute(final Boolean value) {
    this.removeAttribute = value;
  }

  /**
   * A list of Strings, one for each 'directive' that should be always imposed at this attribute
   * definition.
   */
  public List<String> getImposedDirectives() {
    return this.imposedDirectives;
  }

  public void setImposedDirectives(final List<String> value) {
    this.imposedDirectives = value;
  }

  /**
   * A list of Strings, one for each 'directive' that should be removed if previously imposed.
   */
  public List<String> getRemovedDirectives() {
    return this.removedDirectives;
  }

  public void setRemovedDirectives(final List<String> value) {
    this.removedDirectives = value;
  }

  /**
   * The supplied attribute definition will be added to the CdmEntityDefinition after this attribute definition
   * with a trait indicating its supporting role on this.
   */
  public CdmTypeAttributeDefinition getAddSupportingAttribute() {
    return this.addSupportingAttribute;
  }

  public void setAddSupportingAttribute(final CdmTypeAttributeDefinition value) {
    this.addSupportingAttribute = value;
  }

  /**
   * If 'one' then there is a single instance of the attribute or entity used. 'many' indicates
   * multiple instances and the 'expansion' properties will describe array enumeration to use when
   * needed.
   */
  public String getCardinality() {
    return this.cardinality;
  }

  public void setCardinality(final String value) {
    this.cardinality = value;
  }

  /**
   * Format specifier for generated attribute names. May contain a single occurence of ('{a} or
   * 'A'), ('{m}' or '{M}') and '{o}' for the base (a/A)ttribute name, any (m/M)ember attributes
   * from entities and array (o)rdinal. examples: '{a}{o}.{m}' could produce 'address2.city',
   * '{a}{o}' gives 'city1'. Using '{A}' or '{M}' will uppercase the first letter of the name
   * portions.
   */
  public String getRenameFormat() {
    return this.renameFormat;
  }

  public void setRenameFormat(final String value) {
    this.renameFormat = value;
  }

  /**
   * Parameters that control array expansion if inline repeating of attributes is needed.
   */
  public Expansion getExpansion() {
    return this.expansion;
  }

  public void setExpansion(final Expansion value) {
    this.expansion = value;
  }

  public Expansion makeExpansion() {
    return new Expansion();
  }

  /**
   * Parameters that control the use of foreign keys to reference entity instances instead of
   * embedding the entity in a nested way.
   */
  public EntityByReference getEntityByReference() {
    return this.entityByReference;
  }

  public void setEntityByReference(final EntityByReference value) {
    this.entityByReference = value;
  }

  public EntityByReference makeEntityByReference() {
    return new EntityByReference();
  }

  /**
   * Used to indicate that this attribute select either 'one' or 'all' of the sub-attributes from an
   * entity. If the 'structured' directive is set, this trait causes resolved attributes to end up
   * in groups rather than a flattened list.
   */
  public SelectsSubAttribute getSelectsSubAttribute() {
    return this.selectsSubAttribute;
  }

  public void setSelectsSubAttribute(final SelectsSubAttribute value) {
    this.selectsSubAttribute = value;
  }

  public SelectsSubAttribute makeSelectsSubAttribute() {
    return new SelectsSubAttribute();
  }

  @Override
  public boolean validate() {
    return true;
  }

  /**
   *
   * @param resOpt
   * @param options
   * @return
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmAttributeResolutionGuidance.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this);
    }

    CdmAttributeResolutionGuidance copy;
    if (host == null) {
      copy = new CdmAttributeResolutionGuidance(this.getCtx());
    } else {
      copy = (CdmAttributeResolutionGuidance) host;
      copy.setCtx(this.getCtx());
      copy.setExpansion(null);
      copy.setEntityByReference(null);
      copy.setSelectsSubAttribute(null);
    }

    copy.setRemoveAttribute(this.getRemoveAttribute());
    if (this.getImposedDirectives() != null) {
      copy.setImposedDirectives(new ArrayList<>(this.getImposedDirectives()));
    }
    if (this.getRemovedDirectives() != null) {
      copy.setRemovedDirectives(new ArrayList<>(this.getRemovedDirectives()));
    }

    copy.setAddSupportingAttribute(this.getAddSupportingAttribute());
    copy.setCardinality(this.getCardinality());
    copy.setRenameFormat(this.getRenameFormat());

    if (this.getExpansion() != null) {
      final Expansion expansion = new Expansion();

      expansion.setStartingOrdinal(this.getExpansion().getStartingOrdinal());
      expansion.setMaximumExpansion(this.getExpansion().getMaximumExpansion());
      expansion.setCountAttribute(this.getExpansion().getCountAttribute());

      copy.setExpansion(expansion);
    }
    if (this.entityByReference != null) {
      final EntityByReference entityByReference = new EntityByReference();
      entityByReference.setAlwaysIncludeForeignKey(this.getEntityByReference().doesAlwaysIncludeForeignKey());
      entityByReference.setReferenceOnlyAfterDepth(this.getEntityByReference().getReferenceOnlyAfterDepth());
      entityByReference.setAllowReference(this.getEntityByReference().doesAllowReference());
      entityByReference.setForeignKeyAttribute(this.getEntityByReference().getForeignKeyAttribute());

      copy.setEntityByReference(entityByReference);
    }
    if (this.selectsSubAttribute != null) {
      final SelectsSubAttribute selectsSubAttribute = new SelectsSubAttribute();
      selectsSubAttribute.setSelects(this.getSelectsSubAttribute().getSelects());
      selectsSubAttribute.setSelectedTypeAttribute(this.getSelectsSubAttribute().getSelectedTypeAttribute());
      selectsSubAttribute.setSelectsSomeTakeNames(this.getSelectsSubAttribute().getSelectsSomeTakeNames());
      selectsSubAttribute.setSelectsSomeAvoidNames(this.getSelectsSubAttribute().getSelectsSomeAvoidNames());

      copy.setSelectsSubAttribute(selectsSubAttribute);
    }
    return copy;
  }

  /**
   *
   * @param addIn
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public CdmAttributeResolutionGuidance combineResolutionGuidance(
      final CdmAttributeResolutionGuidance addIn) {
    final CdmAttributeResolutionGuidance startWith = this;

    if (addIn == null) {
      return startWith;
    }

    if (startWith == null) {
      return addIn;
    }

    final CdmAttributeResolutionGuidance result = new CdmAttributeResolutionGuidance(getCtx());

    // can remove and then un-remove later
    if (startWith.removeAttribute != null && startWith.removeAttribute) {
      if (addIn.removeAttribute == null || addIn.removeAttribute) {
        result.removeAttribute = true;
      }
    } else {
      if (addIn.removeAttribute != null && addIn.removeAttribute) {
        result.removeAttribute = true;
      }
    }

    // copy and combine if needed
    if (addIn.imposedDirectives != null) {
      if (startWith.imposedDirectives != null) {
        result.imposedDirectives = new ArrayList<>(startWith.imposedDirectives);
      } else {
        result.imposedDirectives = new ArrayList<>();
      }

      result.imposedDirectives.addAll(addIn.imposedDirectives);
    } else {
      result.imposedDirectives = startWith.imposedDirectives;
    }

    if (addIn.removedDirectives != null) {
      if (startWith.removedDirectives != null) {
        result.removedDirectives = new ArrayList<>(startWith.removedDirectives);
      } else {
        result.removedDirectives = new ArrayList<>();
      }

      result.removedDirectives.addAll(addIn.removedDirectives);
    } else {
      result.removedDirectives = startWith.removedDirectives;
    }

    result.addSupportingAttribute = startWith.addSupportingAttribute;
    if (addIn.addSupportingAttribute != null) {
      result.addSupportingAttribute = addIn.addSupportingAttribute;
    }

    result.cardinality = startWith.cardinality;
    if (addIn.cardinality != null) {
      result.cardinality = addIn.cardinality;
    }

    result.renameFormat = startWith.renameFormat;
    if (addIn.renameFormat != null) {
      result.renameFormat = addIn.renameFormat;
    }

    // for these sub objects, ok to just use the same objects unless something is combined. assumption is that these are static during the resolution
    if (addIn.expansion != null) {
      if (startWith.expansion != null) {
        result.expansion = new Expansion();
        result.expansion.setStartingOrdinal(startWith.expansion.getStartingOrdinal());
        if (addIn.expansion.getStartingOrdinal() != null) {
          result.expansion.setStartingOrdinal(addIn.expansion.getStartingOrdinal());
        }
        result.expansion.setMaximumExpansion(startWith.expansion.getMaximumExpansion());
        if (addIn.expansion.getMaximumExpansion() != null) {
          result.expansion.setMaximumExpansion(addIn.expansion.getMaximumExpansion());
        }
        result.expansion.setCountAttribute(startWith.expansion.getCountAttribute());
        if (addIn.expansion.getCountAttribute() != null) {
          result.expansion.setCountAttribute(addIn.expansion.getCountAttribute());
        }

      } else {
        result.expansion = addIn.expansion;
      }

    } else {
      result.expansion = startWith.expansion;
    }

    if (addIn.entityByReference != null) {
      if (startWith.entityByReference != null) {
        result.entityByReference = new EntityByReference();
        result.entityByReference
                .setAlwaysIncludeForeignKey(startWith.entityByReference.doesAlwaysIncludeForeignKey());
        if (addIn.entityByReference.doesAlwaysIncludeForeignKey() != null) {
          result.entityByReference
                  .setAlwaysIncludeForeignKey(addIn.entityByReference.doesAlwaysIncludeForeignKey());
        }
        result.entityByReference
                .setReferenceOnlyAfterDepth(startWith.entityByReference.getReferenceOnlyAfterDepth());
        if (addIn.entityByReference.getReferenceOnlyAfterDepth() != null) {
          result.entityByReference
                  .setReferenceOnlyAfterDepth(addIn.entityByReference.getReferenceOnlyAfterDepth());
        }
        result.entityByReference
                .setForeignKeyAttribute(startWith.entityByReference.getForeignKeyAttribute());
        if (addIn.entityByReference.getForeignKeyAttribute() != null) {
          result.entityByReference
                  .setForeignKeyAttribute(addIn.entityByReference.getForeignKeyAttribute());
        }
        result.entityByReference
                .setAllowReference(startWith.entityByReference.doesAllowReference());
        if (addIn.entityByReference.doesAllowReference() != null) {
          result.entityByReference.setAllowReference(addIn.entityByReference.doesAllowReference());
        }
      } else {
        result.entityByReference = addIn.entityByReference;
      }

    } else {
      result.entityByReference = startWith.entityByReference;
    }

    if (addIn.selectsSubAttribute != null) {
      if (startWith.selectsSubAttribute != null) {
        result.selectsSubAttribute = new SelectsSubAttribute();
        result.selectsSubAttribute
                .setSelectedTypeAttribute(startWith.selectsSubAttribute.getSelectedTypeAttribute());
        if (addIn.selectsSubAttribute.getSelectedTypeAttribute() != null) {
          result.selectsSubAttribute
                  .setSelectedTypeAttribute(addIn.selectsSubAttribute.getSelectedTypeAttribute());
        }
        result.selectsSubAttribute.setSelects(startWith.selectsSubAttribute.getSelects());
        if (addIn.selectsSubAttribute.getSelects() != null) {
          result.selectsSubAttribute.setSelects(addIn.selectsSubAttribute.getSelects());
        }
        if (addIn.selectsSubAttribute.getSelectsSomeTakeNames() != null) {
          if (startWith.selectsSubAttribute.getSelectsSomeTakeNames() != null) {
            result.selectsSubAttribute.setSelectsSomeTakeNames(
                new ArrayList<>(startWith.selectsSubAttribute.getSelectsSomeTakeNames()));
          } else {
            result.selectsSubAttribute.setSelectsSomeTakeNames(new ArrayList<>());
          }
          result.selectsSubAttribute.getSelectsSomeTakeNames().addAll(addIn.selectsSubAttribute.getSelectsSomeTakeNames());
        }
        if (addIn.selectsSubAttribute.getSelectsSomeAvoidNames() != null) {
          if (startWith.selectsSubAttribute.getSelectsSomeAvoidNames() != null) {
            result.selectsSubAttribute.setSelectsSomeAvoidNames(
                new ArrayList<>(startWith.selectsSubAttribute.getSelectsSomeAvoidNames()));
          } else {
            result.selectsSubAttribute.setSelectsSomeAvoidNames(new ArrayList<>());
          }
          result.selectsSubAttribute.getSelectsSomeAvoidNames().addAll(addIn.selectsSubAttribute.getSelectsSomeAvoidNames());
        }
      } else {
        result.selectsSubAttribute = addIn.selectsSubAttribute;
      }

    } else {
      result.selectsSubAttribute = startWith.selectsSubAttribute;
    }

    return result;
  }
}
