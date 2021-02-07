# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

"""Contain logic to help format logging messages in a consistent way."""
from datetime import datetime
import logging
from typing import Callable, Optional, TYPE_CHECKING

from cdm.enums import CdmStatusLevel
from cdm.utilities import time_utils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext

default_logger = logging.getLogger('cdm-python')
default_logger.setLevel(logging.INFO)

# Log to console by default if handler is not specified.
handler = logging.StreamHandler()
handler.setLevel(default_logger.level)
handler.setFormatter(
    logging.Formatter('%(asctime)s\t%(levelname)s\t%(filename)s:%(lineno)s\t%(funcName)s\t%(message)s'))

default_logger.handlers = [handler]  # Overwrite existing handler.


def debug(tag: str, ctx: 'CdmCorpusContext', message: str, path: Optional[str] = None) -> None:
    _log(CdmStatusLevel.PROGRESS, ctx, tag, message, path, default_logger.debug)


def info(tag: str, ctx: 'CdmCorpusContext', message: str, path: Optional[str] = None) -> None:
    _log(CdmStatusLevel.INFO, ctx, tag, message, path, default_logger.info)


def warning(tag: str, ctx: 'CdmCorpusContext', message: str, path: Optional[str] = None) -> None:
    _log(CdmStatusLevel.WARNING, ctx, tag, message, path, default_logger.warning)


def error(tag: str, ctx: 'CdmCorpusContext', message: str, path: Optional[str] = None) -> None:
    _log(CdmStatusLevel.ERROR, ctx, tag, message, path, default_logger.error)


def _log(level: 'CdmStatusLevel', ctx: 'CdmCorpusContext', tag: str, message: str, path: str,
         default_status_event: Callable) -> None:
    """
    Log to the specified status level by using the status event on the corpus context (if it exists) or to the default logger.
    The log level, tag, message and path values are also added as part of a new entry to the log recorder.
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
                'tag': tag,
                'message': message,
                'path': path
            }
            if ctx.correlation_id is not None:
                event['correlationId'] = ctx.correlation_id
            ctx.events.append(event)

        formatted_message = _format_message(tag, message, path, ctx.correlation_id)

        if ctx and ctx.status_event:
            ctx.status_event(level, formatted_message)
        else:
            default_status_event(formatted_message)


def _format_message(timestamp: str, tag: str, message: str, path: Optional[str] = None,
                    correlation_id: Optional[str] = None) -> str:
    path = ' | {}'.format(path) if path is not None else ''
    correlation_id = ' | {}'.format(correlation_id) if correlation_id is not None else ''
    return '{} | {} | {}'.format(timestamp, tag, message) + path + correlation_id


class _TState:
    """
    Helper struct to keep few needed bits of information about the logging scope.
    """

    def __init__(self, tag: str, ctx: 'CdmCorpusContext', path: str):
        self.tag = tag  # type: str
        self.ctx = ctx  # type: CdmCorpusContext
        self.path = path  # type: str


class _LoggerScope:
    """
    LoggerScope class is responsible for enabling/disabling event recording
    and will log the scope entry/exit debug events.
    """

    def __init__(self, state: _TState):
        self.state = state  # type: _TState

    def __enter__(self):
        self.state.ctx.events._enable()
        debug(self.state.tag, self.state.ctx, 'Entering scope', self.state.path)

    def __exit__(self, exc_type, exc_value, exc_traceback):
        debug(self.state.tag, self.state.ctx, 'Leaving scope', self.state.path)
        self.state.ctx.events._disable()


def _enter_scope(tag: str, ctx: 'CdmCorpusContext', path: str) -> _LoggerScope:
    """
    Creates a new LoggerScope instance with the provided details of the scope being entered.
    To be used at beginning of functions via resource wrapper 'with ...: # function body.
    """
    return _LoggerScope(_TState(tag, ctx, path))
