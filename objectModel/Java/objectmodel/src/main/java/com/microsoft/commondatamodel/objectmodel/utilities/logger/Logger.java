// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities.logger;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import org.slf4j.LoggerFactory;

import java.text.MessageFormat;
import java.util.function.Consumer;

public class Logger {
  private static final org.slf4j.Logger defaultLogger = LoggerFactory.getLogger(Logger.class);

  /**
   * Log to DEBUG level.
   * @param tag The tag, usually the class that is calling the method.
   * @param ctx The CDM corpus context.
   * @param message The message.
   */
  public static void debug(String tag, CdmCorpusContext ctx, String message) {
    debug(tag, ctx, message, null);
  }

  /**
   * Log to DEBUG level.
   * @param tag The tag, usually the class that is calling the method.
   * @param ctx The CDM corpus context.
   * @param message The message.
   * @param path The path, usually denotes the class and method calling this method.
   */
  public static void debug(String tag, CdmCorpusContext ctx, String message, String path) {
    Consumer<String> statusEvent = (msg) -> {
      defaultLogger.debug(msg);
    };
    log(CdmStatusLevel.Progress, ctx, tag, message, path, statusEvent);
  }

  /**
   * Log to INFO level.
   * @param tag The tag, usually the class that is calling the method.
   * @param ctx The CDM corpus context.
   * @param message The message.
   */
  public static void info(String tag, CdmCorpusContext ctx, String message) {
    info(tag, ctx, message, null);
  }

  /**
   * Log to INFO level.
   * @param tag The tag, usually the class that is calling the method.
   * @param ctx The CDM corpus context.
   * @param message The message.
   * @param path The path, usually denotes the class and method calling this method.
   */
  public static void info(String tag, CdmCorpusContext ctx, String message, String path) {
    Consumer<String> statusEvent = (msg) -> {
      defaultLogger.info(msg);
    };
    log(CdmStatusLevel.Info, ctx, tag, message, path, statusEvent);
  }

  /**
   * Log to WARNING level.
   * @param tag The tag, usually the class that is calling the method.
   * @param ctx The CDM corpus context.
   * @param message The message.
   */
  public static void warning(String tag, CdmCorpusContext ctx, String message) {
    warning(tag, ctx, message, null);
  }

  /**
   * Log to WARNING level.
   * @param tag The tag, usually the class that is calling the method.
   * @param ctx The CDM corpus context.
   * @param message The message.
   * @param path The path, usually denotes the class and method calling this method.
   */
  public static void warning(String tag, CdmCorpusContext ctx, String message, String path) {
    Consumer<String> statusEvent = (msg) -> {
      defaultLogger.warn(msg);
    };
    log(CdmStatusLevel.Warning, ctx, tag, message, path, statusEvent);
  }

  /**
   * Log to ERROR level.
   * @param tag The tag, usually the class that is calling the method.
   * @param ctx The CDM corpus context.
   * @param message The message.
   */
  public static void error(String tag, CdmCorpusContext ctx, String message) {
    error(tag, ctx, message, null);
  }

  /**
   * Log to ERROR level.
   * @param tag The tag, usually the class that is calling the method.
   * @param ctx The CDM corpus context.
   * @param message The message.
   * @param path The path, usually denotes the class and method calling this method.
   */
  public static void error(String tag, CdmCorpusContext ctx, String message, String path) {
    Consumer<String> statusEvent = (msg) -> {
      defaultLogger.error(msg);
    };
    log(CdmStatusLevel.Error, ctx, tag, message, path, statusEvent);
  }

  /**
   * Formats the message into a string.
   * @param tag The tag, usually the class that is calling the method.
   * @param message The message.
   * @param path The path, usually denotes the class and method calling this method.
   * @return A formatted string.
   */
  private static String formatMessage(String tag, String message, String path) {
    return (path != null) ? MessageFormat.format("{0} | {1} | {2}", tag, message, path) : MessageFormat.format("{0} | {1}", tag, message);
  }

  /**
   * Log to the specified status level by using the status event on the corpus context (if it exists) or the default status event.
   * @param level The status level to log to.
   * @param ctx The CDM corpus context.
   * @param tag The tag, usually the class that is calling the method.
   * @param message The message.
   * @param path The path, usually denotes the class and method calling this method.
   * @param defaultStatusEvent The default status event (log using the default logger).
   */
  private static void log(CdmStatusLevel level, CdmCorpusContext ctx, String tag, String message, String path, Consumer<String> defaultStatusEvent) {
    if (level.compareTo(ctx.getReportAtLevel()) >= 0) {
      String formattedMessage = formatMessage(tag, message, path);
      if (ctx != null && ctx.getStatusEvent() != null) {
        ctx.getStatusEvent().apply(level, formattedMessage);
      } else {
        defaultStatusEvent.accept(message);
      }
    }
  }

  /**
   * Formats a log message with the provided arguments. Ex. format("An error occurred. Reason: '{0}'", exception).
   * Replaces all single quotes in the message with double single quotes before formatting. This is because MessageFormat
   * uses the single quote character to mark regions that should not be formatted, so we need to escape it by adding
   * another single quote character.
   * @param str The log message to format.
   * @param arguments The arguments to format the log message with.
   * @return The formatted message.
   *
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public static String format(final String str, final Object... arguments) {
    if (str == null) {
      return null;
    }
    return MessageFormat.format(str.replace("'", "''"), arguments);
  }
}
