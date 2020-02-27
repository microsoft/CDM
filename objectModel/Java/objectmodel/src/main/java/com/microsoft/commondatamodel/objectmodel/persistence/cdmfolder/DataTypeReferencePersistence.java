// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataTypeReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DataType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.IOException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DataTypeReferencePersistence {
  private static final Logger LOGGER = LoggerFactory.getLogger(DataTypeReferencePersistence.class);

  public static CdmDataTypeReference fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        boolean simpleReference = true;
        Object dataType = null;
    List<CdmTraitReference> appliedTraits = null;

        if (obj.isValueNode())
           dataType = obj;
        else {
            simpleReference = false;
            if (obj.get("dataTypeReference").isValueNode())
                dataType = obj.get("dataTypeReference").asText();
            else
                try {
                    dataType = DataTypePersistence.fromData(ctx, JMapper.MAP.treeToValue(obj.get("dataTypeReference"), DataType.class));
                } catch (final IOException ex) {
                  LOGGER.error("There was an error while trying to convert from JSON to DataTypeRef. Reason: '{}'", ex.getLocalizedMessage());
                }
        }

    final CdmDataTypeReference dataTypeReference = ctx.getCorpus().makeRef(CdmObjectType.DataTypeRef, dataType, simpleReference);

        if (!obj.isValueNode())
            appliedTraits = Utils.createTraitReferenceList(ctx, obj.get("appliedTraits"));

        Utils.addListToCdmCollection(dataTypeReference.getAppliedTraits(), appliedTraits);

        return dataTypeReference;
    }

  public static Object toData(final CdmDataTypeReference instance, final ResolveOptions resOpt, final CopyOptions options) {
        return CdmObjectRefPersistence.toData(instance, resOpt, options);
    }
}
