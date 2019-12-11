import {
    CdmAttributeContext,
    CdmCollection,
    CdmCorpusContext,
    CdmDataPartitionDefinition,
    CdmDataPartitionPatternDefinition,
    CdmEntityDeclarationDefinition,
    CdmFileStatus,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    ResolvedAttributeSetBuilder,
    ResolvedTraitSetBuilder,
    resolveOptions,
    VisitCallback
} from '../internal';
import * as timeUtils from '../Utilities/timeUtils';

/**
 * The object model implementation for referenced entity declaration.
 */
export class CdmReferencedEntityDeclarationDefinition extends CdmObjectDefinitionBase implements CdmEntityDeclarationDefinition {
    /**
     * @inheritdoc
     */
    public entityName: string;

    public entityPath: string;

    public dataPartitions: CdmCollection<CdmDataPartitionDefinition>;

    public dataPartitionPatterns: CdmCollection<CdmDataPartitionPatternDefinition>;

    /**
     * @inheritdoc
     */
    public lastFileStatusCheckTime: Date;

    /**
     * @inheritdoc
     */
    public lastFileModifiedTime: Date;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.referencedEntityDeclarationDef;
    }

    /**
     * Initializes a new instance of referenced entity declaration.
     * @param ctx The context.
     * @param entityName The entity name.
     */
    constructor(ctx: CdmCorpusContext, entityName: string) {
        super(ctx);

        this.objectType = cdmObjectType.referencedEntityDeclarationDef;
        this.entityName = entityName;

    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.referencedEntityDeclarationDef;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }

        let copy: CdmReferencedEntityDeclarationDefinition;
        if (!host) {
            copy = new CdmReferencedEntityDeclarationDefinition(this.ctx, this.entityName);
        } else {
            copy = host as CdmReferencedEntityDeclarationDefinition;
            copy.ctx = this.ctx;
            copy.entityName = this.entityName;
        }
        copy.entityPath = this.entityPath;
        copy.lastFileStatusCheckTime = this.lastFileStatusCheckTime;
        copy.lastFileModifiedTime = this.lastFileModifiedTime;
        this.copyDef(resOpt, copy);

        return copy;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        return this.entityName && this.entityPath ? true : false;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return this.entityName;
    }

    /**
     * @inheritdoc
     */
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
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
     * @internal
     * @inheritdoc
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        this.constructResolvedTraitsDef(undefined, rtsb, resOpt);
    }

    /**
     * @internal
     * @inheritdoc
     */
    public constructResolvedAttributes(resOpt: resolveOptions, under?: CdmAttributeContext): ResolvedAttributeSetBuilder {
        return undefined;
    }

    /**
     * @inheritdoc
     */
    public async fileStatusCheckAsync(): Promise<void> {
        const fullPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(this.entityPath, this.inDocument);
        const modifiedTime: Date = await this.ctx.corpus.computeLastModifiedTimeAsync(fullPath, this);

        this.lastFileStatusCheckTime = new Date();
        this.lastFileModifiedTime = timeUtils.maxTime(modifiedTime, this.lastFileModifiedTime);

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
