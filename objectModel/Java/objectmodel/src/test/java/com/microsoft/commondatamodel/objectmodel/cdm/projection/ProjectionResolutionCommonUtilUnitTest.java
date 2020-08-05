// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projection;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

/**
 * Unit test for ProjectionResolutionCommonUtil functions
 */
public class ProjectionResolutionCommonUtilUnitTest {
    /**
     * The path between TestDataPath and TestName.
     */
    private static final String TESTS_SUBPATH =
        new File(new File(new File(
            "cdm"),
            "projection"),
            "testProjectionResolutionCommonUtil")
            .toString();

    private static List<HashSet<String>> resOptsCombinations = new ArrayList<>(
        Arrays.asList(
            new HashSet<String>(Arrays.asList()),
            new HashSet<String>(Arrays.asList("referenceOnly")),
            new HashSet<String>(Arrays.asList("normalized")),
            new HashSet<String>(Arrays.asList("structured")),
            new HashSet<String>(Arrays.asList("referenceOnly", "normalized")),
            new HashSet<String>(Arrays.asList("referenceOnly", "structured")),
            new HashSet<String>(Arrays.asList("normalized", "structured")),
            new HashSet<String>(Arrays.asList("referenceOnly", "normalized", "structured"))
        )
    );

    // TODO (sukanyas): Need to add Tests
}
