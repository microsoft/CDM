import { CdmCorpusContext, cdmStatusLevel } from '../../internal';

/**
 * The logger class which contains logic to help format logging messages in a consistent way.
 */
export class Logger {
    private static readonly defaultLogger = console;
    private static readonly level: cdmStatusLevel = cdmStatusLevel.info;
    public static debug(tag: string, ctx: CdmCorpusContext, message: string, path?: string): void {
        this.log(cdmStatusLevel.progress, ctx, this.formatMessage(tag, message, path), this.defaultLogger.debug);
    }

    public static info(tag: string, ctx: CdmCorpusContext, message: string, path?: string): void {
        this.log(cdmStatusLevel.info, ctx, this.formatMessage(tag, message, path), this.defaultLogger.info);
    }

    public static warning(tag: string, ctx: CdmCorpusContext, message: string, path?: string): void {
        this.log(cdmStatusLevel.warning, ctx, this.formatMessage(tag, message, path), this.defaultLogger.warn);
    }

    public static error(tag: string, ctx: CdmCorpusContext, message: string, path?: string): void {
        this.log(cdmStatusLevel.error, ctx, this.formatMessage(tag, message, path), this.defaultLogger.error);
    }

    private static log(level: cdmStatusLevel, ctx: CdmCorpusContext, message: string, defaultStatusEvent: (x: string) => void): void {
        if (level >= ctx.reportAtLevel) {
            if (ctx !== undefined && ctx.statusEvent !== undefined) {
                ctx.statusEvent(level, message);
            } else if (level >= this.level) {
                defaultStatusEvent(message);
            }
        }
    }

    private static formatMessage(tag: string, message: string, path?: string): string {
        return path !== undefined ? `${tag} | ${message} | ${path}` : `${tag} | ${message}`;
    }
}
