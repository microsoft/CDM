# Sample - Logical Manipulation using Projections

This sample shows how to create and dynamically manipulate an attribute using projections. 
The manipulations are split into two separate functions `ApplyDefaultBehavior` and `ApplyArrayExpansion`.
The first function aims to reconstruct some of the default behavior present in resolution guidance. The second function focus on applying an array expansion, which is not used in some use cases.

The steps are:
  1. Create a corpus and mount the storage adapters pointing to the CDM Schema Documents;
  1. Create a Person.cdm.json document and within it add a `Person` entity;
  1. Add `name`, `age`, `address` and `email` attributes to the `Person` entity;
  1. Apply default projections to the `email` attribute;
  1. Resolve `Person` entity using some combinations of directives;
  1. Apply array expansion projections to the `address` attribute;
  1. Resolve `Person` entity using `normalized` directive.


To get an overview of the projections feature, refer to the [projections documentation](https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#projections-replaces-resolution-guidance). There you can see an overview of what is a projection and how to construct it. There is also a separate page for each operation that can be accessed under the same link.

For the SDK usage, refer to the [projections API reference](https://docs.microsoft.com/en-us/common-data-model/1.0om/api-reference/cdm/projections/projection). This page contains information about how to use projections on the coding level for each operation.
