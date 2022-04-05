# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
from re import Match
from typing import Union, Tuple, List, Optional, TYPE_CHECKING
import threading
import json, re
from cdm.enums import CdmDataFormat, CdmObjectType
from cdm.objectmodel.projections.cardinality_settings import CardinalitySettings
from cdm.storage.syms import SymsAdapter
from cdm.objectmodel import CdmArgumentValue, CdmAttribute, CdmCorpusContext, \
    CdmObjectReference, CdmTraitReference, CdmTraitGroupReference, CdmCollection, CdmLocalEntityDeclarationDefinition
from cdm.utilities import JObject, IdentifierRef, ResolveOptions, CopyOptions, StorageUtils
from cdm.persistence.syms.types import SymsManifestContent
from cdm.persistence.syms.models import DatabaseEntity, RelationshipEntity, TableEntity, TypeInfo
from .attribute_group_reference_persistence import AttributeGroupReferencePersistence
from .data_type_reference_persistence import DataTypeReferencePersistence
from .entity_attribute_persistence import EntityAttributePersistence
from .entity_reference_persistence import EntityReferencePersistence
from .purpose_reference_persistence import PurposeReferencePersistence
from .trait_reference_persistence import TraitReferencePersistence
from .trait_group_reference_persistence import TraitGroupReferencePersistence
from .type_attribute_persistence import TypeAttributePersistence
from .types import CdmJsonType, TraitGroupReference, TraitReference

if TYPE_CHECKING:
    pass

csv = 'csv'
parquet = 'parquet'

def create_trait_reference_array(ctx: CdmCorpusContext,
                                 obj: Optional[List[Union[str, TraitReference, TraitGroupReference]]]) \
        -> Optional[List[Union[CdmTraitReference, CdmTraitGroupReference]]]:
    """
    Converts a JSON object to a CdmCollection of TraitReferences.
    If object is not a list, returns None.
    """

    if not obj or not isinstance(obj, List):
        # Nothing to do
        return None

    result = []

    for elem in obj:
        if not isinstance(elem, str) and elem.traitGroupReference is not None:
            result.append(TraitGroupReferencePersistence.from_data(ctx, elem))
        else:
            model = JObject()
            try:

                model.decode(elem)
            except Exception as e:
                model = elem
            result.append(TraitReferencePersistence.from_data(ctx, model))

    return result


def add_list_to_cdm_collection(cdm_collection: CdmCollection, the_list: List) -> None:
    """Adds all elements of a list to a CdmCollection"""
    if cdm_collection is not None and the_list is not None:
        for element in the_list:
            cdm_collection.append(element)


def create_constant(ctx: CdmCorpusContext, obj: CdmJsonType) -> Optional[CdmArgumentValue]:
    """Creates a CDM object from a JSON object"""
    if not obj:
        return None

    if isinstance(obj, str) or not isinstance(obj, JObject):
        return obj

    if obj.get('purpose') or obj.get('dataType') or obj.get('entity'):
        if obj.get('dataType'):
            return TypeAttributePersistence.from_data(ctx, obj)
        elif obj.get('entity'):
            return EntityAttributePersistence.from_data(ctx, obj)
        return obj
    elif obj.get('purposeReference'):
        return PurposeReferencePersistence.from_data(ctx, obj)
    elif obj.get('traitReference'):
        return TraitReferencePersistence.from_data(ctx, obj)
    elif obj.get('traitGroupReference'):
        return TraitGroupReferencePersistence.from_data(ctx, obj)
    elif obj.get('dataTypeReference'):
        return DataTypeReferencePersistence.from_data(ctx, obj)
    elif obj.get('entityReference'):
        return EntityReferencePersistence.from_data(ctx, obj)
    elif obj.get('attributeGroupReference'):
        return AttributeGroupReferencePersistence.from_data(ctx, obj)
    else:
        return obj

def copy_identifier_ref(obj_ref: CdmObjectReference, res_opt: ResolveOptions, options: CopyOptions) -> Union[str, 'IdentifierRef']:
    identifier = obj_ref.named_reference

    if options is None or not options.string_refs:
        return identifier

    resolved = obj_ref.fetch_object_definition(res_opt)

    if resolved is None:
        return identifier

    ident_ref = IdentifierRef()
    ident_ref.corpus_path = resolved.at_corpus_path
    ident_ref.identifier = identifier

    return ident_ref


