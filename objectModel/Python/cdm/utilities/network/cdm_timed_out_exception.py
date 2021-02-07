# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.utilities.network.cdm_network_exception import CdmNetworkException


class CdmTimedOutException(CdmNetworkException):
    """
    The exception thrown in the case of a timeout on a request.
    """
    pass
