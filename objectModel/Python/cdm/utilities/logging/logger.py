# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

"""Contain logic to help format logging messages in a consistent way."""
from datetime import datetime
import logging, os
from typing import Callable, Optional, TYPE_CHECKING

from cdm.enums import CdmStatusLevel, CdmLogCode
from cdm.utilities import time_utils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext

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

def debug(ctx: 'CdmCorpusContext', class_name: str, method: str, corpus_path: str, message: str) -> None:
    if CdmStatusLevel.PROGRESS >= ctx.report_at_level:
        _log(CdmStatusLevel.PROGRESS, ctx, class_name, message, method, default_logger.debug, corpus_path, CdmLogCode.NONE)

def info(ctx: 'CdmCorpusContext', class_name: str, method: str, corpus_path: str, message: str) -> None:
    if CdmStatusLevel.INFO >= ctx.report_at_level:
        _log(CdmStatusLevel.INFO, ctx, class_name, message, method, default_logger.info, corpus_path, CdmLogCode.NONE)

def warning(ctx: 'CdmCorpusContext', class_name: str, method: str, corpus_path: str, code: 'CdmLogCode', *args) -> None:
    if CdmStatusLevel.WARNING >= ctx.report_at_level:
        # Get message from resource for the code enum.
        message = _get_message_from_resource_file(code, args)
        _log(CdmStatusLevel.WARNING, ctx, class_name, message, method, default_logger.warning, corpus_path, code)

def error(ctx: 'CdmCorpusContext', class_name: str, method: str, corpus_path: str, code: 'CdmLogCode', *args) -> None:
    if CdmStatusLevel.ERROR >= ctx.report_at_level:
        # Get message from resource for the code enum.
        message = _get_message_from_resource_file(code, args)
        _log(CdmStatusLevel.ERROR, ctx, class_name, message, method, default_logger.error, corpus_path, code)

def _log(level: 'CdmStatusLevel', ctx: 'CdmCorpusContext', class_name: str, message: str, method: str,
         default_status_event: Callable, corpus_path: str, code: 'CdmLogCode') -> None:
    """
    Log to the specified status level by using the status event on the corpus context (if it exists) or to the default logger.
    The log level, class_name, message and path values are also added as part of a new entry to the log recorder.
    """
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
                event['correlationId'] = ctx.correlation_id

            if corpus_path is not None:
                event['corpuspath'] = corpus_path
            ctx.events.append(event)

        formatted_message = _format_message(class_name, message, method, ctx.correlation_id, corpus_path)

        if ctx and ctx.status_event:
            ctx.status_event(level, formatted_message)
        else:
            default_status_event(formatted_message)

def _get_message_from_resource_file(code: 'CdmLogCode', args) -> str:
        """
        Loads the string from resource file for particular enum and inserts arguments in it.
        """
        message = log_messages[code.name]
        i = 0;
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

    def __enter__(self):
        self.state.ctx.events._enable()
        self.time = datetime.utcnow()
        debug(self.state.ctx, self.state.class_name, self.state.path, None, 'Entering scope')

    def __exit__(self, exc_type, exc_value, exc_traceback):
        debug(self.state.ctx, self.state.class_name, self.state.path, None,
              'Leaving scope. Time elapsed: {} ms'.format((datetime.utcnow() - self.time).seconds * 1000))
        self.state.ctx.events._disable()


def _enter_scope(class_name: str, ctx: 'CdmCorpusContext', path: str) -> _LoggerScope:
    """
    Creates a new LoggerScope instance with the provided details of the scope being entered.
    To be used at beginning of functions via resource wrapper 'with ...: # function body.
    """
    return _LoggerScope(_TState(class_name, ctx, path))