def _property_from_data_to_string(value) -> Optional[str]:
    if value is not None and value != '' and isinstance(value, str):
        return value
    if isinstance(value, int):
        return str(value)
    return None


def _property_from_data_to_int(value) -> Optional[int]:
    if value is None or isinstance(value, int):
        return value
    if isinstance(value, str):
        try:
            return int(value)
        except ValueError:
            # str is not a valid number
            pass
    return None


def _property_from_data_to_bool(value) -> Optional[bool]:
    if value is None or isinstance(value, bool):
        return value
    if isinstance(value, str):
        if value in ['True', 'True']:
            return True
        elif value in ['False', 'false']:
            return False
    return None


def cardinality_settings_from_data(data: CardinalitySettings, attribute: CdmAttribute) -> CardinalitySettings:
    """Converts cardinality data into a CardinalitySettings object"""
    if data is None:
        return None

    cardinality = CardinalitySettings(attribute)
    cardinality.minimum = data.get('minimum')
    cardinality.maximum = data.get('maximum')

    if cardinality.minimum is not None and cardinality.maximum is not None:
        return cardinality
    else:
        return None

    return data

def create_partition_trait(obj: 'CsvFormatSettings', ctx: 'CdmCorpusContext',format_type: str) -> 'CdmTraitReference':
    format_trait = None
    if format_type == csv:
        format_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.partition.format.CSV', True)
    elif format_type == parquet:
        format_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.partition.format.parquet', True)
    else:
        # error
        return None

    format_trait.simple_named_reference = False
    if obj is not None:
        if obj.get('header') is not None:
            column_headers_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'columnHeaders')
            column_headers_arg.value = str(obj.get('header')).lower()
            format_trait.arguments.append(column_headers_arg)

        if obj.get('csvStyle') is not None:
            csv_style_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'csvStyle')
            csv_style_arg.value = obj.get('csvStyle')
            format_trait.arguments.append(csv_style_arg)

        if obj.get('field.delim') is not None:
            delimiter_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'delimiter')
            delimiter_arg.value = obj.get('field.delim')
            format_trait.arguments.append(delimiter_arg)

        if obj.get('quoteStyle') is not None:
            quote_style_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'quoteStyle')
            quote_style_arg.value = obj.get('quoteStyle')
            format_trait.arguments.append(quote_style_arg)

        if obj.get('quote') is not None:
            quote_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'quote')
            quote_arg.value = obj.get('quote')
            format_trait.arguments.append(quote_arg)

        if obj.get('encoding') is not None:
            encoding_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'encoding')
            encoding_arg.value = obj.get('encoding')
            format_trait.arguments.append(encoding_arg)

        if obj.get('escape') is not None:
            escape_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'escape')
            escape_arg.value = obj.get('escape')
            format_trait.arguments.append(escape_arg)

        if obj.get('newline') is not None:
            newline_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'newline')
            newline_arg.value = obj.get('newline')
            format_trait.arguments.append(newline_arg)

        if obj.get('skipLines') is not None:
            skiplines_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'skipLines')
            skiplines_arg.value = obj.get('skipLines')
            format_trait.arguments.append(skiplines_arg)

        if obj.get('inferSchema') is not None:
            infer_schema_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'inferSchema')
            infer_schema_arg.value = obj.get('inferSchema')
            format_trait.arguments.append(infer_schema_arg)

        if obj.get('timestampFormat') is not None:
            timestampformat_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'timestampFormat')
            timestampformat_arg.value = obj.get('timestampFormat')
            format_trait.arguments.append(timestampformat_arg)

        if obj.get('ignoreTrailingWhiteSpace') is not None:
            ignore_trailing_white_space_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'ignoreTrailingWhiteSpace')
            ignore_trailing_white_space_arg.value = obj.get('skipLines')
            format_trait.arguments.append(ignore_trailing_white_space_arg)

        if obj.get('ignoreLeadingWhiteSpace') is not None:
            ignore_leading_white_space_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'ignoreLeadingWhiteSpace')
            ignore_leading_white_space_arg.value = obj.get('ignoreLeadingWhiteSpace')
            format_trait.arguments.append(ignore_leading_white_space_arg)

        if obj.get('multiLine') is not None:
            multiline_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'multiLine')
            multiline_arg.value = obj.get('multiLine')
            format_trait.arguments.append(multiline_arg)

    return format_trait

