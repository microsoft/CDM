package com.microsoft.commondatamodel.objectmodel.utilities.exceptions;

public class CdmReadPartitionFromPatternException extends RuntimeException {
  private static final long serialVersionUID = 1;

  public CdmReadPartitionFromPatternException() {
    super();
  }

  public CdmReadPartitionFromPatternException(final String message) {
    super(message);
  }

  public CdmReadPartitionFromPatternException(final String message, final Throwable throwable) {
    super(message, throwable);
  }
}
