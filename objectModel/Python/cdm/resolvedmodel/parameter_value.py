# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from collections import OrderedDict
from typing import Dict, TYPE_CHECKING

from cdm.enums import CdmObjectType

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentValue, CdmConstantEntityDefinition, CdmCorpusContext, CdmParameterDefinition, CdmObject, SpewCatcher
    from cdm.resolvedmodel import ParameterCollection
    from cdm.utilities import ResolveOptions


class ParameterValue():
    def __init__(self, ctx: 'CdmCorpusContext', parameter: 'CdmParameterDefinition', value: 'CdmArgumentValue') -> None:
        self.ctx = ctx  # type: CdmCorpusContext
        self.parameter = parameter  # type: CdmParameterDefinition
        self.value = value  # type: CdmArgumentValue

    @property
    def name(self) -> str:
        return self.parameter.name

    @classmethod
    def fetch_replacement_value(cls, res_opt: 'ResolveOptions', old_value: 'CdmArgumentValue', new_value: 'CdmArgumentValue', was_set: bool) -> 'CdmArgumentValue':
        from cdm.objectmodel import CdmObject

        if old_value is None:
            return new_value

        if not was_set:
            # Must explicitly set a value to override if a new value is not set, then new_value holds nothing or the
            # default. In this case, if there was already a value in this argument then just keep using it.
            return old_value

        if not isinstance(old_value, CdmObject):
            return new_value

        ov = old_value  # type: CdmObject
        nv = new_value  # type: CdmObject

        # Replace an old table with a new table? Actually just mash them together.
        if (ov is not None and ov.object_type == CdmObjectType.ENTITY_REF and
                nv is not None and not isinstance(nv, str) and nv.object_type == CdmObjectType.ENTITY_REF):

            old_ent = ov.fetch_object_definition(res_opt)  # type: CdmConstantEntityDefinition
            new_ent = nv.fetch_object_definition(res_opt)  # type: CdmConstantEntityDefinition

            # Check that the entities are the same shape.
            if new_ent is None:
                return ov

            if old_ent is None or old_ent.entity_shape.fetch_object_definition(res_opt) != new_ent.entity_shape.fetch_object_definition(res_opt):
                return nv

            old_cv = old_ent.constant_values
            new_cv = new_ent.constant_values

            # Rows in old?
            if not old_cv:
                return nv
            # Rows in new?
            if not new_cv:
                return ov

            # Make a set of rows in the old one and add the new ones. This will union the two find rows in the new
            # one that are not in the old one. Slow, but these are small usually.
            unioned_rows = OrderedDict(('::'.join(row), row) for row in old_cv + new_cv)

            if len(unioned_rows) == len(old_cv):
                return ov

            replacement_ent = old_ent.copy(res_opt)  # type: CdmConstantEntityDefinition
            replacement_ent.constant_values = list(unioned_rows.values())
            return res_opt.wrt_doc.ctx.corpus.make_ref(CdmObjectType.ENTITY_REF, replacement_ent, False)

        return new_value

    def fetch_value_string(self, res_opt: 'ResolveOptions') -> str:
        from cdm.objectmodel import CdmObject

        if self.value is None:
            return ''

        if isinstance(self.value, str):
            return self.value
        elif isinstance(self.value, CdmObject):
            # If this is a constant table, then expand into an HTML table.
            object_def = self.value.fetch_object_definition(res_opt)  # type: CdmConstantEntityDefinition
            if self.value.object_type == CdmObjectType.ENTITY_REF and object_def is not None and object_def.object_type == CdmObjectType.CONSTANT_ENTITY_DEF:
                ent_shape = object_def.entity_shape
                ent_values = object_def.constant_values
                if not ent_values:
                    return ''

                rows = []
                shape_atts = ent_shape._fetch_resolved_attributes(res_opt)

                if shape_atts is not None:
                    for row_data in ent_values:
                        if not row_data:
                            continue

                        row = {}
                        for (c, tvalue) in enumerate(row_data):
                            col_att = shape_atts._set[c]
                            if col_att is not None and tvalue is not None:
                                row[col_att.resolved_name] = tvalue

                        rows.append(row)

                if rows:
                    keys = list(rows[0].keys())
                    keys.sort()
                    first_key = keys[0]
                    second_key = keys[1] if len(keys) > 1 else keys[0]

                    rows.sort(key=lambda row: (row[first_key].lower(), row[second_key].lower()))

                rows_string = [self._spew_dict(row) for row in rows]

                return '[' + ','.join(rows_string) + ']'

            # Should be a reference to an object.

            from cdm.persistence import PersistenceLayer
            from cdm.utilities import CopyOptions
            data = PersistenceLayer.to_data(self.value, res_opt, CopyOptions(string_refs=False), PersistenceLayer.CDM_FOLDER)
            if isinstance(data, str):
                return data

            # TODO: the line bellow won't work, the result is going to be the address of the object.
            return str(data)
        else:
            return str(self.value)

        return ''

    def set_value(self, res_opt: 'ResolveOptions', new_value: 'CdmArgumentValue') -> None:
        self.value = ParameterValue.fetch_replacement_value(res_opt, self.value, new_value, True)

    def spew(self, res_opt: 'ResolveOptions', to: 'SpewCatcher', indent: str) -> None:
        to.spew_line('{}{}:{}'.format(indent, self.name, self.fetch_value_string(res_opt)))

    def _spew_dict(self, obj: Dict):
        keys = list(obj.keys())
        keys.sort()

        results = []
        for key in keys:
            value = obj[key].replace('\n', '\\n')
            results.append('"{}":"{}"'.format(key, value))

        return '{' + ','.join(results) + '}'
