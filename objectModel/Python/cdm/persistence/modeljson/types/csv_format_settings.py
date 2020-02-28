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
        self.csvStyle = ''  # type: str
        self.delimiter = ''  # type: str
        self.quoteStyle = ''  # type: str
        self.encoding = ''  # type: str
