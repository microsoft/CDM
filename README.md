# Common Data Model (CDM) Schema

The Common Data Model is a library of entities that represent commonly used concepts and activities across business and productivity applications. CDM provides well-defined, modular, and extensible business entities such as Account, Business Unit, Case, Contact, Lead, Opportunity, and Product, as well as interactions with vendors, workers, and customers, such as activities, cases, and service level agreements. Anyone can build on and extend CDM definitions to capture additional business-specific ideas.

# Introduction

The Common Data Model standard defines a common language for business entities covering customer relationship management (CRM), marketing, product services, and will expand to enterprise resource planning (ERP) and other areas over time. The goal of CDM is to enable data interoperability spanning multiple channels, service implementations, and vendors.

The CDM is undergoing a specification effort driven by Microsoft. The documents published here are a preview, and will be iterated on.

# Repository Layout

There are two primary ways to consume the information in this repository:

1. [Entity Reference Index](schemaDocuments#directory-of-cdm-entities)
2. [Visual Entity Navigator](schemaDocuments/readme.md) for visually navigating entities, entity inheritance, attributes, and entity relationships

# Versioning

Maintaining forward and backwards compatibility is a key goal of the CDM. Therefore, the CDM uses purely additive versioning, which means any revision of the CDM following an initial release will not:

* Introduce new mandatory properties on existing entities
* Rename existing properties or existing entities
* Remove previously defined properties

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Legal Notices

Microsoft and any contributors grant you a license to the Microsoft documentation and other content
in this repository under the [Creative Commons Attribution 4.0 International Public License](https://creativecommons.org/licenses/by/4.0/legalcode),
see the [LICENSE](LICENSE) file, and grant you a license to any code in the repository under the [MIT License](https://opensource.org/licenses/MIT), see the
[LICENSE-CODE](LICENSE-CODE) file.

Microsoft, Windows, Microsoft Azure and/or other Microsoft products and services referenced in the documentation
may be either trademarks or registered trademarks of Microsoft in the United States and/or other countries.
The licenses for this project do not grant you rights to use any Microsoft names, logos, or trademarks.
Microsoft's general trademark guidelines can be found at http://go.microsoft.com/fwlink/?LinkID=254653.

Privacy information can be found at https://privacy.microsoft.com/en-us/

Microsoft and any contributors reserve all others rights, whether under their respective copyrights, patents,
or trademarks, whether by implication, estoppel or otherwise.
