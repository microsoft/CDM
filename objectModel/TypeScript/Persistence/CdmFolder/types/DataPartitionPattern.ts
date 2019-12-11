import { FileStatus, TraitReference } from '.';

/**
 * The representation of data partition pattern in the CDM Folders format.
 */
export abstract class DataPartitionPattern implements FileStatus {
    /**
     * The name for the pattern.
     */
    public name: string;

    /**
     * The explanation for the pattern.
     */
    public explanation?: string;

    /**
     * The starting location corpus path for searching for inferred data partitions.
     */
    public rootLocation: string;

    /**
     * The regular expression to use for searching partitions.
     */
    public regularExpression?: string;

    /**
     * The names for replacement values from regular expression.
     */
    public parameters?: string[];

    /**
     * The corpus path for specialized schema to use for matched pattern partitions.
     */
    public specializedSchema?: string;

    /**
     * The exhibited traits.
     */
    public exhibitsTraits?: (string | TraitReference)[];

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
