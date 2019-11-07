//-----------------------------------------------------------------------
// <copyright file="IPersistenceType.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Common
{
    public interface IPersistenceType
    {
        InterfaceToImpl RegisteredClasses { get; set; }
    }
}
