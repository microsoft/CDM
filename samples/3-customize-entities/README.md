# Sample - Customize Manifest

This sample demonstrates how an existing entity loaded from some public standards can be customized.

The steps are:
  1. Load a manifest from local file-system
  2. Create a new entity named 'MobileCareTeam' which extends from a standard entity called 'CareTeam', and add an attribute named 'currentCity'
  3. Resolve and flatten this new local abstract description of 'CareTeam' entity, then add this customized version of 'CareTeam' entity to the manifest
  4. Save the new documents