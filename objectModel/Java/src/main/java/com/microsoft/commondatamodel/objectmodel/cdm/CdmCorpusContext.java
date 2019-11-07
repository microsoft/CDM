// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

public interface CdmCorpusContext {

  CdmCorpusDefinition getCorpus();

  void setCorpus(CdmCorpusDefinition value);

  void updateDocumentContext(CdmDocumentDefinition currentDoc);

  void updateDocumentContext(CdmDocumentDefinition currentDoc, String corpusPathRoot);
}
