// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { LocalAdapter } from "../../../Storage";
import { CdmFileMetadata } from "../../../Utilities/CdmFileMetadata";
import { NoOverrideAdapter } from "./NoOverrideAdapter";

export class FetchAllMetadataNullAdapter extends NoOverrideAdapter {
    constructor(baseAdapter: LocalAdapter) {
        super(baseAdapter);
    }

    public async fetchAllFilesMetadataAsync(folderCorpusPath: string): Promise<Map<string, CdmFileMetadata>> {
        return undefined;
    }
}
