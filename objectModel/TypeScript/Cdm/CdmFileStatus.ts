import { CdmObject } from '../internal';

export interface CdmFileStatus extends CdmObject {
    /**
     * Last time the modified times were updated
     */
    lastFileStatusCheckTime: Date;

    /**
     * Last time this file was modified according to the OM
     */
    lastFileModifiedTime: Date;

    /**
     * Last time the most recently modified child object was modified
     */
    lastChildFileModifiedTime?: Date;

    /**
     * Checks the modified time for this object and any children
     */
    fileStatusCheckAsync(): Promise<void>;

    /**
     * Report most recent modified time (of current or children objects) to the parent object
     */
    reportMostRecentTimeAsync(childTime: Date): Promise<void>;
}
