package com.microsoft.commondatamodel.objectmodel.cdm.cdmcollection;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;

public class CdmCollectionHelperFunctions {
  /**
   * Creates a Manifest used for the tests.
   *
   * @param localRootPath A string used as root path for "local" namespace.
   * @return Created Manifest.
   */
  static CdmManifestDefinition generateManifest(final String localRootPath) {
    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().setDefaultNamespace("local");

    cdmCorpus.getStorage().mount("local", new LocalAdapter(localRootPath));

    // Add cdm namespace.
    cdmCorpus.getStorage().mount("cdm", new LocalAdapter("C:/Root/Path"));

    final CdmManifestDefinition manifest = new CdmManifestDefinition(cdmCorpus.getCtx(), "manifest");
    manifest.setFolderPath("/");
    manifest.setNamespace("local");

    return manifest;
  }
}
