import { DocSet, p } from '../internal';


export class DocSetCollection {
    public size: number;
    private docSetMap: Map<number, Set<DocSet>>;
    private docSetCollection: Set<DocSet>;

    constructor() {
        this.docSetMap = new Map<number, Set<DocSet>>();
        this.docSetCollection = new Set<DocSet>();
        this.size = 0;
    }

    public add(newDocSet: DocSet): void {
        // let bodyCode = () =>
        {
            const idSum: number = newDocSet.getIdSum();

            if (!this.docSetMap.has(idSum)) {
                this.docSetMap.set(idSum, new Set<DocSet>());
            }

            // check if the set already exists under that key
            for (const docSet of this.docSetMap.get(idSum)) {
                if (DocSet.isEqual(newDocSet, docSet)) {
                    return;
                }
            }

            // add set that doesn't exist yet
            this.docSetMap.get(idSum).add(newDocSet);
            this.docSetCollection.add(newDocSet);
            this.size++;
        }
        // return p.measure(bodyCode);
    }

    public merge(docColl: DocSetCollection): void {
        // let bodyCode = () =>
        {
            if (docColl && docColl.size > 0) {
                for (const docSet of docColl) {
                    this.add(docSet);
                }
            }
        }
        // return p.measure(bodyCode);
    }

    public copy(): DocSetCollection {
        const newColl: DocSetCollection = new DocSetCollection();
        for (const docSet of this) {
            newColl.add(docSet);
        }

        return newColl;
    }

    // use Set iterator
    public [Symbol.iterator]() {
        return this.docSetCollection[Symbol.iterator]();
    }
}
