from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.objectmodel import CdmTraitDefinition


class ResolveContextScope:
    def __init__(self, current_trait=None, current_parameter=None):
        self.current_trait = current_trait  # type: Optional[CdmTraitDefinition]
        self.current_parameter = current_parameter  # type: Optional[int]