def trim_start(input: str, word_to_remove: str) -> str:
        return input[len(word_to_remove):] if input.startswith(word_to_remove) else input

def AdlsConfig(ns: str, host_name: str, container_name: str):
    if not host_name.endswith('.dfs.core.windows.net'):
        host_name = host_name + '.dfs.core.windows.net'

    json = '{ "adapters": [ { "type": "adls", "namespace": "' + ns + '", "config": { "hostname": "' + host_name+  '", "root": "' + container_name + '" }} ]}'
    return json

def check_if_syms_adapter(adapter) -> bool:
    if isinstance(adapter, SymsAdapter):
            return True
    return False

def try_get_dbname(path: str, db_name: str) -> bool:
    db_name = ''
    if path.startswith('/'):
        path = trim_start(path, '/')
        paths = path.split('/')
        if len(paths) > 1:
            db_name = paths[0]
            return True
        return False

def syms_path_to_adls_adapter_path(syms_path: str) ->str:
    if not syms_path.startswith('abfss://') or syms_path.count('abfss://') != 1:
        return None
    if syms_path.endswith('/'):
        syms_path = syms_path.rsplit('/', 1)[0]
    paths = syms_path.replace('abfss://', ',' ).replace('@',',').replace('/',',').split(',')
    if len(paths) > 2:
        ret_value = 'https://{}/{}'.format(paths[2], paths[1])
        for val in paths[3:]:
            if val == '':
                return None
            ret_value = '{}/{}'.format(ret_value, val)
        return ret_value
    return None

def adls_adapter_path_to_syms_path(adls_path: str)-> str:
    if not adls_path.startswith('https://') or adls_path.count('https://') != 1:
        return None

    if adls_path.endswith('/'):
        adls_path = adls_path.rsplit('/', 1)[0]
    paths = adls_path.replace('https://', ',').replace('/',',').split(',')
    if len(paths) > 2:
        ret_value = 'abfss://{}@{}'.format(paths[2], paths[1])
        for val in paths[3:]:
            if val == '':
                return None
            ret_value = '{}/{}'.format(ret_value, val)
        return ret_value
    return None

def syms_path_to_corpus_path(syms_path: str, strg_mgr: 'StorageManager') -> str:
    adls_path = syms_path_to_adls_adapter_path(syms_path)
    corpus_path = strg_mgr.adapter_path_to_corpus_path(adls_path)
    if corpus_path == None:
        path_tuple = create_and_mount_adls_adapter_from_adls_path(strg_mgr, adls_path)
        if path_tuple == None:
            raise Exception('Couldn\'t found adls adapter which can map to adls path : \'{}\'.Path recieved from syms : {}. Tried to generate new adls adapter but failed.'.format(adls_path, syms_path))
        #Try again
        corpus_path = strg_mgr.adapter_path_to_corpus_path(adls_path)
    return corpus_path

def corpus_path_to_syms_path(corpus_path: str, strg_mgr: 'StorageManager')-> str:
    path_tuple = StorageUtils.split_namespace_path(corpus_path)
    if path_tuple[0] != '':
        adls_path = strg_mgr.corpus_path_to_adapter_path(corpus_path)
        if adls_path is not None:
            syms_path = adls_adapter_path_to_syms_path(adls_path)
            if syms_path is not None:
                return syms_path
    return None

def split_storage_name_fs_from_adls_path(path: str) -> Tuple[str, str]:
    if not path.startswith('https://') or path.count('https://') != 1:
        return None

    if path.endswith('/'):
        path = path.rsplit('/', 1)[0]

    paths = path.replace('https://', ',').replace('/',',').split(',')
    if len(paths) > 2:
        if paths[1].endswith('.dfs.core.windows.net'):
            return (paths[1].replace('.dfs.core.windows.net', ''), paths[2])
    return None

