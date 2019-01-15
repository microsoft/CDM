// <copyright file="CompareUtilExtensions.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel.Tests.Utilities
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using FluentAssertions;

    /// <summary>
    /// Extension utilities for test object compare
    /// </summary>
    public static class CompareUtilExtensions
    {
        /// <summary>
        /// Verifies a collection
        /// </summary>
        /// <typeparam name="T">Type of collection</typeparam>
        /// <param name="collection">Collection</param>
        /// <param name="expectedCount">Expected count</param>
        /// <param name="converter">Converter</param>
        /// <param name="containsList">Contains list</param>
        public static void VerifyContains<T>(
            this IEnumerable<T> collection,
            int expectedCount,
            Func<T, string> converter,
            params string[] containsList)
        {
            List<T> list = collection.ToList();
            list.Count.Should().Be(expectedCount);
            foreach (string c in containsList)
            {
                list.Find((p) => string.Compare(converter(p), c, StringComparison.OrdinalIgnoreCase) == 0).Should().NotBeNull();
            }
        }

        /// <summary>
        /// Compares two colletions using the comparer
        /// </summary>
        /// <typeparam name="T">Type of collection</typeparam>
        /// <param name="c1">Collection 1</param>
        /// <param name="c2">Collection 2</param>
        /// <param name="getKey">Get key method</param>
        /// <param name="compareFunction">Compare function</param>
        public static void CompareTo<T>(this IEnumerable<T> c1, IEnumerable<T> c2, Func<T, string> getKey, Action<T, T> compareFunction)
        {
            if (c1 == null && c2 == null)
            {
                return;
            }

            c1.Should().NotBeNull();
            c2.Should().NotBeNull();
            var lookup = c2.ToDictionary(x => getKey(x), x => x);
            c1.ToList().Count.Should().Be(lookup.Count);
            c1.ToList().ForEach(x => lookup.ContainsKey(getKey(x)).Should().BeTrue());
            c1.ToList().ForEach(x => compareFunction(x, lookup[getKey(x)]));
        }
    }
}
