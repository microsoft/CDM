// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Guid } from 'guid-typescript';

/**
    EventList is a supporting class for the logging system and allows subset of messages
    emitted by the SDK to be collected and inspected by the SDK users. The events are stored
    in an ordered list, each element being a dictionary of string keys and string values.

    Upon completion of the API call, the recorded events can be inspected by the host application
    to determine what step to take to address the issue. To simply list all events and their elements,
    a simple for-each like this will work:

    corpus.Ctx.Events.ForEach(
        logEntry => logEntry.ToList().ForEach(
            logEntryPair => Console.WriteLine($"{logEntryPair.Key}={logEntryPair.Value}")
        )
    );

    Note: this class is NOT a replacement for standard logging mechanism employed by the SDK. It serves
    specifically to offer immediate post-call context specific diagnostic information for the application
    to automate handling of certain common problems, such as invalid file name being supplied, file already
    being present on the file-system, etc.
 */
export class EventList {
    get length(): number {
        return this.allItems.length;
    }
    
    /**
     * Specifies whether event recording is enabled or not.
     */
    isRecording: boolean;

    /**
     * @internal
     * Counts how many times we entered into nested functions that each enable recording.
     * We only clear the previously recorded events if the nesting level is at 0.
     */
    public nestingLevel: number;

    /**
     * Identifies the outermost level api method called by user.
     */
    public apiCorrelationId: Guid;

    allItems: Map<string, string>[];

    constructor() {
        this.isRecording = false;
        this.nestingLevel = 0;
        this.allItems = [];
    }

    /**
     * Clears the log recorder and enables recoding of log messages.
     */
    enable(): void {
        // If we are going into nested recorded functions, we should not clear previously recorded events
        if (this.nestingLevel === 0) {
            this.allItems = [];
            this.isRecording = true;
            this.apiCorrelationId = Guid.create();
        }

        this.nestingLevel++;
    }

    /**
     * Disables recording of log messages.
     */
    disable(): void {
        this.nestingLevel--;

        if (this.nestingLevel === 0) {
            this.isRecording = false;
            this.apiCorrelationId = Guid.create();
        }
    }

    /**
     * Shortcut method to add a new entry to the events. The entry will be added
     * only if the recording is enabled.
     * @param theEvent 
     */
    push(theEvent: Map<string, string>): void {
        if (this.isRecording) {
            this.allItems.push(theEvent);
        }
    }
}