def get_wildcards_matches(path: str)-> 'Match[str]':
    if path is not None and path is not '':
        result = re.search(r'[^.]\*', path)
        if result is not None:
            return result
    return None

def split_root_location_regex_from_path(path: str, matches: 'Match[str]')-> Tuple[str, str]:
    if path is not None or path is not '':
        if matches is not None and len(matches) > 0:
            return (path[0:matches.span()[0]], path[matches.span()[0]:])
    return None

def split_storage_name_fs_from_syms_path(path: str)-> Tuple[str, str]:
    if not path.startswith('abfss://') or path.count('abfss://') != 1:
        return None

    if path.endswith('/'):
        path = path.rsplit('/', 1)[0]

    paths = path.replace('abfss://', ',' ).replace('@', ',').replace('/',',').split(',')
    if len(paths) > 2:
        if paths[2].endswith('.dfs.core.windows.net'):
            return (paths[2].replace('.dfs.core.windows.net', ''), paths[1])
    return None

def create_source_trait(ctx: 'CdmCorpusContext', trait_name: str, trait_arg_name: str, trait_arg_value: str = None)-> 'CdmTraitReference':
    if trait_arg_value == None:
       trait_arg_value = 'adlsadapter:/'

    source_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, trait_name, True)
    source_trait.simple_named_reference = False
    prefix_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, trait_arg_name)
    prefix_arg.value = trait_arg_value
    source_trait.arguments.append(prefix_arg)
    return source_trait

def create_syms_absolute_path(root: str, path: str)-> str:
    if not root.startswith('abfss://'):
        return None
    if not path.startswith('abfss://'):
        path = '{}/{}'.format(root.rsplit('/', 1)[0], trim_start(path, '/'))
    return path

def try_get_unique_ns(strg_mgr: 'StorageManager')-> str:
    if strg_mgr is not None:
        count = 0
        max_retry = 100
        ns_name_index = 0
        lock = threading.Lock()
        while True:
            with lock:
                ns_name_index += 1
            ns = 'adls{}'.format(ns_name_index)
            if None == strg_mgr.fetch_adapter(ns):
                    return ns # lucky got it!!
            count = count + 1
            if  count > max_retry:
                break
    return None

def create_and_mount_adls_adapter_from_adls_path(strg_mgr: 'StorageManager', adls_path: str, ns: str = None)-> Tuple[str, str]:
    if ns == None:
        ns = try_get_unique_ns(strg_mgr)
        if ns == None:
            return None

    path_tuple_adls = split_storage_name_fs_from_adls_path(adls_path)
    config = AdlsConfig(ns, path_tuple_adls[0], path_tuple_adls[1])
    error = strg_mgr.mount_from_config(str(config), True)
    if len(error) > 0:
       return None
    return (ns, adls_path)

def extract_table_name_from_entity_path(enitity_path: str)-> str:
    corpus_path = format_corpus_path(enitity_path)
    if corpus_path == None:
       return None
    paths = corpus_path.split('/')
    if len(paths) > 0:
       if not paths[len(paths) - 1].endswith('.cdm.json'):
           return paths[len(paths) - 1]
    return None

def format_corpus_path(corpus_path: str)-> str:
    path_tuple = StorageUtils.split_namespace_path(corpus_path)
    if path_tuple == None:
        return None
    corpus_path = path_tuple[1]
    if len(corpus_path) > 0 and corpus_path[0] != '/':
        corpus_path = '/{}'.format(corpus_path)
    return corpus_path

