// <copyright file="UriExtensions.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System;
    using System.IO;
    using System.Text.RegularExpressions;
    using System.Web;

    /// <summary>
    /// Defines extension methods for <see cref="Uri"/> class.
    /// </summary>
    internal static class UriExtensions
    {
        private const string CdmStandardRepoHost = "raw.githubusercontent.com";
        private const string CdmStandardRepoPath = "microsoft/cdm/master/schemadocuments/core/applicationcommon/";
        private static readonly Regex EntityInfoRegex = new Regex(@"^(?<name>[^.]*)\.(?<version>[0-9.]+)(\.cdm){0,1}\.json$", RegexOptions.Compiled);

        /// <summary>
        /// Utility method to make the model location canonical ( removes query string )
        /// </summary>
        /// <param name="location">Reference Model Location</param>
        /// <returns>Reference Model Location with query string removed</returns>
        public static Uri CanonicalizeModelLocation(this Uri location)
        {
            string absoluteUri = HttpUtility.UrlDecode(location.AbsoluteUri ?? string.Empty);

            if (absoluteUri.IndexOf(Model.ModelFileName) == -1)
            {
                throw new InvalidDataException(
                    $"CanonicalizeModelLocation: Invalid model location. Received location absolute uri:'{absoluteUri}'. The location should point to {Model.ModelFileName}.");
            }

            return new Uri(absoluteUri.Substring(0, absoluteUri.IndexOf(Model.ModelFileName) + Model.ModelFileName.Length));
        }

        /// <summary>
        /// Checks if the provided uri matches a model schema pattern
        /// </summary>
        /// <param name="uri">The rui to check</param>
        /// <returns>bool</returns>
        public static bool IsSchemaUri(this Uri uri)
        {
            if (uri == null)
            {
                return false;
            }

            string path = HttpUtility.UrlDecode(uri.AbsolutePath).Trim('/');
            return
                path.EndsWith(Model.ModelFileExtension) &&
                string.IsNullOrEmpty(uri.Query) &&
                CdmStandardRepoHost.Equals(HttpUtility.UrlDecode(uri.Host), StringComparison.OrdinalIgnoreCase) &&
                path.StartsWith(CdmStandardRepoPath, StringComparison.OrdinalIgnoreCase) &&
                uri.GetSchemaEntityInfo() != null;
        }

        /// <summary>
        /// Get the entity name from a schema Uri
        /// </summary>
        /// <param name="uri">The schema Uri</param>
        /// <returns>The entity information or null</returns>
        public static SchemaEntityInfo GetSchemaEntityInfo(this Uri uri)
        {
            if (uri == null || string.IsNullOrEmpty(uri.AbsolutePath))
            {
                return null;
            }

            string fullEntityInfo = HttpUtility.UrlDecode(uri.AbsolutePath).Trim('/');
            int endOfPrefix = fullEntityInfo.IndexOf(CdmStandardRepoPath, StringComparison.OrdinalIgnoreCase);
            if (endOfPrefix == 0)
            {
                fullEntityInfo = fullEntityInfo.Substring(CdmStandardRepoPath.Length);
            }

            int endOfPath = fullEntityInfo.LastIndexOf('/');
            string path = endOfPath < 0 ? string.Empty : fullEntityInfo.Substring(0, endOfPath);
            string entityInfo = endOfPath < 1 ? fullEntityInfo : fullEntityInfo.Substring(endOfPath + 1);
            Match match = EntityInfoRegex.Match(entityInfo);
            return !match.Success
                ? null
                : new SchemaEntityInfo
                {
                    EntityName = match.Groups["name"].Value,
                    EntityVersion = match.Groups["version"].Value,
                    EntityNamespace = path,
                };
        }
    }
}