
export class DepthInfo {
    /**
     * The default depth that we travel before forcing a foreign key attribute
     */
    public static readonly defaultMaxDepth: number = 2;

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
}
