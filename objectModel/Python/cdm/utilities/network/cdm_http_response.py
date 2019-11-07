from typing import Dict


class CdmHttpResponse:
    """
    Represents the CDM HTTP response.
    """

    def __init__(self, status_code: int = None) -> None:
        self.status_code = status_code  # type: int
        self.is_successful = self.status_code // 100 == 2 if self.status_code is not None else None  # type : bool
        self.response_headers = {}  # type: Dict[str, str]
