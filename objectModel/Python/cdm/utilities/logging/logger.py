# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

"""Contain logic to help format logging messages in a consistent way."""
from datetime import datetime
import logging, os
from typing import Callable, Dict, Optional, TYPE_CHECKING

from cdm.enums import CdmStatusLevel, CdmLogCode
from cdm.utilities import time_utils, storage_utils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmManifestDefinition, CdmEntityDefinition

ROOT_PATH = os.path.dirname(os.path.abspath(__file__))

default_logger = logging.getLogger('cdm-python')

# Log to console by default if handler is not specified.
handler = logging.StreamHandler()
handler.setLevel(default_logger.level)
handler.setFormatter(
    logging.Formatter('%(asctime)s\t%(levelname)s\t%(filename)s:%(lineno)s\t%(funcName)s\t%(message)s'))

default_logger.handlers = [handler]  # Overwrite existing handler.

resource_file_path = os.path.abspath(os.path.join(ROOT_PATH, '..', '..', 'resx','logmessages.txt'))

with open(resource_file_path, 'r') as resource_file:
    log_messages = dict(line.strip().split(': ') for line in resource_file)

def debug(ctx: 'CdmCorpusContext', class_name: str, method: str, corpus_path: str, message: str, ingest_telemetry: Optional[bool] = False) -> None:
    _log(CdmStatusLevel.PROGRESS, ctx, class_name, message, method, default_logger.debug, corpus_path, CdmLogCode.NONE, ingest_telemetry)

def info(ctx: 'CdmCorpusContext', class_name: str, method: str, corpus_path: str, message: str) -> None:
    _log(CdmStatusLevel.INFO, ctx, class_name, message, method, default_logger.info, corpus_path, CdmLogCode.NONE)

def warning(ctx: 'CdmCorpusContext', class_name: str, method: str, corpus_path: str, code: 'CdmLogCode', *args) -> None:
    # Get message from resource for the code enum.
    message = _get_message_from_resource_file(code, args)
    _log(CdmStatusLevel.WARNING, ctx, class_name, message, method, default_logger.warning, corpus_path, code)

def error(ctx: 'CdmCorpusContext', class_name: str, method: str, corpus_path: str, code: 'CdmLogCode', *args) -> None:
    # Get message from resource for the code enum.
    message = _get_message_from_resource_file(code, args)
    _log(CdmStatusLevel.ERROR, ctx, class_name, message, method, default_logger.error, corpus_path, code)

def _log(level: 'CdmStatusLevel', ctx: 'CdmCorpusContext', class_name: str, message: str, method: str,
         default_status_event: Callable, corpus_path: str, code: 'CdmLogCode', ingest_telemetry: Optional[bool] = False) -> None:
    """
    Log to the specified status level by using the status event on the corpus context (if it exists) or to the default logger.
    The log level, class_name, message and path values are also added as part of a new entry to the log recorder.
    """
    if ctx.suppressed_log_codes.__contains__(code):
        return

    #  Write message to the configured logger
    if level >= ctx.report_at_level:
        timestamp = time_utils._get_formatted_date_string(datetime.utcnow())

        # Store a record of the event.
        # Save some dict init and string formatting cycles by checking
        # whether the recording is actually enabled.
        if ctx.events.is_recording:
            event = {
                'timestamp': timestamp,
                'level': level.name,
                'class': class_name,
                'message': message,
                'method': method
            }
            if CdmStatusLevel.ERROR == level or CdmStatusLevel.WARNING == level:
                event['code'] = code.name

            if ctx.correlation_id is not None:
                event['cid'] = ctx.correlation_id

            if corpus_path is not None:
                event['path'] = corpus_path
            ctx.events.append(event)

        formatted_message = _format_message(class_name, message, method, ctx.correlation_id, corpus_path)

        if ctx and ctx.status_event:
            ctx.status_event(level, formatted_message)
        else:
            default_status_event(formatted_message)

        # Ingest the logs into telemetry database
        if ctx.corpus.telemetry_client:
            ctx.corpus.telemetry_client.add_to_ingestion_queue(timestamp, level, class_name, method, corpus_path, 
                                                                message, ingest_telemetry, code)

def _get_message_from_resource_file(code: 'CdmLogCode', args) -> str:
        """
        Loads the string from resource file for particular enum and inserts arguments in it.
        """
        message = log_messages[code.name]
        i = 0
        for x in args:
            string = '{' + str(i) + '}'
            message = message.replace(string, str(x))
            i = i + 1
        return message

def _format_message(timestamp: str, class_name: str, message: str, method: Optional[str] = None,
                    correlation_id: Optional[str] = None, corpus_path: Optional[str] = None) -> str:
    method = ' | {}'.format(method) if method is not None else ''
    correlation_id = ' | {}'.format(correlation_id) if correlation_id is not None else ''
    corpus_path = ' | {}'.format(corpus_path) if corpus_path is not None else ''
    return '{} | {} | {}'.format(timestamp, class_name, message) + method + correlation_id + corpus_path


class _TState:
    """
    Helper struct to keep few needed bits of information about the logging scope.
    """

    def __init__(self, class_name: str, ctx: 'CdmCorpusContext', path: str):
        self.class_name = class_name  # type: str
        self.ctx = ctx  # type: CdmCorpusContext
        self.path = path  # type: str


