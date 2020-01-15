// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ParameterCollection;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTrait;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.CdmException;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.SymbolSet;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import java.util.LinkedHashMap;
import java.util.Map;

public class CdmTraitReference extends CdmObjectReferenceBase {

  protected boolean resolvedArguments;
  private CdmArgumentCollection arguments;
  private boolean fromProperty;

  public CdmTraitReference(final CdmCorpusContext ctx, final Object trait, final boolean simpleReference,
                           final boolean hasArguments) {
    super(ctx, trait, simpleReference);
    this.setObjectType(CdmObjectType.TraitRef);
    this.resolvedArguments = false;
    this.fromProperty = false;
    this.arguments = new CdmArgumentCollection(this.getCtx(), this);
  }

  /**
   * @param pathFrom
   * @param preChildren
   * @param postChildren
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public boolean visitRef(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    return (this.arguments != null && this.arguments
        .visitList(pathFrom + "/arguments/", preChildren, postChildren));
  }

  /**
   * Gets the trait reference argument.
   */
  public CdmArgumentCollection getArguments() {
    return this.arguments;
  }

  /**
   * Gets or sets true if the trait was generated from a property and false it was directly loaded.
   */
  public boolean isFromProperty() {
    return this.fromProperty;
  }

  public void setFromProperty(final boolean value) {
    this.fromProperty = value;
  }

  public Object fetchArgumentValue(String name) {
    if (this.getArguments() == null) {
      return null;
    }

    final int lArgSet = this.getArguments().getCount();
    for (int iArgSet = 0; iArgSet < lArgSet; iArgSet++) {
      final CdmArgumentDefinition arg = this.getArguments().get(iArgSet);
      final String argName = arg.getName();
      if (argName == name) {
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
  public ResolvedTraitSet fetchResolvedTraits(final ResolveOptions resOpt) {
    final String kind = "rtsb";
    final ResolveContext ctx = (ResolveContext) this.getCtx();

    // Get referenced trait.
    final CdmTraitDefinition trait = this.fetchObjectDefinition(resOpt);
    ResolvedTraitSet rtsTrait = null;
    if (null == trait) {
      return this.createEmptyResolvedTraitSet(ctx.getCorpus(), resOpt);
    }

    // See if one is already cached getCache() by name unless there are parameter.
    if (null == trait.thisIsKnownToHaveParameters) {
      // Never been resolved, it will happen soon, so why not now?
      rtsTrait = trait.fetchResolvedTraits(resOpt);
    }

    final boolean cacheByName = trait.thisIsKnownToHaveParameters == null
        ? true
        : trait.thisIsKnownToHaveParameters;
    String cacheTag = ctx.getCorpus()
        .createDefinitionCacheTag(resOpt, this, kind, "", cacheByName);
    Object rtsResult = null;

    if (null != cacheTag) {
      rtsResult = ctx.getCache().get(cacheTag);
    }

    // Store the previous reference symbol set, we will need to add it with
    // children found from the constructResolvedTraits call.
    SymbolSet currSymRefSet = resOpt.getSymbolRefSet();
    if (null == currSymRefSet) {
      currSymRefSet = new SymbolSet();
    }

    resOpt.setSymbolRefSet(new SymbolSet());

    // If not, then make one and save it.
    if (null == rtsResult) {
      // Get the set of resolutions, should just be this one trait.
      if (null == rtsTrait) {
        // Store current symbol ref set.
        final SymbolSet newSymbolRefSet = resOpt.getSymbolRefSet();
        resOpt.setSymbolRefSet(new SymbolSet());

        rtsTrait = trait.fetchResolvedTraits(resOpt);

        // Bubble up symbol reference set from children.
        if (null != newSymbolRefSet) {
          newSymbolRefSet.merge(resOpt.getSymbolRefSet());
        }

        resOpt.setSymbolRefSet(newSymbolRefSet);
      }

      if (null != rtsTrait) {
        rtsResult = rtsTrait.deepCopy();
      }

      // Now if there are argument for this application, set the values in the array.
      if (null != this.getArguments() && null != rtsResult) {
        // If never tried to line up arguments with parameters, do that.
        if (!this.resolvedArguments) {
          this.resolvedArguments = true;
          final ParameterCollection param = trait.fetchAllParameters(resOpt);
          CdmParameterDefinition paramFound;
          Object aValue;

          int iArg = 0;
          if (null != this.getArguments()) {
            for (final CdmArgumentDefinition argumentDef : this.getArguments()) {
              try {
                paramFound = param.resolveParameter(iArg, argumentDef.getName());
              } catch (final CdmException e) {
                throw new RuntimeException();
              }

              argumentDef.setResolvedParameter(paramFound);
              aValue = argumentDef.getValue();
              ctx.getCorpus().constTypeCheck(resOpt, this.getInDocument(), paramFound, aValue);
              argumentDef.setValue(aValue);
              iArg++;
            }
          }
        }
        if (null != this.getArguments()) {
          for (final CdmArgumentDefinition argumentDef : this.getArguments()) {
            ((ResolvedTraitSet) rtsResult).setParameterValueFromArgument(trait, argumentDef);
          }
        }
      }

      // Register set of possible symbols.
      ctx.getCorpus()
          .registerDefinitionReferenceSymbols(this.fetchObjectDefinition(resOpt), kind,
              resOpt.getSymbolRefSet());

      // Get the new getCache() tag now that we have the list of symbols.
      cacheTag = ctx.getCorpus()
          .createDefinitionCacheTag(resOpt, this, kind, "", cacheByName);
      if (null != cacheTag && " ".equalsIgnoreCase(cacheTag)) {
        ctx.getCache().put(cacheTag, rtsResult);
      }
    } else {
      // Cache was found.
      // Get the SymbolSet for this cached object.
      final String key = CdmCorpusDefinition.createCacheKeyFromObject(this, kind);
      final SymbolSet tempDocRefSet = ctx.getCorpus().getDefinitionReferenceSymbols()
          .get(key);

      resOpt.setSymbolRefSet(tempDocRefSet);
    }

    // Merge child document set with current.
    currSymRefSet.merge(resOpt.getSymbolRefSet());
    resOpt.setSymbolRefSet(currSymRefSet);

    return (ResolvedTraitSet) rtsResult;
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
      copy.getArguments().add(arg);
    }

    return copy;
  }

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt,
                                                          final CdmAttributeContext under) {
    // return null intentionally
    return null;
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    // Intended to be blank.
  }

  /**
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
    return CdmObjectBase.copyData(this, resOpt, options, CdmTraitReference.class);
  }

  /**
   * Returns a map from parameter names to the final argument values for a strait reference.
   * Values come (in this order) from base trait defaults then default overrides on inheritance
   * then values supplied on this reference
   */
  public Map<String, Object> fetchFinalArgumentValues(ResolveOptions resOpt) {
    Map<String, Object> finalArgs = new LinkedHashMap<>();
    // get resolved traits does all the work, just clean up the answers
    ResolvedTraitSet rts = this.fetchResolvedTraits(resOpt);
    if (rts == null) {
      return null;
    }
    // there is only one resolved trait
    ResolvedTrait rt = rts.getFirst();
    if (rt.getParameterValues() != null && rt.getParameterValues().length() > 0) {
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

  public boolean isResolvedArguments() {
    return resolvedArguments;
  }

  public void setResolvedArguments(boolean resolvedArguments) {
    this.resolvedArguments = resolvedArguments;
  }
}
