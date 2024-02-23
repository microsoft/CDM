// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ParameterCollection;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTrait;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.exceptions.CdmException;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.SymbolSet;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

import java.util.LinkedHashMap;
import java.util.Map;

public class CdmTraitReference extends CdmTraitReferenceBase {

  protected boolean resolvedArguments;
  private final CdmArgumentCollection arguments;
  private boolean fromProperty;
  private CdmTraitReference verb;

  public CdmTraitReference(final CdmCorpusContext ctx, final Object trait, final boolean simpleReference,
                           final boolean hasArguments) {
    super(ctx, trait, simpleReference);
    this.setObjectType(CdmObjectType.TraitRef);
    this.resolvedArguments = false;
    this.fromProperty = false;
    this.arguments = new CdmArgumentCollection(this.getCtx(), this);
  }

  /**
   * @param pathFrom Path from
   * @param preChildren Pre children
   * @param postChildren Post children
   * @return boolean
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public boolean visitRef(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    boolean result = false;
    if (this.arguments != null && this.arguments.size() > 0) {
      // custom enumeration of args to force a path onto these things that just might not have a name
      int lItem = this.arguments.size();
      for (int iItem = 0; iItem < lItem; iItem++) {
        CdmArgumentDefinition element = this.arguments.get(iItem);
        if (element != null) {
          String argPath = pathFrom + "/arguments/a" + iItem;
          if (element.visit(argPath, preChildren, postChildren)) {
            result = true;
            break;
          }
        }
      }
    }
    if (this.verb != null) {
      this.verb.setOwner(this);
      if (this.verb.visit(pathFrom + "/verb/", preChildren, postChildren))
      return true;
    }
    return result;
  }

  /**
   * Gets the trait reference argument.
   * @return CdmArgumentCollection
   */
  public CdmArgumentCollection getArguments() {
    return this.arguments;
  }

  /**
   * Gets or sets true if the trait was generated from a property and false it was directly loaded.
   * @return boolean
   */
  public boolean isFromProperty() {
    return this.fromProperty;
  }

  public void setFromProperty(final boolean value) {
    this.fromProperty = value;
  }

  /**
   * 
   * Gets or sets a reference to a trait used to describe the 'verb' explaining how the trait's meaning should be applied to the 
   * object that holds this traitReference. This optional property can override the meaning of any defaultVerb that could be part of the 
   * referenced trait's definition
   */
  public CdmTraitReference getVerb() {
    return this.verb;
  }

  public void setVerb(final CdmTraitReference value) {
    this.verb = value;
  }

  public Object fetchArgumentValue(String name) {
    if (this.getArguments() == null) {
      return null;
    }

    final int lArgSet = this.getArguments().getCount();
    for (int iArgSet = 0; iArgSet < lArgSet; iArgSet++) {
      final CdmArgumentDefinition arg = this.getArguments().get(iArgSet);
      final String argName = arg.getName();
      if (argName != null && argName.equals(name)) {
        return arg.getValue();
      }
      // Special case with only one argument and no name give, make a big assumption that this
      // is the one they want right way is to look up parameter def and check name, but this public
      // interface is for working on an unresolved def.
      if (argName == null && lArgSet == 1) {
        return arg.getValue();
      }
    }

    return null;
  }

  public void updateArgumentValue(final String name, final Object value) {
    int iArgSet;
    for (iArgSet = 0; iArgSet < this.getArguments().getCount(); iArgSet++) {
      final CdmArgumentDefinition arg = this.arguments.get(iArgSet);
      if (arg.getName().equals(name)) {
        arg.setValue(value);
      }
    }

    if (iArgSet == this.getArguments().getCount()) {
      final CdmArgumentDefinition arg = new CdmArgumentDefinition(this.getCtx(), null);
      arg.setCtx(this.getCtx());
      arg.setName(name);
      arg.setValue(value);
    }
  }

