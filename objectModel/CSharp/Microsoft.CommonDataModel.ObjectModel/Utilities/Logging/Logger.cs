// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Logging
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using System;
    using System.Collections.Generic;

    public class Logger
    {
        private static NLog.Logger defaultLogger = null;

        /// <summary>
        /// The default logger, used if ctx doesn't provide status report.
        /// </summary>
        private static NLog.Logger DefaultLogger
        {
            get
            {
                if (defaultLogger == null)
                {
                    // Fetch the custom NLog configuration.
                    defaultLogger = NLog.LogManager.GetCurrentClassLogger();

                    // Default logger will always be created. But if warnings and errors are not enabled
                    // then we can safely assume that logger was not loaded properly and use default settings then.
                    if (!defaultLogger.IsWarnEnabled && !defaultLogger.IsErrorEnabled)
                    {
                        var config = new NLog.Config.LoggingConfiguration();
                        // Targets where to log to: File and Console.

                        var layout = "${callsite:className=false} ${longdate} ${threadid} ${level:uppercase=true} ${message}";

                        var logfile = new NLog.Targets.FileTarget("logfile")
                        {
                            Layout = layout,
                            FileName = "cdm_log_${date:format=yyyyMMdd}.txt"
                        };

                        var logconsole = new NLog.Targets.ConsoleTarget("logconsole")
                        {
                            Layout = layout
                        };

                        // Rules for mapping loggers to targets.
                        config.AddRule(NLog.LogLevel.Warn, NLog.LogLevel.Fatal, logconsole);
                        config.AddRule(NLog.LogLevel.Warn, NLog.LogLevel.Fatal, logfile);

                        // Apply config.
                        NLog.LogManager.Configuration = config;

                        defaultLogger = NLog.LogManager.GetCurrentClassLogger();
                    }
                }

                return defaultLogger;
            }
        }

        /// <summary>
        /// Log to DEBUG level.
        /// </summary>
        /// <param name="tag">The tag, usually the class that is calling the method.</param>
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="message">The message.</param>
        /// <param name="path">The path, usually denotes the class and method calling this method.</param>
        public static void Debug(string tag, CdmCorpusContext ctx, string message, string path = null)
        {
            Log(CdmStatusLevel.Progress, ctx, tag, message, path, DefaultLogger.Debug);
        }

        /// <summary>
        /// Log to INFO level.
        /// </summary>
        /// <param name="tag">The tag, usually the class that is calling the method.</param>
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="message">The message.</param>
        /// <param name="path">The path, usually denotes the class and method calling this method.</param>
        public static void Info(string tag, CdmCorpusContext ctx, string message, string path = null)
        {
            Log(CdmStatusLevel.Info, ctx, tag, message, path, DefaultLogger.Info);
        }

        /// <summary>
        /// Log to WARNING level.
        /// </summary>
        /// <param name="tag">The tag, usually the class that is calling the method.</param>
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="message">The message.</param>
        /// <param name="path">The path, usually denotes the class and method calling this method.</param>
        public static void Warning(string tag, CdmCorpusContext ctx, string message, string path = null)
        {
            Log(CdmStatusLevel.Warning, ctx, tag, message, path, DefaultLogger.Warn);
        }

        /// <summary>
        /// Log to ERROR level.
        /// </summary>
        /// <param name="tag">The tag, usually the class that is calling the method.</param>
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="message">The message.</param>
        /// <param name="path">The path, usually denotes the class and method calling this method.</param>
        public static void Error(string tag, CdmCorpusContext ctx, string message, string path = null)
        {
            Log(CdmStatusLevel.Error, ctx, tag, message, path, DefaultLogger.Error);
        }

        /// <summary>
        /// Formats the message into a string.
        /// </summary>
        /// <param name="tag">The tag, usually the class that is calling the method.</param>
        /// <param name="message">The message.</param>
        /// <param name="path">The path, usually denotes the class and method calling this method.</param>
        /// <param name="correlationId">Optional correlation ID.</param>
        /// <returns>A formatted string.</returns>
        private static string FormatMessage(string tag, string message, string path = null, string correlationId = null)
        {
            return $"{tag} | {message}{(path != null ? " | " + path : "")}{(correlationId != null ? " | " + correlationId : "")}";
        }

        /// <summary>
        /// Log to the specified status level by using the status event on the corpus context (if it exists) or to the default logger.
        /// The log level, tag, message and path values are also added as part of a new entry to the log recorder.
        /// </summary>
        /// <param name="level">The status level to log to.</param>
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="tag">The tag, usually the class that is calling the method.</param>
        /// <param name="message">The message.</param>
        /// <param name="path">The path, usually denotes the class and method calling this method.</param>
        /// <param name="defaultStatusEvent">The default status event (log using the default logger).</param>
        private static void Log(CdmStatusLevel level, CdmCorpusContext ctx, string tag, string message, string path, Action<string> defaultStatusEvent)
        {
            // Write message to the configured logger
            if (level >= ctx.ReportAtLevel)
            {
                // Store a record of the event.
                // Save some dict init and string formatting cycles by checking
                // whether the recording is actually enabled.
                if (ctx.Events.IsRecording)
                {
                    var theEvent = new Dictionary<string, string>
                    {
                        { "timestamp", TimeUtils.GetFormattedDateString(DateTimeOffset.UtcNow) },
                        { "level", level.ToString() },
                        { "tag", tag },
                        { "message", message },
                        { "path", path }
                    };

                    if (ctx.CorrelationId != null)
                    {
                        theEvent.Add("correlationId", ctx.CorrelationId);
                    }

                    ctx.Events.Add(theEvent);
                }

                string formattedMessage = FormatMessage(tag, message, path, ctx.CorrelationId);

                if (ctx.StatusEvent != null)
                {
                    ctx.StatusEvent.Invoke(level, formattedMessage);
                }
                else
                {
                    defaultStatusEvent(formattedMessage);
                }
            }
        }

        /// <summary>
        /// Creates a new LoggerScope instance with the provided details of the scope being entered.
        /// To be used at beginning of functions via resource wrapper 'using (...) { // function body }'.
        /// </summary>
        /// <param name="tag">Tag (class name)</param>
        /// <param name="ctx">Corpus context </param>
        /// <param name="path">Path (usually method name or document path)</param>
        /// <returns>LoggerScope instance</returns>
        internal static IDisposable EnterScope(string tag, CdmCorpusContext ctx, string path)
        {
            return new LoggerScope(new TState(tag, ctx, path));
        }

        /// <summary>
        /// Helper struct to keep few needed bits of information about the logging scope.
        /// </summary>
        private sealed class TState
        {
            public string Tag { get; set; }
            public CdmCorpusContext Ctx { get; set; }
            public string Path { get; set; }

            public TState(string tag, CdmCorpusContext ctx, string path)
            {
                Tag = tag;
                Ctx = ctx;
                Path = path;
            }
        }

        /// <summary>
        /// LoggerScope class is responsible for enabling/disabling event recording 
        /// and will log the scope entry/exit debug events.
        /// </summary>
        private sealed class LoggerScope : IDisposable
        {
            private readonly TState state;

            public LoggerScope(TState state)
            {
                this.state = state;
                state.Ctx.Events.Enable();
                Debug(state.Tag, state.Ctx, "Entering scope", state.Path);
            }

            public void Dispose()
            {
                Debug(state.Tag, state.Ctx, "Leaving scope", state.Path);
                state.Ctx.Events.Disable();
            }
        }
    }
}
