# Sample - Create Manifest

This sample is going to simulate the steps a tool would follow in order to create a new manifest document in some user storage folder when the shapes of the entities in  that folder are all taken from some public standards with no extensions or additions

The steps are:
  1. Create a temporary 'manifest' object at the root of the corpus that contains a list of the selected entities
  2. Each selected entity points at an 'abstract' schema defintion in the public standards. These entity docs are too hard to deal with because of abstractions and inheritence, etc. So to make things concrete, we want to make a 'resolved' version of each entity doc in our local folder. To do this, we call createResolvedManifest on our starting manifest. This will resolve everything and find all of the relationships between entities for us
  3. Save the new documentsis