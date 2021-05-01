// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    internal class RelationshipInfo
    {
        internal bool IsByRef { get; set; }
        internal bool IsArray { get; set; }
        internal bool SelectsOne { get; set; }
    }
}