def syms_data_type_to_cdm_data_format(type_info: 'TypeInfo')-> 'CdmDataFormat':
    if type_info.type_name == 'byte':
        return CdmDataFormat.BYTE
    elif type_info.type_name == 'binary':
        return CdmDataFormat.BINARY
    elif type_info.type_name == 'float':
        return CdmDataFormat.FLOAT
    elif type_info.type_name == 'string':
        if type_info.length == 1:
            return CdmDataFormat.CHAR
        if type_info.properties is not None:
            if 'guid' in type_info.properties and type_info.properties['guid'] == True:
                return CdmDataFormat.GUID
            if 'json' in type_info.properties and type_info.properties['json'] == True:
                return CdmDataFormat.JSON
            if 'dateTimeOffset' in type_info.properties and type_info.properties['dateTimeOffset'] == True:
                return CdmDataFormat.DATE_TIME_OFFSET
        return CdmDataFormat.STRING
    elif type_info.type_name == 'char':
        return CdmDataFormat.STRING
    elif type_info.type_name == 'long':
        return CdmDataFormat.INT64
    elif type_info.type_name == 'integer':
        return CdmDataFormat.INT32
    elif type_info.type_name == 'short':
        return CdmDataFormat.INT16
    elif type_info.type_name == 'double':
        return CdmDataFormat.DOUBLE
    elif type_info.type_name == 'date':
        return CdmDataFormat.DATE
    elif type_info.type_name == 'timestamp':
        if type_info.properties is not None:
            if 'dateTime' in type_info.properties and type_info.properties['dateTime'] == True:
                return CdmDataFormat.DateTime
        return CdmDataFormat.TIME
    elif type_info.type_name == 'decimal':
        return CdmDataFormat.DECIMAL
    elif type_info.type_name == 'boolean':
        return CdmDataFormat.BOOLEAN
    else:
        return CdmDataFormat.UNKNOWN

def cdm_data_format_to_syms_data_type(cdm_data_format: CdmDataFormat, type_info: TypeInfo)-> 'TypeInfo':
    if cdm_data_format == CdmDataFormat.BYTE:
        type_info.type_name = 'byte'
    elif cdm_data_format == CdmDataFormat.BINARY:
        type_info.type_name = 'binary'
    elif cdm_data_format == CdmDataFormat.FLOAT:
        type_info.type_name = 'float'
    elif cdm_data_format == CdmDataFormat.CHAR:
        type_info.type_name = 'string'
        type_info.length = 1
    elif cdm_data_format == CdmDataFormat.STRING:
        type_info.type_name = 'string'
    elif cdm_data_format == CdmDataFormat.GUID:
        type_info.type_name = 'string'
        type_info.properties['guid'] = True
    elif cdm_data_format == CdmDataFormat.JSON:
        type_info.type_name = 'string'
        type_info.properties['json'] = True
    elif cdm_data_format == CdmDataFormat.DATE_TIME_OFFSET:
        type_info.type_name = 'string'
        type_info.properties['dateTimeOffset'] = True
    elif cdm_data_format == CdmDataFormat.INT32:
        type_info.type_name = 'integer'
    elif cdm_data_format == CdmDataFormat.INT16:
        type_info.type_name = 'short'
    elif cdm_data_format == CdmDataFormat.INT64:
        type_info.type_name = 'long'
    elif cdm_data_format == CdmDataFormat.DOUBLE:
        type_info.type_name = 'double'
    elif cdm_data_format == CdmDataFormat.DATE:
        type_info.type_name = 'date'
    elif cdm_data_format == CdmDataFormat.DATE_TIME:
         type_info.type_name = 'timestamp'
         type_info.properties['dateTime'] = True
    elif cdm_data_format == CdmDataFormat.TIME:
         type_info.type_name = 'timestamp'
    elif cdm_data_format == CdmDataFormat.DECIMAL:
         type_info.type_name = 'decimal'
    elif cdm_data_format == CdmDataFormat.BOOLEAN:
         type_info.type_name = 'boolean'
    else:
        return None
    return type_info

async def get_syms_model(adapter: 'StorageAdapter', database_response: str, doc_path: str)-> 'SymsManifestContent':
    from cdm.persistence.syms.models.query_artifacts_response import QueryArtifactsResponse
    db = DatabaseEntity().deserialize(json.loads(database_response))
    entities = await adapter.read_async('/' + db.name + '/' + db.name + '.manifest.cdm.json/entitydefinition')
    relationships = await adapter.read_async(doc_path + '/relationships')

    return SymsManifestContent(
            database = db,
            entities = QueryArtifactsResponse().deserialize(json.loads(entities)),
            relationships = QueryArtifactsResponse().deserialize(json.loads(relationships)),
            intial_sync = False,
            removed_entities = None,
            removed_relationships = None)

async def create_or_update_database(database_entity: 'DatabaseEntity', adapter: 'StorageAdapter'):
    content = str(database_entity.serialize()).replace('False', 'false').replace('True', 'true')
    await adapter.write_async('{}/{}.manifest.cdm.json'.format(database_entity.name, database_entity.name), content)

