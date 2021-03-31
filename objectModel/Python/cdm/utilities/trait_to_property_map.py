# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Any, Callable, List, Optional, TYPE_CHECKING

from cdm.enums import CdmDataFormat, CdmObjectType, CdmLogCode
from cdm.resolvedmodel.resolved_trait import ResolvedTrait
from .logging import logger

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmConstantEntityDefinition, CdmObject, CdmTraitCollection, CdmTraitReference


trait_to_list_of_properties = {
    'is.CDM.entityVersion': ['version'],
    'is.CDM.attributeGroup': ['cdmSchemas'],
    'is.CDS.sourceNamed': ['sourceName'],
    'is.localized.displayedAs': ['displayName'],
    'is.localized.describedAs': ['description'],
    'is.CDS.ordered': ['sourceOrdering'],
    'is.readOnly': ['isReadOnly'],
    'is.nullable': ['isNullable'],
    'is.constrainedList': ['valueConstrainedToList'],
    'is.constrained': ['maximumValue', 'minimumValue', 'maximumLength']
}

data_format_trait_names = [
    'is.dataFormat.integer',
    'is.dataFormat.small',
    'is.dataFormat.big',
    'is.dataFormat.floatingPoint',
    'is.dataFormat.guid',
    'is.dataFormat.character',
    'is.dataFormat.array',
    'is.dataFormat.byte',
    'is.dataFormat.time',
    'is.dataFormat.date',
    'is.dataFormat.timeOffset',
    'is.dataFormat.boolean',
    'is.dataFormat.numeric.shaped',
    'means.content.text.JSON'
]


def _fetch_trait_ref_argument_value(trait_ref_or_def: 'CdmTraitDefOrRef', arg_name: str) -> Any:
    if trait_ref_or_def is None:
        return None

    if isinstance(trait_ref_or_def, ResolvedTrait) and trait_ref_or_def.parameter_values:
        return trait_ref_or_def.parameter_values.fetch_parameter_value(arg_name).value

    return trait_ref_or_def.fetch_argument_value(arg_name)


