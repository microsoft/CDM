// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationBase;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationCollection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;

import java.util.List;
import java.util.stream.Collectors;

/**
 * A class to manage the conditional directive of the util
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public final class ConditionExpression {
    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return String
     */
    @Deprecated
    public static String getEntityAttributeOverallConditionExpression() {
        return getEntityAttributeOverallConditionExpression(null);
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param owner CdmObject
     * @return String
     */
    @Deprecated
    public static String getEntityAttributeOverallConditionExpression(CdmObject owner) {
        StringBuilder bldr = new StringBuilder();

        // if the owner of the projection is an entity attribute
        if (owner != null && owner.getObjectType() == CdmObjectType.EntityAttributeDef) {
            bldr.append(" ( (!normalized) || (cardinality.maximum <= 1) ) ");
        }

        return (bldr.length() > 0) ? bldr.toString() : null;
    }

    /**
     * When no explicit condition is provided, a projection will apply the default condition expression based on the operations
     * This function defined the defaults for each operation and builds the projection's condition expression
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param operations CdmOperationCollection
     * @return String
     */
    @Deprecated
    public static String getDefaultConditionExpression(CdmOperationCollection operations) {
        return getDefaultConditionExpression(operations, null);
    }

    /**
     * When no explicit condition is provided, a projection will apply the default condition expression based on the operations
     * This function defined the defaults for each operation and builds the projection's condition expression
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param operations CdmOperationCollection
     * @param owner CdmObject
     * @return String
     */
    @Deprecated
    public static String getDefaultConditionExpression(CdmOperationCollection operations, CdmObject owner) {
        StringBuilder bldr = new StringBuilder();

        // if the owner of the projection is an entity attribute
        if (owner != null && owner.getObjectType() == CdmObjectType.EntityAttributeDef) {
            bldr.append(" ( (!normalized) || (cardinality.maximum <= 1) ) ");
        }

        if (operations.size() > 0) {
            if (hasForeignKeyOperations(operations)) {
                bldr = appendString(bldr, " (referenceOnly || noMaxDepth || (depth > maxDepth)) ");
            } else if (hasNotStructuredOperations(operations)) {
                bldr = appendString(bldr, " (!structured) ");
            } else {
                bldr = appendString(bldr, " (true) "); // do these always
            }
        }

        return (bldr.length() > 0) ? bldr.toString() : null;
    }

    private static StringBuilder appendString(StringBuilder bldr, String message) {
        if (bldr.length() > 0) {
            bldr.append(" && ");
        }
        bldr.append(message);

        return bldr;
    }

    /**
     * Function to find if the operations collection has a foreign key
     * @param operations CdmOperationCollection
     * @return boolean
     */
    private static boolean hasForeignKeyOperations(CdmOperationCollection operations) {
        List<CdmOperationBase> list = operations.getAllItems()
            .stream()
            .filter(op -> op.getObjectType() == CdmObjectType.OperationReplaceAsForeignKeyDef)
            .collect(Collectors.toList());
        return (list.size() > 0);
    }

    /**
     * Function to find if the operations collection has an operation that is not resolved for structured directive
     * @param operations CdmOperationCollection
     * @return boolean
     */
    private static boolean hasNotStructuredOperations(CdmOperationCollection operations) {
        List<CdmOperationBase> list = operations.getAllItems()
            .stream()
            .filter(op ->
                op.getObjectType() == CdmObjectType.OperationAddCountAttributeDef ||
                op.getObjectType() == CdmObjectType.OperationAddTypeAttributeDef ||
                op.getObjectType() == CdmObjectType.OperationRenameAttributesDef ||
                op.getObjectType() == CdmObjectType.OperationArrayExpansionDef)
            .collect(Collectors.toList());
        return (list.size() > 0);
    }
}
