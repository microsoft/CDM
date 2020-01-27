from typing import Dict


class CdmHttpRequest:
    """
    Represents the CDM HTTP request.
    """

    def __init__(self, url: str, number_of_retries: int = 0, method: str = None) -> None:
        self.headers = {}  # type: Dict[str, str]
        self.requested_url = url  # type : str
        self.number_of_retries = number_of_retries  # type : int
        self.content = None  # type : Optional[str]
        self.content_type = None # type: Optional[str]

        if method is None:
            self.method = 'GET'
        else:
            self.method = method
