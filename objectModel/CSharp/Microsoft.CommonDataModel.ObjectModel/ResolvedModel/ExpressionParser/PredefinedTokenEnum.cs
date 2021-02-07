// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    internal enum PredefinedTokenEnum
    {
        ALWAYS,

        AND,
        OR,
        NOT,

        TRUE,
        FALSE,

        GT,
        LT,
        EQ,
        NE,
        GE,
        LE,

        DEPTH,
        MAXDEPTH,
        
        NOMAXDEPTH,
        ISARRAY,

        MINCARDINALITY,
        MAXCARDINALITY,

        REFERENCEONLY,
        NORMALIZED,
        STRUCTURED,
        VIRTUAL,

        OPENPAREN,
        CLOSEPAREN
    }
}
