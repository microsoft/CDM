// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { cdmStatusLevel } from '../internal';

export type EventCallback = (level: cdmStatusLevel, msg: string) => void;
