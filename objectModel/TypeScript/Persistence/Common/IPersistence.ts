// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    copyOptions,
    CdmObject,
    resolveOptions
} from '../../internal';

export interface IPersistence {
    fromData<T extends CdmObject>(...args: any[]): T;
    toData<T extends CdmObject, U>(instance: CdmObject, resOpt: resolveOptions, options?: copyOptions): U;
}
