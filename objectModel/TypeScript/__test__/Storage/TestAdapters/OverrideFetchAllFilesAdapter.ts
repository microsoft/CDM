// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { LocalAdapter } from "../../../Storage";
import { NoOverrideAdapter } from "./NoOverrideAdapter";

export class OverrideFetchAllFilesAdapter extends NoOverrideAdapter {
    constructor(baseAdapter: LocalAdapter) {
        super(baseAdapter);
    }

    public fetchAllFilesAsync(folderCorpusPath: string): Promise<string[]> {
        return this.localAdapter.fetchAllFilesAsync(folderCorpusPath);
    }
}
