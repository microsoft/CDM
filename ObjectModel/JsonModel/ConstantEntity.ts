import { EntityReference } from '../internal';

export interface ConstantEntity {
    explanation?: string;
    constantEntityName?: string;
    entityShape: string | EntityReference;
    constantValues: string[][];
}
