
export class DepthInfo {
    /**
     * The max depth set if the user specified to not use max depth
     */
    public static readonly maxDepthLimit: number = 32;

    /**
     * The maximum depth that we can resolve entity attributes.
     * This value is set in resolution guidance.
     */
    public maxDepth: number;

    /**
     * The current depth that we are resolving at. Each entity attribute that we resolve
     * into adds 1 to depth.
     */
    public currentDepth: number;

    /**
     * Indicates if the maxDepth value has been hit when resolving
     */
    public maxDepthExceeded: boolean;

    public constructor() {
        this.reset();
    }

    /**
     * Resets the instance to its initial values.
     * @internal
     */
    public reset(): void {
        this.currentDepth = 0;
        this.maxDepth = undefined;
        this.maxDepthExceeded = false;
    }

    /**
     * Creates a copy of this depth info instance.
     * @internal
     */
    public copy(): DepthInfo {
        const copy: DepthInfo = new DepthInfo();
        copy.currentDepth = this.currentDepth;
        copy.maxDepth = this.maxDepth;
        copy.maxDepthExceeded = this.maxDepthExceeded;

        return copy;
    }
}
