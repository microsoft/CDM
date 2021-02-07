# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.


class Errors:
    @staticmethod
    def validate_error_string(corpus_path, missing_fields, only_one_required=False):
        """
        Generates a standardized error message describing the missing required fields
        """
        missing_fields_string = ', '.join(map(lambda s: '\'' + s + '\'', missing_fields))
        if only_one_required:
            return 'Integrity check failed. Reason: The object \'{}\' is missing the following fields. At least one of the following must be provided: {}'.format(corpus_path, missing_fields_string)
        else:
            return 'Integrity check failed. Reason: The object \'{}\' is missing the following required fields: {}'.format(corpus_path, missing_fields_string)
