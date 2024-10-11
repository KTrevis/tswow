import setupZoneRestriction from "./LimitZones"

export default function onZoneChange(events: TSEvents) {
    setupZoneRestriction(events)
}