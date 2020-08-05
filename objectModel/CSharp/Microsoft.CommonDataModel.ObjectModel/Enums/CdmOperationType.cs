// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Enums
{
    using System;

    /// <summary>
    /// Enumeration of operation types
    /// </summary>
    public enum CdmOperationType
    {
        Error,
        AddCountAttribute,
        AddSupportingAttribute,
        AddTypeAttribute,
        ExcludeAttributes,
        ArrayExpansion,
        CombineAttributes,
        RenameAttributes,
        ReplaceAsForeignKey,
        IncludeAttributes,
        AddAttributeGroup
    }

    internal class OperationTypeConvertor
    {
        internal static string OperationTypeToString(CdmOperationType opType)
        {
            switch (opType)
            {
                case CdmOperationType.AddCountAttribute:
                    return "addCountAttribute";
                case CdmOperationType.AddSupportingAttribute:
                    return "addSupportingAttribute";
                case CdmOperationType.AddTypeAttribute:
                    return "addTypeAttribute";
                case CdmOperationType.ExcludeAttributes:
                    return "excludeAttributes";
                case CdmOperationType.ArrayExpansion:
                    return "arrayExpansion";
                case CdmOperationType.CombineAttributes:
                    return "combineAttributes";
                case CdmOperationType.RenameAttributes:
                    return "renameAttributes";
                case CdmOperationType.ReplaceAsForeignKey:
                    return "replaceAsForeignKey";
                case CdmOperationType.IncludeAttributes:
                    return "includeAttributes";
                case CdmOperationType.AddAttributeGroup:
                    return "addAttributeGroup";
                case CdmOperationType.Error:
                default:
                    throw new InvalidOperationException();
            }
        }
    }
}
