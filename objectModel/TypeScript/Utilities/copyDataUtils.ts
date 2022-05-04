// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmArgumentCollection,
    CdmCollection,
    CdmDefinitionCollection,
    CdmDocumentCollection, CdmEntityCollection,
    CdmFolderCollection, CdmImportCollection, CdmObject, CdmTraitCollection, copyOptions, resolveOptions } from '../internal';

/**
 * @internal
 */
/**
 * Creates a list object that is a copy of the input IEnumerable object
 */
// tslint:disable-next-line: export-name
export function arrayCopyData<T>(
    resOpt: resolveOptions,
    source: CdmCollection<CdmObject> | CdmArgumentCollection
    | CdmDocumentCollection |
    CdmDefinitionCollection | CdmEntityCollection | CdmTraitCollection
     | CdmFolderCollection | CdmImportCollection | CdmObject[],
    options: copyOptions,
    condition?: (obj: CdmObject) => boolean): T[] {
    if (!source || !source.length) {
        return undefined;
    }
    const casted: T[] = [];
    const l: number = source.length;
    for (let i: number = 0; i < l; i++) {
        const element: CdmObject = (source as CdmCollection<CdmObject>).allItems ? (source as CdmCollection<CdmObject>).allItems[i] : source[i];
        if (condition === undefined || (condition !== undefined && condition(element))) {
            casted.push(element ? element.copyData(resOpt, options) as unknown as T : undefined);
        }
    }

    return casted;
}
