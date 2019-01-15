import json
import re
from enum import Enum
from collections import OrderedDict

def getattrIgnoreCase(obj, attr, default=None):
    for i in dir(obj):
        if i.lower() == attr.lower():
            return getattr(obj, attr, default)
    return default


class SchemaEntry(object):
    __unassigned = object()

    def __init__(self, name, cls, defaultValue = None, verbose = False):
        self.name = name
        self.cls = cls
        if defaultValue is None and issubclass(cls, list):
            defaultValue = cls()
        self.defaultValue = defaultValue
        self.verbose = verbose
    
    def shouldSerialize(self, value):
        if self.verbose:
            return True
        if issubclass(self.cls, list):
            return len(value) > 0
        return self.defaultValue != value


class PolymorphicMeta(type):
    classes = {}
    
    def __new__(cls, name, bases, attrs):
        cls = type.__new__(cls, name, bases, attrs)
        cls.classes[cls] = {cls.__name__ : cls} # TODO: abstract?
        cls.__appendBases(bases, cls)
        return cls
    
    @staticmethod
    def __appendBases(bases, cls):
        for base in bases:
            basemap = cls.classes.get(base, None)
            if basemap is not None:
                basemap[cls.__name__] = cls
                cls.__appendBases(base.__bases__, cls)

class Polymorphic(metaclass=PolymorphicMeta):
    @classmethod
    def fromJson(cls, value):
        actualClass = PolymorphicMeta.classes[cls][value["$type"]]
        return super(Polymorphic, actualClass).fromJson(value)

class Base(object):
    __ctors = {}
    schema = ()

    def __init__(self):
        for entry in self.schema:
            setattr(self, entry.name, entry.defaultValue)

    @classmethod
    def fromJson(cls, value):
        result = cls()
        for entry in cls.schema:
            element = value.pop(entry.name, result)
            if element != result:
                setattr(result, entry.name, cls.__getCtor(entry.cls)(element))
        result.customProperties = value
        return result
    
    @classmethod
    def __getCtor(cls, type):
        ctor = cls.__ctors.get(type, None)
        if not ctor:
            ctor = getattr(type, "fromJson", type)
            cls.__ctors[type] = ctor
        return ctor
    
    def validate(self):
        tmp = object()
        className = self.__class__.__name__
        for entry in self.schema:
            element = getattrIgnoreCase(self, entry.name, tmp)
            if element != tmp and element is not None:
                if not isinstance(element, entry.cls):
                    raise TypeError("%s.%s must be of type %s" % (className, entry.name, entry.cls))
                getattr(element, "validate", lambda: None)()

    def toJson(self):
        result = OrderedDict()
        if isinstance(self, Polymorphic):
            result["$type"] = self.__class__.__name__
        for entry in self.schema:
            element = getattrIgnoreCase(self, entry.name, result)
            if element != result and entry.shouldSerialize(element):
                result[entry.name] = getattr(element, "toJson", lambda: element)()
        result.update(getattrIgnoreCase(self, "customProperties", {}))
        return result

class ObjectCollection(list, Base):
    def append(self, item):
        if not isinstance(item, self.itemType):
            raise TypeError("item is not of type %s" % self.itemType)
        super(ObjectCollection, self).append(item)
    
    @classmethod
    def fromJson(cls, value):
        result = cls()
        ctor = getattr(cls.itemType, "fromJson", cls.itemType)
        for item in value:
            super(ObjectCollection, result).append(ctor(item))
        return result
    
    def toJson(self):
        result = []
        for item in self:
            result.append(getattr(item, "toJson", lambda: item)())
        return result
        
    def validate(self):
        for item in self:
            item.validate()


String = str
Uri = str
DateTimeOffset = str

class JsonEnum(Enum):
    def toJson(self):
        return self.value

class CsvQuoteStyle(JsonEnum):
    Csv = "QuoteStyle.Csv"
    None_ = "QuoteStyle.None"

class CsvStyle(JsonEnum):
    QuoteAlways = "CsvStyle.QuoteAlways"
    QuoteAfterDelimiter = "CsvStyle.QuoteAfterDelimiter"

