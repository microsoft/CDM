// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities.logger;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionPatternDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReferenceBase;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.StorageUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;

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
  private static final ResourceBundle resource = ResourceBundle.getBundle("LogMessages");

  /**
   * Log to DEBUG level.
   * @param ctx The CDM corpus context.
   * @param classname The classname, usually the class that is calling the method.
   * @param method The method, usually denotes method calling this
   * @param corpuspath The corpuspath, usually denotes corpus path of document.
   * @param message The message.
   * @param ingestTelemetry Whether the log is required to be ingested.
   */
  public static void debug(CdmCorpusContext ctx, String classname, String method, String corpuspath, String message, boolean ingestTelemetry) {
    log(CdmStatusLevel.Progress, ctx, classname, message, method, System.out::println, corpuspath, CdmLogCode.None, ingestTelemetry);
  }

  /**
   * Log to DEBUG level. Set ingestTelemetry to false by default.
   */
  public static void debug(CdmCorpusContext ctx, String classname, String method, String corpuspath, String message) {
    debug(ctx, classname, method, corpuspath, message, false);
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
    log(CdmStatusLevel.Info, ctx, classname, message, method, System.out::println, corpuspath, CdmLogCode.None);
  }

  /**
   * Log to WARNING level.
   * 
   * @param classname The classname, usually the class that is calling the method.
   * @param ctx The CDM corpus context.
   * @param method The method, usually denotes the class and method calling this
   *    method.
   * @param corpuspath The corpuspath, usually denotes corpus path of document.
   * @param code The code, denotes the code enum for a message..
   * @param args The args, denotes the arguments inserts into the
   *       message.
   */
  public static void warning(CdmCorpusContext ctx, String classname, String method, String corpuspath, CdmLogCode code, String... args) {
    // Get message from resource for the code enum.
    String message = getMessagefromResourceFile(code, args);
    log(CdmStatusLevel.Warning, ctx, classname, message, method, System.out::println, corpuspath, code);
  }

  /**
   * Log to ERROR level.
   * 
   * @param ctx The CDM corpus context.
   * @param classname The classname, usually the class that is calling the method.
   * @param method The method, usually denotes method calling this
   *        method.
   * @param corpuspath The corpuspath, usually denotes corpus path of document.
   * @param code The code, denotes the code enum for a message..
   * @param args The args, denotes the arguments inserts into the
   */
  public static void error(CdmCorpusContext ctx, String classname, String method, String corpuspath, CdmLogCode code, String... args) {
    // Get message from resource for the code enum.
    String message = getMessagefromResourceFile(code, args);
    log(CdmStatusLevel.Error, ctx, classname, message, method, System.err::println, corpuspath, code);
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
   * @param ingestTelemetry Whether the log is required to be ingested.
   */
  private static void log(CdmStatusLevel level, CdmCorpusContext ctx, String classname, String message, String method,
      Consumer<String> defaultStatusEvent, String corpuspath, CdmLogCode code, boolean ingestTelemetry) {
    if (ctx.getSuppressedLogCodes().contains(code))
      return;

    // Write message to the configured logger
    if (level.compareTo(ctx.getReportAtLevel()) >= 0) {
      final String timestamp = TimeUtils.formatDateStringIfNotNull(OffsetDateTime.now(ZoneOffset.UTC));

      // Store a record of the event.
      // Save some dict init and string formatting cycles by checking
      // whether the recording is actually enabled.
      if (ctx.getEvents().isRecording()) {
        Map<String, String> theEvent = new HashMap<>();
        theEvent.put("timestamp", timestamp);
        theEvent.put("level", level.name());
        theEvent.put("class", classname);
        theEvent.put("message", message);
        theEvent.put("method", method);

        if (level == CdmStatusLevel.Error || level == CdmStatusLevel.Warning) {
          theEvent.put("code", code.name());
        }

        if (ctx.getCorrelationId() != null) {
          theEvent.put("cid", ctx.getCorrelationId());
        }

        if (corpuspath != null) {
          theEvent.put("path", corpuspath);
        }

        ctx.getEvents().add(theEvent);
      }

      String formattedMessage = formatMessage(classname, message, method, ctx.getCorrelationId(), corpuspath);

      if (ctx.getStatusEvent() != null) {
        ctx.getStatusEvent().apply(level, formattedMessage);
      } else {
        defaultStatusEvent.accept(message);
      }

      // Ingest the logs into telemetry database
      if (ctx.getCorpus().getTelemetryClient() != null) {
        ctx.getCorpus().getTelemetryClient().addToIngestionQueue
          (timestamp, level, classname, method, corpuspath, message, ingestTelemetry, code);
      }
    }
  }

  /**
   * Log to the specified status level by using the status event on the corpus
   * context (if it exists) or the default logger. The log level, classname, message and
   * path values are also added as part of a new entry to the log recorder.
   * Set ingestTelemetry to false by default.
   */
  private static void log(CdmStatusLevel level, CdmCorpusContext ctx, String classname, String message, String method,
    Consumer<String> defaultStatusEvent, String corpuspath, CdmLogCode code) {
    log(level, ctx, classname, message, method, defaultStatusEvent, corpuspath, code, false);
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
        builder = builder.replace(builder.indexOf(from), builder.indexOf(from) + from.length(), x == null ? "" : x);
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
    private boolean isTopLevelMethod = false;

    public LoggerScope(TState state) {
      time = Instant.now();
      this.state = state;
      state.ctx.getEvents().enable();

      // check if the method is at the outermost level
      if (state.ctx.getEvents().getNestingLevel() == 1) {
        isTopLevelMethod = true;
      }

      debug(state.ctx, state.classname, state.path, null, "Entering scope");
    }

    @Override
    public void close() {
      String message = Logger.format("Leaving scope. Time Elapsed: {0} ms; Cache memory used: {1}",
        String.valueOf(Duration.between(time, Instant.now()).toMillis()), ((ResolveContext)state.ctx).getCache().size());

      debug(state.ctx, state.classname, state.path, null, message, isTopLevelMethod);

      state.ctx.getEvents().disable();
    }
  }

  /**
   * Construct a message for the input manifest info and log the message.
   * 
   * @param manifest The manifest to be logged.
   * @param ctx The CDM corpus context.
   * @param className Usually the class that is calling the method.
   * @param method Usually denotes method calling this method.
   * @param corpusPath Usually denotes corpus path of document.
   */
  public static void ingestManifestTelemetry(final CdmManifestDefinition manifest,
    final CdmCorpusContext ctx, final String className, final String method, final String corpusPath) {

    // Get the namespace of the storage for the manifest
    String storageNamespace = manifest.getNamespace();

    if (StringUtils.isNullOrEmpty(storageNamespace)) {
      storageNamespace = manifest.getCtx().getCorpus().getStorage().getDefaultNamespace();
    }

    // Get storage adapter type
    final StorageAdapter adapter = manifest.getCtx().getCorpus().getStorage().fetchAdapter(storageNamespace);
    final String adapterType = adapter.getClass().getSimpleName();

    String message = Logger.format("ManifestStorage:{0};", adapterType);

    final Map<String, Integer> manifestInfo = new HashMap<>();

    manifestInfo.put("RelationshipNum", manifest.getRelationships().getCount());

    final int entityNum = manifest.getEntities().getCount();
    manifestInfo.put("EntityNum", entityNum);

    // Counts the total number partitions in the manifest
    int partitionNum = 0;

    // Counts the number of different partition patterns in all the entities
    int partitionGlobPatternNum = 0;
    int partitionRegExPatternNum = 0;

    // Counts the number of standard entities
    int standardEntityNum = 0;

    // Get detailed info for each entity
    for (final CdmEntityDeclarationDefinition entityDec : manifest.getEntities()) {
      // Get data partition info, if any
      if (entityDec.getDataPartitions() != null) {
        partitionNum += entityDec.getDataPartitions().getCount();

        for (final CdmDataPartitionPatternDefinition pattern : entityDec.getDataPartitionPatterns()) {
          // If both globPattern and regularExpression is set, globPattern will be used.
          if (pattern.getGlobPattern() != null) {
            partitionGlobPatternNum++;
          }
          else if (pattern.getRegularExpression() != null) {
            partitionRegExPatternNum++;
          }
        }
      }

      // Check if entity is standard
      final String entityNamespace = StorageUtils.splitNamespacePath(entityDec.getEntityPath()).left;

      if (entityNamespace == "cdm") {
        standardEntityNum++;
      }
    }

    // Add all cumulated entity info
    manifestInfo.put("PartitionNum", partitionNum);
    manifestInfo.put("PartitionGlobPatternNum", partitionGlobPatternNum);
    manifestInfo.put("PartitionRegExPatternNum", partitionRegExPatternNum);
    manifestInfo.put("StandardEntityNum", standardEntityNum);
    manifestInfo.put("CustomEntityNum", entityNum - standardEntityNum);

    // Serialize manifest info dictionary
    message += serializeMap(manifestInfo);

    debug(ctx, className, method, corpusPath, MessageFormat.format("Manifest Info: '{'{0}'}'", message), true);
  }

  /**
   * Construct a message for the input entity data and log the message.
   * 
   * @param entity The entity to be logged.
   * @param ctx The CDM corpus context.
   * @param className Usually the class that is calling the method.
   * @param method Usually denotes method calling this method.
   * @param corpusPath Usually denotes corpus path of document.
   */
  public static void ingestEntityTelemetry(final CdmEntityDefinition entity,
    final CdmCorpusContext ctx, final String className, final String method, final String corpusPath) {

    // Get entity storage namespace
    String entityNamespace = entity.getInDocument().getNamespace();

    if (StringUtils.isNullOrEmpty(entityNamespace)) {
      entityNamespace = entity.getCtx().getCorpus().getStorage().getDefaultNamespace();
    }

    // Get storage adapter type
    final StorageAdapter adapter = entity.getCtx().getCorpus().getStorage().fetchAdapter(entityNamespace);
    final String adapterType = adapter.getClass().getSimpleName();

    String message = Logger.format("EntityStorage:{0};EntityNamespace:{1};", adapterType, entityNamespace);

    // Collect all entity info
    final Map<String, Integer> entityInfo = formEntityInfoDict(entity);

    message += serializeMap(entityInfo);

    debug(ctx, className, method, corpusPath, MessageFormat.format("Entity Info: '{'{0}'}'", message), true);
  }

  /**
   * Construct a message consisting of all the information about the input entity.
   * 
   * @param entity The entity to be logged.
   * 
   * @return A dictionary containing all entity info.
   */
  private static Map<String, Integer> formEntityInfoDict(final CdmEntityDefinition entity) {
    Map<String, Integer> entityInfo = new HashMap<String, Integer>();

    // Check whether entity is resolved
    int isResolved = 0;

    if (entity.getAttributeContext() != null) {
      isResolved = 1;
    }

    entityInfo.put("ResolvedEntity", isResolved);
    entityInfo.put("ExhibitsTraitNum", entity.getExhibitsTraits().getCount());
    entityInfo.put("AttributeNum", entity.getAttributes().getCount());

    // The number of traits whose name starts with "means."
    int semanticsTraitNum = 0;

    for (final CdmTraitReferenceBase trait : entity.getExhibitsTraits()) {
      if (trait.fetchObjectDefinitionName().startsWith("means.")) {
        semanticsTraitNum++;
      }
    }

    entityInfo.put("SemanticsTraitNum", semanticsTraitNum);

    return entityInfo;
  }

  /**
   * Serialize the map and return a string.
   * 
   * @param map The map object to be serialized.
   * 
   * @return The serialized map.
   */
  private static String serializeMap(final Map<String, Integer> map) {
    final StringBuilder mapAsString = new StringBuilder();

    for (final String key : map.keySet()) {
      mapAsString.append(key + ":" + map.get(key) + ";");
    }

    return mapAsString.toString();
  }
}
