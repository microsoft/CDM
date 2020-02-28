// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Runtime.CompilerServices;
using System.Text;

#if INTERNAL_VSTS
[assembly: InternalsVisibleTo("Microsoft.CommonDataModel.ObjectModel.Tests" + Microsoft.CommonDataModel.AssemblyRef.TestPublicKey)]
#else
[assembly: InternalsVisibleTo("Microsoft.CommonDataModel.ObjectModel.Tests")]
#endif
namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    internal class StringSpewCatcher
    {
        private StringBuilder content = new StringBuilder();
        private StringBuilder segment = new StringBuilder();

        public void Clear()
        {
            this.content.Clear();
            this.segment.Clear();
        }

        public void SpewLine(string spew)
        {
            this.segment.Append(spew + "\n");
            if (this.segment.Length > 1000)
            {
                this.content.Append(this.segment);
                this.segment.Clear();
            }
        }

        public string GetContent()
        {
            return this.content.Append(this.segment).ToString();
        }
    }
}
