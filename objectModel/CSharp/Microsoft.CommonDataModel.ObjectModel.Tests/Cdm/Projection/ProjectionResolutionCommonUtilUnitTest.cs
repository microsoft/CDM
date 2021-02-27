// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Projection
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.IO;

    /// <summary>
    /// Unit test for ProjectionResolutionCommonUtil functions
    /// </summary>
    /// <returns></returns>
    [TestClass]
    public class ProjectionResolutionCommonUtilUnitTest
    {
        private static List<HashSet<string>> restOptsCombinations = new List<HashSet<string>>() {
            new HashSet<string> { },
            new HashSet<string> { "referenceOnly" },
            new HashSet<string> { "normalized" },
            new HashSet<string> { "structured" },
            new HashSet<string> { "referenceOnly", "normalized" },
            new HashSet<string> { "referenceOnly", "structured" },
            new HashSet<string> { "normalized", "structured" },
            new HashSet<string> { "referenceOnly", "normalized", "structured" },
        };

        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Projection", "ProjectionResolutionCommonUtilUnitTest");

        // TODO (sukanyas): Need to add Tests
    }
}
