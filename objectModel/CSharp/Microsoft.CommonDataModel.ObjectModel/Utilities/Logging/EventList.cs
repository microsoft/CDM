// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Logging
{
    using System.Collections.Generic;
    using System.Threading;
    using System;

    /// <summary>
    /// EventList is a supporting class for the logging system and allows subset of messages
    /// emitted by the SDK to be collected and inspected by the SDK users. The events are stored
    /// in an ordered list, each element being a dictionary of string keys and string values.
    /// 
    /// Upon completion of the API call, the recorded events can be inspected by the host application
    /// to determine what step to take to address the issue. To simply list all events and their elements,
    /// a simple for-each like this will work:
    /// 
    /// corpus.Ctx.Events.ForEach(
    ///     logEntry => logEntry.ToList().ForEach(
    ///         logEntryPair => Console.WriteLine($"{logEntryPair.Key}={logEntryPair.Value}")
    ///     )
    /// );
    /// 
    /// Note: this class is NOT a replacement for standard logging mechanism employed by the SDK. It serves
    /// specifically to offer immediate post-call context specific diagnostic information for the application
    /// to automate handling of certain common problems, such as invalid file name being supplied, file already
    /// being present on the file-system, etc.
    /// </summary>
    public class EventList : List<Dictionary<string, string>>
    {
        /// <summary>
        /// Specifies whether event recording is enabled or not.
        /// </summary>
        internal bool IsRecording { get; private set; } = false;

        /// <summary>
        /// Counts how many times we entered into nested functions that each enable recording.
        /// We only clear the previously recorded events if the nesting level is at 0.
        /// </summary>
        internal int nestingLevel { get; private set; } = 0;

        /// <summary>
        /// Identifies the outermost level api method called by user.
        /// </summary>
        public Guid ApiCorrelationId { get; private set; }

        /// <summary>
        /// Lock to be used to enter and leave scope.
        /// </summary>
        private SpinLock spinLock;

        public EventList() : base()
        {
            spinLock = new SpinLock(false);
        }

        /// <summary>
        /// Clears the log recorder and enables recoding of log messages.
        /// </summary>
        internal void Enable()
        {
            bool lockTaken = false;
            try
            {
                spinLock.Enter(ref lockTaken);

                // If we are going into nested recorded functions, we should not clear previously recorded events
                if (nestingLevel == 0)
                {
                    Clear();
                    IsRecording = true;
                    ApiCorrelationId = Guid.NewGuid();
                }

                nestingLevel++;
            }
            finally
            {
                if (lockTaken)
                {
                    spinLock.Exit();
                }
            }

        }

        /// <summary>
        /// Disables recording of log messages.
        /// </summary>
        internal void Disable()
        {
            bool lockTaken = false;
            try
            {
                spinLock.Enter(ref lockTaken);
                nestingLevel--;

                if (nestingLevel == 0)
                {
                    IsRecording = false;
                    ApiCorrelationId = Guid.NewGuid();
                }
            }
            finally
            {
                if (lockTaken)
                {
                    spinLock.Exit();
                }
            }
        }

        /// <summary>
        /// Shortcut method to add a new entry to the events. The entry will be added
        /// only if the recording is enabled.
        /// </summary>
        /// <param name="theEvent"></param>
        internal new void Add(Dictionary<string, string> theEvent)
        {
            if (IsRecording)
            {
                bool lockTaken = false;
                try
                {
                    spinLock.Enter(ref lockTaken);
                    base.Add(theEvent);
                }
                finally
                {
                    if (lockTaken)
                    {
                        spinLock.Exit();
                    }
                }
            }
        }
    }
}
