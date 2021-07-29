// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCorpusContext, cdmStatusLevel, cdmLogCode } from '../../internal';
import * as timeUtils from '../timeUtils';
import * as data from '../../resx/logMessages.json';

/**
 * The logger class which contains logic to help format logging messages in a consistent way.
 */
export class Logger {
    private static readonly defaultLogger = console;
    public static debug(ctx: CdmCorpusContext, className: string, method: string, corpusPath: string, message: string): void {
        if (cdmStatusLevel.progress >= ctx.reportAtLevel) {
            this.log(cdmStatusLevel.progress, ctx, className, message, method, this.defaultLogger.debug, corpusPath, cdmLogCode.None);
        }
    }

    public static info(ctx: CdmCorpusContext, className: string, method: string, corpusPath: string, message: string): void {
        if (cdmStatusLevel.progress >= ctx.reportAtLevel) {
            this.log(cdmStatusLevel.info, ctx, className, message, method, this.defaultLogger.info, corpusPath, cdmLogCode.None);
        }
    }

    public static warning(ctx: CdmCorpusContext, className: string, method: string, corpusPath: string, code: cdmLogCode, ...args: any[]): void {
        if (cdmStatusLevel.warning >= ctx.reportAtLevel) {
            // Get message from resource for the code enum.
            var message: string = this.getMessageFromResourceFile(code, args);
            this.log(cdmStatusLevel.warning, ctx, className, message, method, this.defaultLogger.warn, corpusPath, code);
        }
    }

    public static error(ctx: CdmCorpusContext, className: string, method: string, corpusPath: string, code: cdmLogCode, ...args: any[]): void {
        if (cdmStatusLevel.error >= ctx.reportAtLevel) {
            // Get message from resource for the code enum.
            var message: string = this.getMessageFromResourceFile(code, args);
            this.log(cdmStatusLevel.error, ctx, className, message, method, this.defaultLogger.error, corpusPath, code);
        }
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
          code: cdmLogCode): void {
          // Write message to the configured logger
          if (ctx !== undefined) {

              if (ctx.suppressedLogCodes.has(code))
                return;

              // Store a record of the event.
              // Save some dict init and string formatting cycles by checking
              // whether the recording is actually enabled.
              if (ctx.events.isRecording) {
                  let theEvent = new Map<string, string>([
                      ['timestamp', timeUtils.getFormattedDateString(new Date())],
                      ['level', cdmStatusLevel[level]],
                      ['class', className],
                      ['message', message],
                      ['method', method]
                  ]);

                  if (cdmStatusLevel.error == level || cdmStatusLevel.warning == level) {
                      theEvent.set('code', cdmLogCode[code]);
                  }

                  if (ctx.correlationId !== undefined) {
                      theEvent.set('cid', ctx.correlationId);
                  }

                  if (corpusPath !== null) {
                      theEvent.set('path', corpusPath);
                  }

                  ctx.events.push(theEvent);
              }

              if (ctx.statusEvent !== undefined) {
                  const formattedMessage: string = this.formatMessage(className, message, method, ctx.correlationId, corpusPath);
                  ctx.statusEvent(level, formattedMessage);
              }
          } else {
              const formattedMessage: string = this.formatMessage(className, message, method, ctx.correlationId, corpusPath);
              defaultStatusEvent(formattedMessage);
          }
      }

    /**
     * Formats the message into a string.
     * @param code The code, usually the enum code assigned to log message
     * @param args The args, ussually have values which would be inserted into the messages 
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
        corpusPath = corpusPath !== null ? ` | ${corpusPath}` : ``;
        return `${className} | ${message}${method}${correlationId}${corpusPath}`;
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

    constructor(state: TState) {
        this.state = state;
        this.state.ctx.events.enable();
        this.Time = new Date();
        Logger.debug(this.state.ctx, this.state.className, this.state.path, null, 'Entering scope');
    }

    /**
     * @override
     */
    dispose(): void {
        Logger.debug(this.state.ctx, this.state.className, this.state.path, null, `Leaving scope. Time elapsed: ${(new Date()).valueOf() - this.Time.valueOf()} ms`);
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
