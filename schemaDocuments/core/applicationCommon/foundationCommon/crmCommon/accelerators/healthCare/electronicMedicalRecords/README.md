---
title: overview - Common Data Model | Microsoft Docs
description: electronicMedicalRecords is a folder that contains standard entities related to the Common Data Model.
author: nenad1002
ms.service: common-data-model
ms.reviewer: anneta
ms.topic: article
ms.date: 4/17/2019
ms.author: nebanfic
---

# electronicMedicalRecords


## Entities

|Name|Description|
|---|---|
|[Account](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/Account)|Business that represents a customer or a potential customer. The company that's billed in business transactions.  |
|[Address](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/Address)|Address and shipping information. Used to store additional addresses for an account or a contact.  |
|[AllergyIntolerance](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/AllergyIntolerance)|Risk of harmful or undesirable physiological response that's unique to an individual and associated with exposure to a substance.  |
|[CarePlan](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/CarePlan)|Intention of how one or more practitioners intend to deliver care for a particular patient, group, or community for a period of time, possibly limited to care for a specific condition.  |
|[CarePlanGoal](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/CarePlanGoal)|Describes the intended objective(s) of carrying out the care plan.  |
|[CareTeam](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/CareTeam)|The care team includes all the people and organizations who plan to participate in the coordination and delivery of care for a patient.  |
|[CareTeamParticipant](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/CareTeamParticipant)|Identifies all people and organizations who are expected to be involved in the care team.  |
|[CodeableConcept](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/CodeableConcept)|A value that's usually supplied by providing a reference to one or more terminologies but may also be defined by the provision of text.  |
|[Condition](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/Condition)|A clinical condition, a problem, a diagnosis, or some other event, situation, issue, or clinical concept that has risen to a level of concern.  |
|[Contact](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/Contact)|Person with whom a business unit has a relationship, such as a customer, a supplier, or a colleague.  |
|[Device](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/Device)|An instance or a type of a manufactured item that's used in the provision of healthcare without being substantially changed through that activity.  |
|[EmrAppointment](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/EmrAppointment)|A booking of a healthcare event among patient(s), practitioner(s), related person(s), and/or device(s) for a specific date/time. This may result in one or more encounter(s).  |
|[Encounter](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/Encounter)|An interaction between a patient and healthcare provider(s) for the purpose of providing healthcare service(s) or assessing the health status of a patient.  |
|[EpisodeOfCare](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/EpisodeOfCare)|An association between a patient and an organization, healthcare provider(s), or both during which time encounters may occur.  |
|[HealthcareService](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/HealthcareService)|The details of a healthcare service available at a location.  |
|[Location](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/Location)|Details and position information for a physical place where services are provided and resources and participants may be stored, found, contained, or accommodated.  |
|[MedicationAdministration](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/MedicationAdministration)|Describes the event of a patient consuming or otherwise being administered a medication.  |
|[MedicationRequest](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/MedicationRequest)|An order or a request for supplying medication and the instructions for administering the medication to a patient.  |
|[Observation](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/Observation)|Measurements and simple assertions made about a patient, a device, or another subject.  |
|[PractitionerQualification](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/PractitionerQualification)|Qualifications that are obtained by training and certification.  |
|[PractitionerRole](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/PractitionerRole)|A specific set of roles, locations, specialties, or services that a practitioner may perform at an organization for a period of time.  |
|[Procedure](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/Procedure)|An action that is or was performed on a patient. This can be a physical intervention, such as an operation, or less invasive, such as counseling or hypnotherapy.  |
|[Product](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/Product)|Information about products and their prices.  |
|[ReferralRequest](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/ReferralRequest)|Details used to record and send a request for referral service or transfer of a patient to the care of another provider or provider organization.  |
|[RelatedPerson](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/RelatedPerson)|Information about a person who is involved in the care for a patient but who isn't the target of healthcare and has no formal responsibility in the care process.  |
|[RiskAssessment](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/RiskAssessment)|An assessment of the likely outcome(s) for a patient or other subject, as well as the likelihood of each outcome.  |
|[Task](https://docs.microsoft.com/en-us/common-data-model/schema/core/applicationcommon/foundationcommon/crmcommon/accelerators/healthcare/electronicmedicalrecords/Task)|Generic activity that represents work to be done.  |
