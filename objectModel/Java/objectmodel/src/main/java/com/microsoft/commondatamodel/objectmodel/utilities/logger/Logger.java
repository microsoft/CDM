// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities.logger;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import org.slf4j.LoggerFactory;

import java.text.MessageFormat;
import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;
import java.util.ResourceBundle;

public class Logger {
  private static final org.slf4j.Logger defaultLogger = LoggerFactory.getLogger(Logger.class);
  private static final ResourceBundle resource = ResourceBundle.getBundle("LogMessages");

  /**
   * Log to DEBUG level.
   * @param ctx The CDM corpus context.
   * @param classname The classname, usually the class that is calling the method.
   * @param method The method, usually denotes method calling this
   * @param corpuspath The corpuspath, usually denotes corpus path of document.
   * @param message The message.
   */
  public static void debug(CdmCorpusContext ctx, String classname, String method, String corpuspath, String message) {
    if (CdmStatusLevel.Progress.compareTo(ctx.getReportAtLevel()) >= 0) {
      Consumer<String> statusEvent = defaultLogger::debug;
      log(CdmStatusLevel.Progress, ctx, classname, message, method, statusEvent, corpuspath, CdmLogCode.None);
    }
  }

   /**
   * Log to INFO level.
    * @param ctx The CDM corpus context.
    * @param classname The classname, usually the class that is calling the method.
    * @param method The method, usually denotes method calling this
    * @param corpuspath The corpuspath, usually denotes corpus path of document.
    * @param message The message.
    */
  public static void info(CdmCorpusContext ctx, String classname, String method, String corpuspath, String message) {
    if (CdmStatusLevel.Info.compareTo(ctx.getReportAtLevel()) >= 0) {
      Consumer<String> statusEvent = defaultLogger::info;
      log(CdmStatusLevel.Info, ctx, classname, message, method, statusEvent, corpuspath, CdmLogCode.None);
    }
  }

  /**
   * Log to WARNING level.
   * 
   * @param classname The classname, usually the class that is calling the method.
   * @param ctx The CDM corpus context.
   * @param message The message.
   * @param method The method, usually denotes the class and method calling this
   *    method.
   * @param corpuspath The corpuspath, usually denotes corpus path of document.
   * @param code The code, denotes the code enum for a message..
   * @param args The args, denotes the arguments inserts into the
   *       message.
   */
  public static void warning(CdmCorpusContext ctx, String classname, String method, String corpuspath, CdmLogCode code, String... args) {
    if (CdmStatusLevel.Warning.compareTo(ctx.getReportAtLevel()) >= 0) {
      Consumer<String> statusEvent = defaultLogger::warn;
      // Get message from resource for the code enum.
      String message = getMessagefromResourceFile(code, args);
      log(CdmStatusLevel.Warning, ctx, classname, message, method, statusEvent, corpuspath, code);
    }
  }

  /**
   * Log to ERROR level.
   * 
   * @param ctx The CDM corpus context.
   * @param classname The classname, usually the class that is calling the method.
   * @param message The message.
   * @param method The method, usually denotes method calling this
   *        method.
   * @param corpuspath The corpuspath, usually denotes corpus path of document.
   * @param code The code, denotes the code enum for a message..
   * @param args The args, denotes the arguments inserts into the
   */
  public static void error(CdmCorpusContext ctx, String classname, String method, String corpuspath, CdmLogCode code, String... args) {
    if (CdmStatusLevel.Error.compareTo(ctx.getReportAtLevel()) >= 0) {
      Consumer<String> statusEvent = defaultLogger::error;
      // Get message from resource for the code enum.
      String message = getMessagefromResourceFile(code, args);
      log(CdmStatusLevel.Error, ctx, classname, message, method, statusEvent, corpuspath, code);
    }
  }

  /**
   * Formats the message into a string.
   * 
   * @param classname The classname, usually the class that is calling the method.
   * @param message The message.
   * @return A formatted string.
   */
  private static String formatMessage(String classname, String message) {
    return formatMessage(classname, message, null, null, null);
  }

  /**
   * Formats the message into a string.
   * 
   * @param classname The classname, usually the class that is calling the method.
   * @param message The message.
   * @param method The method, usually method calling this method.
   * @return A formatted string.
   */
  private static String formatMessage(String classname, String message, String method) {
    return formatMessage(classname, message, method, null, null);
  }

  /**
   * Formats the message into a string.
   * 
   * @param classname The classname, usually the class that is calling the method.
   * @param message The message.
   * @param method The method, usually denotes method calling this
   *        method.
   * @param correlationId The correlation ID to attach to log messages
   * @return A formatted string.
   */
  private static String formatMessage(String classname, String message, String method, String correlationId, String corpuspath) {
    StringBuilder strBuf = new StringBuilder();

    strBuf.append(classname).append(" | ").append(message);

    if (method != null) {
      strBuf.append(" | ").append(method);
    }

    if (correlationId != null) {
      strBuf.append(" | ").append(correlationId);
    }

    if (corpuspath != null) {
      strBuf.append(" | ").append(corpuspath);
    }

    return strBuf.toString();
  }

