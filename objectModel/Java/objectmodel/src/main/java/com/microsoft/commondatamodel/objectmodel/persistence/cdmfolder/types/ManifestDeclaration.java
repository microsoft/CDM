package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

public class ManifestDeclaration extends FileStatusExtended {
  private String explanation;
  private String manifestName;
  private String definition;

  public String getExplanation() {
    return explanation;
  }

  public void setExplanation(final String explanation) {
    this.explanation = explanation;
  }

  public String getManifestName() {
    return manifestName;
  }

  public void setManifestName(final String manifestName) {
    this.manifestName = manifestName;
  }

  //    TODO-BQ: 2019-09-26 Temporary support for FolioName
  public void setFolioName(final String folioName) {
    this.manifestName = folioName;
  }

  /**
   * Gets the corpus path to the definition of the sub manifest.
   *
   * @return
   */
  public String getDefinition() {
    return definition;
  }

  /**
   * Sets the corpus path to the definition of the sub manifest.
   *
   * @param definition
   */
  public void setDefinition(final String definition) {
    this.definition = definition;
  }
}