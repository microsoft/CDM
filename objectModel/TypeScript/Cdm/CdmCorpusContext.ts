import {
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    EventCallback
} from '../internal';

export interface CdmCorpusContext {
    corpus: CdmCorpusDefinition;
    statusEvent: EventCallback;
}
