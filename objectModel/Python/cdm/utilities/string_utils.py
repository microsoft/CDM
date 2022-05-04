# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from enum import Enum
import re


def rchop(the_string, ending):
    """If 'the_string' has the 'ending', chop it"""
    if the_string.endswith(ending):
        return the_string[:-len(ending)]
    return the_string


class NoValue(Enum):
    def __repr__(self):
        return '<%s.%s>' % (self.__class__.__name__, self.name)


def tckprint(msg, color, pre_tabs=0, the_end='\n'):
    print('\u001b[3{}m{}{}\u001b[0m'.format(color, ' '.ljust(pre_tabs, ' '), msg), end=the_end)


def kvprint(key, value, color, pre_tabs=0):
    tckprint(key+': ', color, pre_tabs, '')
    print(value)


class StringUtils:
    @staticmethod
    def equals_with_ignore_case(a: str, b: str) -> bool:
        return a.lower() == b.lower()

    @staticmethod
    def equals_with_case(a: str, b: str) -> bool:
        return a == b

    @staticmethod
    def is_null_or_white_space(s: str) -> bool:
        return s is None or s.strip() == ''

    @staticmethod
    def is_blank_by_cdm_standard(s: str) -> bool:
        return StringUtils.is_null_or_white_space(s)

    @staticmethod
    def _capitalize_value(s: str) -> str:
        """
        Capitalizes first letter of the given string.
        """
        if StringUtils.is_null_or_white_space(s):
            return ''
        return s[0].upper() + s[1:]

    @staticmethod
    def _replace(source: str, pattern: str, value: str) -> str:
        if value is None:
            value = ''

        lower_case_pattern = pattern.lower()
        upper_case_pattern = pattern.upper()
        upper_case_value = StringUtils._capitalize_value(value) if not StringUtils.is_null_or_white_space(value) else ''

        result = source.replace('{{{}}}'.format(lower_case_pattern), value)
        return result.replace('{{{}}}'.format(upper_case_pattern), upper_case_value)

    @staticmethod
    def snake_case_to_pascal_case(snake_str: str) -> str:
        if StringUtils.is_null_or_white_space(snake_str):
            return snake_str

        components = snake_str.split('_')

        return ''.join(x.title() for x in components)

    @staticmethod
    def pascal_case_to_snake_case(pascal_str: str) -> str:
        if StringUtils.is_null_or_white_space(pascal_str):
            return pascal_str

        pattern = re.compile(r'(?<!^)(?=[A-Z])')

        return pattern.sub('_', pascal_str).upper()

    @staticmethod
    def trim_start(inputstring, word_to_remove):
        return inputstring[len(word_to_remove):] if inputstring.startswith(word_to_remove) else inputstring

    @staticmethod
    def trim_end(inputstring, word_to_remove):
        return inputstring[:len(word_to_remove)] if inputstring.endswith(word_to_remove) else inputstring