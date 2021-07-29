// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Enums
{
    /// <summary>
    /// An enum class indicating the running environment type.
    /// </summary>
    public enum EnvironmentType
    {
        // Development environment. Allows the more detailed information to be consumed in development environment
        DEV,

        // Testing In Production. Protects all information that may contains user-created contents
        TEST,

        // Production environment. Protects all information that may contains user-created contents
        PROD,
    }
}
