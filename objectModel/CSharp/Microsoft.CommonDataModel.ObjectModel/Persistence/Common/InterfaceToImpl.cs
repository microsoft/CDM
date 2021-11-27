// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Common
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using System;
    using System.Collections.Generic;

    public class InterfaceToImpl
    {
        private readonly IDictionary<Type, Type> PersistenceClasses = new Dictionary<Type, Type>();

        public void Register<TInterface, TClass>()
            where TInterface : CdmObject
            where TClass : class
        {
            PersistenceClasses.Add(typeof(TInterface), typeof(TClass));
        }

        public Type FetchPersistenceClass<TInterface>()
            where TInterface : CdmObject
        {
            if (PersistenceClasses.TryGetValue(typeof(TInterface), out Type persistenceClass))
            {
                return persistenceClass;
            }

            return null;
        }
    }
}
