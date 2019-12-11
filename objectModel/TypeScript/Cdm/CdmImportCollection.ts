import { isArray, isString } from 'util';
import {
    CdmCollection,
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmFolderDefinition,
    CdmImport,
    cdmObjectType
} from '../internal';

export class CdmImportCollection extends CdmCollection<CdmImport> {
constructor(ctx: CdmCorpusContext, owner: CdmDocumentDefinition) {
        super(ctx, owner, cdmObjectType.import);
    }

    public get owner(): CdmDocumentDefinition {
        return super.owner as CdmDocumentDefinition;
    }

    public set owner(value: CdmDocumentDefinition) {
        super.owner = value;
    }

    /**
     * @inheritdoc
     */
    public push(parameter: string | CdmImport, moniker?: string | boolean): CdmImport {
        const obj: CdmImport = super.push(parameter);
        if (moniker !== undefined && isString(moniker)) {
            obj.moniker = moniker;
        }

        return obj;
    }
}
