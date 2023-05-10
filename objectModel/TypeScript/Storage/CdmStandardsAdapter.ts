// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCustomPackageAdapter } from './CdmCustomPackageAdapter';

/**
 * An adapter pre-configured to read the standard schema files published by CDM.
 */
export class CdmStandardsAdapter extends CdmCustomPackageAdapter {
    constructor() {
        if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
            // for webpack, we need to explicitly state imports, can't require using a variable
            super(require('cdm.objectmodel.cdmstandards'));
        } else {
            super('cdm.objectmodel.cdmstandards');
        }
    }
}
