import { CdmDocumentDefinition } from '../internal';

/**
     * @internal
     */
export interface docsResult {
    newSymbol?: string;
    docBest?: CdmDocumentDefinition;
    docList?: CdmDocumentDefinition[];
}
