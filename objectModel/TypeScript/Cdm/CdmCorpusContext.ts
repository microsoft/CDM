import {
    CdmCorpusDefinition,
    cdmStatusLevel,
    EventCallback
} from '../internal';

export interface CdmCorpusContext {
    reportAtLevel: cdmStatusLevel;
    corpus: CdmCorpusDefinition;
    statusEvent: EventCallback;
}
