// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Common
{
    public interface IPersistenceType
    {
        InterfaceToImpl RegisteredClasses { get; set; }
    }
}
