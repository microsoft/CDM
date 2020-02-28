// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
