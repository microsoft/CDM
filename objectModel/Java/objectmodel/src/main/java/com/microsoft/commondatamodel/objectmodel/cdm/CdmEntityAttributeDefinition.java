// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CardinalitySettings;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.*;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionDirective;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.Errors;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.LinkedHashSet;
import java.util.stream.Collectors;

public class CdmEntityAttributeDefinition extends CdmAttribute {
  private CdmEntityReference entity;
  private TraitToPropertyMap t2pm;
  private Boolean isPolymorphicSource;

  public CdmEntityAttributeDefinition(final CdmCorpusContext ctx, final String name) {
    super(ctx, name);
    this.setObjectType(CdmObjectType.EntityAttributeDef);
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    return false;
  }

  public String fetchDescription() {
    final Object description = this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.DESCRIPTION);
    return description != null ? (String) description : null;
  }

  public void updateDescription(final String value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.DESCRIPTION, value);
  }

  public String fetchDisplayName() {
    return (String) this.getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.DISPLAY_NAME);
  }

  public void updateDisplayName(final String value) {
    this.getTraitToPropertyMap().updatePropertyValue(CdmPropertyName.DISPLAY_NAME, value);
  }

  /**
   * @param propertyName
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Object fetchProperty(final CdmPropertyName propertyName) {
    return this.getTraitToPropertyMap().fetchPropertyValue(propertyName, true);
  }

  private TraitToPropertyMap getTraitToPropertyMap() {
    if (this.t2pm == null) {
      this.t2pm = new TraitToPropertyMap(this);
    }
    return this.t2pm;
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    if (this.entity == null) {
      return false;
    }

    String path = "";
    if (this.getCtx() != null
        && this.getCtx().getCorpus() != null
        && !this.getCtx().getCorpus().blockDeclaredPathChanges) {
      this.getDeclaredPath();

      if (Strings.isNullOrEmpty(path)) {
        path = pathFrom + this.getName();
        this.setDeclaredPath(path);
      }
    }

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }

    if (this.getEntity().visit(path + "/entity/", preChildren, postChildren)) {
      return true;
    }
    if (this.visitAtt(path, preChildren,
        postChildren)) {
      return true;
    }
    return postChildren != null && postChildren.invoke(this, path);
  }

  /**
   * Gets or sets the entity attribute entity reference.
   */
  public CdmEntityReference getEntity() {
    return this.entity;
  }

  public void setEntity(final CdmEntityReference value) {
    this.entity = value;
  }

  /**
   * For projection based models, a source is explicitly tagged as a polymorphic source for it to be recognized as such.
   * This property of the entity attribute allows us to do that.
   */
  public Boolean getIsPolymorphicSource() {
    return isPolymorphicSource;
  }

  public void setIsPolymorphicSource(final Boolean polymorphicSource) {
    isPolymorphicSource = polymorphicSource;
  }

  @Override
  public ResolvedEntityReferenceSet fetchResolvedEntityReferences(ResolveOptions resOpt) {
    if (resOpt == null) {
      Set<String> directives = new LinkedHashSet<> ();
      directives.add("normalized");
      directives.add("referenceOnly");
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    final ResolvedTraitSet rtsThisAtt = this.fetchResolvedTraits(resOpt);
    final CdmAttributeResolutionGuidance resGuide = this
        .getResolutionGuidance();

    // this context object holds all of the info about what needs to happen to resolve these attributes
    final AttributeResolutionContext arc = new AttributeResolutionContext(resOpt, resGuide, rtsThisAtt);

    final RelationshipInfo relInfo = this.getRelationshipInfo(resOpt, arc);
    if (relInfo.isByRef() && !relInfo.isArray()) {
      {
        // only place this is used, so logic here instead of encapsulated.
        // make a set and the one ref it will hold
        final ResolvedEntityReferenceSet rers = new ResolvedEntityReferenceSet(resOpt);
        final ResolvedEntityReference rer = new ResolvedEntityReference();
        // referencing attribute(s) come from this attribute
        rer.getReferencing().getResolvedAttributeSetBuilder()
            .mergeAttributes(this.fetchResolvedAttributes(resOpt, null));

        // either several or one entity
        // for now, a sub for the 'select one' idea
        if (this.getEntity().getExplicitReference() != null) {
          final CdmEntityDefinition entPickFrom = this.getEntity().fetchObjectDefinition(resOpt);
          final CdmCollection<CdmAttributeItem> attsPick = entPickFrom.getAttributes();
          if (attsPick != null) {
            for (int i = 0; i < attsPick.getCount(); i++) {
              if (attsPick.getAllItems().get(i).getObjectType()
                  == CdmObjectType.EntityAttributeDef) {
                final CdmEntityReference er = ((CdmEntityAttributeDefinition) attsPick.getAllItems().get(i))
                    .getEntity();
                rer.getReferenced().add(resolveSide(er, resOpt));
              }
            }
          }
        } else {
          rer.getReferenced().add(resolveSide(this.getEntity(), resOpt));
        }

        rers.getSet().add(rer);
        return rers;
      }
    }
    return null;
  }

  @Override
  public boolean validate() {
    ArrayList<String> missingFields = new ArrayList<String>();

    if (StringUtils.isNullOrTrimEmpty(this.getName())) {
      missingFields.add("name");
    }

    if (this.entity == null) {
      missingFields.add("entity");
    }

    if (this.getCardinality() != null) {
      if (StringUtils.isNullOrTrimEmpty(this.getCardinality().getMinimum())) {
        missingFields.add("cardinality.minimum");
      }
      if (StringUtils.isNullOrTrimEmpty(this.getCardinality().getMaximum())) {
        missingFields.add("cardinality.maximum");
      }
    }

    if (missingFields.size() > 0) {
      Logger.error(CdmEntityAttributeDefinition.class.getSimpleName(), this.getCtx(), Errors.validateErrorString(this.getAtCorpusPath(), missingFields));
      return false;
    }

    if (this.getCardinality() != null) {
      if (!CardinalitySettings.isMinimumValid(this.getCardinality().getMinimum())) {
        Logger.error(CdmEntityAttributeDefinition.class.getSimpleName(), this.getCtx(), Logger.format("Invalid minimum cardinality {0}", this.getCardinality().getMinimum()), "validate");
        return false;
      }
      if (!CardinalitySettings.isMaximumValid(this.getCardinality().getMaximum())) {
        Logger.error(CdmEntityAttributeDefinition.class.getSimpleName(), this.getCtx(), Logger.format("Invalid maximum cardinality {0}", this.getCardinality().getMaximum()), "validate");
        return false;
      }
    }

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
    return CdmObjectBase.copyData(this, resOpt, options, CdmEntityAttributeDefinition.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    CdmEntityAttributeDefinition copy;
    if (host == null) {
      copy = new CdmEntityAttributeDefinition(this.getCtx(), this.getName());
    } else {
      copy = (CdmEntityAttributeDefinition) host;
      copy.setCtx(this.getCtx());
      copy.setName(this.getName());
    }

    copy.setEntity((CdmEntityReference) this.entity.copy(resOpt));
    this.copyAtt(resOpt, copy);
    return copy;
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    // // get from purpose
    if (this.getPurpose() != null) {
      rtsb.takeReference(this.getPurpose().fetchResolvedTraits(resOpt));
    }

    this.addResolvedTraitsApplied(rtsb, resOpt);
    //rtsb.CleanUp();
  }

  private RelationshipInfo getRelationshipInfo(final ResolveOptions resOpt,
                                               final AttributeResolutionContext arc) {
    final ResolvedTraitSet rts = null;
    boolean noMaxDepth = false;
    boolean hasRef = false;
    boolean isByRef = false;
    boolean isArray = false;
    boolean selectsOne = false;
    Integer nextDepth = null;
    boolean maxDepthExceeded = false;

    if (arc != null && arc.getResGuide() != null) {
      final EntityByReference resGuide = arc.getResGuide()
          .getEntityByReference();
      if (resGuide != null && resGuide.doesAllowReference()) {
        hasRef = true;
      }

      final AttributeResolutionDirectiveSet resDirectives = arc.getResOpt().getDirectives();
      if (resDirectives != null) {
        noMaxDepth = resDirectives.has("noMaxDepth");
        // based on directives
        if (hasRef) {
          isByRef = resDirectives.has("referenceOnly");
        }
        selectsOne = resDirectives.has("selectOne");
        isArray = resDirectives.has("isArray");
      }
      // figure out the depth for the next level
      final Integer oldDepth = resOpt.getRelationshipDepth();
      nextDepth = oldDepth;
      // if this is a 'selectone', then skip counting this entity in the depth, else count it
      if (!selectsOne) {
        // if already a ref, who cares?
        if (!isByRef) {
          if (nextDepth == null) {
            //    TODO-BQ: Verify this if statement. Might not be reachable.
            nextDepth = 1;
          } else {
            nextDepth++;
          }

          // max comes from settings but may not be set
          int maxDepth = 2;
          if (hasRef
              && arc.getResGuide().getEntityByReference().getReferenceOnlyAfterDepth() != null) {
            maxDepth = arc.getResGuide().getEntityByReference().getReferenceOnlyAfterDepth();
          }
          if (noMaxDepth) {
            maxDepth = 32; // no max? really? what if we loop forever? if you need more than 32 nested entities, then you should buy a different metadata description system.
          }

          if (nextDepth > maxDepth) {
            // don't do it
            isByRef = true;
            maxDepthExceeded = true;
          }
        }
      }
    }

    final RelationshipInfo relationshipInfo = new RelationshipInfo();
    relationshipInfo.setRts(rts);
    relationshipInfo.setByRef(isByRef);
    relationshipInfo.setArray(isArray);
    relationshipInfo.setSelectsOne(selectsOne);
    relationshipInfo.setNextDepth(nextDepth);
    relationshipInfo.setMaxDepthExceeded(maxDepthExceeded);
    return relationshipInfo;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(
      final ResolveOptions resOpt,
      CdmAttributeContext under) {
    // find and cache the complete set of attributes
    // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
    // the entity used as an attribute, traits applied to that entity,
    // the purpose of the attribute, any traits applied to the attribute.
    ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();
    final CdmEntityReference ctxEnt = this.getEntity();
    final CdmAttributeContext underAtt = under;
    AttributeContextParameters acpEnt = null;

    CdmObjectDefinition ctxEntObjDef = ctxEnt.fetchObjectDefinition(resOpt);
    if (ctxEntObjDef.getObjectType() == CdmObjectType.ProjectionDef) {
      // A Projection

      ProjectionDirective projDirective = new ProjectionDirective(resOpt, this, ctxEnt);
      CdmProjection projDef = (CdmProjection)ctxEntObjDef;
      ProjectionContext projCtx = projDef.constructProjectionContext(projDirective, under);

      ResolvedAttributeSet ras = projDef.extractResolvedAttributes(projCtx);
      rasb.setResolvedAttributeSet(ras);
    } else {
      // An Entity Reference

      if (underAtt != null) {
        // make a context for this attribute that holds the attributes that come up from the entity
        acpEnt = new AttributeContextParameters();
        acpEnt.setUnder(underAtt);
        acpEnt.setType(CdmAttributeContextType.Entity);
        acpEnt.setName(ctxEnt.fetchObjectDefinitionName());
        acpEnt.setRegarding(ctxEnt);
        acpEnt.setIncludeTraits(true);
      }

      final ResolvedTraitSet rtsThisAtt = this.fetchResolvedTraits(resOpt);

      // this context object holds all of the info about what needs to happen to resolve these attributes.
      // make a copy and add defaults if missing
      final CdmAttributeResolutionGuidance resGuideWithDefault;
      if (this.getResolutionGuidance() != null) {
        resGuideWithDefault = (CdmAttributeResolutionGuidance) this.getResolutionGuidance()
                .copy(resOpt);
      } else {
        resGuideWithDefault = new CdmAttributeResolutionGuidance(this.getCtx());
      }
      resGuideWithDefault.updateAttributeDefaults(this.getName());

      final AttributeResolutionContext arc = new AttributeResolutionContext(resOpt, resGuideWithDefault,
              rtsThisAtt);

      // complete cheating but is faster.
      // this purpose will remove all of the attributes that get collected here, so dumb and slow to go get them
      final RelationshipInfo relInfo = this.getRelationshipInfo(arc.getResOpt(), arc);
      if (relInfo.isByRef()) {
        // make the entity context that a real recursion would have give us
        if (under != null) {
          under = rasb.getResolvedAttributeSet().createAttributeContext(resOpt, acpEnt);
        }
        // if selecting from one of many attributes, then make a context for each one
        if (under != null && relInfo.doSelectsOne()) {
          // the right way to do this is to get a resolved entity from the embedded entity and then
          // look through the attribute context hierarchy for non-nested entityReferenceAsAttribute nodes
          // that seems like a disaster waiting to happen given endless looping, etc.
          // for now, just insist that only the top level entity attributes declared in the ref entity will work
          final CdmEntityDefinition entPickFrom = ((CdmEntityReference) this.getEntity()).fetchObjectDefinition(resOpt);
          CdmCollection<CdmAttributeItem> attsPick = null;
          if (entPickFrom != null) {
            attsPick = entPickFrom.getAttributes();
          }

          if (entPickFrom != null && attsPick != null) {
            for (int i = 0; i < attsPick.getCount(); i++) {
              if (attsPick.getAllItems().get(i).getObjectType() == CdmObjectType.EntityAttributeDef) {
                // a table within a table. as expected with a selectsOne attribute
                // since this is by ref, we won't get the atts from the table, but we do need the traits that hold the key
                // these are the same contexts that would get created if we recursed
                // first this attribute
                final AttributeContextParameters acpEntAtt = new AttributeContextParameters();
                acpEntAtt.setUnder(under);
                acpEntAtt.setType(CdmAttributeContextType.AttributeDefinition);
                acpEntAtt.setName(attsPick.getAllItems().get(i).fetchObjectDefinitionName());
                acpEntAtt.setRegarding(attsPick.getAllItems().get(i));
                acpEntAtt.setIncludeTraits(true);

                final CdmAttributeContext pickUnder = rasb.getResolvedAttributeSet().createAttributeContext(resOpt, acpEntAtt);
                final CdmEntityReference pickEnt = (((CdmEntityAttributeDefinition) attsPick.getAllItems().get(i))).getEntity();
                CdmAttributeContextType pickEntType = (pickEnt.fetchObjectDefinition(resOpt).getObjectType() == CdmObjectType.ProjectionDef) ?
                        CdmAttributeContextType.Projection :
                        CdmAttributeContextType.Entity;

                final AttributeContextParameters acpEntAttEnt = new AttributeContextParameters();
                acpEntAttEnt.setUnder(pickUnder);
                acpEntAttEnt.setType(pickEntType);
                acpEntAttEnt.setName(pickEnt.fetchObjectDefinitionName());
                acpEntAttEnt.setRegarding(pickEnt);
                acpEntAttEnt.setIncludeTraits(true);

                rasb.getResolvedAttributeSet().createAttributeContext(resOpt, acpEntAttEnt);
              }
            }
          }
        }

        // if we got here because of the max depth, need to impose the directives to make the trait work as expected
        if (relInfo.isMaxDepthExceeded()) {
          if (arc.getResOpt().getDirectives() == null) {
            arc.getResOpt().setDirectives(new AttributeResolutionDirectiveSet());
          }
          arc.getResOpt().getDirectives().add("referenceOnly");
        }
      } else {
        final ResolveOptions resLink = copyResolveOptions(resOpt);
        resLink.setSymbolRefSet(resOpt.getSymbolRefSet());
        resLink.setRelationshipDepth(relInfo.getNextDepth());
        rasb.mergeAttributes(this.getEntity().fetchResolvedAttributes(resLink, acpEnt));
      }

      // from the traits of purpose and applied here, see if new attributes get generated
      rasb.getResolvedAttributeSet().setAttributeContext(underAtt);
      rasb.applyTraits(arc);
      rasb.generateApplierAttributes(arc, true); // true = apply the prepared traits to new atts
      // this may have added symbols to the dependencies, so merge them
      resOpt.getSymbolRefSet().merge(arc.getResOpt().getSymbolRefSet());

      // use the traits for linked entity identifiers to record the actual foreign key links
      if (rasb.getResolvedAttributeSet() != null && rasb.getResolvedAttributeSet().getSet() != null
              && relInfo.isByRef()) {
        for (final ResolvedAttribute att : rasb.getResolvedAttributeSet().getSet()) {
          if (att.fetchResolvedTraits() != null) {
            final ResolvedTrait reqdTrait = att.fetchResolvedTraits()
                    .find(resOpt, "is.linkedEntity.identifier");
            if (reqdTrait == null) {
              continue;
            }

            if (reqdTrait.getParameterValues() == null
                    || reqdTrait.getParameterValues().length() == 0) {
              Logger.warning(CdmEntityAttributeDefinition.class.getSimpleName(), this.getCtx(), "is.linkedEntity.identifier does not support arguments");
              continue;
            }

            final List<String> entReferences = new ArrayList<>();
            final List<String> attReferences = new ArrayList<>();

            if (relInfo.doSelectsOne()) {
              final CdmEntityDefinition entPickFrom = (((CdmEntityReference) this.getEntity())).fetchObjectDefinition(resOpt);

              List<CdmObject> attsPick = null;
              if (entPickFrom != null && entPickFrom.getAttributes() != null) {
                attsPick = entPickFrom.getAttributes().getAllItems()
                        .stream()
                        .map(attribute -> (CdmObject) attribute)
                        .collect(Collectors.toList());
              }

              if (entPickFrom != null && attsPick != null) {
                for (int i = 0; i < attsPick.size(); i++) {
                  if (attsPick.get(i).getObjectType() == CdmObjectType.EntityAttributeDef) {
                    final CdmEntityAttributeDefinition entAtt = (CdmEntityAttributeDefinition) attsPick.get(i);
                    addEntityReference(entAtt.getEntity(), resOpt, entReferences, attReferences, this.getInDocument().getNamespace());
                  }
                }
              }
            } else {
              addEntityReference(
                      this.getEntity(),
                      resOpt,
                      entReferences,
                      attReferences,
                      this.getInDocument() == null
                              ? null
                              : this.getInDocument().getNamespace());
            }

            final CdmConstantEntityDefinition constantEntity = this.getCtx().getCorpus()
                    .makeObject(CdmObjectType.ConstantEntityDef);
            constantEntity.setEntityShape(
                    this.getCtx().getCorpus().makeRef(CdmObjectType.EntityRef, "entityGroupSet", true));
            final List<List<String>> listOfStringLists = new ArrayList<>();

            for (int i = 0; i < entReferences.size(); i++) {
              final List<String> stringList = new ArrayList<>();
              stringList.add(entReferences.get(i));
              stringList.add(attReferences.get(i));
              listOfStringLists.add(stringList);
            }

            constantEntity.setConstantValues(listOfStringLists);
            final CdmEntityReference traitParam = this.getCtx().getCorpus()
                    .makeRef(CdmObjectType.EntityRef, constantEntity, false);
            reqdTrait.getParameterValues().setParameterValue(resOpt, "entityReferences", traitParam);
          }
        }
      }

      // a 'structured' directive wants to keep all entity attributes together in a group
      if (arc.getResOpt().getDirectives() != null && arc.getResOpt().getDirectives().has("structured")) {
        final ResolvedAttribute raSub = new ResolvedAttribute(rtsThisAtt.getResOpt(),
                rasb.getResolvedAttributeSet(),
                this.getName(),
                rasb.getResolvedAttributeSet().getAttributeContext());
        if (relInfo.isArray()) {
          // put a resolved trait on this att group, yuck, hope I never need to do this again and then need to make a function for this
          final CdmTraitReference tr = this.getCtx().getCorpus()
                  .makeObject(CdmObjectType.TraitRef, "is.linkedEntity.array", true);
          final CdmTraitDefinition t = tr.fetchObjectDefinition(resOpt);
          final ResolvedTrait rt = new ResolvedTrait(t, null, new ArrayList<>(), new ArrayList<>());
          raSub.setResolvedTraits(raSub.fetchResolvedTraits().merge(rt, true));
        }
        rasb = new ResolvedAttributeSetBuilder();
        rasb.getResolvedAttributeSet().setAttributeContext(raSub.getAttCtx()); // this got set to null with the new builder
        rasb.ownOne(raSub);
      }
    }

    return rasb;
  }

  private void addEntityReference(final CdmEntityReference entRef, final ResolveOptions resOpt,
                                  final List<String> entReferences,
                                  final List<String> attReferences,
                                  final String nameSpace) {

    final CdmEntityDefinition entDef = entRef.fetchObjectDefinition(resOpt);
    if (entDef != null) {
      final ResolvedTraitSet otherResTraits = entRef.fetchResolvedTraits(resOpt);
      ResolvedTrait identifyingTrait;

      if (otherResTraits != null
          && (identifyingTrait = otherResTraits.find(resOpt, "is.identifiedBy")) != null) {
        final Object attRef = identifyingTrait
            .getParameterValues()
            .fetchParameterValue("attribute")
            .getValue();
        final String[] bits = attRef instanceof String ? ((String) attRef).split("/")
            : ((CdmObjectReference) attRef).getNamedReference().split("/");
        final String attName = bits[bits.length - 1];
        // path should be absolute and without a namespace
        String relativeEntPath = this.getCtx()
            .getCorpus()
            .getStorage()
            .createAbsoluteCorpusPath(entDef.getAtCorpusPath(), entDef.getInDocument());
        if (relativeEntPath.startsWith(nameSpace + ":")) {
          relativeEntPath = relativeEntPath.substring(nameSpace.length() + 1);
        }
        entReferences.add(relativeEntPath);
        attReferences.add(attName);
      }
    }
  }

  private ResolvedEntityReferenceSide resolveSide(final CdmEntityReference entRef, final ResolveOptions resOpt) {
    final ResolvedEntityReferenceSide sideOther = new ResolvedEntityReferenceSide(null, null);
    if (entRef != null) {
      // reference to the other entity, hard part is the attribute name.
      // by convention, this is held in a trait that identifies the key
      sideOther.setEntity(entRef.fetchObjectDefinition(resOpt));
      if (sideOther.getEntity() != null) {
        final CdmAttribute otherAttribute;
        final ResolveOptions otherOpts = new ResolveOptions();
        otherOpts.setWrtDoc(resOpt.getWrtDoc());
        otherOpts.setDirectives(resOpt.getDirectives());
        final ResolvedTrait t = entRef.fetchResolvedTraits(otherOpts).find(otherOpts, "is.identifiedBy");
        if (t != null && t.getParameterValues() != null && t.getParameterValues().length() > 0) {
          final Object otherRef = (t.getParameterValues().fetchParameterValue("attribute").getValue());
          if (CdmObject.class.isAssignableFrom(otherRef.getClass())) {
            otherAttribute = ((CdmObject) otherRef).fetchObjectDefinition(otherOpts);
            if (otherAttribute != null) {
              final ResolvedAttributeSet resolvedAttributeSet = sideOther.getEntity().fetchResolvedAttributes(otherOpts);
              if (resolvedAttributeSet != null) {
              sideOther.getResolvedAttributeSetBuilder().ownOne(
                resolvedAttributeSet.get(otherAttribute.getName()).copy());
              }
            }
          }
        }
      }
    }

    return sideOther;
  }
}
