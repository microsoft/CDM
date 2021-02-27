// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using System.Collections.Generic;

    /// <summary>
    /// <see cref="CdmCollection"/> customized for <see cref="CdmArgumentDefinition"/>.
    /// </summary>
    public class CdmArgumentCollection : CdmCollection<CdmArgumentDefinition>
    {
        /// <inheritdoc />
        protected new CdmTraitReference Owner
        {
            get
            {
                return base.Owner as CdmTraitReference;
            }
        }

        /// <summary>
        /// Constructs a CdmArgumentCollection.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="owner">The owner of the collection. Has to be a <see cref="CdmTraitReference"/> because this collection is optimized to handle adjustments to the trait when adding an argument.</param>
        public CdmArgumentCollection(CdmCorpusContext ctx, CdmTraitReference owner)
            : base(ctx, owner, CdmObjectType.ArgumentDef)
        {
        }

        /// <inheritdoc />
        public new void Insert(int index, CdmArgumentDefinition arg)
        {
            this.Owner.ResolvedArguments = false;
            base.Insert(index, arg);
        }

        /// <inheritdoc />
        public new CdmArgumentDefinition Add(CdmArgumentDefinition arg)
        {
            this.Owner.ResolvedArguments = false;
            return base.Add(arg);
        }

        /// <summary>
        /// Creates an argument based on the name and value provided and adds it to the collection.
        /// </summary>
        /// <param name="name">The name of the argument to be created and added to the collection.</param>
        /// <param name="value">The value of the argument to be created and added to the collection.</param>
        /// <returns>The created argument.</returns>
        public CdmArgumentDefinition Add(string name, dynamic value)
        {
            var argument = base.Add(name);
            argument.Value = value;
            this.Owner.ResolvedArguments = false;
            return argument;
        }

        /// <inheritdoc />
        public new void AddRange(IEnumerable<CdmArgumentDefinition> argumentList)
        {
            foreach (var argument in argumentList)
            {
                this.Add(argument);
            }
        }

        /// <summary>
        /// Retrieves the value of the argument with the provided name.
        /// If no argument with the provided name is found and there is only one argument with a null name, retrieves the value of this argument.
        /// </summary>
        /// <param name="name">The name of the argument we should fetch the value for.</param>
        /// <returns>The value of the argument.</returns>
        public dynamic FetchValue(string name)
        {
            foreach (var argument in this.AllItems)
            {
                if (string.Equals(argument.Name, name))
                {
                    return argument.Value;
                }
            }


            // special case with only one argument and no name give, make a big assumption that this is the one they want
            // right way is to look up parameter def and check name, but this public interface is for working on an unresolved def
            if (this.AllItems.Count == 1 && this.AllItems[0].Name == null)
                return this.AllItems[0].Value;

            return null;
        }

        /// <summary>
        /// Updates the value of an existing argument. If no argument is found with the provided name, an argument is created and added.
        /// </summary>
        /// <param name="name">The name of the argument to be updated.</param>
        /// <param name="value">The value to update the argument with.</param>
        /// <returns>Whether the operation completed successfully.(If an argument with the provided name was found.)</returns>
        public void UpdateArgument(string name, dynamic value)
        {
            this.MakeDocumentDirty();
            foreach (var argument in this.AllItems)
            {
                if (string.Equals(argument.Name, name))
                {
                    argument.Value = value;
                    return;
                }
            }
            this.Add(name, value);
        }
    }
}
