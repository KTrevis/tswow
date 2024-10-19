import onLevelChange from "./LevelChange/main"
import onZoneChange from "./ZoneChange/main"
import onDeath from "./Death/main"

export function Main(events: TSEvents) {
    onLevelChange(events)
    onZoneChange(events)
    onDeath(events)
    
}