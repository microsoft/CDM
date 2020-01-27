# Sample - Search Partition Pattern

This sample demonstrates how to perform a data partition pattern search on an existing entity.

*Note: A data partition pattern describes a search space over a set of files that can be used to infer or discover and list new data partition files.*

The steps are:
  1. Load an entity named 'Account' from some public standards
  2. Create a data partition pattern and add it to 'Account' entity.
  3. Find all the associated partition files, and add them to the data partition to the entity in the manifest.
  4. Resolve the manifest and save the new documents