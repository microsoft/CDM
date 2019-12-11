import { FileStatus, TraitReference } from '.';

/**
 * abstract class for a key value pair in typescript.
 */
export abstract class KeyValPair {
    public name: string;
    public value: string;
}

export abstract class DataPartition implements FileStatus {
    /**
     * Gets or sets the name of the data partition.
     */
    public name: string;

    /**
     * The corpus path for the data file location.
     */
    public location: string;

    /**
     * The exhibited traits.
     */
    public exhibitsTraits?: (string | TraitReference)[];

    /**
     * The list of key value pairs to give names for the replacement values from the RegEx.
     */
    public arguments?: KeyValPair[];

    /**
     * The path of a specialized schema to use specifically for the partitions generated.
     */
    public specializedSchema?: string;

    /**
     * Last time the modified times were updated
     */
    public lastFileStatusCheckTime: string;

    /**
     * Last time this file was modified
     */
    public lastFileModifiedTime: string;

    /**
     * Last time the most recently modified child object was modified
     */
    public lastChildFileModifiedTime?: string;
}
