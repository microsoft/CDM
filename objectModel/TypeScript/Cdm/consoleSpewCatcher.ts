// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { spewCatcher } from '../internal';
// tslint:disable:no-console

export class consoleSpewCatcher implements spewCatcher {
    public clear(): void {
        console.clear();
    }
    public spewLine(spew: string): void {
        console.log(spew);
    }
}
