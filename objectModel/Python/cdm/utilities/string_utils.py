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
        return s is None or s.strip() is ''
