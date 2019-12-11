import { EntityReference } from '.';

export abstract class ConstantEntity {
    public explanation?: string;
    public constantEntityName?: string;
    public entityShape: string | EntityReference;
    public constantValues: string[][];
}
