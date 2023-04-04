# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Dict

import json

import operator

from collections import OrderedDict


class JObject(OrderedDict):
    """
    Enables deriving classes to specify field serialization options.
    Fields with value None are excluded from serialization by default.
    """

    def __init__(self, value=None, json_renamed=None, json_sorted=None):
        super().__init__()
        self.__json_ignored = {"__json_ignored", "__json_renamed", "__json_sorted"}
        self.__json_renamed = dict(json_renamed) if json_renamed else dict()  # type: Dict[str, str]
        self.__json_sorted = dict(json_sorted) if json_sorted else dict()  # type: Dict[str, str]

        if value is not None:
            if isinstance(value, dict) or isinstance(value, list):
                self.__setstate__(value)
            elif isinstance(value, str):
                self.__setstate__(json.loads(value))
            else:
                raise ValueError('Only dict, list or json strings are supported')
        else:
            return None

    def __new__(cls, *args, **kwargs):
        if len(args) > 0 and args[0] is None:
            return None

        return super().__new__(cls, *args, **kwargs)

    def json_ignore(self, keys):
        self.__json_ignored.update(keys)

    def json_rename(self, keymap):
        self.__json_renamed.update(keymap)

    def json_sort(self, keysort):
        self.__json_sorted.update(keysort)

    def __getstate__(self):
        state = OrderedDict()

        # First order the attributes
        if self.__json_sorted is not None:
            # First get the explicitly sorted attribute keys that exist in self.
            # The operator allows sorted() to sort items by their value.
            sorted_keys = sorted([item for item in self.__json_sorted.items() if item[0] in self], key=operator.itemgetter(1))
            # Add all others with default order = max found + 1
            if sorted_keys:
                max_order = sorted_keys[len(sorted_keys)-1][1] + 1
            else:
                max_order = 1
            sorted_keys += ([(item[0], max_order) for item in self.items() if item[0] not in self.__json_sorted.keys()])
        else:
            # No sorted keys defined, just take the whole list of attribs from self
            sorted_keys = self.items()

        # Now construct the resulting ordered dictionary
        for sorted_key_tuple in sorted_keys:
            original_key = sorted_key_tuple[0]

            value = self[original_key]

            # Remove ignored and null-value attributes
            if (self.__json_ignored is not None and original_key in self.__json_ignored) or value is None or original_key.startswith('_'):
                continue

            # Rename attributes
            renamed_key = original_key
            if self.__json_renamed is not None and renamed_key in self.__json_renamed:
                renamed_key = self.__json_renamed[renamed_key]

            # Write the value using the renamed (may be original) key name.
            # The value to assign is obtained by either running __getstate__ on the original value, if it is a JObject,
            # or just passing the original value as is, otherwise.
            if isinstance(value, JObject):
                value.json_ignore(self.__json_ignored)
                value.json_rename(self.__json_renamed)
                value.json_sort(self.__json_sorted)
                state[renamed_key] = value.__getstate__()
            elif isinstance(value, list):
                new_list = []
                for item in value:
                    if isinstance(item, JObject):
                        item.json_ignore(self.__json_ignored)
                        item.json_rename(self.__json_renamed)
                        item.json_sort(self.__json_sorted)
                        new_list.append(item.__getstate__())
                    else:
                        new_list.append(item)
                state[renamed_key] = new_list
            elif isinstance(value, dict):
                new_dict = dict()
                for itemKey in value:
                    item = value[itemKey]
                    if isinstance(item, JObject):
                        item.json_ignore(self.__json_ignored)
                        item.json_rename(self.__json_renamed)
                        item.json_sort(self.__json_sorted)
                        new_dict[itemKey]=(item.__getstate__())
                    else:
                        if item:
                            new_dict[itemKey] = item
                state[renamed_key] = new_dict
            else:
                state[renamed_key] = value

        return state

    def __setstate__(self, state):
        # Rename attributes
        for key, value in list(state.items()):
            if self.__json_renamed and key in self.__json_renamed.values():
                self.__setvalue(list(self.__json_renamed.keys())[list(self.__json_renamed.values()).index(key)], value)
            else:
                self.__setvalue(key, value)

    def __setvalue(self, key, value):
        # If dict, we just instantiate another JObject
        if key.find(':') != -1:
            setattr(self, key, value)
        elif isinstance(value, dict):
            setattr(self, key, JObject(value, self.__json_renamed, self.__json_sorted))
        # If list, we need to construct a new list consisting of
        # instantiated JObjects
        elif isinstance(value, list):
            jobjects = []
            for value_elem in value:
                # Try to instantiate a JObject if the current list value
                # is a nested object, otherwise treat it as a primitive
                try:
                    jobjects.append(JObject(value_elem, self.__json_renamed, self.__json_sorted))
                except Exception:
                    jobjects.append(value_elem)
            setattr(self, key, jobjects)
        # In all other cases, just set the value as is
        else:
            setattr(self, key, value)

    def encode(self) -> str:
        """Returns this object in JSON form"""
        data = self.__getstate__()
        return json.dumps(data, indent=2)

    def decode(self, json_str):
        """Loads given JSON string into this object"""
        if isinstance(json_str, str):
            self.__setstate__(json.loads(json_str, object_pairs_hook=OrderedDict))
        elif isinstance(json_str, dict):
            self.__setstate__(json_str)
        return self

    def to_dict(self):
        return self.__getstate__()

    def __delattr__(self, key):
        self.__delitem__(key)

    def __getattr__(self, key):
        if key in self:
            return super().__getitem__(key)
        return None

    def __setattr__(self, key, value):
        if key.startswith('_'):
            super().__setattr__(key, value)
        else:
            self[key] = value

    def __str__(self):
        return self.encode()

    def __repr__(self):
        return self.encode()
