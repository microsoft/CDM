# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

class EventList(list):
    """
    EventList is a supporting class for the logging system and allows subset of messages
    emitted by the SDK to be collected and inspected by the SDK users. The events are stored
    in an ordered list, each element being a dictionary of string keys and string values.

    Upon completion of the API call, the recorded events can be inspected by the host application
    to determine what step to take to address the issue. To simply list all events and their elements,
    a simple for-each like this will work:

        for log_entry in corpus.ctx.events:
            for log_entry_key in log_entry:
                print(log_entry_key + '=' + (log_entry[log_entry_key]) if log_entry[log_entry_key] else '')
            print()

    Note: this class is NOT a replacement for standard logging mechanism employed by the SDK. It serves
    specifically to offer immediate post-call context specific diagnostic information for the application
    to automate handling of certain common problems, such as invalid file name being supplied, file already
    being present on the file-system, etc.
    """

    def __init__(self) -> None:
        self.is_recording = False  # type: bool
        self.nesting_level = 0  # type: int
        list.__init__(self)

    def _enable(self) -> None:
        if self.nesting_level == 0:
            super().clear()
            self.is_recording = True

        self.nesting_level += 1

    def _disable(self) -> None:
        self.nesting_level -= 1

        if self.nesting_level == 0:
            self.is_recording = False

    def __add__(self, x):
        return super().__add__(x)
