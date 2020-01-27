from typing import Optional

from .entity_declaration_definition import EntityDeclarationDefinition


class ReferencedEntityDeclaration(EntityDeclarationDefinition):
    """The referenced entity declaration for CDM folders format."""

    def __init__(self):
        super().__init__('ReferencedEntity')

        self.entityDeclaration = None  # type: Optional[str]
        """The corpus path pointing to the external document."""
