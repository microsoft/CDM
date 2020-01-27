
# foundationCommon


## Sub-folders

|Name|
|---|
|[crmCommon](crmCommon/README.md)|
|[financialCommon](financialCommon/README.md)|
|[productInsights](productInsights/README.md)|




## Entities

|Name|Description|
|---|---|
|[Account](Account.cdm.json)|Business that represents a customer or potential customer. The company that is billed in business transactions.  |
|[BookableResource](BookableResource.cdm.json)|Resource that has capacity which can be allocated to work.  |
|[BookableResourceBooking](BookableResourceBooking.cdm.json)|Represents the line details of a resource booking.  |
|[BookableResourceBookingHeader](BookableResourceBookingHeader.cdm.json)|Reservation entity representing the summary of the associated resource bookings.  |
|[BookableResourceCategory](BookableResourceCategory.cdm.json)|Categorize resources that have capacity into categories such as roles.  |
|[BookableResourceCategoryAssn](BookableResourceCategoryAssn.cdm.json)|Association entity to model the categorization of resources.  |
|[BookableResourceCharacteristic](BookableResourceCharacteristic.cdm.json)|Associates resources with their characteristics and specifies the proficiency level of a resource for that characteristic.  |
|[BookableResourceGroup](BookableResourceGroup.cdm.json)|Associates resources with resource groups that they are a member of.  |
|[BookingStatus](BookingStatus.cdm.json)|Allows creation of multiple sub statuses mapped to a booking status option.  |
|[Characteristic](Characteristic.cdm.json)|Skills, education and certifications of resources.  |
|[Company](Company.cdm.json)|Uniquely identifies a Company by name and type  |
|[Contact](Contact.cdm.json)|Person with whom a business unit has a relationship, such as customer, supplier, and colleague.  |
|[KnowledgeArticle](KnowledgeArticle.cdm.json)|Organizational knowledge for internal and external use.  |
|[Organization](Organization.cdm.json)|Top level of the Microsoft Dynamics 365 business hierarchy. The organization can be a specific business, holding company, or corporation.  |
|[PriceList](PriceList.cdm.json)|Entity that defines pricing levels.  |
|[PriceListItem](PriceListItem.cdm.json)|Information about how to price a product in the specified price level, including pricing method, rounding option, and discount type based on a specified product unit.  |
|[Product](Product.cdm.json)|Information about products and their pricing information.  |
|[ProductAssociation](ProductAssociation.cdm.json)|Instance of a product added to a bundle or kit.  |
|[ProductRelationship](ProductRelationship.cdm.json)|Information about the selling relationship between two products, including the relationship type, such as up-sell, cross-sell, substitute, or accessory.  |
|[Property](Property.cdm.json)|Information about a product property.  |
|[PropertyAssociation](PropertyAssociation.cdm.json)|Association of a property definition with another entity in the system.  |
|[PropertyInstance](PropertyInstance.cdm.json)|Instance of a property with its value.  |
|[PropertyOptionSetItem](PropertyOptionSetItem.cdm.json)|Item with a name and value in a property option set type.  |
|[RatingModel](RatingModel.cdm.json)|Represents a model to evaluate skills or other related entities.  |
|[RatingValue](RatingValue.cdm.json)|A unique value associated with a rating model that allows providing a user friendly rating value.  |
|[Unit](Unit.cdm.json)|Unit of measure.  |
|[UnitGroup](UnitGroup.cdm.json)|Grouping of units.  |
