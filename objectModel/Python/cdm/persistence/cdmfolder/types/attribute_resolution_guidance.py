from typing import List

from cdm.utilities import JObject


class Expansion(JObject):
    def __init__(self):
        super().__init__()

        self.startingOrdinal = 0  # type: int

        self.maximumExpansion = 0  # type: int
        """the greatest number of time that the attribute pattern should be repeated."""

        self.countAttribute = None  # type: TypeAttribute
        """The supplied attribute definition will be added to the Entity to represent the total number of instances found in the data."""


class EntityByReference(JObject):
    def __init__(self):
        super().__init__()

        self.allowReference = False  # type: bool
        """explicitly, is a reference allowed?"""

        self.alwaysIncludeForeignKey = False  # type: bool
        """if true, a foreign key attribute will be added to the entity even when the entity attribute is imbedded in a nested way."""

        self.referenceOnlyAfterDepth = 0  # type: int
        """After a given depth of non-reference nesting using entity attributes, the 'referenceOnly' directive will be imposed"""

        self.foreignKeyAttribute = None  # type: TypeAttribute
        """The supplied attribute definition will be added to the Entity to hold a foreign key value for the referenced entity.."""


class SelectsSubAttribute(JObject):
    def __init__(self):
        super().__init__()

        self.selects = ''  # type: str
        """used to indicate either 'one' or 'all' sub-attributes selected. """

        self.selectedTypeAttribute = None  # type: TypeAttribute
        """The supplied attribute definition will be added to the Entity to hold a description of the single attribute that was selected
        from the sub-entity when selects is 'one'"""

        self.selectsSomeTakeNames = []
        self.selectsSomeAvoidNames = []


class AttributeResolutionGuidance(JObject):
    def __init__(self):
        super().__init__()

        self.removeAttribute = False  # type: bool
        """If true, this attribute definiton will be removed from the final resolved attribute list of an entity."""

        self.imposedDirectives = []  # type: List[str]
        """A list of strings, one for each 'directive' that should be always imposed at this attribute definition"""

        self.removedDirectives = []  # type: List[str]
        """A list of strings, one for each 'directive' that should be removed if previously imposed"""

        self.addSupportingAttribute = None  # type: TypeAttribute
        """The supplied attribute definition will be added to the Entity after this attribute definition with a trait indicating its supporting role on this."""

        self.cardinality = ''  # type: str
        """If 'one' then there is a single instance of the attribute or entity used. 'many' indicates multiple instances and the 'expansion' properties will describe array enumeration to use when needed."""

        self.renameFormat = ''  # type: str
        """format specifier for generated attribute names. May contain a single occurence of ('{a} or 'A'), ('{m}' or '{M}') and '{o}' for the base (a/A)ttribute name, any (m/M)ember attributes from entities and array (o)rdinal. examples: '{a}{o}.{m}' could produce 'address2.city', '{a}{o}' gives 'city1'. Using '{A}' or '{M}' will uppercase the first letter of the name portions."""

        self.expansion = None  # type: Expansion
        """Parameters that control array expansion if inline repeating of attributes is needed."""

        self.entityByReference = None  # type: EntityByReference
        """Parameters that control the use of foreign keys to reference entity instances instead of imbedding the entity in a nested way"""

        self.selectsSubAttribute = None  # type: SelectsSubAttribute
        """used to indicate that this attribute select either 'one' or 'all' of the sub-attributes from an entity. If the 'structured' directive is set, this trait causes resolved attributes to end up in groups rather than a flattend list"""
