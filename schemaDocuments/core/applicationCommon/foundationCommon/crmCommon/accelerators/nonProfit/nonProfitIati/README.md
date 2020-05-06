
# nonProfitIati

CDM Solution for the 'NONPROFITIATI' CDS Solution  

## Entities

|Name|Description|
|---|---|
|[Account](Account.cdm.json)|Business that represents a customer or potential customer. The company that is billed in business transactions.|
|[AidType](AidType.cdm.json)|The type of aid being supplied (project-type intervention, budget support, debt relief, etc.).|
|[Award](Award.cdm.json)|An Award represents the total amount of funding that has been agreed to be awarded to an individual or institution.|
|[Budget](Budget.cdm.json)|A Budget represents the amount of funds that can be awarded for a particular delivery framework (i.e Program, Project, Initiative, Activity) for a defined period of time (i.e. fiscal year).|
|[Campaign](Campaign.cdm.json)|Container for campaign activities and responses, sales literature, products, and lists to create, plan, execute, and track the results of a specific marketing campaign through its life.|
|[Condition](Condition.cdm.json)|Specific terms and conditions attached to the Delivery Framework that, if not met, may influence the delivery of commitments made by participating organizations.|
|[Contact](Contact.cdm.json)|Person with whom a business unit has a relationship, such as customer, supplier, and colleague.|
|[CrsOtherFlag](CrsOtherFlag.cdm.json)|This covers the four CRS++ columns titled: “Free standing technical cooperation”; “Programme-based approach”; “Investment project”; “Associated financing”|
|[DeliveryFramework](DeliveryFramework.cdm.json)|Delivery Framework represents a management unit of work defined by the organization or entity doing the work. In IATI, the Delivery Framework is an “Activity.”|
|[DeliveryFrameworkContact](DeliveryFrameworkContact.cdm.json)|Contact information for the Delivery Framework.|
|[DeliveryFrameworkDescription](DeliveryFrameworkDescription.cdm.json)|A longer, human-readable description containing a meaningful description of the delivery framework|
|[Designation](Designation.cdm.json)|An area to which funds may be allocated, including a GL-relevant accounting code.  Designations are the way a donor instructs an organization about how their donation should be spent or earmarked.|
|[DesignationPlan](DesignationPlan.cdm.json)|A line item attached to a Pledge, Payment Schedule, or Campaign indicating how associated payments should be designated.|
|[Dimension](Dimension.cdm.json)|A category used for dis-aggregating the result by gender, age, etc|
|[Disbursement](Disbursement.cdm.json)|A Disbursement represents an Award disbursement to an individual or organizational awardee.  A Disbursement is related to a specific Award and Budget.|
|[DisbursementDistribution](DisbursementDistribution.cdm.json)|Disbursement Distribution represents the Framework(s) - i.e. Program, Project, Initiative - that contribute to funding an Award Disbursement.|
|[Docket](Docket.cdm.json)|A Docket is used to group inquiries (LOIs) and/or requests with a specific grant/award cycle or date (usually a review/board meeting).|
|[DocumentCategory](DocumentCategory.cdm.json)|IATI Document Category.|
|[DocumentCountry](DocumentCountry.cdm.json)|The recipient country that is the focus of the document.|
|[DocumentLanguage](DocumentLanguage.cdm.json)|The language in which target document is written.|
|[DocumentLink](DocumentLink.cdm.json)|A link to an online, publicly accessible web page or document.|
|[DonorCommitment](DonorCommitment.cdm.json)|Donor commitments represent the actual or prospective agreement between a donor and an organization for the donor to make a gift to the organization.|
|[Expenditure](Expenditure.cdm.json)|An Expenditure represents an amount of money spent by an Organization or Delivery Framework.|
|[FssForecast](FssForecast.cdm.json)|A container to hold separate forecast values for each year.|
|[HumanitarianScope](HumanitarianScope.cdm.json)|Classification of emergencies, appeals and other humanitarian events and actions.|
|[IatiFileGeneration](IatiFileGeneration.cdm.json)|Entity used for the generation of IATI XML files.|
|[Identifier](Identifier.cdm.json)|An IATI's globally unique identifier for the delivery framework|
|[Indicator](Indicator.cdm.json)|An Indicator describes what will be measured to track evidence of a Result. Indicators can be qualitative or quantitative and may or may not be aggregable.|
|[IndicatorReference](IndicatorReference.cdm.json)|A standardised means of identifying the indicator from a code in a recognised vocabulary.|
|[IndicatorValue](IndicatorValue.cdm.json)|An Indicator Value is a quantitative or qualitative value of measurement of an Indicator. Indicator Values may be but are not limited to baseline, target or actual values of measurement.|
|[IndicatorValueLocation](IndicatorValueLocation.cdm.json)|Indicates the location of the indicator value|
|[Location](Location.cdm.json)|The sub-national geographical identification of the target locations of an activity. These can be described by gazetteer reference, coordinates, administrative areas or a textual description.|
|[Membership](Membership.cdm.json)|Representation of a Customer Membership.|
|[MembershipCategory](MembershipCategory.cdm.json)|Represents the types of membership associated to products.|
|[NarrativeTranslation](NarrativeTranslation.cdm.json)|Allows the translation of different narrative elements for IATI reporting.|
|[NonEmbeddedCodelist](NonEmbeddedCodelist.cdm.json)|Non-functional codelists that usually provide lookup information on e.g. currencies, languages in use, countries, etc.|
|[NonEmbeddedCodelistVocabulary](NonEmbeddedCodelistVocabulary.cdm.json)|Sources for non embedded codelists|
|[Objective](Objective.cdm.json)|An Objective represents the organization's highest priorities, strategies and/or goals that guide investments (in the case of Requests and Awards) and program delivery.|
|[Opportunity](Opportunity.cdm.json)|An opportunity represents prospective, pending and closed "deals" or gifts.  This entity allows nonprofit organizations to track their efforts to build relationships with prospective donors.|
|[ParticipatingOrganization](ParticipatingOrganization.cdm.json)|Organization involved with the delivery framework|
|[PaymentMethod](PaymentMethod.cdm.json)|Payment Method is a placeholder entity for customizations that may be supported by an application.|
|[PaymentSchedule](PaymentSchedule.cdm.json)|A gift transaction can be a one-time payment or a recurring payment (ie, monthly/sustainer giving). In addition, it can be a pledge (ie, promise) of a future payment or a current/received payment.|
|[PlannedGiving](PlannedGiving.cdm.json)|A planned gift is a gift made during a donor's lifetime or at the time of their death that involves their estate and/or tax planning.|
|[PolicyMarker](PolicyMarker.cdm.json)|A policy or theme addressed by the Delivery Framework.|
|[RecipientCountry](RecipientCountry.cdm.json)|The country that will benefit from this delivery framework|
|[RecipientRegion](RecipientRegion.cdm.json)|A supranational geopolitical region that will benefit from the delivery framework|
|[Request](Request.cdm.json)|Requests represent a request from an individual or institution for funding or support. A request is more formal than an inquiry (LOI) and typically happens after an inquiry has already occurred.|
|[Result](Result.cdm.json)|A Result is a container that represents the changes in the context in which an organization operates..|
|[ResultReference](ResultReference.cdm.json)|A reference element to allow for the coded identification of a results framework.|
|[Sector](Sector.cdm.json)|Classification of the purpose of the Delivery Framework.|
|[Tag](Tag.cdm.json)|Categorizations from established taxonomies that enrich the classification of the Delivery Framework but that, unlike those reported in the sector element, cannot be associated with percentage splits.|
|[Transaction](Transaction.cdm.json)|Transactions (also referred to as donations) represent payments from a constituent (i.e. donor, contact, account or organization) to the nonprofit.|
|[Website](Website.cdm.json)|A web address.|
