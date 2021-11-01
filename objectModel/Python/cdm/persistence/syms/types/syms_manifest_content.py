
from cdm.utilities import JObject
from typing import Union, List

from cdm.persistence.syms.models import TableEntity, DatabaseEntity, RelationshipEntity
class SymsManifestContent:
    """The SymsManifestContent use refer syms content."""
    def __init__(self, database = None, entities = None, relationships = None, intial_sync = False,
                 removed_entities = None, removed_relationships = None):
        self.database = database  # type: database_entity
        self.entities = entities  # type: List[table_entity]
        self.relationships = relationships  # type: List[relationship_entity]
        self.intial_sync = intial_sync  # type: bool
        self.removed_entities = removed_entities  # type: List[str]
        self.removed_relationships = removed_relationships  # type: List[str]

class SymsDatabasesResponse(JObject):
    _attribute_map = {
        'databases': {'key': 'items', 'type': '[object]'},
    }
    def __init__(self, items = None):
        self.databases = items  # type: List[DatabaseEntity]

class SymsTableResponse(JObject):
    def __init__(self):
        self.entities = None  # type: List[table_entity]

class SymsRelationshipResponse(JObject):
    def __init__(self):
        self.relationships = None  # type: List[relationship_entity]