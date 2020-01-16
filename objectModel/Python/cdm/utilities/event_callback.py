from typing import Callable, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.enums import CdmStatusLevel


EventCallback = Callable[['CdmStatusLevel', str], None]
