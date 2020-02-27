// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCorpusContext, cdmStatusLevel, resolveContext } from '../../internal';

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

    private static log(
        level: cdmStatusLevel,
        ctx: CdmCorpusContext,
        tag: string,
        message: string,
        path: string,
        defaultStatusEvent: (x: string) => void): void {
        if (level >= ctx.reportAtLevel) {
            const formattedMessage: string = this.formatMessage(tag, message, path);
            if (ctx !== undefined && ctx.statusEvent !== undefined) {
                ctx.statusEvent(level, formattedMessage);
            } else {
                defaultStatusEvent(formattedMessage);
            }
        }
    }

    private static formatMessage(tag: string, message: string, path?: string): string {
        return path !== undefined ? `${tag} | ${message} | ${path}` : `${tag} | ${message}`;
    }
}
