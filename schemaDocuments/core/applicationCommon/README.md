# applicationCommon


## Sub-folders

|Name|
|---|
|[foundationCommon](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationCommon/overview)|




## Entities

|Name|Description|
|---|---|
|[Account](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Account)|Business that represents a customer or a potential customer. The company that's billed in business transactions.  |
|[Activity](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Activity)|Task performed, or to be performed, by a user. An activity is any action for which an entry can be made on a calendar.  |
|[ActivityParty](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/ActivityParty)|Person or group associated with an activity. An activity can have multiple activity parties.  |
|[Address](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Address)|Address and shipping information. Used to store additional addresses for an account or a contact.  |
|[Appointment](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Appointment)|Commitment representing a time interval with start/end times and duration.  |
|[Article](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Article)|Structured content that is part of the knowledge base.  |
|[ArticleComment](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/ArticleComment)|Comment on a knowledge base article.  |
|[ArticleTemplate](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/ArticleTemplate)|Template for a knowledge base article that contains the standard attributes of an article.  |
|[BusinessUnit](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/BusinessUnit)|Business, division, or department in the Microsoft Dynamics 365 database.  |
|[Connection](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Connection)|Relationship between two entities.  |
|[ConnectionRole](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/ConnectionRole)|Role describing a relationship between a two records.  |
|[Contact](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Contact)|Person with whom a business unit has a relationship, such as a customer, a supplier, or a colleague.  |
|[Currency](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Currency)|Currency in which a financial transaction is carried out.  |
|[CustomerRelationship](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/CustomerRelationship)|Relationship between a customer and a partner in which either can be an account or contact.  |
|[Email](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Email)|Activity that is delivered using email protocols.  |
|[EmailSignature](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/EmailSignature)|Signature for email message  |
|[Fax](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Fax)|Activity that tracks call outcome and number of pages for a fax and optionally stores an electronic copy of the document.  |
|[Feedback](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Feedback)|Container for feedback and ratings for knowledge articles.  |
|[Goal](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Goal)|Target objective for a user or a team for a specified time period.  |
|[GoalMetric](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/GoalMetric)|Type of measurement for a goal, such as money amount or count.  |
|[KnowledgeArticle](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/KnowledgeArticle)|Organizational knowledge for internal and external use.  |
|[KnowledgeArticleCategory](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/KnowledgeArticleCategory)|Category for a Knowledge Article.  |
|[KnowledgeArticleViews](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/KnowledgeArticleViews)|No of times an article is viewed per day  |
|[KnowledgeBaseRecord](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/KnowledgeBaseRecord)|Metadata of knowledge base (KB) articles associated with Microsoft Dynamics 365 entities.  |
|[Letter](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Letter)|Activity that tracks the delivery of a letter. The activity can contain the electronic copy of the letter.  |
|[Note](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Note)|Note that is attached to one or more objects, including other notes.  |
|[Organization](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Organization)|Top level of the Microsoft Dynamics 365 business hierarchy. The organization can be a specific business, holding company, or corporation.  |
|[Owner](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Owner)|Group of undeleted system users and undeleted teams. Owners can be used to control access to specific objects.  |
|[PhoneCall](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/PhoneCall)|Activity to track a telephone call.  |
|[Position](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Position)|Position of a user in the hierarchy  |
|[Queue](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Queue)|A list of records that require action, such as accounts, activities, and cases.  |
|[QueueItem](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/QueueItem)|A specific item in a queue, such as a case record or an activity record.  |
|[RecurringAppointment](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/RecurringAppointment)|The Master appointment of a recurring appointment series.  |
|[SLA](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/SLA)|Contains information about the tracked service-level KPIs for cases that belong to different customers.  |
|[SLAItem](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/SLAItem)|Contains information about a tracked support KPI for a specific customer.  |
|[SLAKPIInstance](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/SLAKPIInstance)|Service level agreement (SLA) key performance indicator (KPI) instance that is tracked for an individual case  |
|[SocialActivity](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/SocialActivity)|For internal use only.  |
|[SocialProfile](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/SocialProfile)|This entity is used to store social profile information of its associated account and contacts on different social channels.  |
|[Task](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Task)|Generic activity that represents work to be done.  |
|[Team](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Team)|Collection of system users that routinely collaborate. Teams can be used to simplify record sharing and provide team members with common access to organization data when team members belong to different Business Units.  |
|[Territory](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/Territory)|Territory represents sales regions.  |
|[User](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/User)|Person with access to the Microsoft CRM system and who owns objects in the Microsoft CRM database.  |
