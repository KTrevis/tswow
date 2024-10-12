import restrictZones from "./LimitZones"

const FLIGHTMASTER = 8192

export default function onZoneChange(events: TSEvents) {
    events.Player.OnUpdateZone(restrictZones)
}