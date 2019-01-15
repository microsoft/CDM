// <copyright file="FileFormatSettings.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents a base class for file format settings.
    /// </summary>
    public abstract class FileFormatSettings : ICloneable
    {
        /// <inheritdoc/>
        public virtual object Clone()
        {
            return this.MemberwiseClone();
        }
    }
}