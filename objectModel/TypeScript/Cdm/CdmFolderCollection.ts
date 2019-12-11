import { isArray, isString } from 'util';
import {
    CdmCollection,
    CdmCorpusContext,
    CdmFolderDefinition,
    cdmObjectType
} from '../internal';

export class CdmFolderCollection extends CdmCollection<CdmFolderDefinition> {
    constructor(ctx: CdmCorpusContext, parentFolder: CdmFolderDefinition) {
        super(ctx, parentFolder, cdmObjectType.folderDef);
    }

    public get owner(): CdmFolderDefinition {
        return super.owner as CdmFolderDefinition;
    }

    public set owner(value: CdmFolderDefinition) {
        super.owner = value;
    }

    /**
     * @inheritdoc
     */
    public push(childFolderOrName: string | CdmFolderDefinition, simpleRef: boolean = false)
        : CdmFolderDefinition {
        const childFolder: CdmFolderDefinition = super.push(childFolderOrName, simpleRef);
        this.addItemModifications(childFolder);

        return childFolder;
    }

    public insert(index: number, childFolder: CdmFolderDefinition): void {
        this.addItemModifications(childFolder);
        super.insert(index, childFolder);
    }

    private addItemModifications(childFolder: CdmFolderDefinition): void {
        childFolder.corpus = this.owner.corpus;
        childFolder.namespace = this.owner.namespace;
        childFolder.folderPath = `${this.owner.folderPath}${childFolder.name}/`;

        // TODO: At this point we should also propagate the root adapter into the child folder 
        // and all its sub-folders and contained documents. For now, don't add things to the
        // folder unless it's tied to an adapter root.
    }
}
