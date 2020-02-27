// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmParameterDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Parameter;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public class ParameterPersistence {

  public static CdmParameterDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj) {

    final CdmParameterDefinition parameter = ctx.getCorpus()
        .makeObject(CdmObjectType.ParameterDef, obj.get("name").asText());
    parameter.setExplanation(obj.get("explanation") != null ? obj.get("explanation").asText() : null);
    parameter.setRequired(obj.get("required") != null ? obj.get("required").asBoolean() : false);

    parameter.setDefaultValue(Utils.createConstant(ctx, obj.get("defaultValue")));
    parameter.setDataTypeRef(DataTypeReferencePersistence.fromData(ctx, obj.get("dataType")));

    return parameter;
  }

  public static Parameter toData(final CdmParameterDefinition instance, final ResolveOptions resOpt,
                                 final CopyOptions options) {
    JsonNode defVal = null;
    if (instance.getDefaultValue() != null) {
      // TODO-BQ: Verify for the case of instance.getDefaultValue() instanceof String, suggested by C#
      if (instance.getDefaultValue() instanceof String) {
        defVal = JMapper.MAP.valueToTree(instance.getDefaultValue());
      } else {
        defVal = JMapper.MAP.valueToTree(((CdmObject) instance.getDefaultValue()).copyData(resOpt, options));
      }
    }
    final Parameter result = new Parameter();

    result.setExplanation(instance.getExplanation());
    result.setName(instance.getName());
    result.setDefaultValue(defVal);
    result.setRequired(instance.isRequired() != null && instance.isRequired() ? true : null);
    result.setDataType(Utils.jsonForm(instance.getDataTypeRef(), resOpt, options));

    return result;
  }
}
