from cdm.utilities.network.cdm_network_exception import CdmNetworkException


class CdmNumberOfRetriesExceededException(CdmNetworkException):
    """
    The Exception thrown when the number of retries has exceeded some limit.
    """
    pass
