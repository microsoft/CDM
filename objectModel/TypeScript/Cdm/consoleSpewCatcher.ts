import { spewCatcher } from '../internal';
// tslint:disable:no-console

export class consoleSpewCatcher implements spewCatcher {
    public clear(): void {
        console.clear();
    }
    public spewLine(spew: string): void {
        console.log(spew);
    }
}
