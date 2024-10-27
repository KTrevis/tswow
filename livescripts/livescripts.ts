import onLevelChange from "./LevelChange/main"
import onDeath from "./Death/main"

export function Main(events: TSEvents) {
    onLevelChange(events)
    onDeath(events)
}