  /**
   * Log to the specified status level by using the status event on the corpus
   * context (if it exists) or the default logger. The log level, classname, message and
   * path values are also added as part of a new entry to the log recorder.
   * 
   * @param level The status level to log to.
   * @param ctx The CDM corpus context.
   * @param classname The classname, usually the class that is calling the
   *       method.
   * @param message The message.
   * @param method The method, usually denotes method calling this
   *        method.
   * @param defaultStatusEvent The default status event (log using the default
   *       logger).
   * @param code The code, denotes the code enum for a message..
   */
  private static void log(CdmStatusLevel level, CdmCorpusContext ctx, String classname, String message, String method,
      Consumer<String> defaultStatusEvent, String corpuspath, CdmLogCode code) {
    // Write message to the configured logger

    // Store a record of the event.
    // Save some dict init and string formatting cycles by checking
    // whether the recording is actually enabled.
    if (ctx.getEvents().isRecording()) {
      Map<String, String> theEvent = new HashMap<>();
      theEvent.put("timestamp", TimeUtils.formatDateStringIfNotNull(OffsetDateTime.now(ZoneOffset.UTC)));
      theEvent.put("level", level.name());
      theEvent.put("class", classname);
      theEvent.put("message", message);
      theEvent.put("method", method);

      if (ctx.getCorrelationId() != null) {
        theEvent.put("code", code.name());
      }

      if (ctx.getCorrelationId() != null) {
        theEvent.put("correlationId", ctx.getCorrelationId());
      }

      if (corpuspath != null) {
        theEvent.put("corpuspath", corpuspath);
      }

      ctx.getEvents().add(theEvent);
    }

    String formattedMessage = formatMessage(classname, message, method, ctx.getCorrelationId(), corpuspath);

    if (ctx.getStatusEvent() != null) {
      ctx.getStatusEvent().apply(level, formattedMessage);
    } else {
      defaultStatusEvent.accept(message);
    }
  }

  /**
   * Loads the string from resource file for pritcluar enum and inserts arguments
   * in it.
   * 
   * @param code The path, denotes the code enum for a message..
   * @param args The path, denotes the arguments inserts into the message.
   */
  private static String getMessagefromResourceFile(CdmLogCode code, String... args) {
      StringBuilder builder = new StringBuilder(resource.getString(code.toString()));

      int i = 0;
      for (String x : args) {
        String from = "{" + i + "}";
        builder = builder.replace(builder.indexOf(from), builder.indexOf(from) + from.length(), x);
        i++;
      }
    return builder.toString();
  }

  /**
   * Formats a log message with the provided arguments. Ex. format("An error
   * occurred. Reason: '{0}'", exception). Replaces all single quotes in the
   * message with double single quotes before formatting. This is because
   * MessageFormat uses the single quote character to mark regions that should not
   * be formatted, so we need to escape it by adding another single quote
   * character.
   * 
   * @param str The log message to format.
   * @param arguments The arguments to format the log message with.
   * @return The formatted message.
   *
   * @deprecated This function is extremely likely to be removed in the public
   *     interface, and not meant to be called externally at all. Please
   *     refrain from using it.
   */
  @Deprecated
  public static String format(final String str, final Object... arguments) {
    if (str == null) {
      return null;
    }
    return MessageFormat.format(str.replace("'", "''"), arguments);
  }

  /**
   * Creates a new LoggerScope instance with the provided details of the scope
   * being entered. To be used at beginning of functions via resource wrapper
   * 'using (...) { // function body }'.
   * 
   * @param classname  classname (class name)
   * @param ctx  Corpus context
   * @param path Path (usually method name or document path)
   * @return LoggerScope instance
   */
  public static LoggerScope enterScope(String classname, CdmCorpusContext ctx, String path) {
    return new LoggerScope(new TState(classname, ctx, path));
  }

  /**
   * Helper struct to keep few needed bits of information about the logging scope.
   */
  private static class TState {
    public String classname;
    public CdmCorpusContext ctx;
    public String path;

    public TState(String classname, CdmCorpusContext ctx, String path) {
      this.classname = classname;
      this.ctx = ctx;
      this.path = path;
    }
  }

  /**
   * LoggerScope class is responsible for enabling/disabling event recording and
   * will log the scope entry/exit debug events.
   * 
   * @deprecated This function is extremely likely to be removed in the public
   *     interface, and not meant to be called externally at all. Please
   *     refrain from using it.
   */
  public static class LoggerScope implements AutoCloseable {
    private final TState state;
    private Instant time;

    public LoggerScope(TState state) {
      time = Instant.now();
      this.state = state;
      state.ctx.getEvents().enable();
      debug(state.ctx, state.classname, state.path, null, "Entering scope");
    }

    @Override
    public void close() {
      debug(state.ctx, state.classname, state.path, null, Logger.format("Leaving scope. Time Elapsed: {0} ms :", String.valueOf(Duration.between(time, Instant.now()).toMillis())));
      state.ctx.getEvents().disable();
    }
  }
}
