// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttribute;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeResolutionGuidance;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import java.util.List;
import java.util.Objects;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class PrimitiveAppliers {
  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static AttributeResolutionApplier isRemoved = new AttributeResolutionApplier();

  static {
    isRemoved.matchName = "is.removed";
    isRemoved.priority = 10;
    isRemoved.overridesBase = false;
    isRemoved.willRemove = (ApplierContext onStep) -> true;
  }

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static AttributeResolutionApplier doesImposeDirectives = new AttributeResolutionApplier();

  static {
    doesImposeDirectives.matchName = "does.imposeDirectives";
    doesImposeDirectives.priority = 1;
    doesImposeDirectives.overridesBase = true;
    doesImposeDirectives.willAlterDirectives = (ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide) -> true;
    doesImposeDirectives.doAlterDirectives = (ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide) -> {
      final List<String> allAdded = resGuide.getImposedDirectives();

      if (allAdded != null && resOpt.getDirectives() != null) {
        resOpt.setDirectives(resOpt.getDirectives().copy());
        allAdded.forEach(d -> resOpt.getDirectives().add(d));
      }
    };
  }

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static AttributeResolutionApplier doesRemoveDirectives = new AttributeResolutionApplier();

  static {
    doesRemoveDirectives.matchName = "does.removeDirectives";
    doesRemoveDirectives.priority = 2;
    doesRemoveDirectives.overridesBase = true;
    doesRemoveDirectives.willAlterDirectives = (ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide) -> true;
    doesRemoveDirectives.doAlterDirectives = (ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide) -> {
      final List<String> allRemoved = resGuide.getRemovedDirectives();

      if (allRemoved != null && resOpt.getDirectives() != null) {
        resOpt.setDirectives(resOpt.getDirectives().copy());
        allRemoved.forEach(d -> resOpt.getDirectives().delete(d));
      }
    };
  }

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static AttributeResolutionApplier doesAddSupportingAttribute = new AttributeResolutionApplier();

  static {
    doesAddSupportingAttribute.matchName = "does.addSupportingAttribute";
    doesAddSupportingAttribute.priority = 8;
    doesAddSupportingAttribute.overridesBase = true;
    doesAddSupportingAttribute.willAttributeAdd = (ApplierContext appCtx) -> true;
    doesAddSupportingAttribute.doAttributeAdd = (ApplierContext appCtx) -> {
      // get the added attribute and applied trait
      CdmAttribute sub = appCtx.resGuide.getAddSupportingAttribute();
      sub = (CdmAttribute) sub.copy(appCtx.resOpt);
      // use the default name
      appCtx.resAttNew.updateResolvedName(sub.getName());
      // add a supporting trait to this attribute
      final CdmTraitReference supTraitRef = sub.getAppliedTraits().add("is.addedInSupportOf", false);
      final CdmTraitDefinition supTraitDef = supTraitRef.fetchObjectDefinition(appCtx.resOpt);

      // get the resolved traits from attribute
      appCtx.resAttNew.setResolvedTraits(sub.fetchResolvedTraits(appCtx.resOpt));
      // assumes some things, like the argument name. probably a dumb design, should just take the name and assume the trait too. that simplifies the source docs
      Object supporting = "(unspecified)";
      if (appCtx.resAttSource != null)
        supporting = appCtx.resAttSource.getResolvedName();

      appCtx.resAttNew.setResolvedTraits(appCtx.resAttNew.fetchResolvedTraits().setTraitParameterValue(appCtx.resOpt, supTraitDef, "inSupportOf", supporting));

      appCtx.resAttNew.setTarget(sub);
      appCtx.resGuideNew = sub.getResolutionGuidance();
    };
    doesAddSupportingAttribute.willCreateContext = (ApplierContext appCtx) -> true;
    doesAddSupportingAttribute.doCreateContext = (ApplierContext appCtx) -> {
      // make a new attributeContext to differentiate this supporting att
      final AttributeContextParameters acp = new AttributeContextParameters();
      acp.setUnder(appCtx.attCtx);
      acp.setType(CdmAttributeContextType.AddedAttributeSupporting);
      acp.setName(String.format("supporting_%s", appCtx.resAttSource.getResolvedName()));
      acp.setRegarding((CdmAttribute) appCtx.resAttSource.getTarget());

      appCtx.attCtx = CdmAttributeContext.createChildUnder(appCtx.resOpt, acp);
    };
  }

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static AttributeResolutionApplier doesDisambiguateNames = new AttributeResolutionApplier();

  static {
    doesDisambiguateNames.matchName = "does.disambiguateNames";
    doesDisambiguateNames.priority = 9;
    doesDisambiguateNames.overridesBase = true;
    doesDisambiguateNames.willAttributeModify = (ApplierContext appCtx) -> {
      if (appCtx.resAttSource != null && !appCtx.resOpt.getDirectives().has("structured")) {
        return true;
      }
      return false;
    };
    doesDisambiguateNames.doAttributeModify = (ApplierContext appCtx) -> {
      if (appCtx.resAttSource != null) {
        final String format = appCtx.resGuide.getRenameFormat();
        final ApplierState state = appCtx.resAttSource.getApplierState();
        final String ordinal = state != null && state.flexCurrentOrdinal != null ? state.flexCurrentOrdinal.toString() : "";

        if (Strings.isNullOrEmpty(format)) {
          return;
        }

        final int formatLength = format.length();
        if (formatLength == 0) {
          return;
        }

        // parse the format looking for positions of {n} and {o} and text chunks around them
        // there are only 5 possibilities
        boolean upper = false;
        int iN = format.indexOf("{a}");

        if (iN < 0) {
          iN = format.indexOf("{A}");
          upper = true;
        }

        final int iO = format.indexOf("{o}");

        String result;
        final String srcName = appCtx.resAttSource.getPreviousResolvedName();

        if (iN < 0 && iO < 0)
          result = format;
        else if (iN < 0)
          result = replace(0, iO, formatLength, ordinal, upper, format);
        else if (iO < 0)
          result = replace(0, iN, formatLength, srcName, upper, format);
        else if (iN < iO) {
          result = replace(0, iN, iO, srcName, upper, format);
          result += replace(iO, iO, formatLength, ordinal, upper, format);
        } else {
          result = replace(0, iO, iN, ordinal, upper, format);
          result += replace(iN, iN, formatLength, srcName, upper, format);
        }

        appCtx.resAttSource.updateResolvedName(result);
      }
    };
  }

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static AttributeResolutionApplier doesExplainArray = new AttributeResolutionApplier();

  static {
    doesExplainArray.matchName = "does.explainArray";
    doesExplainArray.priority = 6;
    doesExplainArray.overridesBase = false;
    doesExplainArray.willGroupAdd = (ApplierContext appCtx) -> {
      final AttributeResolutionDirectiveSet dir = appCtx.resOpt.getDirectives();
      final boolean isNorm = dir != null && dir.has("normalized");
      final boolean isArray = dir != null && dir.has("isArray");
      final boolean isStructured = dir != null && dir.has("structured");
      // expand array and add a count if this is an array AND it isn't structured or normalized
      // structured assumes they know about the array size from the structured data format
      // normalized means that arrays of entities shouldn't be put inline, they should reference or include from the 'other' side of that 1=M relationship
      return isArray && !isNorm && !isStructured;
    };
    doesExplainArray.doGroupAdd = (ApplierContext appCtx) -> {
      final CdmAttribute sub = appCtx.resGuide.getExpansion().getCountAttribute();
      appCtx.resAttNew.setTarget(sub);
      appCtx.resAttNew.getApplierState().flexRemove = false;
      // use the default name.
      appCtx.resAttNew.updateResolvedName(sub.getName());

      // add the trait that tells them what this means
      if (sub.getAppliedTraits() == null || sub.getAppliedTraits().getAllItems().stream().noneMatch((atr) -> atr.fetchObjectDefinitionName().equals("is.linkedEntity.array.count")))
        sub.getAppliedTraits().add("is.linkedEntity.array.count", true);

      // get the resolved traits from attribute
      appCtx.resAttNew.setResolvedTraits(sub.fetchResolvedTraits(appCtx.resOpt));
      appCtx.resGuideNew = sub.getResolutionGuidance();
    };
    doesExplainArray.willCreateContext = (ApplierContext appCtx) -> true;
    doesExplainArray.doCreateContext = (ApplierContext appCtx) -> {
      if (appCtx.resAttNew != null
          && appCtx.resAttNew.getApplierState() != null
          && appCtx.resAttNew.getApplierState().array_specializedContext != null) {
        // this attribute may have a special context that it wants, use that instead
        appCtx.resAttNew.getApplierState().array_specializedContext.accept(appCtx);
      } else {
        CdmAttributeContextType ctxType = CdmAttributeContextType.AttributeDefinition;
        // if this is the group add, then we are adding the counter
        if ("group".equals(appCtx.state)) {
          ctxType = CdmAttributeContextType.AddedAttributeExpansionTotal;
        }
        final AttributeContextParameters acp = new AttributeContextParameters();
        acp.setUnder(appCtx.attCtx);
        acp.setType(ctxType);
        appCtx.attCtx = CdmAttributeContext.createChildUnder(appCtx.resOpt, acp);
      }
    };
    doesExplainArray.willAttributeAdd = (ApplierContext appCtx) -> {
      final AttributeResolutionDirectiveSet dir = appCtx.resOpt.getDirectives();
      final boolean isNorm = dir != null && dir.has("normalized");
      final boolean isArray = dir != null && dir.has("isArray");
      final boolean isStructured = dir != null && dir.has("structured");
      return isArray && !isNorm && !isStructured;
    };
    doesExplainArray.doAttributeAdd = (ApplierContext appCtx) -> {
      appCtx.continues = false;

      if (appCtx.resAttSource != null) {
        final ApplierState state = appCtx.resAttNew.getApplierState();

        if (state.arrayFinalOrdinal == null) {
          // get the fixed size (not set means no fixed size)
          int fixedSize = 1;
          if (appCtx.resGuide.getExpansion() != null && appCtx.resGuide.getExpansion().getMaximumExpansion() != null) {
            fixedSize = appCtx.resGuide.getExpansion().getMaximumExpansion();
          }

          int initial = 0;
          if (appCtx.resGuide.getExpansion() != null && appCtx.resGuide.getExpansion().getStartingOrdinal() != null) {
            initial = appCtx.resGuide.getExpansion().getStartingOrdinal();
          }

          fixedSize += initial;

          // marks this att as the template for expansion
          state.arrayTemplate = appCtx.resAttSource;

          if (appCtx.resAttSource.getApplierState() == null) {
            appCtx.resAttSource.setApplierState(new ApplierState());
          }

          appCtx.resAttSource.getApplierState().flexRemove = true;

          // give back the attribute that holds the count first
          state.arrayInitialOrdinal = initial;
          state.arrayFinalOrdinal = fixedSize - 1;
          state.flexCurrentOrdinal = initial;
        } else
          state.flexCurrentOrdinal = state.flexCurrentOrdinal + 1;

        if (state.flexCurrentOrdinal <= state.arrayFinalOrdinal) {
          final ResolvedAttribute template = state.arrayTemplate;
          appCtx.resAttNew.setTarget(template.getTarget());
          // copy the template
          appCtx.resAttNew.updateResolvedName(state.arrayTemplate.getPreviousResolvedName());
          appCtx.resAttNew.setResolvedTraits(template.fetchResolvedTraits().deepCopy());
          appCtx.resGuideNew = appCtx.resGuide; // just take the source, because this is not a new attribute that may have different settings
          appCtx.continues = state.flexCurrentOrdinal < state.arrayFinalOrdinal;
        }
      }
    };
    doesExplainArray.willAlterDirectives = (ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide) -> {
      if (resGuide.getCardinality().equals("many")) {
        return true;
      }
      return false;
    };
    doesExplainArray.doAlterDirectives = (resOpt, resTrait) -> {
      if (resOpt.getDirectives() != null) {
        resOpt.setDirectives(resOpt.getDirectives().copy());
      } else {
        resOpt.setDirectives(new AttributeResolutionDirectiveSet());
      }
      resOpt.getDirectives().add("isArray");
    };
    doesExplainArray.willRemove = (ApplierContext appCtx) -> {
      final AttributeResolutionDirectiveSet dir = appCtx.resOpt.getDirectives();
      final boolean isNorm = dir != null && dir.has("normalized");
      final boolean isArray = dir != null && dir.has("isArray");

      // remove the 'template' attributes that got copied on expansion if they come here
      // also, normalized means that arrays of entities shouldn't be put inline
      // only remove the template attributes that seeded the array expansion
      final boolean isTemplate = appCtx.resAttSource.getApplierState() != null && appCtx.resAttSource.getApplierState().flexRemove;
      return isArray && (isTemplate || isNorm);
    };
  }

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static AttributeResolutionApplier doesReferenceEntity = new AttributeResolutionApplier();

  static {
    doesReferenceEntity.matchName = "does.referenceEntity";
    doesReferenceEntity.priority = 4;
    doesReferenceEntity.overridesBase = true;
    doesReferenceEntity.willRemove = (ApplierContext appCtx) -> {
      // Return always false for the time being.
      // boolean visible = true;
      // if (appCtx.resAttSource != null) {
      //   // all others go away
      //   visible = Objects.equals(
      //       appCtx.resAttSource.getTarget(),
      //       appCtx.resGuide.getEntityByReference().getForeignKeyAttribute());
      // }
      return false;
    };
    doesReferenceEntity.willRoundAdd = (ApplierContext appCtx) -> true;
    doesReferenceEntity.doRoundAdd = (ApplierContext appCtx) -> {
      // get the added attribute and applied trait
      final CdmAttribute sub = appCtx.resGuide.getEntityByReference().getForeignKeyAttribute();
      appCtx.resAttNew.setTarget(sub);
      // use the default name.
      appCtx.resAttNew.updateResolvedName(sub.getName());

      // add the trait that tells them what this means
      if (sub.getAppliedTraits() == null
          || sub.getAppliedTraits().getAllItems()
          .parallelStream()
          .noneMatch((atr) ->
              atr.fetchObjectDefinitionName().equals("is.linkedEntity.identifier"))) {
        sub.getAppliedTraits().add("is.linkedEntity.identifier", true);
      }

      // get the resolved traits from attribute
      appCtx.resGuideNew = sub.getResolutionGuidance();
      appCtx.resAttNew.setResolvedTraits(sub.fetchResolvedTraits(appCtx.resOpt));

      if (appCtx.resAttNew.fetchResolvedTraits() != null) {
        appCtx.resAttNew.setResolvedTraits(appCtx.resAttNew.fetchResolvedTraits().deepCopy());
      }
    };
    doesReferenceEntity.willCreateContext = (ApplierContext appCtx) -> true;
    doesReferenceEntity.doCreateContext = (ApplierContext appCtx) -> {
      // make a new attributeContext to differentiate this supporting att
      final AttributeContextParameters acp = new AttributeContextParameters();
      acp.setUnder(appCtx.attCtx);
      acp.setType(CdmAttributeContextType.AddedAttributeIdentity);
      acp.setName("_foreignKey");
      appCtx.attCtx = CdmAttributeContext.createChildUnder(appCtx.resOpt, acp);
    };
  }

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static AttributeResolutionApplier doesReferenceEntityVia = new AttributeResolutionApplier();

  static {
    doesReferenceEntityVia.matchName = "does.referenceEntityVia";
    doesReferenceEntityVia.priority = 4;
    doesReferenceEntityVia.overridesBase = false;
    doesReferenceEntityVia.willRemove = (ApplierContext appCtx) -> {
      final AttributeResolutionDirectiveSet dir = appCtx.resOpt.getDirectives();

      final boolean isNorm = dir != null && dir.has("normalized");
      final boolean isArray = dir != null && dir.has("isArray");
      final boolean isRefOnly = dir != null && dir.has("referenceOnly");
      final boolean alwaysAdd = appCtx.resGuide.getEntityByReference().getForeignKeyAttribute() != null &&
        appCtx.resGuide.getEntityByReference().doesAlwaysIncludeForeignKey();
      final boolean doFKOnly = isRefOnly && (!isNorm || !isArray);
      boolean visible = true;

      if (doFKOnly && appCtx.resAttSource != null)
        // if in reference only mode, then remove everything that isn't marked to retain
        visible = alwaysAdd || appCtx.resAttSource.getApplierState() == null || !appCtx.resAttSource.getApplierState().flexRemove;

      return !visible;
    };
    doesReferenceEntityVia.willRoundAdd = (ApplierContext appCtx) -> {
      final AttributeResolutionDirectiveSet dir = appCtx.resOpt.getDirectives();

      final boolean isNorm = dir != null && dir.has("normalized");
      final boolean isArray = dir != null && dir.has("isArray");
      final boolean isRefOnly = dir != null && dir.has("referenceOnly");
      final boolean alwaysAdd = appCtx.resGuide.getEntityByReference().getForeignKeyAttribute() != null &&
        appCtx.resGuide.getEntityByReference().doesAlwaysIncludeForeignKey();

      // add a foreign key and remove everything else when asked to do so.
      // however, avoid doing this for normalized arrays, since they remove all atts anyway
      final boolean doFKOnly = (isRefOnly || alwaysAdd) && (!isNorm || !isArray);

      return doFKOnly;
    };
    doesReferenceEntityVia.doRoundAdd = (ApplierContext appCtx) -> {
      // get the added attribute and applied trait
      final CdmAttribute sub = appCtx.resGuide.getEntityByReference().getForeignKeyAttribute();
      appCtx.resAttNew.setTarget(sub);
      // use the default name.
      appCtx.resAttNew.updateResolvedName(sub.getName());

      // add the trait that tells them what this means
      if (sub.getAppliedTraits() == null
          || sub.getAppliedTraits().getAllItems()
          .parallelStream()
          .noneMatch((atr) -> atr.fetchObjectDefinitionName().equals("is.linkedEntity.identifier")))
        sub.getAppliedTraits().add("is.linkedEntity.identifier", true);

      // get the resolved traits from attribute, make a copy to avoid conflicting on the param values
      appCtx.resGuideNew = sub.getResolutionGuidance();
      appCtx.resAttNew.setResolvedTraits(sub.fetchResolvedTraits(appCtx.resOpt));

      if (appCtx.resAttNew.fetchResolvedTraits() != null) {
        appCtx.resAttNew.setResolvedTraits(appCtx.resAttNew.fetchResolvedTraits().deepCopy());
      }

      // make this code create a context for any copy of this attribute that gets repeated in an array
      appCtx.resAttNew.getApplierState().array_specializedContext = PrimitiveAppliers.doesReferenceEntityVia.doCreateContext;
    };
    doesReferenceEntityVia.willCreateContext = (ApplierContext appCtx) -> {
      final AttributeResolutionDirectiveSet dir = appCtx.resOpt.getDirectives();

      final boolean isNorm = dir != null && dir.has("normalized");
      final boolean isArray = dir != null && dir.has("isArray");
      final boolean isRefOnly = dir != null && dir.has("referenceOnly");
      final boolean alwaysAdd = appCtx.resGuide.getEntityByReference().getForeignKeyAttribute() != null &&
        appCtx.resGuide.getEntityByReference().doesAlwaysIncludeForeignKey();

      // add a foreign key and remove everything else when asked to do so.
      // however, avoid doing this for normalized arrays, since they remove all atts anyway
      final boolean doFKOnly = (isRefOnly || alwaysAdd) && (!isNorm || !isArray);
      return doFKOnly;
    };
    doesReferenceEntityVia.doCreateContext = (ApplierContext appCtx) -> {
      // make a new attributeContext to differentiate this foreign key att
      final AttributeContextParameters acp = new AttributeContextParameters();
      acp.setUnder(appCtx.attCtx);
      acp.setType(CdmAttributeContextType.AddedAttributeIdentity);
      acp.setName("_foreignKey");

      appCtx.attCtx = CdmAttributeContext.createChildUnder(appCtx.resOpt, acp);
    };
  }

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static AttributeResolutionApplier doesSelectAttributes = new AttributeResolutionApplier();

  static {
    doesSelectAttributes.matchName = "does.selectAttributes";
    doesSelectAttributes.priority = 4;
    doesSelectAttributes.overridesBase = false;
    doesSelectAttributes.willAlterDirectives = (ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide) ->
            resGuide.getSelectsSubAttribute().getSelects().equals("one");
    doesSelectAttributes.doAlterDirectives = (ResolveOptions resOpt, CdmAttributeResolutionGuidance resGuide) -> {
      if (resOpt.getDirectives() != null) {
        resOpt.setDirectives(resOpt.getDirectives().copy());
      } else {
        resOpt.setDirectives(new AttributeResolutionDirectiveSet());
      }
      resOpt.getDirectives().add("selectOne");
    };
    doesSelectAttributes.willRoundAdd = (ApplierContext appCtx) -> {
      final AttributeResolutionDirectiveSet dir = appCtx.resOpt.getDirectives();
      final boolean selectsOne = dir != null && dir.has("selectOne");
      final boolean structured = dir != null && dir.has("structured");

      if (selectsOne && !structured)
        // when one class is being pulled from a list of them
        // add the class attribute unless this is a structured output (assumes they know the class)
        return true;

      return false;
    };
    doesSelectAttributes.doRoundAdd = (ApplierContext appCtx) -> {
      // get the added attribute and applied trait
      final CdmAttribute sub = appCtx.resGuide.getSelectsSubAttribute().getSelectedTypeAttribute();
      appCtx.resAttNew.setTarget(sub);
      appCtx.resAttNew.getApplierState().flexRemove = false;
      // use the default name.
      appCtx.resAttNew.updateResolvedName(sub.getName());

      // add the trait that tells them what this means
      if (sub.getAppliedTraits() == null || sub.getAppliedTraits().getAllItems().stream().noneMatch((atr) -> atr.fetchObjectDefinitionName().equals("is.linkedEntity.name"))) {
        sub.getAppliedTraits().add("is.linkedEntity.name", true);
      }

      // get the resolved traits from attribute
      appCtx.resAttNew.setResolvedTraits(sub.fetchResolvedTraits(appCtx.resOpt));
      appCtx.resGuideNew = sub.getResolutionGuidance();

      // make this code create a context for any copy of this attribute that gets repeated in an array
      appCtx.resAttNew.getApplierState().array_specializedContext = PrimitiveAppliers.doesSelectAttributes.doCreateContext;
    };
    doesSelectAttributes.willCreateContext = (ApplierContext appCtx) -> {
      final AttributeResolutionDirectiveSet dir = appCtx.resOpt.getDirectives();
      final boolean selectsOne = dir != null && dir.has("selectOne");
      final boolean structured = dir != null && dir.has("structured");

      if (selectsOne && !structured) {
        return true;
      }

      return false;
    };
    doesSelectAttributes.doCreateContext = (ApplierContext appCtx) -> {
      // make a new attributeContext to differentiate this supporting att
      final AttributeContextParameters acp = new AttributeContextParameters();
      acp.setUnder(appCtx.attCtx);
      acp.setType(CdmAttributeContextType.AddedAttributeSelectedType);
      acp.setName("_selectedEntityName");
      appCtx.attCtx = CdmAttributeContext.createChildUnder(appCtx.resOpt, acp);
    };
  }

  private static String replace(final int start, final int at, final int length, String value, final boolean upper, final String format) {
    if (upper && !Strings.isNullOrEmpty(value))
      value = StringUtils.capitalize(value);

    String replaced = "";

    if (at > start)
      replaced = format.substring(start, at);

    replaced += value;

    if (at + 3 < length)
      replaced += format.substring(at + 3, length);

    return replaced;
  }
}
