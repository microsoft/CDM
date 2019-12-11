import {
    CdmObject,
    CdmTraitCollection,
} from '../internal';
import { CdmReferencesEntities } from './CdmReferencesEntities';

export interface CdmAttributeItem extends CdmObject, CdmReferencesEntities {
    readonly appliedTraits: CdmTraitCollection;
}
