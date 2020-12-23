// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCorpusContext, cdmStatusLevel } from '../../internal';
import * as timeUtils from '../timeUtils';

/**
 * The logger class which contains logic to help format logging messages in a consistent way.
 */
export class Logger {
    private static readonly defaultLogger = console;
    public static debug(tag: string, ctx: CdmCorpusContext, message: string, path?: string): void {
        this.log(cdmStatusLevel.progress, ctx, tag, message, path, this.defaultLogger.debug);
    }

    public static info(tag: string, ctx: CdmCorpusContext, message: string, path?: string): void {
        this.log(cdmStatusLevel.info, ctx, tag, message, path, this.defaultLogger.info);
    }

    public static warning(tag: string, ctx: CdmCorpusContext, message: string, path?: string): void {
        this.log(cdmStatusLevel.warning, ctx, tag, message, path, this.defaultLogger.warn);
    }

    public static error(tag: string, ctx: CdmCorpusContext, message: string, path?: string): void {
        this.log(cdmStatusLevel.error, ctx, tag, message, path, this.defaultLogger.error);
    }

    /**
     * Log to the specified status level by using the status event on the corpus context (if it exists) or to the default logger.
     * The log level, tag, message and path values are also added as part of a new entry to the log recorder.
     * @param level The status level to log to.
     * @param ctx The CDM corpus context.
     * @param tag >The tag, usually the class that is calling the method.
     * @param message The message.
     * @param path The path, usually denotes the class and method calling this method.
     * @param defaultStatusEvent The default status event (log using the default logger).
     */
    private static log(
        level: cdmStatusLevel,
        ctx: CdmCorpusContext,
        tag: string,
        message: string,
        path: string,
        defaultStatusEvent: (x: string) => void): void {
        // Write message to the configured logger
        if (ctx !== undefined) {
            if (level >= ctx.reportAtLevel) {
                // Store a record of the event.
                // Save some dict init and string formatting cycles by checking
                // whether the recording is actually enabled.
                if (ctx.events.isRecording) {
                    let theEvent = new Map<string, string>([
                        ['timestamp', timeUtils.getFormattedDateString(new Date())],
                        ['level', cdmStatusLevel[level]],
                        ['tag', tag],
                        ['message', message],
                        ['path', path]
                    ]);

                    if (ctx.correlationId !== undefined) {
                        theEvent.set('correlationId', ctx.correlationId);
                    }

                    ctx.events.push(theEvent);
                }

                if (ctx.statusEvent !== undefined) {
                    const formattedMessage: string = this.formatMessage(tag, message, path);
                    ctx.statusEvent(level, formattedMessage);
                }
            }
        } else {
            const formattedMessage: string = this.formatMessage(tag, message, path);
            defaultStatusEvent(formattedMessage);
        }
    }

    /**
     * Formats the message into a string.
     * @param tag The tag, usually the class that is calling the method
     * @param message The message.
     * @param path The path, usually denotes the class and method calling this method.
     * @param correlationId Optional correlation ID.
     */
    private static formatMessage(tag: string, message: string, path?: string, correlationId?: string): string {
        path = path !== undefined ? ` | ${path}` : ``;
        correlationId = correlationId !== undefined ? ` | ${correlationId}` : ``;
        return `${tag} | ${message}${path}${correlationId}`;
    }
}

/**
 * Helper struct to keep few needed bits of information about the logging scope.
 * @internal
 */
export class TState {
    tag: string;
    ctx: CdmCorpusContext;
    path: string;

    constructor(tag: string, ctx: CdmCorpusContext, path: string) {
        this.tag = tag;
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

    constructor(state: TState) {
        this.state = state;
        this.state.ctx.events.enable();
        Logger.debug(this.state.tag, this.state.ctx, 'Entering scope', this.state.path);
    }

    /**
     * @override
     */
    dispose(): void {
        Logger.debug(this.state.tag, this.state.ctx, 'Leaving scope', this.state.path);
        this.state.ctx.events.disable();
    }
}

/// <summary>
/// Creates a new LoggerScope instance with the provided details of the scope being entered.
/// To be used at beginning of functions via resource wrapper 'using (...) { // function body }'.
/// </summary>
/// <param name="tag">Tag (class name)</param>
/// <param name="ctx">Corpus context </param>
/// <param name="path">Path (usually method name or document path)</param>
/// <returns>LoggerScope instance</returns>
export function enterScope(tag: string, ctx: CdmCorpusContext, path: string): LoggerScope {
    return new LoggerScope(new TState(tag, ctx, path));
}
