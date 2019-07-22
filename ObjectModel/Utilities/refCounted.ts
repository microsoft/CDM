export class refCounted {
    public refCnt: number;
    constructor() {
        // let bodyCode = () =>
        {
            this.refCnt = 0;
        }
        // return p.measure(bodyCode);
    }
    public addRef(): void {
        // let bodyCode = () =>
        {
            this.refCnt++;
        }
        // return p.measure(bodyCode);
    }
    public release(): void {
        // let bodyCode = () =>
        {
            this.refCnt--;
        }
        // return p.measure(bodyCode);
    }
}
