// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmObject } from '../internal';

export interface CdmContainerDefinition extends CdmObject {
    /**
     * @deprecated Only for internal use.
     * The namespace where this object can be found
     */
    namespace: string;

    /**
     * @deprecated Only for internal use.
     * The folder where this object exists
     */
    folderPath: string;
}
