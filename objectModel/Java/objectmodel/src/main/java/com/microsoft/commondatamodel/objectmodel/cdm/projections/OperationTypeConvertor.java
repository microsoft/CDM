// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
 @Deprecated
public class OperationTypeConvertor {
    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not meant
     * to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static String operationTypeToString(CdmOperationType opType) {
        switch (opType) {
            case AddCountAttribute:
                return "addCountAttribute";
            case AddSupportingAttribute:
                return "addSupportingAttribute";
            case AddTypeAttribute:
                return "addTypeAttribute";
            case ExcludeAttributes:
                return "excludeAttributes";
            case ArrayExpansion:
                return "arrayExpansion";
            case CombineAttributes:
                return "combineAttributes";
            case RenameAttributes:
                return "renameAttributes";
            case ReplaceAsForeignKey:
                return "replaceAsForeignKey";
            case IncludeAttributes:
                return "includeAttributes";
            case AddAttributeGroup:
                return "addAttributeGroup";
            case Error:
            default:
                throw new UnsupportedOperationException();
        }
    }
}
