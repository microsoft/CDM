import importlib

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import CdmError, CopyOptions, JObject, ResolveOptions

if TYPE_CHECKING:
    from cdm.objectmodel import CdmObject


def from_data(*args) -> 'CdmObject':
    """
    * @param args arguments passed to the persistence class.
    * @param objectType any of cdmObjectType.
    * @param persistence_type a type supported by the persistence layer. Can by any of PersistenceTypes.
    """
    arglist = list(args)
    persistence_type = arglist.pop()
    object_type = arglist.pop()
    return _get_persistence_class(object_type, persistence_type).from_data(arglist)


def to_data(instance: 'CdmObject', res_opt: ResolveOptions, persistence_type: str, options: Optional[CopyOptions]) -> JObject:
    """
    * @param instance the instance that is going to be serialized.
    * @param res_opt Rnformation about how to resolve the instance.
    * @param persistence_type a type supported by the persistence layer. Can by any of PersistenceTypes.
    * @param options set of options to specify how the output format.
    """
    return _get_persistence_class(instance.object_type, persistence_type).to_data(instance, res_opt, options)


def _get_persistence_class(object_type: CdmObjectType, persistence_type: str) -> object:
    # persistence_layer: { [id: string]: IPersistence } = PersistenceTypes[persistence_type] as { [id: string]: IPersistence }
    # if persistence_layer:
    object_name = object_type.name.lower()  # CdmObjectType[object_type]

    if object_name.endswith('def'):
        object_name = object_name[0:-4]
    elif object_name.endswith('ref'):
        object_name += 'erence'

    persistence_module_name = '{}_persistence'.format(object_name)
    persistence_class_name = ''.join([x.title() for x in persistence_module_name.split('_')])
    TargetClass = getattr(importlib.import_module('cdm.persistence.{}.{}'.format(persistence_type.lower(), persistence_module_name)), persistence_class_name)
    instance = TargetClass()

    if not instance:
        raise CdmError('Persistence class {} not implemented for type {}'.format(persistence_class_name, persistence_type))

    return instance
    # else:
    # raise CdmError(f'Persistence type {persistence_type} not implemented.')
