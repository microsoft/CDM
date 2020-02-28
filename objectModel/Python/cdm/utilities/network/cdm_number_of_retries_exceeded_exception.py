# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.utilities.network.cdm_network_exception import CdmNetworkException


class CdmNumberOfRetriesExceededException(CdmNetworkException):
    """
    The Exception thrown when the number of retries has exceeded some limit.
    """
    pass
