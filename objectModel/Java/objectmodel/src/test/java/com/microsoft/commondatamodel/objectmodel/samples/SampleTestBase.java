// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.samples;

import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import org.testng.SkipException;

/**
 * The base class for sample test classes.
 */
public abstract class SampleTestBase {
    protected static final String TESTS_SUBPATH = "Samples";

    /**
     * Check the environment variable and throws SkipException which marks
     * the corresponding test as skipped if SAMPLE_RUNTESTS is not set.
     */
    protected void checkSampleRunTestsFlag()
    {
        if (!"1".equals(System.getenv("SAMPLE_RUNTESTS")))
        {
            // this will cause tests to appear as "Skipped" in the final result
            throw new SkipException("SAMPLE_RUNTESTS environment variable not set.");
        }
    }
}
