
export class AttributeResolutionDirectiveSet {
    public set: Set<string>;
    public setRemoved: Set<string>;
    public sortedTag: string;
    constructor(set?: Set<string>) {
        if (set) {
            this.set = new Set<string>(set);
        }
    }
    public copy(): AttributeResolutionDirectiveSet {
        const result: AttributeResolutionDirectiveSet = new AttributeResolutionDirectiveSet();
        if (this.set) {
            result.set = new Set<string>(this.set);
        }
        if (this.setRemoved) {
            result.setRemoved = new Set<string>(this.setRemoved);
        }
        result.sortedTag = this.sortedTag;

        return result;
    }
    public has(directive: string): boolean {
        if (this.set) {
            return this.set.has(directive);
        }

        return false;
    }
    public add(directive: string): void {
        if (!this.set) {
            this.set = new Set<string>();
        }
        // once explicitly removed from a set, never put it back.
        if (this.setRemoved && this.setRemoved.has(directive)) {
            return;
        }
        this.set.add(directive);
        this.sortedTag = undefined;
    }

    public delete(directive: string): void {
        if (!this.setRemoved) {
            this.setRemoved = new Set<string>();
        }
        this.setRemoved.add(directive);
        if (this.set) {
            if (this.set.has(directive)) {
                this.set.delete(directive);
            }
        }
        this.sortedTag = undefined;
    }

    public merge(directives: AttributeResolutionDirectiveSet): void {
        if (directives) {
            if (directives.setRemoved) {
                // copy over the removed list first
                directives.setRemoved.forEach((d: string) => {
                    this.delete(d);
                });
            }
            if (directives.set) {
                directives.set.forEach((d: string) => {
                    this.add(d);
                });
            }
            this.sortedTag = undefined;
        }
    }
    public getTag(): string {
        if (this.sortedTag === undefined) {
            if (this.set && this.set.size) {
                this.sortedTag = '';
                const sorted: string[] = Array.from(this.set)
                    .sort();
                sorted.forEach((d: string) => {
                    this.sortedTag += `-${d}`;
                });
            }
        }

        if (this.sortedTag) {
            return this.sortedTag;
        }

        return '';
    }
}
