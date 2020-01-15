from cdm.objectmodel import CdmCorpusContext, CdmParameterDefinition, CdmObject
from cdm.enums import CdmObjectType
from cdm.persistence import PersistenceLayer
from cdm.utilities import ResolveOptions, CopyOptions

from . import utils
from .data_type_reference_persistence import DataTypeReferencePersistence
from .types import Parameter


class ParameterPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, obj: Parameter) -> CdmParameterDefinition:
        parameter = ctx.corpus.make_object(CdmObjectType.PARAMETER_DEF, obj.name)
        parameter.explanation = obj.explanation if obj.get('explanation') else None
        parameter.required = obj.required if obj.get('required') else False
        parameter.default_value = utils.create_constant(ctx, obj.get('defaultValue'))
        parameter.data_type_ref = DataTypeReferencePersistence.from_data(ctx, obj.get('dataType'))
        return parameter

    @staticmethod
    def to_data(instance: CdmParameterDefinition, res_opt: ResolveOptions, options: CopyOptions) -> Parameter:
        def_val = None

        if instance.default_value:
            if isinstance(instance.default_value, CdmObject):
                def_val = PersistenceLayer.to_data(instance.default_value, res_opt, 'CdmFolder', options)
            elif isinstance(instance.default_value, str):
                def_val = instance.default_value

        result = Parameter()
        result.name = instance.name
        result.dataType = PersistenceLayer.to_data(instance.data_type_ref, res_opt, 'CdmFolder', options) if instance.data_type_ref else None
        result.explanation = instance.explanation
        result.defaultValue = def_val
        result.required = instance.required

        return result
