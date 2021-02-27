// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    internal static class CopyDataUtils
    {
        /// <summary>
        /// Creates a list of JSON objects that is a copy of the input IEnumerable object
        /// </summary>
        internal static List<JToken> ListCopyData(ResolveOptions resOpt, IEnumerable<dynamic> source, CopyOptions options)
        {
            if (source == null)
                return null;
            List<JToken> casted = new List<JToken>();
            foreach (var element in source)
            {
                casted.Add(JToken.FromObject(element?.CopyData(resOpt, options), JsonSerializationUtil.JsonSerializer));
            }
            if (casted.Count == 0)
                return null;
            return casted;
        }

    }
}
