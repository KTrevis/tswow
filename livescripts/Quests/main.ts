function onContactCraterDone(quest: TSQuest, player: TSPlayer) {
	player.SendAreaTriggerMessage("test")
}

export default function onQuest(events: TSEvents) {
	events.Quest.OnReward(UTAG("trevis", "Contact In The Crater"), onContactCraterDone)
}