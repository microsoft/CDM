# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

"""Contain logic to help format logging messages in a consistent way."""
from datetime import datetime
import logging
from typing import Callable, Optional, TYPE_CHECKING

from cdm.enums import CdmStatusLevel

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext

default_logger = logging.getLogger('cdm-python')
default_logger.setLevel(logging.INFO)

# Log to console by default if handler is not specified.
handler = logging.StreamHandler()
handler.setLevel(default_logger.level)
handler.setFormatter(logging.Formatter('%(asctime)s\t%(levelname)s\t%(filename)s:%(lineno)s\t%(funcName)s\t%(message)s'))

default_logger.handlers = [handler]  # Overwrite existing handler.


def debug(tag: str, ctx: 'CdmCorpusContext', message: str, path: Optional[str] = None) -> None:
    _log(CdmStatusLevel.PROGRESS, ctx, tag, message, path, default_logger.debug)


def info(tag: str, ctx: 'CdmCorpusContext', message: str, path: Optional[str] = None) -> None:
    _log(CdmStatusLevel.INFO, ctx, tag, message, path, default_logger.info)


def warning(tag: str, ctx: 'CdmCorpusContext', message: str, path: Optional[str] = None) -> None:
    _log(CdmStatusLevel.WARNING, ctx, tag, message, path, default_logger.warning)


def error(tag: str, ctx: 'CdmCorpusContext', message: str, path: Optional[str] = None) -> None:
    _log(CdmStatusLevel.ERROR, ctx, tag, message, path, default_logger.error)


def _log(level: 'CdmStatusLevel', ctx: 'CdmCorpusContext', tag: str, message: str, path: str, default_status_event: Callable) -> None:
    if level >= ctx.report_at_level:
        formatted_message = _format_message(tag, message, path)
        if ctx and ctx.status_event:
            ctx.status_event(level, formatted_message)
        else:
            default_status_event(formatted_message)


def _format_message(tag: str, message: str, path: Optional[str] = None) -> str:
    timestamp = _get_timestamp(datetime.utcnow())
    path = ' | {}'.format(path) if path is not None else ''
    return '{} | {} | {}'.format(timestamp, tag, message) + path


def _get_timestamp(date_time: datetime) -> str:
    return date_time.strftime('%Y/%m/%d %H:%M:%S,%f')[:-2]
