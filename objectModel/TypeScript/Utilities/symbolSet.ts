export class SymbolSet {
    private symbolSetCollection: Set<string>;

    constructor() {
        this.symbolSetCollection = new Set<string>();
    }

    public add(newSymbol: string): void {
        this.symbolSetCollection.add(newSymbol);
    }

    /**
     * @internal
     */
    public merge(symSet: SymbolSet): void {
        // let bodyCode = () =>
        {
            if (symSet !== undefined) {
                for (const sym of symSet) {
                    this.symbolSetCollection.add(sym);
                }
            }
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public copy(): SymbolSet {
        const newSet: SymbolSet = new SymbolSet();
        for (const sym of this.symbolSetCollection) {
            newSet.add(sym);
        }

        return newSet;
    }

    /**
     * @internal
     */
    public get size(): number {
        return this.symbolSetCollection.size;
    }

    // use Set iterator
    public [Symbol.iterator]() {
        return this.symbolSetCollection[Symbol.iterator]();
    }
}
