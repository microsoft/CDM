// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Argument;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public class ArgumentPersistence {
    public static CdmArgumentDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        final CdmArgumentDefinition argument = ctx.getCorpus().makeObject(CdmObjectType.ArgumentDef);

        if (obj.get("value") != null) {
            argument.setValue(Utils.createConstant(ctx, obj.get("value")));

            if (obj.get("name") != null)
                argument.setName(obj.get("name").asText());

            if (obj.get("explanation") != null)
                argument.setExplanation(obj.get("explanation").asText());
        } else
            // Not a structured argument, just a thing. try it.
            argument.setValue(Utils.createConstant(ctx, obj));

        return argument;
    }

    public static Object toData(final CdmArgumentDefinition instance, final ResolveOptions resOpt, final CopyOptions options) {
        Object val = null;

        if (instance.getValue() != null) {
            if (instance.getValue() instanceof String || instance.getValue() instanceof JsonNode) {
                val = instance.getValue();
            } else if (instance.getValue() instanceof CdmObject) {
                val = ((CdmObject) instance.getValue()).copyData(resOpt, options);
            } else {
                val = instance.getValue();
            }
        }

        // skip the argument if just a value
        if (Strings.isNullOrEmpty(instance.getName()))
            return val;

        final Argument result = new Argument();
        result.setExplanation(instance.getExplanation());
        result.setName(instance.getName());
        result.setValue(JMapper.MAP.valueToTree(val));

        return result;
    }
}
