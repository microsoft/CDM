// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmImport;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Import;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

public class ImportPersistence {
  private static final String TAG = ImportPersistence.class.getSimpleName();

  public static CdmImport fromData(final CdmCorpusContext ctx, final Import obj) {
        if (obj == null) {
          Logger.error(ctx, TAG, "fromData", null, CdmLogCode.ErrPersistJsonImportConversionError);
          return null;
        }

        final CdmImport theImport = ctx.getCorpus().makeObject(CdmObjectType.Import);

        String corpusPath = obj.getCorpusPath();
        if (StringUtils.isNullOrEmpty(corpusPath))
            corpusPath = obj.getUri();

        theImport.setCorpusPath(corpusPath);
        theImport.setMoniker(obj.getMoniker());

        return theImport;
  }

  public static Import toData(final CdmImport instance, final ResolveOptions resOpt, final CopyOptions options) {
        final Import result = new Import();
        result.setMoniker(StringUtils.isNullOrEmpty(instance.getMoniker()) ? null : instance.getMoniker());
        result.setCorpusPath(StringUtils.isNullOrEmpty(instance.getCorpusPath()) ? null : instance.getCorpusPath());
        return result;
  }
}