class DataType(JsonEnum):
    # TODO: Fix autogeneration
    Unclassified = "unclassified"
    String = "string"
    Int64 = "int64"
    Double = "double"
    DateTime = "dateTime"
    DateTimeOffset = "dateTimeOffset"
    Decimal = "decimal"
    Boolean = "boolean"
    Guid = "guid"
    Json = "json"

class Annotation(Base):
    schema = Base.schema + (
        SchemaEntry("name", String),
        SchemaEntry("value", String)
    )

    def validate(self):
        super().validate()
        className = self.__class__.__name__
        if not self.name:
            raise ValueError("%s.name is not set." % (className, ))

class AnnotationCollection(ObjectCollection):
    itemType = Annotation

class MetadataObject(Base):
    schema = Base.schema + (
        SchemaEntry("name", String),
        SchemaEntry("description", String),
        SchemaEntry("annotations", AnnotationCollection)
    )

    nameLengthMin = 1
    nameLengthMax = 256
    invalidNameRegex = re.compile("^\\s|\\s$")
    descriptionLengthMax = 4000

    def __repr__(self):
        name = getattr(self, "name", None)
        className = self.__class__.__name__
        if name:
            return "<%s '%s'>" % (className, name)
        else:
            return "<%s>" % (className, )
    
    def validate(self):
        super().validate()
        className = self.__class__.__name__
        if self.name is not None:
            if len(self.name) > self.nameLengthMax or len(self.name) < self.nameLengthMin:
                raise ValueError("Length of %s.name (%d) is not between %d and %d." % (className, len(self.name), self.nameLengthMin, self.nameLengthMax))
            if self.invalidNameRegex.search(self.name):
                raise ValueError("%s.name cannot contain leading or trailing blank spaces or consist only of whitespace." % (className, ))
        if self.description is not None and len(self.description) > self.descriptionLengthMax:
            raise ValueError("Length of %s.description (%d) may not exceed %d." % (className, len(self.name), self.nameLengthMin, self.nameLengthMax))

class MetadataObjectCollection(ObjectCollection):
    def __getitem__(self, index):
        if type(index) == str:
            index = next((i for i,item in enumerate(self) if item.name.lower() == index.lower()), None)
        if index is None:
            return None
        return super(MetadataObjectCollection, self).__getitem__(index)
    
    def validate(self):
        super().validate()
        className = self.__class__.__name__
        s = set()
        for item in self:
            if item.name != None and item.name in s:
                raise ValueError("%s contains non-unique item name '%s'" % (className, item.name))
            s.add(item.name)

class DataObject(MetadataObject):
    schema = MetadataObject.schema + (
        SchemaEntry("isHidden", bool, False),
    )

    def validate(self):
        super().validate()
        className = self.__class__.__name__
        if self.name is None:
            raise ValueError("%s.name is not set" % (className, ))

class SchemaCollection(ObjectCollection):
    itemType = Uri

class Reference(Base):
    schema = Base.schema + (
        SchemaEntry("id", String),
        SchemaEntry("location", Uri)
    )

class ReferenceCollection(ObjectCollection):
    itemType = Reference

class AttributeReference(Base):
    schema = Base.schema + (
        SchemaEntry("entityName", String),
        SchemaEntry("attributeName", String)
    )

    def __eq__(self, other):
        return isinstance(other, self.__class__) and self.entityName == other.entityName and self.attributeName == other.attributeName
    
    def __ne__(self, other):
        return not self.__eq__(other)

    def validate(self):
        super().validate()
        className = self.__class__.__name__
        if not self.entityName:
            raise ValueError("%s.entityName is not set" % (className, ))
        if not self.attributeName:
            raise ValueError("%s.attributeName is not set" % (className, ))

class Relationship(Polymorphic, Base):
    pass

