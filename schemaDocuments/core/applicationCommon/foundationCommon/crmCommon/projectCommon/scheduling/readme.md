---
title: overview - Common Data Model | Microsoft Docs
description: scheduling is a folder that contains standard entities related to the Common Data Model.
author: nenad1002
ms.service: common-data-model
ms.reviewer: anneta
ms.topic: article
ms.date: 4/17/2019
ms.author: nebanfic
---

# scheduling


## Entities

|Name|Description|
|---|---|
|[Actual](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/Actual)|  |
|[BookableResourceAssociation](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/BookableResourceAssociation)|  |
|[BookingAlert](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/BookingAlert)|Alerts that notify schedule board users of booking issues or information.  |
|[BookingAlertStatus](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/BookingAlertStatus)|The status of a booking alert.  |
|[BookingChange](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/BookingChange)|An internal entity used to track changes that affect the schedule board.  |
|[BookingRule](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/BookingRule)|Specify custom rules to be validated by the system before saving a booking record.  |
|[BookingSetupMetadata](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/BookingSetupMetadata)|  |
|[BusinessClosure](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/BusinessClosure)|  |
|[ClientExtension](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/ClientExtension)|  |
|[Configuration](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/Configuration)|This entity is used to store queries and templates.  |
|[Organization](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/Organization)|Top level of the Microsoft Dynamics 365 business hierarchy. The organization can be a specific business, holding company, or corporation.  |
|[OrganizationalUnit](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/OrganizationalUnit)|  |
|[Priority](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/Priority)|Priorities to be used on bookings. In addition, a color could be specified for each priority type and the color selected will be shown visually on the schedule board.  |
|[RequirementCharacteristic](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/RequirementCharacteristic)|Requirement Characteristic  |
|[RequirementGroup](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/RequirementGroup)|Service which has resource requirement offering periods  |
|[RequirementOrganizationUnit](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/RequirementOrganizationUnit)|Requirement of Organization Unit  |
|[RequirementRelationship](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/RequirementRelationship)|Relationship of requirements in the group  |
|[RequirementResourceCategory](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/RequirementResourceCategory)|Requirement Resource Category  |
|[RequirementResourcePreference](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/RequirementResourcePreference)|Requirement Resource Preference  |
|[RequirementStatus](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/RequirementStatus)|Requirement Status  |
|[ResourceRequirement](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/ResourceRequirement)|  |
|[ResourceRequirementDetail](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/ResourceRequirementDetail)|Resource Requirement Time Detail  |
|[ResourceTerritory](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/ResourceTerritory)|Allows to specify for which territory a resource could provide services for  |
|[ScheduleBoardSetting](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/ScheduleBoardSetting)|To store settings of SB by user & tabs  |
|[SchedulingParameter](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/SchedulingParameter)|Scheduling Parameters  |
|[TimeGroup](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/TimeGroup)|Specify time groups consisting of multiple time windows to be used for scheduling, for example.  |
|[TimeGroupDetail](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/TimeGroupDetail)|Specify individual time windows under a time group.  |
|[TransactionOrigin](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/TransactionOrigin)|System entity used to record the source of a project cost or sales actual.  |
|[WorkHourTemplate](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/projectcommon/scheduling/WorkHourTemplate)|Template where resource working hours can be saved and reused.  |
