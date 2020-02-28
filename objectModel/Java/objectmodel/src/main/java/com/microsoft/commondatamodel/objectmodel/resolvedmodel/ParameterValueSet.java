// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmParameterDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.StringSpewCatcher;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ParameterValueSet {

  private ParameterCollection pc;
  // TODO-BQL Investigate values, and wasSet, they seems to be always use together. Might want to declare as List<Tuple<Object,Boolean>> ?
  private List<Object> values;// TODO-BQ: This may need to be revisit, uncertain if type is correct.
  private CdmCorpusContext ctx;
  private List<Boolean> wasSet;

  ParameterValueSet(
      final CdmCorpusContext ctx,
      final ParameterCollection pc,
      final List<Object> values,
      final List<Boolean> wasSet) {
    this.pc = pc;
    this.values = values;
    this.wasSet = wasSet;
    this.ctx = ctx;
  }

  public int indexOf(final CdmParameterDefinition paramDef) {
    return pc.getOrdinals().get(paramDef);
  }

  public CdmParameterDefinition fetchParameter(final int paramIndex) {
    return pc.getSequence().get(paramIndex);
  }

  public Object fetchValue(final int paramIndex) {
    return values.get(paramIndex);
  }

  public String fetchValueString(final ResolveOptions resOpt, final int paramIndex)
      throws IOException {
    return new ParameterValue(ctx, pc.getSequence().get(paramIndex), values.get(paramIndex))
        .fetchValueString(resOpt);
  }

  /**
   *
   * @param paramName
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ParameterValue fetchParameterValue(final String paramName) {
    final int paramIndex = pc.fetchParameterIndex(paramName);
    return new ParameterValue(ctx, pc.getSequence().get(paramIndex), values.get(paramIndex));
  }

  public void setParameterValue(final ResolveOptions resOpt, final String paramName, final Object value) {
    final int paramIndex = pc.fetchParameterIndex(paramName);
    values.set(paramIndex,
        ParameterValue.fetchReplacementValue(resOpt, values.get(paramIndex), value, true));
    wasSet.set(paramIndex, true);
  }

  public ParameterValueSet copy() {
    final List<Object> copyValues = new ArrayList<>(values);
    final List<Boolean> copyWasSet = new ArrayList<>(wasSet);
    final ParameterValueSet copy = new ParameterValueSet(ctx, pc, copyValues, copyWasSet);
    return copy;
  }

  public void spew(final ResolveOptions resOpt, final StringSpewCatcher to, final String indent)
      throws IOException {
    for (int i = 0; i < length(); i++) {
      final ParameterValue parameterValue = new ParameterValue(ctx, pc.getSequence().get(i),
          values.get(i));
      parameterValue.spew(resOpt, to, indent + '-');
    }
  }

  ParameterCollection getPc() {
    return pc;
  }

  void setPc(final ParameterCollection pc) {
    this.pc = pc;
  }

  public List<Object> getValues() {
    return values;
  }

  void setValues(final List<Object> values) {
    this.values = values;
  }

  CdmCorpusContext getCtx() {
    return ctx;
  }

  void setCtx(final CdmCorpusContext ctx) {
    this.ctx = ctx;
  }

  List<Boolean> getWasSet() {
    return wasSet;
  }

  void setWasSet(final List<Boolean> wasSet) {
    this.wasSet = wasSet;
  }

  public int length() {
    if (pc != null && pc.getSequence() != null) {
      return pc.getSequence().size();
    }

    return 0;
  }
}