class SingleKeyRelationship(Relationship):
    schema = Relationship.schema + (
        SchemaEntry("fromAttribute", AttributeReference),
        SchemaEntry("toAttribute", AttributeReference)
    )

    def validate(self):
        super().validate()
        className = self.__class__.__name__
        if self.fromAttribute is None:
            raise ValueError("%s.fromAttribute is not set" % (className, ))
        if self.toAttribute is None:
            raise ValueError("%s.toAttribute is not set" % (className, ))
        if self.fromAttribute == self.toAttribute:
            raise ValueError("%s must exist between different attribute references" % (className, ))

class RelationshipCollection(ObjectCollection):
    itemType = Relationship

class FileFormatSettings(Polymorphic, Base):
    pass

class CsvFormatSettings(FileFormatSettings):
    schema = FileFormatSettings.schema + (
        SchemaEntry("columnHeaders", bool, False),
        SchemaEntry("delimiter", String, ","),
        SchemaEntry("quoteStyle", CsvQuoteStyle, CsvQuoteStyle.Csv),
        SchemaEntry("csvStyle", CsvStyle, CsvStyle.QuoteAlways),
    )

class Partition(DataObject):
    schema = DataObject.schema + (
        SchemaEntry("refreshTime", DateTimeOffset),
        SchemaEntry("location", Uri),
        SchemaEntry("fileFormatSettings", FileFormatSettings)
    )

class PartitionCollection(MetadataObjectCollection):
    itemType = Partition

class Attribute(MetadataObject):
    schema = MetadataObject.schema + (
        SchemaEntry("dataType", DataType),
    )

    def __repr__(self):
        return "<[%s]>" % (getattr(self, "name", "(unnamed)"), )

class AttributeCollection(MetadataObjectCollection):
    itemType = Attribute

class Entity(Polymorphic, DataObject):
    invalidEntityNameRegex = re.compile("\\.|\"")

    def validate(self):
        super().validate()
        if self.invalidEntityNameRegex.search(self.name):
            raise ValueError("%s.name cannot contain dot or quotation mark." % (self.__class__.__name__, ))

class LocalEntity(Entity):
    schema = Entity.schema + (
        SchemaEntry("schemas", SchemaCollection),
        SchemaEntry("attributes", AttributeCollection),
        SchemaEntry("partitions", PartitionCollection)
    )

class ReferenceEntity(Entity):
    schema = Entity.schema + (
        SchemaEntry("refreshTime", DateTimeOffset),
        SchemaEntry("source", String),
        SchemaEntry("modelId", String)
    )

    def validate(self):
        super().validate()
        className = self.__class__.__name__
        if not self.source:
            raise ValueError("%s.source is not set." % (className, ))
        if not self.modelId:
            raise ValueError("%s.modelId is not set." % (className, ))
        
        # TODO: Validate model references

class EntityCollection(MetadataObjectCollection):
    itemType = Entity

class Model(DataObject):
    schema = DataObject.schema + (
        SchemaEntry("application", String),
        SchemaEntry("version", String),
        SchemaEntry("modifiedTime", DateTimeOffset),
        SchemaEntry("culture", String),
        SchemaEntry("referenceModels", ReferenceCollection),
        SchemaEntry("entities", EntityCollection, verbose=True),
        SchemaEntry("relationships", RelationshipCollection)
    )

    currentSchemaVersion = "1.0"

    def __init__(self, name = None):
        super().__init__()
        self.name = name
        self.version = self.currentSchemaVersion

    @classmethod
    def fromJson(cls, value):
        if isinstance(value, str):
            value = json.loads(value)
        elif not isinstance(value, dict):
            value = json.load(value)
        return super(Model, cls).fromJson(value)

    def toJson(self):
        return json.dumps(super().toJson())

    def validate(self, allowUnresolvedModelReferences = True):
        super().validate()
        if self.version != self.currentSchemaVersion:
            raise ValueError("Invalid model version '%s'", self.version)
        if not allowUnresolvedModelReferences:
            for entity in self.entities:
                if isinstance(entity, ReferenceEntity):
                    found = next((model for model in self.referenceModels if model.id == entity.modelId), None)
                    if found is None:
                        raise ValueError("ReferenceEntity '%s' doesn't have a reference model" % (entity.name, ))
