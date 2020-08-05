// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// A class to manage the conditional directive of the util
    /// </summary>
    /// <unitTest>ConditionExpressionUnitTest</unitTest>
    internal sealed class ConditionExpression
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="operations"></param>
        /// <param name="owner"></param>
        /// <returns></returns>
        internal static string GetEntityAttributeOverallConditionExpression(CdmObject owner = null)
        {
            StringBuilder bldr = new StringBuilder();

            // if the owner of the projection is an entity attribute
            if (owner?.ObjectType == CdmObjectType.EntityAttributeDef)
            {
                bldr.Append($" ( (!normalized) || (cardinality.maximum <= 1) ) ");
            }

            return (bldr.Length > 0) ? bldr.ToString() : null;
        }

        /// <summary>
        /// When no explicit condition is provided, a projection will apply the default condition expression based on the operations
        /// This function defined the defaults for each operation and builds the projection's condition expression
        /// </summary>
        /// <param name="operations"></param>
        /// <param name="owner"></param>
        /// <returns></returns>
        internal static string GetDefaultConditionExpression(CdmOperationCollection operations, CdmObject owner = null)
        {
            StringBuilder bldr = new StringBuilder();

            // if the owner of the projection is an entity attribute
            if (owner?.ObjectType == CdmObjectType.EntityAttributeDef)
            {
                bldr.Append($" ( (!normalized) || (cardinality.maximum <= 1) ) ");
            }

            if (operations.Count > 0)
            {
                if (HasForeignKeyOperations(operations))
                {
                    bldr = AppendString(bldr, $" (referenceOnly || noMaxDepth || (depth > maxDepth)) ");
                }
                else if (HasNotStructuredOperations(operations))
                {
                    bldr = AppendString(bldr, $" (!structured) ");
                }
                else
                {
                    bldr = AppendString(bldr, $" (true) "); // do these always
                }
            }

            return (bldr.Length > 0) ? bldr.ToString() : null;
        }

        private static StringBuilder AppendString(StringBuilder bldr, string message)
        {
            if (bldr.Length > 0)
            {
                bldr.Append($" && ");
            }
            bldr.Append(message);

            return bldr;
        }

        /// <summary>
        /// Function to find if the operations collection has a foreign key
        /// </summary>
        /// <param name="operations"></param>
        /// <returns></returns>
        private static bool HasForeignKeyOperations(CdmOperationCollection operations)
        {
            List<CdmOperationBase> list = operations
                .Where<CdmOperationBase>(op => op.ObjectType == CdmObjectType.OperationReplaceAsForeignKeyDef).ToList();
            return (list.Count > 0);
        }

        /// <summary>
        /// Function to find if the operations collection has an operation that is not resolved for structured directive
        /// </summary>
        /// <param name="operations"></param>
        /// <returns></returns>
        private static bool HasNotStructuredOperations(CdmOperationCollection operations)
        {
            List<CdmOperationBase> list = operations
                .Where<CdmOperationBase>(op => (
                    op.ObjectType == CdmObjectType.OperationAddCountAttributeDef ||
                    op.ObjectType == CdmObjectType.OperationAddTypeAttributeDef ||
                    op.ObjectType == CdmObjectType.OperationRenameAttributesDef ||
                    op.ObjectType == CdmObjectType.OperationArrayExpansionDef
                )).ToList();
            return (list.Count > 0);
        }
    }
}
