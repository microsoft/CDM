// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Logging
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using System;
    using System.Collections.Generic;
    using System.Reflection;
    using System.Resources;
    using System.Text;

    public class Logger
    {
        private static NLog.Logger defaultLogger = null;
        private static ResourceManager resManager = new ResourceManager("Microsoft.CommonDataModel.ObjectModel.Resx.LogMessages", Assembly.GetExecutingAssembly());

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
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="className">The className, usually the class that is calling the method.</param>
        /// <param name="method">The method, usually denotes method calling this method.</param>
        /// <param name="corpusPath">The corpusPath, usually denotes corpus path of document.</param>
        /// <param name="message">The message.</param>
        public static void Debug(CdmCorpusContext ctx, string className, string method, string corpusPath, string message)
        {
            if (CdmStatusLevel.Progress >= ctx.ReportAtLevel)
            {
                Log(CdmStatusLevel.Progress, ctx, className, message, method, DefaultLogger.Debug, corpusPath);
            }
        }

        /// <summary>
        /// Log to INFO level.
        /// </summary>
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="className">The className, usually the class that is calling the method.</param>
        /// <param name="method">The method, usually denotes method calling this method.</param>
        /// <param name="corpusPath">The corpusPath, usually denotes corpus path of document.</param>
        /// <param name="message">The message.</param>
        public static void Info(CdmCorpusContext ctx, string className, string method, string corpusPath, string message)
        {
            if (CdmStatusLevel.Info >= ctx.ReportAtLevel)
            {
                Log(CdmStatusLevel.Info, ctx, className, message, method, DefaultLogger.Info, corpusPath);
            }
        }

        /// <summary>
        /// Log to WARNING level.
        /// </summary>
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="className">The className, usually the class that is calling the method.</param>
        /// <param name="method">The method, usually denotes the method calling this method.</param>
        /// <param name="corpusPath">The corpusPath, usually denotes corpus path of document.</param>
        /// <param name="code">The code, denotes the code enum for a message.</param>
        /// <param name="args">The args, denotes the arguments inserted into the messages.</param>
        public static void Warning(CdmCorpusContext ctx, string className, string method, string corpusPath, CdmLogCode code, params string[] args)
        {
            if (CdmStatusLevel.Warning >= ctx.ReportAtLevel)
            {
                // Get message from resource for the code enum.
                string message = GetMessagefromResourceFile(code, args);

                Log(CdmStatusLevel.Warning, ctx, className, message, method, DefaultLogger.Warn, corpusPath, code);
            }
        }

        /// <summary>
        /// Log to ERROR level.This is extension to Error function for new logging.
        /// </summary>
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="className">The className, usually the class that is calling the method.</param>
        /// <param name="method">The path, usually denotes the method calling this method.</param>
        /// <param name="corpusPath">The corpusPath, usually denotes corpus path of document.</param>
        /// <param name="code">The code, denotes the code enum for a message.</param>
        /// <param name="args">The args, denotes the arguments inserted into the messages.</param>
        public static void Error(CdmCorpusContext ctx, string className, string method, string corpusPath, CdmLogCode code, params string[] args)
        {
            if (CdmStatusLevel.Error >= ctx.ReportAtLevel)
            {
                // Get message from resource for the code enum.
                string message = GetMessagefromResourceFile(code, args);

                Log(CdmStatusLevel.Error, ctx, className, message, method, DefaultLogger.Error, corpusPath, code);
            }
        }

        /// <summary>
        /// Formats the message into a string.
        /// </summary>
        /// <param name="className">The className, usually the class that is calling the method.</param>
        /// <param name="message">The message.</param>
        /// <param name="path">The path, usually denotes method calling this method.</param>
        /// <param name="correlationId">Optional correlation ID.</param>
        /// <returns>A formatted string.</returns>
        private static string FormatMessage(string className, string message, string method = null, string correlationId = null, string corpusPath = null)
        {
            return $"{className} | {message}{(method != null ? " | " + method : "")}{(correlationId != null ? " | " + correlationId : "")}{(corpusPath != null ? " | " + corpusPath : "")}";
        }

        /// <summary>
        /// Log to the specified status level by using the status event on the corpus context (if it exists) or to the default logger.
        /// The log level, className, message and path values are also added as part of a new entry to the log recorder.
        /// </summary>
        /// <param name="level">The status level to log to.</param>
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="className">The className, usually the class that is calling the method.</param>
        /// <param name="message">The message.</param>
        /// <param name="method">The path, usually denotes the class and method calling this method.</param>
        /// <param name="defaultStatusEvent">The default status event (log using the default logger).</param>
        /// <param name="code">The code(optional), denotes the code enum for a message.</param>
        private static void Log(CdmStatusLevel level, CdmCorpusContext ctx, string className, string message, string method, Action<string> defaultStatusEvent, string corpusPath, CdmLogCode code = CdmLogCode.None)
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
                        { "class", className },
                        { "message", message },
                        { "method", method }
                    };

                if (level == CdmStatusLevel.Error || level == CdmStatusLevel.Warning)
                {
                    theEvent.Add("code", code.ToString());
                }

                if (ctx.CorrelationId != null)
                {
                    theEvent.Add("correlationId", ctx.CorrelationId);
                }

                if (corpusPath != null)
                {
                    theEvent.Add("corpuspath", corpusPath);
                }

                ctx.Events.Add(theEvent);
            }

            string formattedMessage = FormatMessage(className, message, method, ctx.CorrelationId, corpusPath);

            if (ctx.StatusEvent != null)
            {
                ctx.StatusEvent.Invoke(level, formattedMessage);
            }
            else
            {
                defaultStatusEvent(formattedMessage);
            }
        }

        /// <summary>
        /// Loads the string from resource file for particular enum and inserts arguments in it.
        /// </summary>
        /// <param name="code">The code, denotes the code enum for a message.</param>
        /// <param name="args">The args, denotes the arguments inserts into the messages.</param>
        private static string GetMessagefromResourceFile(CdmLogCode code, params string[] args)
        {
            StringBuilder builder = new StringBuilder(resManager.GetString(code.ToString()));

            int i = 0;
            foreach (string x in args)
            {
                string str = "{" + i + "}";
                builder.Replace(str, x);
                i++;
            }

            return builder.ToString();
        }

        /// <summary>
        /// Creates a new LoggerScope instance with the provided details of the scope being entered.
        /// To be used at beginning of functions via resource wrapper 'using (...) { // function body }'.
        /// </summary>
        /// <param name="className">Tag (class name)</param>
        /// <param name="ctx">Corpus context </param>
        /// <param name="path">Path (usually method name or document path)</param>
        /// <returns>LoggerScope instance</returns>
        internal static IDisposable EnterScope(string className, CdmCorpusContext ctx, string path)
        {
            return new LoggerScope(new TState(className, ctx, path));
        }

        /// <summary>
        /// Helper struct to keep few needed bits of information about the logging scope.
        /// </summary>
        private sealed class TState
        {
            public string Tag { get; set; }
            public CdmCorpusContext Ctx { get; set; }
            public string Path { get; set; }

            public TState(string className, CdmCorpusContext ctx, string path)
            {
                Tag = className;
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
            private DateTime time;

            public LoggerScope(TState state)
            {
                time = DateTime.UtcNow;
                this.state = state;
                state.Ctx.Events.Enable();
                Debug(state.Ctx, state.Tag, state.Path, null, message: "Entering scope");
            }

            public void Dispose()
            {
                Debug(state.Ctx, state.Tag, state.Path, null, message: $"Leaving scope. Time elapsed: {(DateTime.UtcNow - time).TotalMilliseconds} ms");
                state.Ctx.Events.Disable();
            }
        }
    }
}
