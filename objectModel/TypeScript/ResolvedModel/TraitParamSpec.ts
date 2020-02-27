// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface TraitParamSpec {
    traitBaseName: string;
    params: {
        paramName: string;
        paramValue: string;
    }[];
}

export type TraitSpec = (string | TraitParamSpec);
