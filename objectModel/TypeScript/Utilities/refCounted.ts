/**
 * @internal
 */
export class refCounted {
    /**
     * @internal
     */
    public refCnt: number;

    constructor() {
        // let bodyCode = () =>
        {
            this.refCnt = 0;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public addRef(): void {
        // let bodyCode = () =>
        {
            this.refCnt++;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public release(): void {
        // let bodyCode = () =>
        {
            this.refCnt--;
        }
        // return p.measure(bodyCode);
    }
}
