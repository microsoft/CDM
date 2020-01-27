//-----------------------------------------------------------------------
// <copyright file="StringSpewCatcher.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
using System.Runtime.CompilerServices;
using System.Text;

[assembly: InternalsVisibleTo("Microsoft.CommonDataModel.ObjectModel.Tests")]
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
