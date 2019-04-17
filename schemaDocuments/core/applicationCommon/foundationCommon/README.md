---
title: overview - Common Data Model | Microsoft Docs
description: foundationCommon is a folder that contains standard entities related to the Common Data Model.
author: nenad1002
ms.service: common-data-model
ms.reviewer: anneta
ms.topic: article
ms.date: 4/17/2019
ms.author: nebanfic
---

# foundationCommon


## Sub-folders

|Name|
|---|
|[crmCommon](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmCommon/overview)|
|[financialCommon](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/financialCommon/overview)|




## Entities

|Name|Description|
|---|---|
|[Account](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/Account)|Business that represents a customer or a potential customer. The company that's billed in business transactions.  |
|[BookableResource](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/BookableResource)|Resource that has capacity which can be allocated to work.  |
|[BookableResourceBooking](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/BookableResourceBooking)|Represents the line details of a resource booking.  |
|[BookableResourceBookingHeader](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/BookableResourceBookingHeader)|Reservation entity representing the summary of the associated resource bookings.  |
|[BookableResourceCategory](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/BookableResourceCategory)|Categorize resources that have capacity into categories such as roles.  |
|[BookableResourceCategoryAssn](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/BookableResourceCategoryAssn)|Association entity to model the categorization of resources.  |
|[BookableResourceCharacteristic](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/BookableResourceCharacteristic)|Associates resources with their characteristics and specifies the proficiency level of a resource for that characteristic.  |
|[BookableResourceGroup](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/BookableResourceGroup)|Associates resources with resource groups that they are a member of.  |
|[BookingStatus](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/BookingStatus)|Allows creation of multiple sub statuses mapped to a booking status option.  |
|[Characteristic](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/Characteristic)|Skills, education and certifications of resources.  |
|[Company](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/Company)|Uniquely identifies a Company by name and type  |
|[Contact](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/Contact)|Person with whom a business unit has a relationship, such as a customer, a supplier, or a colleague.  |
|[KnowledgeArticle](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/KnowledgeArticle)|Organizational knowledge for internal and external use.  |
|[Organization](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/Organization)|Top level of the Microsoft Dynamics 365 business hierarchy. The organization can be a specific business, holding company, or corporation.  |
|[PriceList](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/PriceList)|Entity that defines pricing levels.  |
|[PriceListItem](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/PriceListItem)|Information about how to price a product in the specified price level, including pricing method, rounding option, and discount type based on a specified product unit.  |
|[Product](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/Product)|Information about products and their prices.  |
|[ProductAssociation](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/ProductAssociation)|Instance of a product added to a bundle or kit.  |
|[ProductRelationship](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/ProductRelationship)|Information about the selling relationship between two products, including the relationship type, such as up-sell, cross-sell, substitute, or accessory.  |
|[Property](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/Property)|Information about a product property.  |
|[PropertyAssociation](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/PropertyAssociation)|Association of a property definition with another entity in the system.  |
|[PropertyInstance](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/PropertyInstance)|Instance of a property with its value.  |
|[PropertyOptionSetItem](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/PropertyOptionSetItem)|Item with a name and value in a property option set type.  |
|[RatingModel](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/RatingModel)|Represents a model to evaluate skills or other related entities.  |
|[RatingValue](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/RatingValue)|A unique value associated with a rating model that allows providing a user friendly rating value.  |
|[Unit](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/Unit)|Unit of measure.  |
|[UnitGroup](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/UnitGroup)|Grouping of units.  |
