import { DocumentImpl } from '../internal';

export class DocSet {
    public size: number;
    private docSet: Set<DocumentImpl>;
    private idSet: Set<number>;
    private idSum: number;

    constructor(set?: Iterable<DocumentImpl>) {
        this.docSet = new Set<DocumentImpl>();
        this.idSet = new Set<number>();
        this.size = 0;
        this.idSum = 0;

        if (set) {
            for (const doc of set) {
                this.add(doc);
            }
        }
    }

    public static isEqual(set1: DocSet, set2: DocSet): boolean {
        // let bodyCode = () =>
        {
            if (set1 && set2 && set1.size === set2.size) {
                for (const num of set1.idSet) {
                    if (!set2.idSet.has(num)) {
                        return false;
                    }
                }

                return true;
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    public copy(): DocSet {
        // let bodyCode = () =>
        {
            const copySet: DocSet = new DocSet();
            for (const doc of this) {
                copySet.add(doc);
            }

            return copySet;
        }
        // return p.measure(bodyCode);
    }

    public add(doc: DocumentImpl): void {
        // let bodyCode = () =>
        {
            if (!this.idSet.has(doc.ID)) {
                this.docSet.add(doc);
                this.idSet.add(doc.ID);
                this.size++;
                this.idSum += doc.ID;
            }
        }
        // return p.measure(bodyCode);
    }

    public has(doc: DocumentImpl): boolean {
        return this.idSet.has(doc.ID);
    }

    public getIdSum(): number {
        return this.idSum;
    }

    // use Set iterator
    public [Symbol.iterator]() {
        return this.docSet[Symbol.iterator]();
    }
}
