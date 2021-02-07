# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from enum import Enum


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
    def _replace(source: str, pattern: str, value: str) -> str:
        if len(pattern) > 1:
            # This exception is just for safety since Python doesn't support char type.
            raise Exception('Pattern should have size 1.')

        if value is None:
            value = ''

        lower_case_pattern = pattern.lower()
        upper_case_pattern = pattern.upper()
        upper_case_value = ''
        
        if value:
            upper_case_value = value[0].upper() + value[1:]

        result = source.replace('{{{}}}'.format(lower_case_pattern), value)
        return result.replace('{{{}}}'.format(upper_case_pattern), upper_case_value)