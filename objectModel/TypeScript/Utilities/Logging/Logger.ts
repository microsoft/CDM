// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCorpusContext, CdmEntityDefinition, cdmLogCode, CdmManifestDefinition, cdmStatusLevel, StorageAdapterBase } from '../../internal';
import * as timeUtils from '../timeUtils';
import { StorageUtils } from '../StorageUtils';
import * as data from '../../resx/logMessages.json';

/**
 * The logger class which contains logic to help format logging messages in a consistent way.
 */
export class Logger {
    private static readonly defaultLogger = console;
    public static debug(ctx: CdmCorpusContext, className: string, method: string, corpusPath: string, 
        message: string, ingestTelemetry: boolean = false): void {

        this.log(cdmStatusLevel.progress, ctx, className, message, method, this.defaultLogger.debug, 
            corpusPath, cdmLogCode.None, ingestTelemetry);
    }

    public static info(ctx: CdmCorpusContext, className: string, method: string, corpusPath: string, message: string): void {
        this.log(cdmStatusLevel.info, ctx, className, message, method, this.defaultLogger.info, corpusPath, cdmLogCode.None);
    }

    public static warning(ctx: CdmCorpusContext, className: string, method: string, corpusPath: string, code: cdmLogCode, ...args: any[]): void {
        // Get message from resource for the code enum.
        var message: string = this.getMessageFromResourceFile(code, args);
        this.log(cdmStatusLevel.warning, ctx, className, message, method, this.defaultLogger.warn, corpusPath, code);
    }

    public static error(ctx: CdmCorpusContext, className: string, method: string, corpusPath: string, code: cdmLogCode, ...args: any[]): void {
        // Get message from resource for the code enum.
        var message: string = this.getMessageFromResourceFile(code, args);
        this.log(cdmStatusLevel.error, ctx, className, message, method, this.defaultLogger.error, corpusPath, code);
}

     /**
     * Log to the specified status level by using the status event on the corpus context (if it exists) or to the default logger.
     * The log level, className, message and path values are also added as part of a new entry to the log recorder.
     * @param level The status level to log to.
     * @param ctx The CDM corpus context.
     * @param className >The className, usually the class that is calling the method.
     * @param message The message.
     * @param method The path, usually denotes method calling this method.
     * @param defaultStatusEvent The default status event (log using the default logger).
     * @param corpusPath The corpusPath, denotes the corpus path of document.
     * @param cdmLogCode The code, denotes the code enum for a message.
     */
    private static log(
        level: cdmStatusLevel,
        ctx: CdmCorpusContext,
        className: string,
        message: string,
        method: string,
        defaultStatusEvent: (x: string) => void,
        corpusPath: string,
        code: cdmLogCode,
        ingestTelemetry: boolean = false): void {
        // Write message to the configured logger
        if (ctx !== undefined) {
            if (ctx.suppressedLogCodes.has(code))
                return;

            if (level >= ctx.reportAtLevel) {
                const timestamp: string = timeUtils.getFormattedDateString(new Date());

                // Store a record of the event.
                // Save some dict init and string formatting cycles by checking
                // whether the recording is actually enabled.
                if (ctx.events.isRecording) {
                    let theEvent = new Map<string, string>([
                        ['timestamp', timestamp],
                        ['level', cdmStatusLevel[level]],
                        ['class', className],
                        ['message', message],
                        ['method', method]
                    ]);

                    if (cdmStatusLevel.error === level || cdmStatusLevel.warning === level) {
                        theEvent.set('code', cdmLogCode[code]);
                    }

                    if (ctx.correlationId !== undefined) {
                        theEvent.set('cid', ctx.correlationId);
                    }

                    if (corpusPath !== undefined) {
                        theEvent.set('path', corpusPath);
                    }

                    ctx.events.push(theEvent);
                }

                if (ctx.statusEvent !== undefined) {
                    const formattedMessage: string = this.formatMessage(className, message, method, ctx.correlationId, corpusPath);
                    ctx.statusEvent(level, formattedMessage);
                }

                // Ingest the logs into telemetry database
                if (ctx.corpus.telemetryClient !== undefined) {
                    ctx.corpus.telemetryClient.addToIngestionQueue(timestamp, level, className, method, corpusPath, message, ingestTelemetry, code)
                }
            }
        } else {
            const formattedMessage: string = this.formatMessage(className, message, method, ctx.correlationId, corpusPath);
            defaultStatusEvent(formattedMessage);
        }
    }
    /**
     * Formats the message into a string.
     * @param code The code, usually the enum code assigned to log message
     * @param args The args, usually have values which would be inserted into the messages 
     */
    private static getMessageFromResourceFile(code: cdmLogCode, args: any[]): string {
        var retstr: string = data[cdmLogCode[code]];
        var i: number = 0;
        for (let x of args) {
            const str: string = "{" + i + "}";
            retstr = retstr.replace(str, x);
            i = i + 1;
        }
        return retstr
    }
    /**
     * Formats the message into a string.
     * @param className The className, usually the class that is calling the method
     * @param message The message.
     * @param path The path, usually denotes the class and method calling this method.
     * @param correlationId Optional correlation ID.
     */
    private static formatMessage(className: string, message: string, method?: string, correlationId?: string, corpusPath?: string): string {
        method = method !== undefined ? ` | ${method}` : ``;
        correlationId = correlationId !== undefined ? ` | ${correlationId}` : ``;
        corpusPath = corpusPath !== undefined ? ` | ${corpusPath}` : ``;
        return `${className} | ${message}${method}${correlationId}${corpusPath}`;
    }

