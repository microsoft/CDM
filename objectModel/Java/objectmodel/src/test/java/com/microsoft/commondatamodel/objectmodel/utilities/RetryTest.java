/*
 * Copyright (c) Microsoft Corporation.
 */

package com.microsoft.commondatamodel.objectmodel.utilities;

import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;

/**
 * Retry failed test for a maximum of 3 times.
 * Use this class by adding an annotation to {@code @Test} like so:
 * {@code @Test(retryAnalyzer = RetryTest.class)}
 */
public class RetryTest implements IRetryAnalyzer {
  private static final int MAX_RETRY = 3;
  private int count = 0;

  @Override
  public boolean retry(final ITestResult result) {
    if (!result.isSuccess()) {
      if (count < MAX_RETRY) {
        count++;
        result.setStatus(ITestResult.FAILURE);
        return true;
      } else {
        result.setStatus(ITestResult.FAILURE);
      }
    } else {
      result.setStatus(ITestResult.SUCCESS);
    }
    return false;
  }
}
