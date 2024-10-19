function capLevel(player: TSPlayer, oldLevel: number) {
    if (player.GetLevel() % 10 != 0) return
    player.SetFlag(UnitFields.PLAYER_FLAGS, PlayerFlags.FLAGS_NO_XP_GAIN)
}

function learnSkills(player: TSPlayer, oldLevel: number) {
    player.LearnClassSpells(true, true, true)
    player.AdvanceSkillsToMax()
}

export default function onLevelChange(events: TSEvents) {
    events.Player.OnLevelChanged(capLevel)
    events.Player.OnLevelChanged(learnSkills)
}