    public static ingestManifestTelemetry(manifest: CdmManifestDefinition, ctx: CdmCorpusContext, className: string, 
        method: string, corpusPath: string): void {
        if (ctx.corpus.telemetryClient === undefined) {
            return;
        }

        // Get the namespace of the storage for the manifest
        let storageNamespace: string = manifest.namespace;

        if (storageNamespace === undefined) {
            storageNamespace = manifest.ctx.corpus.storage.defaultNamespace;
        }

        // Get storage adapter type
        const adapter: StorageAdapterBase = manifest.ctx.corpus.storage.fetchAdapter(storageNamespace);
        const adapterType: string = typeof (adapter);

        let message = `ManifestStorage:${adapterType};`;

        const manifestInfo: Map<string, number> = new Map<string, number>();

        manifestInfo.set('RelationshipNum', manifest.relationships.length);

        const entityNum: number = manifest.entities.length;
        manifestInfo.set('EntityNum', entityNum);

        // Counts the total number partitions in the manifest
        let partitionNum: number = 0;

        // Counts the number of different partition patterns in all the entities
        let partitionGlobPatternNum: number = 0;
        let partitionRegExPatternNum: number = 0;

        // Counts the number of standard entities
        let standardEntityNum: number = 0;

        // Get detailed info for each entity
        for (const entityDec of manifest.entities) {
            // Get data partition info, if any
            if (entityDec.dataPartitions !== undefined && entityDec.dataPartitions !== undefined) {
                partitionNum += entityDec.dataPartitions.length;

                for (const pattern of entityDec.dataPartitionPatterns) {
                    // If both globPattern and regularExpression is set, globPattern will be used.
                    if (pattern.globPattern !== undefined && pattern.globPattern !== undefined) {
                        partitionGlobPatternNum++;
                    } else if (pattern.regularExpression !== undefined && pattern.regularExpression !== undefined) {
                        partitionRegExPatternNum++;
                    }
                }
            }

            // Check if entity is standard
            const entityNamespace: string = StorageUtils.splitNamespacePath(entityDec.entityPath)[0];

            if (entityNamespace === 'cdm') {
                standardEntityNum++;
            }
        }

        // Add all cumulated entity info
        manifestInfo.set('PartitionNum', partitionNum);
        manifestInfo.set('PartitionGlobPatternNum', partitionGlobPatternNum);
        manifestInfo.set('PartitionRegExPatternNum', partitionRegExPatternNum);
        manifestInfo.set('StandardEntityNum', standardEntityNum);
        manifestInfo.set('CustomEntityNum', entityNum - standardEntityNum);

        // Serialize manifest info dictionary
        message += this.serializeMap(manifestInfo);

        this.debug(ctx, className, method, corpusPath, `Manifest Info: {${message}}`, true);
    }