class _LoggerScope:
    """
    LoggerScope class is responsible for enabling/disabling event recording
    and will log the scope entry/exit debug events.
    """

    def __init__(self, state: _TState):
        self.state = state  # type: _TState
        self.time = datetime.utcnow()  # type: Date
        self.is_top_level_method = False  # type: bool

    def __enter__(self):
        self.state.ctx.events._enable()

        # Check if the method is at the outermost level
        if self.state.ctx.events.nesting_level == 1:
            self.is_top_level_method = True

        self.time = datetime.utcnow()
        debug(self.state.ctx, self.state.class_name, self.state.path, None, 'Entering scope')

    def __exit__(self, exc_type, exc_value, exc_traceback):
        message = 'Leaving scope. Time elapsed: {0} ms; Cache memory used: {1}'\
            .format((datetime.utcnow() - self.time).microseconds / 1000, len(self.state.ctx._cache))

        debug(self.state.ctx, self.state.class_name, self.state.path, None, message, self.is_top_level_method)
        self.state.ctx.events._disable()


def _enter_scope(class_name: str, ctx: 'CdmCorpusContext', path: str) -> _LoggerScope:
    """
    Creates a new LoggerScope instance with the provided details of the scope being entered.
    To be used at beginning of functions via resource wrapper 'with ...: # function body.
    """
    return _LoggerScope(_TState(class_name, ctx, path))


def _ingest_manifest_telemetry(manifest: 'CdmManifestDefinition', ctx: 'CdmCorpusContext',
                               class_name: str, method: str, corpus_path: str) -> None:
    # Get the namespace of the storage for the manifest
    storage_namespace = manifest.namespace or manifest.ctx.corpus.storage.default_namespace

    # Get storage adapter type
    adapter = manifest.ctx.corpus.storage.fetch_adapter(storage_namespace)
    adapter_type = type(adapter).__name__
    message = 'ManifestStorage:{0};'.format(adapter_type)

    entity_num = len(manifest.entities)

    manifest_info = {'RelationshipNum': len(manifest.relationships),
                     'EntityNum': entity_num}  # type: Dict[str, int]

    # Counts the total number partitions in the manifest
    partition_num = 0

    # Counts the number of different partition patterns in all the entities
    partition_glob_pattern_num = 0
    partition_regex_pattern_num = 0

    # Counts the number of standard entities
    standard_entity_num = 0

    # Get detailed info for each entity
    for entity_dec in manifest.entities:
        # Get data partition info, if any
        if entity_dec.data_partitions:
            partition_num += len(entity_dec.data_partitions)

            for pattern in entity_dec.data_partition_patterns:
                # If both globPattern and regularExpression is set, globPattern will be used
                if pattern.glob_pattern:
                    partition_glob_pattern_num += 1
                elif pattern.regular_expression:
                    partition_regex_pattern_num += 1

        # Check if entity is standard
        entity_namespace = storage_utils.StorageUtils.split_namespace_path(entity_dec.entity_path)[0]

        if entity_namespace == 'cdm':
            standard_entity_num += 1

    manifest_info['PartitionNum'] = partition_num
    manifest_info['PartitionGlobPatternNum'] = partition_glob_pattern_num
    manifest_info['PartitionRegExPatternNum'] = partition_regex_pattern_num
    manifest_info['StandardEntityNum'] = standard_entity_num
    manifest_info['CustomEntityNum'] = entity_num - standard_entity_num

    # Serialize manifest info dictionary
    message += _serialize_dictionary(manifest_info)

    debug(ctx, class_name, method, corpus_path, 'Manifest Info: {{{0}}}'.format(message), True)


def _ingest_entity_telemetry(entity: 'CdmEntityDefinition', ctx: 'CdmCorpusContext',
                             class_name: str, method: str, corpus_path: str) -> None:
    # Get entity storage namespace
    entity_namespace = entity.in_document.namespace or entity.ctx.corpus.storage.default_namespace

    # Get storage adapter type
    adapter = entity.ctx.corpus.storage.fetch_adapter(entity_namespace)
    adapter_type = type(adapter).__name__

    message = 'EntityStorage:{0};EntityNamespace:{1};'.format(adapter_type, entity_namespace)

    # Collect all entity info
    entity_info = _form_entity_info_dict(entity)
    message += _serialize_dictionary(entity_info)

    debug(ctx, class_name, method, corpus_path, 'Entity Info: {{{0}}}'.format(message), True)


def _form_entity_info_dict(entity: 'CdmEntityDefinition'):
    entity_info = {}  # type: Dict[str, int]

    # Check whether entity is resolved
    is_resolved = 0

    if entity.attribute_context:
        is_resolved = 1

    entity_info['ResolvedEntity'] = is_resolved
    entity_info['ExhibitsTraitNum'] = len(entity.exhibits_traits)
    entity_info['AttributeNum'] = len(entity.attributes)

    # The number of traits whose name starts with "means."
    semantics_trait_num = 0

    for trait in entity.exhibits_traits:
        if trait.fetch_object_definition_name().startswith('means.'):
            semantics_trait_num += 1

    entity_info['SemanticsTraitNum'] = semantics_trait_num

    return entity_info


def _serialize_dictionary(dictionary: Dict[str, int]):
    """
    Serialize the map and return a string.
    :param dictionary: The dictionary to be serialized.
    :return: The serialized dictionary.
    """
    dict_str = ''

    for key, val in dictionary.items():
        if not val:
            val = 'None'
        dict_str += key + ':' + str(val) + ';'

    return dict_str
