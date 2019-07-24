export class friendlyFormatNode {
    public verticalMode: boolean = false;
    public indentChildren: boolean = true;
    public terminateAfterList: boolean = true;
    public lineWrap: boolean = false;
    public forceWrap: boolean = false;
    public bracketEmpty: boolean = false;
    public starter: string;
    public terminator: string;
    public separator: string;
    public comment: string;
    public leafSource: string;
    public layoutWidth: number = 0;
    public children: friendlyFormatNode[];
    public calcStarter: string;
    public calcTerminator: string;
    public calcPreceedingSeparator: string;
    public calcIndentLevel: number;
    public calcNLBefore: boolean;
    public calcNLAfter: boolean;

    constructor(leafSource?: string) {
        this.leafSource = leafSource;
    }
    public addComment(comment: string): void {
        this.comment = comment;
    }
    public addChild(child: friendlyFormatNode): void {
        if (!this.children) {
            this.children = [];
        }
        this.children.push(child);
    }

    public addChildString(source: string, quotes: boolean = false): void {
        if (source) {
            if (quotes) {
                source = `"${source}"`;
            }
            this.addChild(new friendlyFormatNode(source));
        }
    }

    public setDelimiters(): void {
        this.calcStarter = '';
        this.calcTerminator = '';
        this.calcPreceedingSeparator = '';
        if (!this.children && !this.leafSource) {
            if (this.bracketEmpty && this.starter && this.terminator) {
                this.calcStarter = this.starter;
                this.calcTerminator = this.terminator;
            }

            return;
        }

        if (this.starter) {
            this.calcStarter = this.starter;
        }
        if (this.terminator) {
            this.calcTerminator = this.terminator;
        }

        const lChildren: number = this.children ? this.children.length : 0;
        for (let iChild: number = 0; iChild < lChildren; iChild++) {
            const child: friendlyFormatNode = this.children[iChild];
            child.setDelimiters();
            if (iChild > 0 && this.separator) {
                child.calcPreceedingSeparator = this.separator;
            }
        }
    }

    public setWhitespace(indentLevel: number, needsNL: boolean): boolean {
        this.calcIndentLevel = indentLevel;
        const lChildren: number = this.children ? this.children.length : 0;
        let didNL: boolean = false;

        if (this.leafSource) {
            this.calcNLBefore = needsNL;
        }
        for (let iChild: number = 0; iChild < lChildren; iChild++) {
            const child: friendlyFormatNode = this.children[iChild];
            if (this.verticalMode) {
                needsNL = !didNL;
            }

            didNL = child.setWhitespace(indentLevel + ((this.indentChildren && this.verticalMode) ? 1 : 0), needsNL);

            if (!this.verticalMode) {
                needsNL = false;
            }
        }

        if (this.verticalMode) {
            if (needsNL) {
                this.calcNLAfter = true;
                didNL = true;
            }
        }

        return didNL;
    }

    public layout(maxWidth: number, maxMargin: number, start: number, indentWidth: number): [number, number] {

        let position: number = start;
        let firstWrite: number;

        if (this.calcPreceedingSeparator) {
            firstWrite = position;
            position += this.calcPreceedingSeparator.length;
        }

        if (this.calcStarter) {
            firstWrite = firstWrite !== undefined ? firstWrite : position;
            position += this.calcStarter.length;
        }

        if (this.calcNLBefore) {
            position = 0;
            position += this.calcIndentLevel * indentWidth;
            firstWrite = position;
        }

        if (this.children) {
            const lChildren: number = this.children.length;
            let wrapTo: number;
            for (let iChild: number = 0; iChild < lChildren; iChild++) {
                const child: friendlyFormatNode = this.children[iChild];
                if (iChild > 0 && (this.forceWrap || (this.lineWrap && position + child.layoutWidth > maxWidth))) {
                    child.calcNLBefore = true;
                    child.calcIndentLevel = Math.floor((wrapTo + indentWidth) / indentWidth);
                    position = child.calcIndentLevel * indentWidth;
                }
                const childLayout: [number, number] = child.layout(maxWidth, maxMargin, position, indentWidth);
                position = childLayout['0'];
                if (iChild === 0) {
                    wrapTo = childLayout['1'];
                    firstWrite = firstWrite !== undefined ? firstWrite : wrapTo;
                }
            }
        } else if (this.leafSource) {
            firstWrite = firstWrite !== undefined ? firstWrite : position;
            position += this.leafSource.length;
        }

        if (this.calcNLAfter) {
            position = 0;
            firstWrite = firstWrite !== undefined ? firstWrite : position;
        }

        if (this.calcTerminator) {
            if (this.calcNLAfter) {
                position += this.calcIndentLevel * indentWidth;
            }
            firstWrite = firstWrite !== undefined ? firstWrite : position;
            position += this.calcTerminator.length;
            if (this.calcNLAfter) {
                position = 0;
            }
        }

        firstWrite = firstWrite !== undefined ? firstWrite : position;
        this.layoutWidth = position - firstWrite;

        return [position, firstWrite];
    }

    public lineStart(startIndent: number): string {
        let line: string = '';
        while (startIndent) {
            line += ' ';
            startIndent--;
        }

        return line;
    }

    public compose(indentWidth: number): string {

        let compose: string = '';

        compose += this.calcPreceedingSeparator;

        if (this.calcStarter) {
            compose += this.calcStarter;
        }

        if (this.calcNLBefore) {
            compose += '\n';
            compose += this.lineStart(this.calcIndentLevel * indentWidth);
        }

        if (this.children) {
            const lChildren: number = this.children.length;
            for (let iChild: number = 0; iChild < lChildren; iChild++) {
                const child: friendlyFormatNode = this.children[iChild];
                compose += child.compose(indentWidth);
            }
        } else if (this.leafSource) {
            compose += this.leafSource;
        }

        if (this.calcNLAfter) {
            compose += '\n';
        }

        if (this.calcTerminator) {
            if (this.calcNLAfter) {
                compose += this.lineStart(this.calcIndentLevel * indentWidth);
            }
            compose += this.calcTerminator;
            if (this.calcNLAfter) {
                compose += '\n';
            }
        }

        return compose;
    }

    public toString(maxWidth: number, maxMargin: number, startIndent: number, indentWidth: number): string {
        this.setDelimiters();
        this.setWhitespace(0, false);
        this.calcNLBefore = false;
        // layout with a giant maxWidth so that we just measure everything
        this.layout(Number.MAX_SAFE_INTEGER, maxMargin, startIndent, indentWidth);
        // now use the real max
        this.layout(maxWidth, maxMargin, startIndent, indentWidth);

        return this.compose(indentWidth);
    }
}
