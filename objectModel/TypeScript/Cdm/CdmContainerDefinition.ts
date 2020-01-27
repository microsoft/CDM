import { CdmObject } from '../internal';

export interface CdmContainerDefinition extends CdmObject {
    /**
     * The namespace where this object can be found
     */
    namespace: string;

    /**
     * The folder where this object exists
     */
    folderPath: string;
}
