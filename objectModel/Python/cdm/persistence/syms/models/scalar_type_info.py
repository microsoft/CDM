# coding=utf-8
# --------------------------------------------------------------------------
# Code generated by Microsoft (R) AutoRest Code Generator 0.17.0.0
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
# --------------------------------------------------------------------------

from .type_info import TypeInfo


class ScalarTypeInfo(TypeInfo):
    """Scalar type information.

    :param type_family: Type family.
    :type type_family: str
    :param type_name: Type name.
    :type type_name: str
    :param is_table_type: Is Table type.
    :type is_table_type: bool
    :param is_complex_type: Is Complex type.
    :type is_complex_type: bool
    :param is_nullable: Is Nullable.
    :type is_nullable: bool
    :param length: Length.
    :type length: int
    :param precision: Precision.
    :type precision: int
    :param scale: Scale.
    :type scale: int
    :param properties: Property bag.
    :type properties: dict
    """ 

    _validation = {
        'type_name': {'required': True},
    }

    def __init__(self, type_name, type_family=None, is_table_type=None, is_complex_type=None, is_nullable=None, length=None, precision=None, scale=None, properties=None):
        super(ScalarTypeInfo, self).__init__(type_family=type_family, type_name=type_name, is_table_type=is_table_type, is_complex_type=is_complex_type, is_nullable=is_nullable, length=length, precision=precision, scale=scale, properties=properties)
