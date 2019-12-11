import { CdmCorpusContext, cdmStatusLevel } from '../../internal';

/**
 * The logger class which contains logic to help format logging messages in a consistent way.
 */
export class Logger {
    public static debug(tag: string, ctx: CdmCorpusContext, message: string, path?: string): void {
        this.log(cdmStatusLevel.progress, ctx, this.formatMessage(tag, message, path));
    }

    public static info(tag: string, ctx: CdmCorpusContext, message: string, path?: string): void {
        this.log(cdmStatusLevel.info, ctx, this.formatMessage(tag, message, path));
    }

    public static warning(tag: string, ctx: CdmCorpusContext, message: string, path?: string): void {
        this.log(cdmStatusLevel.warning, ctx, this.formatMessage(tag, message, path));
    }

    public static error(tag: string, ctx: CdmCorpusContext, message: string, path?: string): void {
        this.log(cdmStatusLevel.error, ctx, this.formatMessage(tag, message, path));
    }

    private static log(level: cdmStatusLevel, ctx: CdmCorpusContext, message: string): void {
        if (ctx !== undefined && ctx.statusEvent !== undefined) {
            ctx.statusEvent(level, message);
        } else {
            throw new Error('Current corpus doesn\'t have an event callback set, please specify your callback (e.g. can be outputed to console or file system)');
        }
    }

    private static formatMessage(tag: string, message: string, path: string = undefined): string {
        return path !== undefined ? `${tag} | ${message} | ${path}` : `${tag} | ${message}`;
    }
}