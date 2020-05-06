
# applicationCommon

CDM standard entities  

## Sub-folders

|Name|
|---|
|[foundationCommon](foundationCommon/README.md)|




## Entities

|Name|Description|
|---|---|
|[Account](Account.cdm.json)|Business that represents a customer or potential customer. The company that is billed in business transactions.|
|[Activity](Activity.cdm.json)|Task performed, or to be performed, by a user. An activity is any action for which an entry can be made on a calendar.|
|[ActivityParty](ActivityParty.cdm.json)|Person or group associated with an activity. An activity can have multiple activity parties.|
|[Address](Address.cdm.json)|Address and shipping information. Used to store additional addresses for an account or contact.|
|[Appointment](Appointment.cdm.json)|Commitment representing a time interval with start/end times and duration.|
|[Article](Article.cdm.json)|Structured content that is part of the knowledge base.|
|[ArticleComment](ArticleComment.cdm.json)|Comment on a knowledge base article.|
|[ArticleTemplate](ArticleTemplate.cdm.json)|Template for a knowledge base article that contains the standard attributes of an article.|
|[BusinessUnit](BusinessUnit.cdm.json)|Business, division, or department in the Microsoft Dynamics 365 database.|
|[Connection](Connection.cdm.json)|Relationship between two entities.|
|[ConnectionRole](ConnectionRole.cdm.json)|Role describing a relationship between a two records.|
|[Contact](Contact.cdm.json)|Person with whom a business unit has a relationship, such as customer, supplier, and colleague.|
|[Currency](Currency.cdm.json)|Currency in which a financial transaction is carried out.|
|[CustomerRelationship](CustomerRelationship.cdm.json)|Relationship between a customer and a partner in which either can be an account or contact.|
|[Email](Email.cdm.json)|Activity that is delivered using email protocols.|
|[EmailSignature](EmailSignature.cdm.json)|Signature for email message|
|[Fax](Fax.cdm.json)|Activity that tracks call outcome and number of pages for a fax and optionally stores an electronic copy of the document.|
|[Feedback](Feedback.cdm.json)|Container for feedback and ratings for knowledge articles.|
|[Goal](Goal.cdm.json)|Target objective for a user or a team for a specified time period.|
|[GoalMetric](GoalMetric.cdm.json)|Type of measurement for a goal, such as money amount or count.|
|[KnowledgeArticle](KnowledgeArticle.cdm.json)|Organizational knowledge for internal and external use.|
|[KnowledgeArticleCategory](KnowledgeArticleCategory.cdm.json)|Category for a Knowledge Article.|
|[KnowledgeArticleViews](KnowledgeArticleViews.cdm.json)|No of times an article is viewed per day|
|[KnowledgeBaseRecord](KnowledgeBaseRecord.cdm.json)|Metadata of knowledge base (KB) articles associated with Microsoft Dynamics 365 entities.|
|[Letter](Letter.cdm.json)|Activity that tracks the delivery of a letter. The activity can contain the electronic copy of the letter.|
|[Note](Note.cdm.json)|Note that is attached to one or more objects, including other notes.|
|[Organization](Organization.cdm.json)|Top level of the Microsoft Dynamics 365 business hierarchy. The organization can be a specific business, holding company, or corporation.|
|[Owner](Owner.cdm.json)|Group of undeleted system users and undeleted teams. Owners can be used to control access to specific objects.|
|[PhoneCall](PhoneCall.cdm.json)|Activity to track a telephone call.|
|[Position](Position.cdm.json)|Position of a user in the hierarchy|
|[Queue](Queue.cdm.json)|A list of records that require action, such as accounts, activities, and cases.|
|[QueueItem](QueueItem.cdm.json)|A specific item in a queue, such as a case record or an activity record.|
|[RecurringAppointment](RecurringAppointment.cdm.json)|The Master appointment of a recurring appointment series.|
|[SLA](SLA.cdm.json)|Contains information about the tracked service-level KPIs for cases that belong to different customers.|
|[SLAItem](SLAItem.cdm.json)|Contains information about a tracked support KPI for a specific customer.|
|[SLAKPIInstance](SLAKPIInstance.cdm.json)|Service level agreement (SLA) key performance indicator (KPI) instance that is tracked for an individual case|
|[SocialActivity](SocialActivity.cdm.json)|For internal use only.|
|[SocialProfile](SocialProfile.cdm.json)|This entity is used to store social profile information of its associated account and contacts on different social channels.|
|[Task](Task.cdm.json)|Generic activity representing work needed to be done.|
|[Team](Team.cdm.json)|Collection of system users that routinely collaborate. Teams can be used to simplify record sharing and provide team members with common access to organization data when team members belong to different Business Units.|
|[TeamMembership](TeamMembership.cdm.json)|User membership in Teams|
|[Territory](Territory.cdm.json)|Territory represents sales regions.|
|[User](User.cdm.json)|Person with access to the Microsoft CRM system and who owns objects in the Microsoft CRM database.|
