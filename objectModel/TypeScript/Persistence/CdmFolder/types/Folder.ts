import {
    Import,
    TraitReference
} from '.';

/**
 * The folder for CDM folder format.
 */
export abstract class Folder {
    /**
     * The folder name.
     */
    public folderName: string;

    /**
     * The folder explanation.
     */
    public explanation?: string;

    /**
     * The exhibited traits.
     */
    public exhibitsTraits?: (string | TraitReference)[];
}
