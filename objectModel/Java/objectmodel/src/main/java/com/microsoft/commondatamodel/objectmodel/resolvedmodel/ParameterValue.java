// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmConstantEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmParameterDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.StringSpewCatcher;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.lang3.ObjectUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ParameterValue {
  private CdmParameterDefinition parameter;
  private Object value;
  private CdmCorpusContext ctx;

  public ParameterValue(final CdmCorpusContext ctx, final CdmParameterDefinition parameter, final Object value) {
    this.parameter = parameter;
    this.value = value;
    this.ctx = ctx;
  }

  public static Object fetchReplacementValue(
      final ResolveOptions resOpt,
      final Object oldValue,
      final Object newValue,
      final boolean wasSet) {
    if (oldValue == null) {
      return newValue;
    }

    if (!wasSet) {
      // must explicitly set a value to override
      // if a new value is not set, then newValue holds nothing or the default.
      // in this case, if there was already a value in this argument then just keep using it.
      return oldValue;
    }

    if (oldValue instanceof String) {
      return newValue;
    }

    final CdmObject ov = (CdmObject) oldValue;

    // replace an old table with a new table? actually just mash them together
    if (ov.getObjectType() == CdmObjectType.EntityRef
            && newValue instanceof CdmObject
            && ((CdmObject) newValue).getObjectType() == CdmObjectType.EntityRef) {

      final CdmObject nv = (CdmObject) newValue;
      final CdmConstantEntityDefinition oldEnt = ov.fetchObjectDefinition(resOpt);
      final CdmConstantEntityDefinition newEnt = nv.fetchObjectDefinition(resOpt);

      // check that the entities are the same shape
      if (newEnt == null) {
        return ov;
      }

      // BUG
      CdmEntityDefinition entDefShape = null;
      if (oldEnt == null || ((entDefShape = oldEnt.getEntityShape().fetchObjectDefinition(resOpt)) != newEnt.getEntityShape().fetchObjectDefinition(resOpt))) {
        return nv;
      }

      final List<List<String>> oldCv = oldEnt.getConstantValues();
      final List<List<String>> newCv = newEnt.getConstantValues();

      // rows in old?
      if (oldCv == null || oldCv.size() == 0) {
        return nv;
      }

      // rows in new?
      if (newCv == null || newCv.size() == 0) {
        return ov;
      }

      // make a set of rows in the old one and add the new ones. this will union the two
      // find rows in the new one that are not in the old one. slow, but these are small usually
      final Map<String, List<String>> unionedRows = new LinkedHashMap<>();

      // see if any of the entity atts are the primary key, meaning, the only thing that causes us to merge dups unique.
      // i know this makes you think about a snake eating its own tail, but fetch the resolved attributes of the constant shape
      int pkAtt = -1;
      if (entDefShape != null)
      {
        final ResolveOptions resOptShape = new ResolveOptions(entDefShape.getInDocument());
        final ResolvedAttributeSet resAttsShape = entDefShape.fetchResolvedAttributes(resOptShape);
        if (resAttsShape != null) {
          pkAtt = resAttsShape.getSet().indexOf(resAttsShape.getSet().stream().filter(ra -> ra.getResolvedTraits().find(resOptShape, "is.identifiedBy") != null).findFirst());
        }
      }

      for (int i = 0; i < oldCv.size(); i++) {
        final List<String> row = oldCv.get(i);
        final StringBuilder key = new StringBuilder();
        // the entity might have a PK, if so, only look at that values as the key
        if (pkAtt != -1) {
          key.append(row.get(pkAtt));
        } else {
          row.forEach(s -> key.append(key.length() == 0 ? s : "::" + s));
        }
        unionedRows.put(key.toString(), row);
      }

      for (int i = 0; i < newCv.size(); i++) {
        final List<String> row = newCv.get(i);
        final StringBuilder key = new StringBuilder();
        // the entity might have a PK, if so, only look at that values as the key
        if (pkAtt != -1) {
          key.append(row.get(pkAtt));
        } else {
          row.forEach(s -> key.append(key.length() == 0 ? s : "::" + s));
        }
        unionedRows.put(key.toString(), row);
      }

      if (unionedRows.size() == oldCv.size()) {
        return ov;
      }

      final List<List<String>> allRows = new ArrayList<>(unionedRows.values());

      final CdmConstantEntityDefinition replacementEnt = (CdmConstantEntityDefinition) oldEnt.copy(resOpt);
      replacementEnt.setConstantValues(allRows);
      return resOpt.getWrtDoc().getCtx().getCorpus()
              .makeRef(CdmObjectType.EntityRef, replacementEnt, false);
    }

    return newValue;
  }

  public void setValue(final ResolveOptions resOpt, final Object newValue) {
    value = ParameterValue.fetchReplacementValue(resOpt, value, newValue, true);
  }

  public String fetchValueString(final ResolveOptions resOpt) throws IOException {
    if (value == null) {
      return "";
    }

    if (value instanceof String) {
      return (String) value;
    }

    if (value instanceof JsonNode) {
      return ((JsonNode) value).asText();
    }

    if (value instanceof CdmObject) {
      final CdmObjectDefinition def = ((CdmObject) value).fetchObjectDefinition(resOpt);

      if (((CdmObject) value).getObjectType() == CdmObjectType.EntityRef
              && def != null && def.getObjectType() == CdmObjectType.ConstantEntityDef) {

        final CdmEntityReference entShape = ((CdmConstantEntityDefinition) def).getEntityShape();
        final List<List<String>> entValues = ((CdmConstantEntityDefinition) def).getConstantValues();

        if (entValues == null || entValues.size() == 0) {
          return "";
        }

        final List<Map<String, String>> rows = new ArrayList<>();
        final ResolvedAttributeSet shapeAtts = entShape.fetchResolvedAttributes(resOpt);

        if (shapeAtts != null && shapeAtts.getSet() != null && shapeAtts.getSet().size() > 0) {
          for (final List<String> rowData : entValues) {
            final Map<String, String> row = new TreeMap<>();

            if (rowData != null && rowData.size() > 0) {
              for (int c = 0; c < rowData.size(); c++) {
               final String tValue = rowData.get(c);
                final ResolvedAttribute colAtt = shapeAtts.getSet().get(c);
                if (colAtt != null) {
                 row.put(colAtt.getResolvedName(), tValue);
                }
              }
              rows.add(row);
            }
          }
        }

        return JMapper.MAPPER_FOR_SPEW.writeValueAsString(rows);
      }

      final CopyOptions copyOptions = new CopyOptions();
      copyOptions.setIsStringRefs(false);
      final Object data = ((CdmObject) value).copyData(resOpt, copyOptions);

      if (data instanceof String) {
        return (String) data;
      }

      return JMapper.MAPPER_FOR_SPEW.writeValueAsString(data);
    }

    return "";
  }

  public String getName() {
    return parameter.getName();
  }

  public CdmParameterDefinition getParameter() {
    return parameter;
  }

  public void setParameter(final CdmParameterDefinition parameter) {
    this.parameter = parameter;
  }

  public Object getValue() {
    return value;
  }

  public void setValue(final Object value) {
    this.value = value;
  }

  CdmCorpusContext getCtx() {
    return ctx;
  }

  void setCtx(final CdmCorpusContext ctx) {
    this.ctx = ctx;
  }

  public void spew(final ResolveOptions resOpt, final StringSpewCatcher to, final String indent)
          throws IOException {
    to.spewLine(indent + getName() + ":" + fetchValueString(resOpt));
  }
}
