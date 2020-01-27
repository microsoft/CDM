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
