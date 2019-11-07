// -----------------------------------------------------------------------
// <copyright file="Logger.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

using Microsoft.CommonDataModel.ObjectModel.Cdm;
using System;

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Logging
{
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

                        var logfile = new NLog.Targets.FileTarget("logfile") {
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
        /// <param name="tag">The tag, usually the class which is calling the method.</param>
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="message">The message.</param>
        /// <param name="path">The path, usually denotes the class and method calling this method.</param>
        public static void Debug(string tag, CdmCorpusContext ctx, string message, string path = null)
        {
            var logMessage = FormatMessage(tag, message, path);
            if (ctx != null && ctx.StatusEvent != null)
            {
                ctx.StatusEvent.Invoke(Cdm.CdmStatusLevel.Progress, logMessage);
            }
            else
            {
                DefaultLogger.Debug(logMessage);
            }
        }

        /// <summary>
        /// Log to INFO level.
        /// </summary>
        /// <param name="tag">The tag, usually the class which is calling the method.</param>
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="message">The message.</param>
        /// <param name="path">The path, usually denotes the class and method calling this method.</param>
        public static void Info(string tag, CdmCorpusContext ctx, string message, string path = null)
        {
            var logMessage = FormatMessage(tag, message, path);
            if (ctx != null && ctx.StatusEvent != null)
            {
                ctx.StatusEvent.Invoke(Cdm.CdmStatusLevel.Info, logMessage);
            }
            else
            {
                DefaultLogger.Info(logMessage);
            }
        }

        /// <summary>
        /// Log to WARNING level.
        /// </summary>
        /// <param name="tag">The tag, usually the class which is calling the method.</param>
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="message">The message.</param>
        /// <param name="path">The path, usually denotes the class and method calling this method.</param>
        public static void Warning(string tag, CdmCorpusContext ctx, string message, string path = null)
        {
            var logMessage = FormatMessage(tag, message, path);
            if (ctx != null && ctx.StatusEvent != null)
            {
                ctx.StatusEvent.Invoke(Cdm.CdmStatusLevel.Warning, logMessage);
            }
            else
            {
                DefaultLogger.Warn(logMessage);
            }
        }

        /// <summary>
        /// Log to ERROR level.
        /// </summary>
        /// <param name="tag">The tag, usually the class which is calling the method.</param>
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="message">The message.</param>
        /// <param name="path">The path, usually denotes the class and method calling this method.</param>
        public static void Error(string tag, CdmCorpusContext ctx, string message, string path = null)
        {
            var logMessage = FormatMessage(tag, message, path);
            if (ctx != null && ctx.StatusEvent != null)
            {
                ctx.StatusEvent.Invoke(Cdm.CdmStatusLevel.Error, logMessage);
            }
            else
            {
                DefaultLogger.Error(logMessage);
            }
        }

        /// <summary>
        /// Formats the message into a string.
        /// </summary>
        /// <param name="tag">The tag, usually the class which is calling the method.</param>
        /// <param name="message">The message.</param>
        /// <param name="path">The path, usually denotes the class and method calling this method.</param>
        /// <returns>A formated string.</returns>
        private static string FormatMessage(string tag, string message, string path = null)
        {
            return (path != null) ? $"{tag} | {message} | {path}" :
                $"{tag} | {message}";
        }
    }
}
