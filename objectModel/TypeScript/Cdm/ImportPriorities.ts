// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmDocumentDefinition, ImportInfo } from '../internal';

/**
 * @internal
 */
export class ImportPriorities {
  public importPriority: Map<CdmDocumentDefinition, ImportInfo>;
  public monikerPriorityMap: Map<string, CdmDocumentDefinition>;
  public hasCircularImport: boolean;

  constructor() {
      this.importPriority = new Map<CdmDocumentDefinition, ImportInfo>();
      this.monikerPriorityMap = new Map<string, CdmDocumentDefinition>();
      this.hasCircularImport = false;
  }

  public copy(): ImportPriorities {
      const copy: ImportPriorities = new ImportPriorities();
      if (this.importPriority) {
          this.importPriority.forEach((v: ImportInfo, k: CdmDocumentDefinition) => { copy.importPriority.set(k, v); });
      }
      if (this.monikerPriorityMap) {
          this.monikerPriorityMap.forEach((v: CdmDocumentDefinition, k: string) => { copy.monikerPriorityMap.set(k, v); });
      }
      copy.hasCircularImport = this.hasCircularImport;

      return copy;
  }
}
