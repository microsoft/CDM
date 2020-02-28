// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Collections;
using System.Collections.Generic;

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    internal class SymbolSet : IEnumerable
    {
        private HashSet<string> SymbolSetCollection;
        internal int Size { get { return this.SymbolSetCollection.Count; } }

        internal SymbolSet()
        {
            this.SymbolSetCollection = new HashSet<string>();
        }

        internal void Add(string newSymbol)
        {
            this.SymbolSetCollection.Add(newSymbol);
        }

        internal void Merge(SymbolSet symSet)
        {
            if (symSet != null)
            {
                foreach (string sym in symSet)
                {
                    this.SymbolSetCollection.Add(sym);
                }
            }
        }

        internal SymbolSet Copy()
        {
            SymbolSet newSet = new SymbolSet();
            foreach (string sym in this.SymbolSetCollection)
            {
                newSet.Add(sym);
            }
            return newSet;
        }

        public IEnumerator GetEnumerator()
        {
            return this.SymbolSetCollection.GetEnumerator();
        }
    }
}
