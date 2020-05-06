
# eventManagement

CDM standard entities  

## Entities

|Name|Description|
|---|---|
|[Account](Account.cdm.json)|Business that represents a customer or potential customer. The company that is billed in business transactions.|
|[AttendeePass](AttendeePass.cdm.json)||
|[Building](Building.cdm.json)|A single venue can be comprised of zero or more buildings where event activities are held. Each building in turn is comprised of zero or more rooms where event activities are held.|
|[CheckIn](CheckIn.cdm.json)||
|[CustomRegistrationField](CustomRegistrationField.cdm.json)||
|[Event](Event.cdm.json)|Container to manage and plan marketing activities that take place at a specific venue or location.|
|[EventCustomRegistrationField](EventCustomRegistrationField.cdm.json)||
|[EventRegistration](EventRegistration.cdm.json)||
|[EventTeamMember](EventTeamMember.cdm.json)||
|[EventVendor](EventVendor.cdm.json)||
|[Hotel](Hotel.cdm.json)|This represents a single hotel property (for e.g, Marriott in Bellevue). Each individual property belongs to a Hotel Group (e.g., Marriott) which is represented by an Account|
|[HotelRoomAllocation](HotelRoomAllocation.cdm.json)|This entity records the number of rooms that are allocated from a single hotel for guests of a single event.|
|[HotelRoomReservation](HotelRoomReservation.cdm.json)|Each record of this type tracks a single request made by an event attendee (through the registration portal) to reserve a hotel room from the available hotel allocations|
|[Invitation](Invitation.cdm.json)|Send invitations to existing contacts or email addresses and assign them to web roles upon redemption.|
|[Layout](Layout.cdm.json)|The layout entity is to provide users a quick way to specify the various different layouts that a single room can be arranged in and the maximum capacity of the room as a result of the change.|
|[Pass](Pass.cdm.json)|Information about passes.|
|[RegistrationResponse](RegistrationResponse.cdm.json)||
|[Room](Room.cdm.json)|A room is where a session may be held. A single room can be used in multiple different layouts which has a direct impact on the max. occupancy of the room.|
|[Session](Session.cdm.json)||
|[SessionRegistration](SessionRegistration.cdm.json)||
|[SessionTrack](SessionTrack.cdm.json)||
|[Speaker](Speaker.cdm.json)|Speaker bios of individuals speaking at an event|
|[SpeakerEngagement](SpeakerEngagement.cdm.json)||
|[SponsorableArticle](SponsorableArticle.cdm.json)|An item or a group of items that can be sponsored|
|[Sponsorship](Sponsorship.cdm.json)||
|[Venue](Venue.cdm.json)|The Venue describes the location at which all event sessions and activities take place. A single event venue can be comprised of zero or more buildings, each of which can have zero or more rooms where sessions take place.|
|[WaitlistItem](WaitlistItem.cdm.json)||