    /**
     * Construct a message for the input entity data and log the message.
     * @param entity The entity to be logged.
     * @param ctx The CDM corpus context.
     * @param className Usually the class that is calling the method.
     * @param method Usually denotes method calling this method.
     * @param corpusPath Usually denotes corpus path of document.
     */
    public static ingestEntityTelemetry(entity: CdmEntityDefinition, ctx: CdmCorpusContext, className: string, method: string, corpusPath: string): void {
        if (ctx.corpus.telemetryClient === undefined) {
            return;
        }

        // Get entity storage namespace
        let entityNamespace: string = entity.inDocument.namespace;

        if (entityNamespace === undefined) {
            entityNamespace = entity.ctx.corpus.storage.defaultNamespace;
        }

        // Get storage adapter type
        const adapter: StorageAdapterBase = entity.ctx.corpus.storage.fetchAdapter(entityNamespace);
        const adapterType: string = typeof (adapter);

        let message: string = `EntityStorage:${adapterType};EntityNamespace:${entityNamespace};`

        // Collect all entity info
        const entityInfo: Map<string, number> = this.formEntityInfoDict(entity);

        message += this.serializeMap(entityInfo);

        this.debug(ctx, className, method, corpusPath, `Entity Info: {${message}}`, true);
    }

    /**
     * Construct a message consisting of all the information about the input entity.
     * @param entity The entity to be logged.
     * @return A dictionary containing all entity info.
     */
    private static formEntityInfoDict(entity: CdmEntityDefinition): Map<string, number> {
        const entityInfo: Map<string, number> = new Map<string, number>();

        // Check whether entity is resolved
        let isResolved: number = 0;

        if (entity.attributeContext !== undefined) {
            isResolved = 1;
        }

        entityInfo.set('ResolvedEntity', isResolved);
        entityInfo.set('ExhibitsTraitNum', entity.exhibitsTraits.length);
        entityInfo.set('AttributeNum', entity.attributes.length);

        // The number of traits whose name starts with 'means.'
        let semanticsTraitNum: number = 0;

        for (const trait of entity.exhibitsTraits) {
            if (trait.fetchObjectDefinitionName().startsWith('means.')) {
              semanticsTraitNum++;
            }
        }
      
        entityInfo.set('SemanticsTraitNum', semanticsTraitNum);      

        return entityInfo;
    }

    /**
     * Serialize the map and return a string.
     * @param map The map object to be serialized.
     * @return The serialized map.
     */
    private static serializeMap(map: Map<string, number>): string {
        let mapAsString: string = '';

        for (const key of map.keys()) {
            mapAsString += `${key}:${map.get(key)};`
        }

        return mapAsString;
    }
}

/**
 * Helper struct to keep few needed bits of information about the logging scope.
 * @internal
 */
export class TState {
    className: string;
    ctx: CdmCorpusContext;
    path: string;

    constructor(className: string, ctx: CdmCorpusContext, path: string) {
        this.className = className;
        this.ctx = ctx;
        this.path = path;
    }    
}

/**
 * LoggerScope class is responsible for enabling/disabling event recording 
 * and will log the scope entry/exit debug events.
 * @internal
 */
export class LoggerScope {
    private readonly state: TState;
    private Time: Date;
    private isTopLevelMethod: boolean = false;

    constructor(state: TState) {
        this.state = state;
        this.state.ctx.events.enable();
        this.Time = new Date();

        // check if the method is at the outermost level
        if (state.ctx.events.nestingLevel === 1) {
            this.isTopLevelMethod = true;
        }

        Logger.debug(this.state.ctx, this.state.className, this.state.path, undefined, 'Entering scope');
    }

    /**
     * @override
     */
    dispose(): void {
        const message: string = `Leaving scope. Time elapsed: ${(new Date()).valueOf() - this.Time.valueOf()} ms.`;

        // Commenting out to keep consistent with C#
        // In C# - Cache is a concurrent dict, and getting the Count on it is getting blocked by other cache updates
        // const message: string = `Leaving scope. Time elapsed: ${(new Date()).valueOf() - this.Time.valueOf()} ms; Cache memory used: ${(this.state.ctx as resolveContext).attributeCache.size}.`;
        
        Logger.debug(this.state.ctx, this.state.className, this.state.path, undefined, message, this.isTopLevelMethod);
        
        this.state.ctx.events.disable();
    }
}

/// <summary>
/// Creates a new LoggerScope instance with the provided details of the scope being entered.
/// To be used at beginning of functions via resource wrapper 'using (...) { // function body }'.
/// </summary>
/// <param name="className">className (class name)</param>
/// <param name="ctx">Corpus context </param>
/// <param name="path">Path (usually method name or document path)</param>
/// <returns>LoggerScope instance</returns>
export function enterScope(className: string, ctx: CdmCorpusContext, path: string): LoggerScope {
    return new LoggerScope(new TState(className, ctx, path));
}