  @Override
  public long getMinimumSemanticVersion()
  {
      if (this.verb != null || this.getAppliedTraits() != null && this.getAppliedTraits().size() > 0) {
          return CdmObjectBase.semanticVersionStringToNumber(CdmObjectBase.getJsonSchemaSemanticVersionTraitsOnTraits());
      }
      return super.getMinimumSemanticVersion();
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public ResolvedTraitSet fetchResolvedTraits(ResolveOptions resOpt) {
    if (resOpt == null) {
        resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    final String kind = "rtsb";
    final ResolveContext ctx = (ResolveContext) this.getCtx();

    // Get referenced trait.
    final CdmTraitDefinition trait = this.fetchObjectDefinition(resOpt);
    ResolvedTraitSet rtsTrait = null;
    if (trait == null) {
      return this.createEmptyResolvedTraitSet(ctx.getCorpus(), resOpt);
    }

    // See if one is already cached getCache() by name unless there are parameter.
    if (trait.thisIsKnownToHaveParameters == null) {
      // Never been resolved, it will happen soon, so why not now?
      rtsTrait = trait.fetchResolvedTraits(resOpt);
    }

    ResolvedTraitSet rtsResult = null;

    // Store the previous reference symbol set, we will need to add it with
    // children found from the constructResolvedTraits call.
    SymbolSet currSymRefSet = resOpt.getSymbolRefSet();
    if (currSymRefSet == null) {
      currSymRefSet = new SymbolSet();
    }

    resOpt.setSymbolRefSet(new SymbolSet());

    // Get the set of resolutions, should just be this one trait.
    if (rtsTrait == null) {
      // Store current symbol ref set.
      final SymbolSet newSymbolRefSet = resOpt.getSymbolRefSet();
      resOpt.setSymbolRefSet(new SymbolSet());

      rtsTrait = trait.fetchResolvedTraits(resOpt);

      // Bubble up symbol reference set from children.
      if (newSymbolRefSet != null) {
        newSymbolRefSet.merge(resOpt.getSymbolRefSet());
      }

      resOpt.setSymbolRefSet(newSymbolRefSet);
    }

    if (rtsTrait != null) {
      rtsResult = rtsTrait.deepCopy();
    }

    // Now if there are argument for this application, set the values in the array.
    if (this.getArguments() != null && rtsResult != null) {
      // If never tried to line up arguments with parameters, do that.
      if (!this.resolvedArguments) {
        this.resolvedArguments = true;
        final ParameterCollection param = trait.fetchAllParameters(resOpt);
        CdmParameterDefinition paramFound;

        int argumentIndex = 0;
        for (final CdmArgumentDefinition argumentDef : this.getArguments()) {
          try {
            paramFound = param.resolveParameter(argumentIndex, argumentDef.getName());
          } catch (final CdmException e) {
            throw new RuntimeException();
          }

          argumentDef.setResolvedParameter(paramFound);
          Object argumentValue = paramFound.constTypeCheck(resOpt, this.getInDocument(), argumentDef.getValue());
          argumentDef.setValue(argumentValue);
          argumentIndex++;
        }
      }

      for (final CdmArgumentDefinition argumentDef : this.getArguments()) {
        rtsResult.setParameterValueFromArgument(trait, argumentDef);
      }
    }

    // if an explicit verb is set, remember this. don't resolve that verb trait, cuz that sounds nuts.
    if (this.verb != null) {
        rtsResult.setExplicitVerb(trait, this.verb);
    }
    // if a collection of meta traits exist, save on the resolved but don't resolve these. again, nuts
    if (this.getAppliedTraits() != null && this.getAppliedTraits().getCount() > 0) {
        rtsResult.setMetaTraits(trait, this.getAppliedTraits().allItems);
    }
   

    // Register set of possible symbols.
    ctx.getCorpus()
        .registerDefinitionReferenceSymbols(this.fetchObjectDefinition(resOpt), kind,
            resOpt.getSymbolRefSet());

    // Merge child document set with current.
    currSymRefSet.merge(resOpt.getSymbolRefSet());
    resOpt.setSymbolRefSet(currSymRefSet);

    return rtsResult;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmObjectReferenceBase copyRefObject(
      final ResolveOptions resOpt,
      final Object refTo,
      final boolean simpleReference) {
    return copyRefObject(resOpt, refTo, simpleReference, null);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmObjectReferenceBase copyRefObject(
      final ResolveOptions resOpt,
      final Object refTo,
      final boolean simpleReference,
      CdmObjectReferenceBase host) {
    final int argCount = null != this.arguments ? this.arguments.size() : 0;

    CdmTraitReference copy;
    if (host == null) {
      copy = new CdmTraitReference(
          this.getCtx(),
          refTo,
          simpleReference,
          argCount > 0);
    } else {
      copy = (CdmTraitReference) host.copyToHost(this.getCtx(), refTo, simpleReference);
      copy.getArguments().clear();
    }

    if (!simpleReference) {
      copy.resolvedArguments = this.resolvedArguments;
    }

    for (final CdmArgumentDefinition arg : this.arguments) {
      copy.getArguments().add((CdmArgumentDefinition)arg.copy(resOpt));
    }

    copy.setVerb((CdmTraitReference) (this.verb == null ? null : this.verb.copy(resOpt)));

    return copy;
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
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt,
                                                          final CdmAttributeContext under) {
    // return null intentionally
    return null;
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    // Intended to be blank.
  }

  /**
   * @param resOpt Resolved option
   * @param options copy options
   * @return Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmTraitReference.class);
  }

  /**
   * Returns a map from parameter names to the final argument values for a strait reference.
   * Values come (in this order) from base trait defaults then default overrides on inheritance
   * then values supplied on this reference
   * @param resOpt Resolved option
   * @return Map of string to object
   */
  public Map<String, Object> fetchFinalArgumentValues(ResolveOptions resOpt) {
    Map<String, Object> finalArgs = new LinkedHashMap<>();
    // get resolved traits does all the work, just clean up the answers
    ResolvedTraitSet rts = this.fetchResolvedTraits(resOpt);
    if (rts == null || rts.getSize() != 1) {
        // well didn't get the traits. maybe imports are missing or maybe things are just not defined yet.
        // this function will try to fake up some answers then from the arguments that are set on this reference only
        if (this.getArguments() != null && this.getArguments().size() > 0) {
          int unNamedCount = 0;
          for (final CdmArgumentDefinition arg : this.getArguments()) {
            // if no arg name given, use the position in the list.
            String argName = arg.getName();
            if (StringUtils.isNullOrTrimEmpty(argName)) {
              argName = String.valueOf(unNamedCount);
            }
            finalArgs.put(argName, arg.getValue());
            unNamedCount++;
          }
          return finalArgs;
        }
      return null;
    }
    // there is only one resolved trait
    ResolvedTrait rt = rts.getFirst();
    if (rt != null && rt.getParameterValues() != null && rt.getParameterValues().length() > 0) {
      final int l = rt.getParameterValues().length();
      for (int i = 0; i < l; i++) {
        final CdmParameterDefinition p = rt.getParameterValues().fetchParameter(i);
        final Object v = rt.getParameterValues().fetchValue(i);
        String name = p.getName();
        if (name == null) {
          name = Integer.toString(i);
        }
        finalArgs.put(name, v);
      }
    }

    return finalArgs;
  }

  private ResolvedTraitSet createEmptyResolvedTraitSet(
      final CdmCorpusDefinition corpus,
      final ResolveOptions resOpt) {
    String key = "";

    if (resOpt != null) {
      if (resOpt.getWrtDoc() != null) {
        key = Integer.toString(resOpt.getWrtDoc().getId());
      }

      key += "-";

      if (resOpt.getDirectives() != null) {
        key += resOpt.getDirectives().getTag();
      }
    }

    ResolvedTraitSet rts = corpus.getEmptyRts().get(key);
    if (rts == null) {
      rts = new ResolvedTraitSet(resOpt);
      corpus.getEmptyRts().put(key, rts);
    }

    return rts;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @return boolean
   */
  @Deprecated
  public boolean isResolvedArguments() {
    return resolvedArguments;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resolvedArguments boolan
   */
  @Deprecated
  public void setResolvedArguments(boolean resolvedArguments) {
    this.resolvedArguments = resolvedArguments;
  }
}
