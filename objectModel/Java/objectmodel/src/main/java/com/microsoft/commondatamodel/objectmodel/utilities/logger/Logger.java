// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities.logger;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import org.slf4j.LoggerFactory;

import java.text.MessageFormat;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;
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
    Consumer<String> statusEvent = defaultLogger::debug;
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
    Consumer<String> statusEvent = defaultLogger::info;
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
    Consumer<String> statusEvent = defaultLogger::warn;
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
    Consumer<String> statusEvent = defaultLogger::error;
    log(CdmStatusLevel.Error, ctx, tag, message, path, statusEvent);
  }

  /**
   * Formats the message into a string.
   * @param tag The tag, usually the class that is calling the method.
   * @param message The message.
   * @return A formatted string.
   */
  private static String formatMessage(String tag, String message) {
    return formatMessage(tag, message, null);
  }

  /**
   * Formats the message into a string.
   * @param tag The tag, usually the class that is calling the method.
   * @param message The message.
   * @param path The path, usually denotes the class and method calling this method.
   * @return A formatted string.
   */
  private static String formatMessage(String tag, String message, String path) {
    return formatMessage(tag, message, path, null);
  }

  /**
   * Formats the message into a string.
   * @param tag The tag, usually the class that is calling the method.
   * @param message The message.
   * @param path The path, usually denotes the class and method calling this method.
   * @param correlationId The correlation ID to attach to log messages
   * @return A formatted string.
   */
  private static String formatMessage(String tag, String message, String path, String correlationId) {
    StringBuilder strBuf = new StringBuilder();

    strBuf.append(tag).append(" | ").append(message);

    if (path != null) {
      strBuf.append(" | ").append(path);
    }

    if (correlationId != null) {
      strBuf.append(" | ").append(correlationId);
    }

    return strBuf.toString();
  }

  /**
   * Log to the specified status level by using the status event on the corpus context (if it exists) or the default logger.
   * The log level, tag, message and path values are also added as part of a new entry to the log recorder.
   * @param level The status level to log to.
   * @param ctx The CDM corpus context.
   * @param tag The tag, usually the class that is calling the method.
   * @param message The message.
   * @param path The path, usually denotes the class and method calling this method.
   * @param defaultStatusEvent The default status event (log using the default logger).
   */
  private static void log(CdmStatusLevel level, CdmCorpusContext ctx, String tag, String message, String path, Consumer<String> defaultStatusEvent) {
    // Write message to the configured logger
    if (level.compareTo(ctx.getReportAtLevel()) >= 0) {
      // Store a record of the event.
      // Save some dict init and string formatting cycles by checking
      // whether the recording is actually enabled.
      if (ctx.getEvents().isRecording())  {
        Map<String, String> theEvent = new HashMap<>();
        theEvent.put("timestamp", TimeUtils.formatDateStringIfNotNull(OffsetDateTime.now(ZoneOffset.UTC)));
        theEvent.put("level", level.name());
        theEvent.put("tag", tag);
        theEvent.put("message", message);
        theEvent.put("path", path);

        if (ctx.getCorrelationId() != null) {
          theEvent.put("correlationId", ctx.getCorrelationId());
        }

        ctx.getEvents().add(theEvent);
      }

      String formattedMessage = formatMessage(tag, message, path, ctx.getCorrelationId());

      if (ctx.getStatusEvent() != null) {
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

  /**
   * Creates a new LoggerScope instance with the provided details of the scope being entered.
   * To be used at beginning of functions via resource wrapper 'using (...) { // function body }'.
   * @param tag Tag (class name)
   * @param ctx Corpus context
   * @param path Path (usually method name or document path)
   * @return LoggerScope instance
   */
  public static LoggerScope enterScope(String tag, CdmCorpusContext ctx, String path)  {
    return new LoggerScope(new TState(tag, ctx, path));
  }

  /**
   * Helper struct to keep few needed bits of information about the logging scope.
   */
  private static class TState  {
    public String tag;
    public CdmCorpusContext ctx;
    public String path;

    public TState(String tag, CdmCorpusContext ctx, String path) {
      this.tag = tag;
      this.ctx = ctx;
      this.path = path;
    }
  }

  /**
   * LoggerScope class is responsible for enabling/disabling event recording
   * and will log the scope entry/exit debug events.
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  public static class LoggerScope implements AutoCloseable {
    private final TState state;

    public LoggerScope(TState state) {
      this.state = state;
      state.ctx.getEvents().enable();
      debug(state.tag, state.ctx, "Entering scope", state.path);
    }

    @Override
    public void close() {
      debug(state.tag, state.ctx, "Leaving scope", state.path);
      state.ctx.getEvents().disable();
    }
  }
}
