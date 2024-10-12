function capLevel(player: TSPlayer, oldLevel: number) {
    if (player.GetLevel() % 10 != 0) return
    player.SetFlag(UnitFields.PLAYER_FLAGS, PlayerFlags.FLAGS_NO_XP_GAIN)
}

export default function onLevelChange(events: TSEvents) {
    events.Player.OnLevelChanged(capLevel)
}