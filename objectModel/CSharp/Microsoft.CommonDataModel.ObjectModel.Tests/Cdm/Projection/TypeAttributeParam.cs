// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    /// <summary>
    /// Type Attribute Test Parameters
    /// </summary>
    public sealed class TypeAttributeParam
    {
        /// <summary>
        /// Attribute name property
        /// </summary>
        public string AttributeName { get; set; }

        /// <summary>
        /// Attribute data type property
        /// </summary>
        public string AttributeDataType { get; set; }

        /// <summary>
        /// Attribute purpose property
        /// </summary>
        public string AttributePurpose { get; set; }

        public TypeAttributeParam(string name, string dataType, string purpose)
        {
            AttributeName = name;
            AttributeDataType = dataType;
            AttributePurpose = purpose;
        }
    }
}