async def create_or_update_table_entity(table_entity: 'TableEntity', adapter: 'StorageAdapter'):
    content = str(table_entity.serialize()).replace('False', 'false').replace('True', 'true')
    await adapter.write_async('{}/{}.cdm.json'.format(table_entity.properties.namespace.database_name, table_entity.name), content)

async def create_or_update_relationship_entity(relationship_entity: 'RelationshipEntity', adapter: 'StorageAdapter'):
    database_name = relationship_entity.properties.namespace.database_name
    content = str(relationship_entity.serialize()).replace('False', 'false').replace('True', 'true')
    await adapter.write_async('{}/{}.manifest.cdm.json/relationships/{}'.format(database_name, database_name, relationship_entity.name), content)

async def create_or_update_syms_entities(syms_manifest_content: 'SymsManifestContent', adapter: 'StorageAdapter'):
    failed_updated_tables = {}
    failed_updated_relationships = {}
    failed_removed_tables = {}
    failed_removed_relationships = {}
    error_mesg = ''

    if syms_manifest_content.intial_sync:
       await create_or_update_database(syms_manifest_content.database, adapter)
    if syms_manifest_content.removed_entities is not None:
        for remove_table in syms_manifest_content.removed_entities:
            try:
                await remove_table_entity(remove_table, syms_manifest_content.database.name, adapter)
            except Exception as e:
                failed_removed_tables[remove_table] = str(e)
            if len(failed_removed_tables) > 0:
                error_mesg += 'Failed removed tables : ' + str(failed_removed_tables)

    if syms_manifest_content.removed_relationships is not None:
        for remove_relationship in syms_manifest_content.removed_relationships:
            try:
                await remove_relationship_entity(remove_relationship, syms_manifest_content.database.name, adapter)
            except Exception as e:
                failed_removed_relationships[remove_relationship] = str(e)
        if len(failed_removed_relationships) > 0:
           error_mesg += 'Failed removed relationships :' + str(failed_removed_relationships)

    if syms_manifest_content.entities is not None:
        for table in syms_manifest_content.entities:
            try:
                await create_or_update_table_entity(table, adapter)
            except Exception as e:
                failed_updated_tables[table.name] = str(e)
        if len(failed_updated_tables) > 0:
            error_mesg += 'Failed updated tables : ' + str(failed_updated_tables)

    if syms_manifest_content.relationships is not None:
        for relationship in syms_manifest_content.relationships:
            try:
                await create_or_update_relationship_entity(relationship, adapter)
            except Exception as e:
                failed_updated_relationships[relationship.name] = str(e)
        if len(failed_updated_relationships) > 0:
            error_mesg += 'Failed updated relationships : ' + str(failed_updated_relationships)

    if error_mesg != '':
        raise Exception (error_mesg)

async def remove_table_entity(table_name: str, database_name: str, adapter: 'StorageAdapter'):
    await adapter.write_async('{}/{}.cdm.json'.format(database_name, table_name), None)

async def remove_relationship_entity(relationship: str, database_name: str, adapter: 'StorageAdapter'):
    await adapter.write_async('{}/{}.manifest.cdm.json/relationships/{}'.format(database_name, database_name, relationship), None)

def is_entity_added_or_modified(entity: CdmLocalEntityDeclarationDefinition, existing_syms_tables)-> bool:
    if existing_syms_tables == None or len(existing_syms_tables) == 0 or not entity.entity_name in existing_syms_tables:
        return True
    if entity.last_file_modified_time is not None and (entity.last_file_modified_old_time is not None and entity.last_file_modified_old_time <= entity.last_file_modified_time):
        return True
    return False

def is_relationship_added_or_modified(relationship: 'CdmE2ERelationship', existing_syms_relationship)-> bool:
    if relationship.name == None or existing_syms_relationship == None or len(existing_syms_relationship) == 0 or not relationship.name in existing_syms_relationship:
        return True
    if relationship.last_file_modified_time is not None and (relationship.last_file_modified_old_time is not None and relationship.last_file_modified_old_time < relationship.last_file_modified_time):
        return True
    return False