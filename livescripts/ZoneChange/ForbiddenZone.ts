export enum ZoneID {
    STORMWIND = 1519,
    ELWYNN = 12,
    ORGRIMMAR = 1637,
    DUROTAR = 14,
    DUN_MOROGH = 1,
    IRONFORGE = 1537,
    TELDRASSIL = 141,
    DARNASSUS = 1657,
    UNDERCITY = 1497,
    TIRISFAL_GLADES = 85,
    MULGORE = 215,
    THUNDER_BLUFF = 1638,
    DEEPRUN_TRAM = 2257,
    HYJAL = 616,
}

const allowedZones: number[] = [
    ZoneID.HYJAL,
    // ZoneID.DUROTAR,
    // ZoneID.ELWYNN,
    // ZoneID.ORGRIMMAR,
    // ZoneID.STORMWIND,
    // ZoneID.DUN_MOROGH,
    // ZoneID.DARNASSUS,
    // ZoneID.TELDRASSIL,
    // ZoneID.MULGORE,
    // ZoneID.THUNDER_BLUFF,
    // ZoneID.TIRISFAL_GLADES,
    // ZoneID.UNDERCITY,
    // ZoneID.DEEPRUN_TRAM,
    // ZoneID.IRONFORGE,
]

const aura = UTAG("trevis", "Forbidden zone")

export default function restrictZones(player: TSPlayer, newZone: number) {
    if (player.IsGM()) return
    if (player.HasUnitState(256)) return // this mean the player is on a taxi
    if (allowedZones.includes(newZone)) {
        player.RemoveAura(aura)
        return
    }
    console.log(`${player.GetName()} entered a forbidden zone: ${newZone}`)
    if (player.HasAura(aura)) return
    player.AddAura(aura, player)
    player.SendAreasIDTriggerMessage(`You are not allowed to be here. You will be teleported to your faction capital in 10 seconds if you do not leave this zone.`)
}