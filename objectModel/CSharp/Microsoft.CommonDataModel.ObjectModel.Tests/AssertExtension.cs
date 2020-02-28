// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Text;

namespace Microsoft.CommonDataModel.ObjectModel.Tests
{
    /// <summary>
    /// Extends Assert to add test for performance that is only run when we are not debugging.
    /// </summary>
    public abstract class AssertExtension : NUnit.Framework.Assert
    {
        /// <summary>
        /// If not debugging, asserts the actual running time is lower or equal to the expected.
        /// </summary>
        /// <param name="expected">Expected maximum running time</param>
        /// <param name="actual"> Actual running time</param>
        /// <param name="operation">The name of the operation. It will be written in case of an error.</param>
        public static void Performance(long expected, long actual, string operation = "Something")
        {
            if (Debugger.IsAttached)
            {
                // Skip testing if a debugging session is in progress.
                return;
            }
            Assert.That(actual, Is.LessThanOrEqualTo(expected), $"{operation} took {actual}; expected <= {expected}");
        }
    }
}
