# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import sys
from typing import TYPE_CHECKING

from cdm.enums import CdmLogCode
from cdm.utilities.logging import logger
from cdm.utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmAttribute


class CardinalitySettings:
    """Class for attribute cardinality"""

    # By default all attributes in CDM are Not Nullable and hence setting the default value to be 1:1
    _default_minimum = 1  # type: int
    _default_maximum = 1  # type: int
    _infinite_maximum = -1  # type: int

    def __init__(self, owner: 'CdmAttribute') -> None:
        """CardinalitySettings constructor"""
        self._TAG = CardinalitySettings.__name__
        self._owner = owner
        self._ctx = owner.ctx if owner else None  # type: CdmCorpusContext

        # Minimum cardinality (range -->> "0" .. "n")
        self._minimum = None  # type: str
        # Maximum cardinality (range -->> "1" .. "*")
        self._maximum = None  # type: str

        self._minimum_number = self._default_minimum  # type: int
        self._maximum_number = self._default_maximum  # type: int

    @property
    def minimum(self) -> str:
        return self._minimum

    @minimum.setter
    def minimum(self, val: str) -> None:
        from cdm.objectmodel import CdmTypeAttributeDefinition

        if not CardinalitySettings._is_minimum_valid(val):
            logger.error(self._ctx, self._TAG, 'minimum', self._owner.at_corpus_path, CdmLogCode.ERR_VALDN_INVALID_MIN_CARDINALITY, val)
        else:
            self._minimum = val
            self._minimum_number = self._get_number(self._minimum, self._default_minimum)

        # In the case of type attributes, a '0' minimum cardinality represents a nullable attribute
        if self._owner and isinstance(self._owner, CdmTypeAttributeDefinition):
            self._owner.is_nullable = self._minimum_number == 0

    @property
    def maximum(self) -> str:
        return self._maximum

    @maximum.setter
    def maximum(self, val: str) -> None:
        if not CardinalitySettings._is_maximum_valid(val):
            logger.error(self._ctx, self._TAG, 'maximum', self._owner.at_corpus_path, CdmLogCode.ERR_VALDN_INVALID_MAX_CARDINALITY, val)
        else:
            self._maximum = val
            self._maximum_number = self._get_number(self._maximum, self._default_maximum)

    def _get_number(self, val: str, default_value: int) -> int:
        """Converts the string cardinality to number"""
        if StringUtils.equals_with_ignore_case(val, '*'):
            return CardinalitySettings._infinite_maximum

        try:
            number = int(val)
            return number
        except ValueError:
            logger.error(self._ctx, self._TAG, '_get_number', self._owner.at_corpus_path, CdmLogCode.ERR_PROJ_STRING_ERROR, val, default_value)
            # defaults to min:max DefaultMinimum:DefaultMaximum in the invalid values
            return default_value

    @staticmethod
    def _is_minimum_valid(minimum: str) -> bool:
        """
        Validate if the minimum cardinality is valid
        Min Cardinality valid options are as follows -- '0'..Int.MaxValue.ToString()
        By default Min Cardinality is '1'
        """
        if minimum:
            # By default Min Cardinality is 1
            try:
                # Min Cardinality valid options are as follows -- '0'..Int.MaxValue.ToString()
                min_number = int(minimum)
                return 0 <= min_number <= sys.maxsize
            except ValueError:
                return False
        return False

    @staticmethod
    def _is_maximum_valid(maximum: str) -> bool:
        """
        Validate if the maximum cardinality is valid
        Max Cardinality valid options are as follows -- '1'..Int.MaxValue.ToString(), or can be '*' to define Infinity
        By default Max Cardinality is '1'
        """
        if maximum:
            # By default Max Cardinality is 1

            # Max Cardinality can be '*' to define Infinity
            # If not '*', an explicit value can be provided, but is limited to '1'..Int.MaxValue.ToString()
            if StringUtils.equals_with_ignore_case(maximum, '*'):
                return True
            try:
                max_number = int(maximum)
                return CardinalitySettings._default_maximum <= max_number <= sys.maxsize
            except ValueError:
                return False
        return False
