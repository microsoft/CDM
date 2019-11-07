//-----------------------------------------------------------------------
// <copyright file="AttributeResolutionDirectiveSet.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using System.Collections.Generic;
    using System.Linq;

    public class AttributeResolutionDirectiveSet
    {
        public ISet<string> Set { get; set; }
        public ISet<string> SetRemoved { get; set; }
        private string SortedTag;

        public AttributeResolutionDirectiveSet(ISet<string> set = null)
        {
            if (set != null)
            {
                this.Set = new HashSet<string>(set);
            }
        }

        public AttributeResolutionDirectiveSet Copy()
        {
            AttributeResolutionDirectiveSet result = new AttributeResolutionDirectiveSet();
            if (this.Set != null)
                result.Set = new HashSet<string>(this.Set);
            if (this.SetRemoved != null)
                result.SetRemoved = new HashSet<string>(this.SetRemoved);
            result.SortedTag = this.SortedTag;
            return result;
        }

        public bool Has(string directive)
        {
            if (this.Set != null)
            {
                return this.Set.Contains(directive);
            }
            return false;
        }

        public void Add(string directive)
        {
            if (this.Set == null)
                this.Set = new HashSet<string>();
            // once explicitly removed from a set, never put it back
            if (this.SetRemoved?.Contains(directive) == true)
                return;
            this.Set.Add(directive);
            this.SortedTag = null;
        }

        public void Delete(string directive)
        {
            if (this.SetRemoved == null)
                this.SetRemoved = new HashSet<string>();
            this.SetRemoved.Add(directive);
            if (this.Set != null && this.Set.Contains(directive))
                this.Set.Remove(directive);
            this.SortedTag = null;
        }

        public void Merge(AttributeResolutionDirectiveSet directives)
        {
            if (directives != null)
            {
                if (directives.SetRemoved != null)
                {
                    // copy over the removed list first
                    foreach (string d in directives?.SetRemoved)
                    {
                        this.Delete(d);
                    }
                }
                if (directives.Set != null) 
                {
                    foreach (string d in directives?.Set)
                    {
                        this.Set.Add(d);
                    }
                }
                this.SortedTag = null;
            }
        }

        public string GetTag()
        {
            if (string.IsNullOrEmpty(this.SortedTag))
            {
                if (this.Set != null && this.Set.Count > 0)
                {
                    this.SortedTag = "";
                    List<string> sorted = this.Set.ToList();
                    sorted.Sort();
                    sorted.ForEach(d =>
                    {
                        this.SortedTag += "-" + d;
                    });
                }
            }

            if (!string.IsNullOrEmpty(this.SortedTag))
                return this.SortedTag;
            return "";
        }
    }
}
