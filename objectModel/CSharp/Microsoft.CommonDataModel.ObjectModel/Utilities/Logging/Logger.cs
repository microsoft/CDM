// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities.Logging
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Reflection;
    using System.Resources;
    using System.Text;

    public class Logger
    {
        private static ResourceManager resManager = new ResourceManager("Microsoft.CommonDataModel.ObjectModel.Resx.LogMessages", Assembly.GetExecutingAssembly());

        /// <summary>
        /// Log to DEBUG level.
        /// </summary>
        /// <param name="ctx">The CDM corpus context.</param>
        /// <param name="className">The className, usually the class that is calling the method.</param>
        /// <param name="method">The method, usually denotes method calling this method.</param>
        /// <param name="corpusPath">The corpusPath, usually denotes corpus path of document.</param>
        /// <param name="message">The message.</param>
        public static void Debug(CdmCorpusContext ctx, string className, string method, string corpusPath, string message, bool ingestTelemetry = false)
        {
            Log(CdmStatusLevel.Progress, ctx, className, message, method, Console.WriteLine, corpusPath, ingestTelemetry: ingestTelemetry);
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
            Log(CdmStatusLevel.Info, ctx, className, message, method, Console.WriteLine, corpusPath);
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
            // Get message from resource for the code enum.
            string message = GetMessagefromResourceFile(code, args);

            Log(CdmStatusLevel.Warning, ctx, className, message, method, Console.WriteLine, corpusPath, code, true);
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
            // Get message from resource for the code enum.
            string message = GetMessagefromResourceFile(code, args);

            Log(CdmStatusLevel.Error, ctx, className, message, method, Console.Error.WriteLine, corpusPath, code, true);
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
        private static void Log(CdmStatusLevel level, CdmCorpusContext ctx, string className, string message, string method, 
            Action<string> defaultStatusEvent, string corpusPath, CdmLogCode code = CdmLogCode.None, bool ingestTelemetry = false)
        {
            if (ctx.SuppressedLogCodes.Contains(code))
                return;

            // Store a record of the event.
            // Save some dict init and string formatting cycles by checking
            // whether the recording is actually enabled.
            if (level >= ctx.ReportAtLevel)
            {
                string timestamp = TimeUtils.GetFormattedDateString(DateTimeOffset.UtcNow);

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
                        theEvent.Add("cid", ctx.CorrelationId);
                    }

                    if (corpusPath != null)
                    {
                        theEvent.Add("path", corpusPath);
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

                // Ingest the logs into telemetry database
                if (ctx.Corpus.TelemetryClient != null)
                {
                    ctx.Corpus.TelemetryClient.AddToIngestionQueue(timestamp, level, className, method, corpusPath, message, ingestTelemetry, code);
                }
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
            private bool isTopLevelMethod = false;

            public LoggerScope(TState state)
            {
                time = DateTime.UtcNow;
                this.state = state;
                state.Ctx.Events.Enable();

                // check if the method is at the outermost level
                if (state.Ctx.Events.nestingLevel == 1)
                {
                    isTopLevelMethod = true;
                }

                string message = "Entering scope";
                Debug(state.Ctx, state.Tag, state.Path, null, message: message);
            }

            public void Dispose()
            {
                string message = $"Leaving scope. Time elapsed: {(DateTime.UtcNow - time).TotalMilliseconds} ms"
                    + $"; Cache memory used: {(state.Ctx as ResolveContext).Cache.Count}";
                Debug(state.Ctx, state.Tag, state.Path, null, message: message, isTopLevelMethod);

                state.Ctx.Events.Disable();
            }
        }

        /// <summary>
        /// Construct a message for the input manifest info and log the message
        /// </summary>
        /// <param name="manifest">The manifest to be logged</param>
        /// <param name="ctx">CDM corpus context</param>
        /// <param name="className">Usually the class that is calling the method</param>
        /// <param name="method">Usually denotes method calling this method</param>
        /// <param name="corpusPath">Usually denotes corpus path of document</param>
        internal static void IngestManifestTelemetry(CdmManifestDefinition manifest,
            CdmCorpusContext ctx, string className, string method, string corpusPath)
        {
            // Get the namespace of the storage for the manifest
            string storageNamespace = manifest.Namespace;
            if (string.IsNullOrWhiteSpace(storageNamespace))
            {
                storageNamespace = manifest.Ctx.Corpus.Storage.DefaultNamespace;
            }
            
            // Get storage adapter type
            var adapter = manifest.Ctx.Corpus.Storage.FetchAdapter(storageNamespace);
            string adapterType = adapter.GetType().Name;

            string message = $"ManifestStorage:{adapterType};";

            Dictionary<string, int> manifestInfo = new Dictionary<string, int>();

            manifestInfo.Add("RelationshipNum", manifest.Relationships.Count);

            int entityNum = manifest.Entities.Count;
            manifestInfo.Add("EntityNum", entityNum);

            // Counts the total number partitions in the manifest
            int partitionNum = 0;

            // Counts the number of different partition partterns in all the entities
            int partitionGlobPatternNum = 0;
            int partitionRegExPatternNum = 0;

            // Counts the number of standard entities
            int standardEntityNum = 0;

            // Get detailed info for each entity
            foreach (CdmEntityDeclarationDefinition entityDec in manifest.Entities)
            {
                // Get data partition info, if any
                if (entityDec.DataPartitions != null)
                {
                    partitionNum += entityDec.DataPartitions.Count;

                    foreach (CdmDataPartitionPatternDefinition pattern in entityDec.DataPartitionPatterns)
                    {
                        // If both globPattern and regularExpression is set, globPattern will be used.
                        if (pattern.GlobPattern != null)
                        {
                            partitionGlobPatternNum++;
                        }
                        else if (pattern.RegularExpression != null)
                        {
                            partitionRegExPatternNum++;
                        }
                    }
                }

                // Check if entity is standard
                string entityNamespace = StorageUtils.SplitNamespacePath(entityDec.EntityPath).Item1;
                if (entityNamespace == "cdm")
                {
                    standardEntityNum++;
                }
            }

            // Add all cumulated entity info
            manifestInfo.Add("PartitionNum", partitionNum);
            manifestInfo.Add("PartitionGlobPatternNum", partitionGlobPatternNum);
            manifestInfo.Add("PartitionRegExPatternNum", partitionRegExPatternNum);
            manifestInfo.Add("StandardEntityNum", standardEntityNum);
            manifestInfo.Add("CustomEntityNum", entityNum - standardEntityNum);

            // Serialize manifest info dictionary
            message += SerializeDictionary(manifestInfo);

            Debug(ctx, className, method, corpusPath, $"Manifest Info: {{{message}}}", true);
        }

        /// <summary>
        /// Construct a message for the input entity data and log the message
        /// </summary>
        /// <param name="entity">The entity to be logged</param>
        /// <param name="ctx">CDM corpus context</param>
        /// <param name="className">Usually the class that is calling the method</param>
        /// <param name="method">Usually denotes method calling this method</param>
        /// <param name="corpusPath">Usually denotes corpus path of document</param>
        internal static void IngestEntityTelemetry(CdmEntityDefinition entity,
            CdmCorpusContext ctx, string className, string method, string corpusPath)
        {
            // Get entity storage namespace
            string entityNamespace = entity.InDocument.Namespace;

            if (string.IsNullOrWhiteSpace(entityNamespace))
            {
                entityNamespace = entity.Ctx.Corpus.Storage.DefaultNamespace;
            }

            // Get storage adapter type
            var adapter = entity.Ctx.Corpus.Storage.FetchAdapter(entityNamespace);
            string adapterType = adapter.GetType().Name;

            string message = $"EntityStorage:{adapterType};EntityNamespace:{entityNamespace};";

            // Collect all entity info
            Dictionary<string, int> entityInfo = FormEntityInfoDict(entity);

            message += SerializeDictionary(entityInfo);

            Debug(ctx, className, method, corpusPath, $"Entity Info: {{{message}}}", true);
        }

        /// <summary>
        /// Construct a message consisting of all the information about the input entity
        /// </summary>
        /// <param name="entity">The entity to be logged</param>
        /// <returns>A dictionary containing all entity info</returns>
        private static Dictionary<string, int> FormEntityInfoDict(CdmEntityDefinition entity)
        {
            Dictionary<string, int> entityInfo = new Dictionary<string, int>();

            // Check whether entity is resolved
            int isResolved = 0;
            if (entity.AttributeContext != null)
            {
                isResolved = 1;
            }

            entityInfo.Add("ResolvedEntity", isResolved);
            entityInfo.Add("ExhibitsTraitNum", entity.ExhibitsTraits.Count);
            entityInfo.Add("AttributeNum", entity.Attributes.Count);

            // The number of traits whose name starts with "means."
            int semanticsTraitNum = 0;

            foreach (CdmTraitReferenceBase trait in entity.ExhibitsTraits)
            {
                if (trait.FetchObjectDefinitionName().StartsWith("means."))
                {
                    semanticsTraitNum++;
                }
            }

            entityInfo.Add("SemanticsTraitNum", semanticsTraitNum);

            return entityInfo;
        }

        /// <summary>
        /// Serialize the dictionary and return a string
        /// </summary>
        /// <param name="dict">The dictionary to be handled</param>
        /// <returns>The serialized dictionary</returns>
        private static string SerializeDictionary(object dict)
        {
            return JsonConvert.SerializeObject(dict)
                .Replace(",", ";")
                .Replace("\"", "")
                .Replace("{", "")
                .Replace("}", "");
        }
    }
}
