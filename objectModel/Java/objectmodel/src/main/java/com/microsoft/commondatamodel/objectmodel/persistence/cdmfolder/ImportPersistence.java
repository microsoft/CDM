package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmImport;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Import;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ImportPersistence {
  private static final Logger LOGGER = LoggerFactory.getLogger(ImportPersistence.class);

  public static CdmImport fromData(final CdmCorpusContext ctx, final Import obj) {
        if (obj == null) {
          LOGGER.error("There was an error while trying to convert from JSON to CdmImport. Reason: JSON object is null");
          return null;
        }

    final CdmImport theImport = ctx.getCorpus().makeObject(CdmObjectType.Import);

        String corpusPath = obj.getCorpusPath();
        if (Strings.isNullOrEmpty(corpusPath))
            corpusPath = obj.getUri();

        theImport.setCorpusPath(corpusPath);
        theImport.setMoniker(obj.getMoniker());

        return theImport;
    }

  public static Import toData(final CdmImport instance, final ResolveOptions resOpt, final CopyOptions options) {
        final Import result = new Import();
        result.setMoniker(Strings.isNullOrEmpty(instance.getMoniker()) ? null : instance.getMoniker());
        result.setCorpusPath(Strings.isNullOrEmpty(instance.getCorpusPath()) ? null : instance.getCorpusPath());
        return result;
    }
}
