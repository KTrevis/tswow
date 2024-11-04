import onLevelChange from "./LevelChange/main"
import onDeath from "./Death/main"
import onQuest from "./Quests/main"

export function Main(events: TSEvents) {
    onLevelChange(events)
    onDeath(events)
	onQuest(events)
}