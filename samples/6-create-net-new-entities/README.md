# Sample - Create Net New Entites

This sample is going to simulate the steps a tool would follow in order to create a new manifest document in some user storage folder with two types of entities - a net new entity and an entity extended from some public standards.

*Note: If we want to create a relationship from a new custom entity to an existing entity which is loaded from some public standards, we need to create an entity extended from the existing entity and add a relationship to the attribute of the new entity. Since we can't modify attributes from an 'abstract' schema defintion in the public standards.*

This sample also creates a relationship from a net new entity to an existing entity, and a relationship between two net new entities.

The steps are:
  1. Create a temporary 'manifest' object at the root of the corpus
  2. Create two net new entities without extending any exsiting entity, create a relationship from one to the other, and add them to the manifest
  3. Create one entity which extends from the public standards, create a relationship from it to a net new entity, and add the entity to the manifest
  4. Make a 'resolved' version of each entity doc in our local folder. Call CreateResolvedManifestAsync on our starting manifest. This will resolve everything and find all of the relationships between entities for us. Please check out the second example 2-create-manifest for more details
  5. Save the new document(s) 