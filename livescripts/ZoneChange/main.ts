import restrictZones from "./LimitZones"

export default function onZoneChange(events: TSEvents) {
    events.Player.OnUpdateZone(restrictZones)
}