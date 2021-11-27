// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataTypeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DataType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

public class DataTypePersistence {
  private static final String TAG = DataTypePersistence.class.getSimpleName();

  public static CdmDataTypeDefinition fromData(final CdmCorpusContext ctx, final DataType obj) {
      if (obj == null) {
        Logger.error(ctx, TAG, "fromData", null, CdmLogCode.ErrPersistJsonDatatypeConversionError);
        return null;
      }

      final CdmDataTypeDefinition dataType = ctx.getCorpus().makeObject(CdmObjectType.DataTypeDef, obj.getDataTypeName());
      dataType.setExtendsDataType(DataTypeReferencePersistence.fromData(ctx, obj.getExtendsDataType()));

      if (obj.getExplanation() != null)
          dataType.setExplanation(obj.getExplanation());

      Utils.addListToCdmCollection(dataType.getExhibitsTraits(), Utils.createTraitReferenceList(ctx, obj.getExhibitsTraits()));

      return dataType;
    }

  public static DataType toData(final CdmDataTypeDefinition instance, final ResolveOptions resOpt, final CopyOptions options) {
      final DataType result = new DataType();
      result.setExplanation(instance.getExplanation());
      result.setDataTypeName(instance.getDataTypeName());
      result.setExtendsDataType(Utils.jsonForm(instance.getExtendsDataType(), resOpt, options));
      result.setExhibitsTraits(Utils.listCopyDataAsArrayNode(instance.getExhibitsTraits(), resOpt, options));
      return result;
    }
}