class TraitToPropertyMap:
    def __init__(self, host: 'CdmObject') -> None:
        self._TAG = TraitToPropertyMap.__name__
        self._host = host

    @property
    def _ctx(self) -> 'CdmCorpusContext':
        return self._host.ctx

    @property
    def _traits(self) -> 'CdmTraitCollection':
        from cdm.objectmodel import CdmAttribute, CdmObjectReference
        if isinstance(self._host, (CdmObjectReference, CdmAttribute)):
            return self._host.applied_traits
        return self._host.exhibits_traits

    def _update_property_value(self, property_name: str, new_value: Any) -> None:
        trait_name = self._map_trait_name(property_name)
        list_of_props = trait_to_list_of_properties.get(trait_name, [])
        has_multiple_props = len(list_of_props) > 1

        # if a trait has multiple arguments it should remove only the argument not the full trait.
        # this is done in _update_trait_argument.
        if new_value is None and not has_multiple_props:
            self._remove_trait(trait_name)
            return

        if property_name == 'version':
            self._update_trait_argument('is.CDM.entityVersion', 'versionNumber', new_value)
        elif property_name == 'cdmSchemas':
            self._update_single_attribute_trait_table('is.CDM.attributeGroup', 'groupList', 'attributeGroupSet', new_value)
        elif property_name == 'sourceName':
            self._update_trait_argument('is.CDS.sourceNamed', 'name', new_value)
        elif property_name == 'displayName':
            self._construct_localized_trait_table('is.localized.displayedAs', new_value)
        elif property_name == 'description':
            self._construct_localized_trait_table('is.localized.describedAs', new_value)
        elif property_name == 'sourceOrdering':
            self._update_trait_argument('is.CDS.ordered', 'ordinal', str(new_value))
        elif property_name == 'isPrimaryKey':
            self._update_trait_argument('is.identifiedBy', '', new_value)
        elif property_name == 'isReadOnly':
            self._update_boolean_trait('is.readOnly', new_value)
        elif property_name == 'isNullable':
            self._update_boolean_trait('is.nullable', new_value)
        elif property_name == 'valueConstrainedToList':
            self._update_boolean_trait('is.constrainedList', new_value)
        elif property_name == 'maximumValue':
            self._update_trait_argument('is.constrained', 'maximumValue', str(new_value) if new_value else None)
        elif property_name == 'minimumValue':
            self._update_trait_argument('is.constrained', 'minimumValue', str(new_value) if new_value else None)
        elif property_name == 'maximumLength':
            self._update_trait_argument('is.constrained', 'maximumLength', new_value)
        elif property_name == 'dataFormat':
            self._data_format_to_traits(new_value)
        elif property_name == 'defaultValue':
            self._update_default_value(new_value)

    def _fetch_property_value(self, property_name: str, only_from_property: bool = False) -> Any:
        from cdm.objectmodel import CdmTypeAttributeDefinition

        if property_name == 'version':
            return _fetch_trait_ref_argument_value(self._fetch_trait_reference('is.CDM.entityVersion', only_from_property), 'versionNumber')
        elif property_name == 'sourceName':
            return _fetch_trait_ref_argument_value(self._fetch_trait_reference('is.CDS.sourceNamed', only_from_property), 'name')
        elif property_name == 'displayName':
            return self._fetch_localized_trait_table('is.localized.displayedAs', only_from_property)
        elif property_name == 'description':
            return self._fetch_localized_trait_table('is.localized.describedAs', only_from_property)
        elif property_name == 'cdmSchemas':
            return self._fetch_single_attribute_trait_table('is.CDM.attributeGroup', 'groupList', only_from_property)
        elif property_name == 'sourceOrdering':
            return int(_fetch_trait_ref_argument_value(self._fetch_trait_reference('is.CDS.ordered'), 'ordinal') or 0)
        elif property_name == 'isPrimaryKey':
            if not only_from_property and isinstance(self._host, CdmTypeAttributeDefinition) and self._host.purpose and self._host.purpose.named_reference == 'identifiedBy':
                return True
            return self._fetch_trait_reference('is.identifiedBy', only_from_property) is not None
        elif property_name == 'isNullable':
            return self._fetch_trait_reference('is.nullable', only_from_property) is not None
        elif property_name == 'isReadOnly':
            return self._fetch_trait_reference('is.readOnly', only_from_property) is not None
        elif property_name == 'valueConstrainedToList':
            return self._fetch_trait_reference('is.constrainedList', only_from_property) is not None
        elif property_name == 'maximumValue':
            return _fetch_trait_ref_argument_value(self._fetch_trait_reference('is.constrained', only_from_property), 'maximumValue')
        elif property_name == 'minimumValue':
            return _fetch_trait_ref_argument_value(self._fetch_trait_reference('is.constrained', only_from_property), 'minimumValue')
        elif property_name == 'maximumLength':
            temp = _fetch_trait_ref_argument_value(self._fetch_trait_reference('is.constrained', only_from_property), 'maximumLength')
            if temp is not None:
                return int(temp)
        elif property_name == 'dataFormat':
            return self._traits_to_data_format(only_from_property)
        elif property_name == 'primaryKey':
            att_ref = _fetch_trait_ref_argument_value(self._fetch_trait_reference('is.identifiedBy', only_from_property), 'attribute')
            if att_ref is not None:
                return att_ref.fetch_object_definition_name()
        elif property_name == 'defaultValue':
            return self._fetch_default_value(only_from_property)

        return None

    def _fetch_trait_reference(self, trait_name: str, only_from_property: bool = False) -> Optional['CdmTraitReference']:
        """Fetch a trait based on name from the array of traits."""
        trait_index = self._traits.index(trait_name, only_from_property)
        return self._traits[trait_index] if trait_index != -1 else None

    def _remove_trait(self, trait_name: str) -> None:
        self._traits.remove(trait_name, True)

    def _update_boolean_trait(self, trait_name: str, value: bool) -> None:
        if value:
            self._fetch_or_create_trait(trait_name, True)
        else:
            self._remove_trait(trait_name)

    def _data_format_to_traits(self, data_format: str) -> None:
        # reset the current dataFormat
        for trait_name in data_format_trait_names:
            self._remove_trait(trait_name)
        if data_format == CdmDataFormat.INT16:
            self._fetch_or_create_trait('is.dataFormat.integer', True)
            self._fetch_or_create_trait('is.dataFormat.small', True)
        elif data_format == CdmDataFormat.INT32:
            self._fetch_or_create_trait('is.dataFormat.integer', True)
        elif data_format == CdmDataFormat.INT64:
            self._fetch_or_create_trait('is.dataFormat.integer', True)
            self._fetch_or_create_trait('is.dataFormat.big', True)
        elif data_format == CdmDataFormat.FLOAT:
            self._fetch_or_create_trait('is.dataFormat.floatingPoint', True)
        elif data_format == CdmDataFormat.DOUBLE:
            self._fetch_or_create_trait('is.dataFormat.floatingPoint', True)
            self._fetch_or_create_trait('is.dataFormat.big', True)
        elif data_format == CdmDataFormat.GUID:
            self._fetch_or_create_trait('is.dataFormat.guid', True)
            self._fetch_or_create_trait('is.dataFormat.character', True)
            self._fetch_or_create_trait('is.dataFormat.array', True)
        elif data_format == CdmDataFormat.STRING:
            self._fetch_or_create_trait('is.dataFormat.character', True)
            self._fetch_or_create_trait('is.dataFormat.array', True)
        elif data_format == CdmDataFormat.CHAR:
            self._fetch_or_create_trait('is.dataFormat.character', True)
            self._fetch_or_create_trait('is.dataFormat.big', True)
        elif data_format == CdmDataFormat.BYTE:
            self._fetch_or_create_trait('is.dataFormat.byte', True)
        elif data_format == CdmDataFormat.BINARY:
            self._fetch_or_create_trait('is.dataFormat.byte', True)
            self._fetch_or_create_trait('is.dataFormat.array', True)
        elif data_format == CdmDataFormat.TIME:
            self._fetch_or_create_trait('is.dataFormat.time', True)
        elif data_format == CdmDataFormat.DATE:
            self._fetch_or_create_trait('is.dataFormat.date', True)
        elif data_format == CdmDataFormat.DATE_TIME:
            self._fetch_or_create_trait('is.dataFormat.time', True)
            self._fetch_or_create_trait('is.dataFormat.date', True)
        elif data_format == CdmDataFormat.DATE_TIME_OFFSET:
            self._fetch_or_create_trait('is.dataFormat.time', True)
            self._fetch_or_create_trait('is.dataFormat.date', True)
            self._fetch_or_create_trait('is.dataFormat.timeOffset', True)
        elif data_format == CdmDataFormat.BOOLEAN:
            self._fetch_or_create_trait('is.dataFormat.boolean', True)
        elif data_format == CdmDataFormat.DECIMAL:
            self._fetch_or_create_trait('is.dataFormat.numeric.shaped', True)
        elif data_format == CdmDataFormat.JSON:
            self._fetch_or_create_trait('is.dataFormat.array', True)
            self._fetch_or_create_trait('means.content.text.JSON', True)

    def _map_trait_name(self, property_name: str) -> str:
        if property_name == 'version':
            return 'is.CDM.entityVersion'
        if property_name == 'cdmSchemas':
            return 'is.CDM.attributeGroup'
        if property_name == 'sourceName':
            return 'is.CDS.sourceNamed'
        if property_name == 'displayName':
            return 'is.localized.displayedAs'
        if property_name == 'description':
            return 'is.localized.describedAs'
        if property_name == 'sourceOrdering':
            return 'is.CDS.ordered'
        if property_name == 'isPrimaryKey':
            return 'is.identifiedBy'
        if property_name == 'isReadOnly':
            return 'is.readOnly'
        if property_name == 'isNullable':
            return 'is.nullable'
        if property_name == 'valueConstrainedToList':
            return 'is.constrainedList'
        if property_name == 'maximumValue' or property_name == 'minimumValue' or property_name == 'maximumLength':
            return 'is.constrained'
        return property_name

    def _traits_to_data_format(self, only_from_property) -> bool:
        if self._traits is None:
            return None

        is_array = False
        is_big = False
        is_small = False
        is_integer = False
        probably_json = False

        base_type = CdmDataFormat.UNKNOWN

        for trait in self._traits:
            if only_from_property and not trait.is_from_property:
                continue

            trait_name = trait.fetch_object_definition_name()

            if trait_name == 'is.dataFormat.array':
                is_array = True
            elif trait_name == 'is.dataFormat.big':
                is_big = True
            elif trait_name == 'is.dataFormat.small':
                is_small = True
            elif trait_name == 'is.dataFormat.integer':
                is_integer = True
            elif trait_name == 'is.dataFormat.floatingPoint':
                base_type = CdmDataFormat.FLOAT
            elif trait_name == 'is.dataFormat.character':
                if base_type != CdmDataFormat.GUID:
                    base_type = CdmDataFormat.CHAR
            elif trait_name == 'is.dataFormat.byte':
                base_type = CdmDataFormat.BYTE
            elif trait_name == 'is.dataFormat.date':
                base_type = CdmDataFormat.DATE_TIME if base_type == CdmDataFormat.TIME else CdmDataFormat.DATE
            elif trait_name == 'is.dataFormat.time':
                base_type = CdmDataFormat.DATE_TIME if base_type == CdmDataFormat.DATE else CdmDataFormat.TIME
            elif trait_name == 'is.dataFormat.timeOffset':
                if base_type == CdmDataFormat.DATE_TIME:
                    base_type = CdmDataFormat.DATE_TIME_OFFSET
            elif trait_name == 'is.dataFormat.boolean':
                base_type = CdmDataFormat.BOOLEAN
            elif trait_name == 'is.dataFormat.numeric.shaped':
                base_type = CdmDataFormat.DECIMAL
            elif trait_name == 'is.dataFormat.guid':
                base_type = CdmDataFormat.GUID
            elif trait_name == 'means.content.text.JSON':
                base_type = CdmDataFormat.JSON if is_array else CdmDataFormat.UNKNOWN
                probably_json = True

        if is_array:
            if probably_json:
                base_type = CdmDataFormat.JSON
            elif base_type == CdmDataFormat.CHAR:
                base_type = CdmDataFormat.STRING
            elif base_type == CdmDataFormat.BYTE:
                base_type = CdmDataFormat.BINARY
            elif base_type != CdmDataFormat.GUID:
                base_type = CdmDataFormat.UNKNOWN

        if base_type == CdmDataFormat.FLOAT and is_big:
            base_type = CdmDataFormat.DOUBLE
        if is_integer and is_big:
            base_type = CdmDataFormat.INT64
        elif is_integer and is_small:
            base_type = CdmDataFormat.INT16
        elif is_integer:
            base_type = CdmDataFormat.INT32

        return base_type

    def _fetch_or_create_trait(self, trait_name: str, simple_ref: bool) -> 'CdmTraitReference':
        trait = self._fetch_trait_reference(trait_name, True)  # type: Optional[CdmTraitReference]

        if trait is None:
            trait = self._ctx.corpus.make_object(CdmObjectType.TRAIT_REF, trait_name, simple_ref)
            self._traits.append(trait)
            trait.is_from_property = True

        return trait

    def _update_trait_argument(self, trait_name: str, arg_name: str, value: Any) -> None:
        """sets the value of a trait argument where the argument name matches the passed name"""

        trait = self._fetch_or_create_trait(trait_name, False)

        args = trait.arguments

        if not args:
            if value is not None:
                trait.arguments.append(arg_name, value)
            else:
                self._remove_trait(trait_name)
            return

        for idx in range(len(args)):
            arg = args[idx]
            if arg.name == arg_name:
                if value is not None:
                    arg.value = value
                else:
                    args.remove(arg)
                    if not trait.arguments:
                        self._remove_trait(trait)
                return

        if value is not None:
            trait.arguments.append(arg_name, value)

    def _update_trait_table(self, trait: Any, arg_name: str, entity_name: str, action: Callable[['CdmConstantEntityDefinition', bool], None]) -> None:
        trait = self._fetch_or_create_trait(trait, False)

        if not trait.arguments:
            # Make the argument nothing but a ref to a constant entity.
            c_ent = self._ctx.corpus.make_object(CdmObjectType.CONSTANT_ENTITY_DEF, None, False)
            c_ent.entity_shape = self._ctx.corpus.make_ref(CdmObjectType.ENTITY_REF, entity_name, True)
            action(c_ent, True)
            trait.arguments.append(arg_name, self._ctx.corpus.make_ref(CdmObjectType.ENTITY_REF, c_ent, False))
        else:
            loc_ent_ref = _fetch_trait_ref_argument_value(trait, arg_name)
            if loc_ent_ref is not None:
                loc_ent = loc_ent_ref.fetch_object_definition(None)
                if loc_ent is not None:
                    action(loc_ent, False)

    def _fetch_trait_table(self, trait: Any, arg_name: str, only_from_property: bool) -> 'CdmConstantEntityDefinition':
        if trait is None:
            return None

        if isinstance(trait, str):
            idx = self._traits.index(trait, only_from_property)
            if idx != -1:
                trait = self._traits[idx]
            else:
                return None

        loc_ent_ref = _fetch_trait_ref_argument_value(trait, arg_name)
        return None if loc_ent_ref is None else loc_ent_ref.fetch_object_definition(None)

    def _construct_localized_trait_table(self, trait_name: str, source_text) -> None:
        def action(c_ent, created):
            if created:
                c_ent.constant_values = [['en', source_text]]
            else:
                # search for a match
                # -1 on order gets us the last row that matches. needed because inheritence
                # chain with different descriptions stacks these up
                # need to use ordinals because no binding done yet
                c_ent._update_constant_value(None, 1, source_text, 0, 'en', -1)

        self._update_trait_table(trait_name, 'localizedDisplayText', 'localizedTable', action)

    def _fetch_localized_trait_table(self, trait_name: str, only_from_property: bool) -> Any:
        c_ent = self._fetch_trait_table(trait_name, 'localizedDisplayText', only_from_property)
        # search for a match
        # -1 on order gets us the last row that matches. needed because inheritence
        # chain with different descriptions stacks these up
        # need to use ordinals because no binding done yet
        return None if c_ent is None else c_ent._fetch_constant_value(None, 1, 0, 'en', -1)

    def _update_single_attribute_trait_table(self, trait_name: str, arg_name: str, entity_name: str, source_text: List[str]) -> None:
        def action(c_ent, created):  # pylint: disable=unused-argument
            # Turn list of strings into list of list of strings.
            c_ent.constant_values = [[v] for v in source_text]

        self._update_trait_table(trait_name, arg_name, entity_name, action)

    def _fetch_single_attribute_trait_table(self, trait_name: str, arg_name: str, only_from_property: bool) -> List[str]:
        c_ent = self._fetch_trait_table(trait_name, arg_name, only_from_property)
        # Turn list of list of strings into a single list of strings.
        return None if c_ent is None else [v[0] for v in c_ent.constant_values]

    def _fetch_default_value(self, only_from_property: bool) -> Any:
        trait = self._fetch_trait_reference('does.haveDefault', only_from_property)
        if trait is None:
            return None

        def_val = _fetch_trait_ref_argument_value(trait, 'default')
        if def_val is not None:
            if isinstance(def_val, str):
                return def_val

            if def_val.object_type == CdmObjectType.ENTITY_REF:
                c_ent = def_val.fetch_object_definition(None)
                if c_ent is not None:
                    es_name = c_ent.entity_shape.fetch_object_definition_name()
                    corr = es_name == 'listLookupCorrelatedValues'
                    lookup = es_name == 'listLookupValues'
                    if es_name == 'localizedTable' or lookup or corr:
                        def func(raw_row):
                            row = {}
                            if len(raw_row) == 2 or (lookup and len(raw_row) == 4) or (corr and len(raw_row) == 5):
                                row['languageTag'] = raw_row[0]
                                row['displayText'] = raw_row[1]
                                if lookup or corr:
                                    row['attributeValue'] = raw_row[2]
                                    row['displayOrder'] = raw_row[3]
                                    if corr:
                                        row['correlatedValue'] = raw_row[4]
                            return row

                        return list(map(func, c_ent.constant_values))
                    else:
                        # An unknown entity shape. Only thing to do is to serialize the object.
                        def_val = def_val.copy_data(None, None)
            else:
                # Is it a CDM object?
                if def_val.getObjectType is not None:
                    def_val = def_val.copy_data(None, None)

        return def_val

    def _update_default_value(self, new_default: Any) -> None:
        if not isinstance(new_default, list):
            logger.error(self._host.ctx, self._TAG, '_update_default_value', None, CdmLogCode.ERR_UNSUPPORTED_TYPE)
        elif new_default is None or len(new_default) == 0 or new_default[0].get('languageTag') is None or new_default[0].get('displayText') is None:
            logger.error(self._host.ctx, self._TAG, '_update_default_value', None, CdmLogCode.ERR_VALDN_MISSING_LANGUAGE_TAG)
        elif new_default:
            # Looks like something we understand.
            corr = new_default[0].get('correlatedValue') is not None

            def func(row):
                raw_row = [row.get('languageTag'), row.get('displayText'), row.get('attributeValue'), row.get('displayOrder')]
                if corr:
                    raw_row.append(row.get('correlatedValue'))
                return raw_row

            c_ent = self._ctx.corpus.make_object(CdmObjectType.CONSTANT_ENTITY_DEF, None, False)
            c_ent.entity_shape = self._ctx.corpus.make_ref(CdmObjectType.ENTITY_REF, 'listLookupCorrelatedValues' if corr else 'listLookupValues', True)
            c_ent.constant_values = list(map(func, new_default))

            trait = self._fetch_or_create_trait('does.haveDefault', False)
            self._update_trait_argument(trait, 'default', self._ctx.corpus.make_ref(CdmObjectType.ENTITY_REF, c_ent, False))
