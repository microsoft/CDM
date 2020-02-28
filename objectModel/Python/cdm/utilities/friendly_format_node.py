# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Optional, Tuple


class FriendlyFormatNode:
    def __init__(self, leaf_source: str = None) -> None:
        self.vertical_mode = False  # type: bool
        self.indent_children = True  # type: bool
        self.terminate_after_list = True  # type: bool
        self.line_wrap = False  # type: bool
        self.force_wrap = False  # type: bool
        self.bracket_empty = False  # type: bool
        self.starter = None  # type: Optional[str]
        self.terminator = None  # type: Optional[str]
        self.separator = None  # type: Optional[str]
        self.comment = None  # type: Optional[str]
        self.leaf_source = leaf_source  # type: Optional[str]
        self.layout_width = 0  # type: int
        self.children = []  # type: List[FriendlyFormatNode]

        self._calc_starter = None  # type: Optional[str]
        self._calc_terminator = None  # type: Optional[str]
        self._calc_preceeding_separator = None  # type: Optional[str]
        self._calc_indent_level = 0  # type: int
        self._calc_nl_before = False  # type: bool
        self._calc_nl_after = False  # type: bool

    def add_comment(self, comment: Optional[str]) -> None:
        if comment is not None:
            self.comment = comment

    def add_child(self, child: 'FriendlyFormatNode') -> None:

        # TODO: See if checks for 'if self.children is None' can be removed by initializing to empty list.
        if self.children is None:
            self.children = []
        self.children.append(child)

    def add_child_string(self, source: Optional[str], quotes: bool = False) -> None:
        if source is not None:
            if quotes:
                source = '"{}"'.format(source)
            self.add_child(FriendlyFormatNode(source))

    def set_delimiters(self) -> None:
        self._calc_starter = ''
        self._calc_terminator = ''
        self._calc_preceeding_separator = ''

        if self.children is None and not self.leaf_source:
            if self.bracket_empty and self.starter and self.terminator:
                self._calc_starter = self.starter
                self._calc_terminator = self.terminator
            return

        if self.starter:
            self._calc_starter = self.starter
        if self.terminator:
            self._calc_terminator = self.terminator

        if self.children is not None:
            for child in self.children:
                child.set_delimiters()
                if self.separator:
                    child._calc_preceeding_separator = self.separator

    def set_whitespace(self, indent_level: int, needs_nl: bool) -> bool:
        self._calc_indent_level = indent_level

        if self.leaf_source:
            self._calc_nl_before = needs_nl

        did_nl = False

        if self.children is not None:
            child_indent_level = indent_level + (1 if self.indent_children and self.vertical_mode else 0)

            for child in self.children:
                if self.vertical_mode:
                    needs_nl = not did_nl

                did_nl = child.set_whitespace(child_indent_level, needs_nl)

                if not self.vertical_mode:
                    needs_nl = False

        if self.vertical_mode and needs_nl:
            self._calc_nl_after = True
            did_nl = True

        return did_nl

    def layout(self, max_width: int, max_margin: int, start: int, indent_width: int) -> Tuple[int, int]:
        first_write = -1
        position = start

        if self._calc_preceeding_separator:
            first_write = position
            position = len(self._calc_preceeding_separator)

        if self._calc_starter:
            first_write = first_write if first_write != -1 else position
            position = len(self._calc_starter)

        if self._calc_nl_before:
            position = self._calc_indent_level * indent_width
            first_write = position

        if self.children is None:
            first_write = first_write if first_write != -1 else position
            position += len(self.leaf_source)
        else:
            wrap_to = 0
            for idx, child in enumerate(self.children):
                if self.force_wrap or (self.line_wrap and position + child.layout_width > max_width):
                    child._calc_nl_before = True
                    child._calc_indent_level = (wrap_to + indent_width) // indent_width
                    position = child._calc_indent_level + indent_width

                child_layout = child.layout(max_width, max_margin, position, indent_width)
                position = child_layout[0]

                if idx == 0:
                    wrap_to = child_layout[1]
                    first_write = first_write if first_write != -1 else wrap_to

        if self._calc_nl_after:
            position = 0
            first_write = first_write if first_write != -1 else position

        if self._calc_terminator:
            if self._calc_nl_after:
                position += self._calc_indent_level * indent_width

            first_write = first_write if first_write != -1 else position
            position += len(self._calc_terminator)

            if self._calc_nl_after:
                position = 0

        first_write = first_write if first_write != -1 else position
        self.layout_width = position - first_write
        return (position, first_write)

    def line_start(self, start_indent: int) -> str:
        return ' ' * start_indent

    def compose(self, indent_width: int) -> str:
        compose_list = []
        compose_list.append(self._calc_preceeding_separator)

        if self._calc_starter:
            compose_list.append(self._calc_starter)

        if self._calc_nl_before:
            compose_list.append('\n')
            compose_list.append(self.line_start(self._calc_indent_level * indent_width))

        if self.children is not None:
            compose_list += [child.compose(indent_width) for child in self.children]
        elif self.leaf_source:
            compose_list.append(self.leaf_source)

        if self._calc_nl_after:
            compose_list.append('\n')

        if self._calc_terminator:
            if self._calc_nl_after:
                compose_list.append(self.line_start(self._calc_indent_level * indent_width))
            compose_list.append(self._calc_terminator)
            if self._calc_nl_after:
                compose_list.append('\n')

        return ''.join(compose_list)

    def to_string(self, max_width: int, max_margin: int, start_indent: int, indent_width: int) -> str:
        self.set_delimiters()
        self.set_whitespace(0, False)
        self._calc_nl_before = False

        # Layout with a giant maxwidth so that we just measure everything.
        self.layout(1000000, max_margin, start_indent, indent_width)
        # Now use the real max.
        self.layout(max_width, max_margin, start_indent, indent_width)

        return self.compose(indent_width)
