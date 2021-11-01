# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from .file_format_settings import FileFormatSettings


class CsvFormatSettings(FileFormatSettings):
    """
    CSV file format settings.
    """

    def __init__(self):
        super().__init__()

        self.columnHeaders = False  # type: bool
        self.csvStyle = None  # type: str
        self.delimiter = None  # type: str
        self.quoteStyle = None  # type: str
        self.encoding = None  # type: str
