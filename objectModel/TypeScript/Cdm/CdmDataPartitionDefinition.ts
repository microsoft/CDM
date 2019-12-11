import {
    CdmCorpusContext,
    CdmFileStatus,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    resolveOptions,
    traitToPropertyMap,
    VisitCallback
} from '../internal';
import { KeyValPair } from '../Persistence/CdmFolder/types';
import * as timeUtils from '../Utilities/timeUtils';

/**
 *  The object model implementation for Data Partition.
 */
export class CdmDataPartitionDefinition extends CdmObjectDefinitionBase implements CdmDataPartitionDefinition, CdmFileStatus {
    /**
     * @inheritdoc
     */
    public name: string;

    /**
     * @inheritdoc
     */
    public location: string;

    /**
     * @inheritdoc
     */
    public inferred: boolean;

    /**
     * @inheritdoc
     */
    public refreshTime: Date;

    /**
     * @inheritdoc
     */
    public arguments?: KeyValPair[];

    /**
     * @inheritdoc
     */
    public lastFileStatusCheckTime: Date;

    /**
     * @inheritdoc
     */
    public lastFileModifiedTime: Date;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.dataPartitionDef;
    }

    /**
     * @inheritdoc
     */
    public specializedSchema?: string;

    private readonly traitToPropertyMap: traitToPropertyMap;

    /**
     * Initializes a new instance of Data Partition.
     * @param ctx The context.
     */
    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx);
        this.name = name;
        this.objectType = cdmObjectType.dataPartitionDef;
        this.arguments = [];
        this.inferred = false;
        this.traitToPropertyMap = new traitToPropertyMap(this);
    }

    public get description(): string {
        return this.traitToPropertyMap.fetchPropertyValue('description') as string;
    }

    public set description(val: string) {
        this.traitToPropertyMap.updatePropertyValue('description', val);
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.dataPartitionDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        return !!this.location;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmDataPartitionDefinition {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }

        let copy: CdmDataPartitionDefinition;
        if (!host) {
            copy = new CdmDataPartitionDefinition(this.ctx, this.name);
        } else {
            copy = host as CdmDataPartitionDefinition;
            copy.ctx = this.ctx;
            copy.name = this.name;
        }

        copy.description = this.description;
        copy.location = this.location;
        copy.lastFileStatusCheckTime = this.lastFileStatusCheckTime;
        copy.lastFileModifiedTime = this.lastFileModifiedTime;
        copy.inferred = this.inferred;
        copy.arguments = this.arguments;
        copy.specializedSchema = this.specializedSchema;
        this.copyDef(resOpt, copy);

        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return this.name;
    }

    /**
     * @inheritdoc
     */
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        let path: string = '';
        if (this.ctx.corpus.blockDeclaredPathChanges === false) {
            path = this.declaredPath;
            if (!path) {
                let thisName: string = this.getName();
                if (!thisName) {
                    thisName = 'UNNAMED';
                }
                path = pathFrom + thisName;
                this.declaredPath = path;
            }
        }

        if (preChildren && preChildren(this, path)) {
            return false;
        }

        if (this.visitDef(path, preChildren, postChildren)) {
            return true;
        }

        if (postChildren && postChildren(this, path)) {
            return false;
        }

        return false;
    }

    /**
     * @inheritdoc
     */
    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }

        return false;
    }

    /**
     * @inheritdoc
     */
    public async fileStatusCheckAsync(): Promise<void> {
        const fullPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(this.location, this.inDocument);

        const modifiedTime: Date = await this.ctx.corpus.getLastModifiedTimeFromPartitionPath(fullPath);

        // update modified times
        this.lastFileStatusCheckTime = new Date();
        this.lastFileModifiedTime = (modifiedTime !== undefined) ? timeUtils.maxTime(modifiedTime, this.lastFileModifiedTime)
            : this.lastFileModifiedTime;
        await this.reportMostRecentTimeAsync(this.lastFileModifiedTime);
    }

    /**
     * @inheritdoc
     */
    public async reportMostRecentTimeAsync(childTime: Date): Promise<void> {
        if ((this.owner as CdmFileStatus).reportMostRecentTimeAsync && childTime) {
            await (this.owner as CdmFileStatus).reportMostRecentTimeAsync(childTime);
        }
    }
}
