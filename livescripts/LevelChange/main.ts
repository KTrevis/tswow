function capLevel(player: TSPlayer, oldLevel: number) {
    if (player.GetLevel() % 10 != 0) return player.RemoveFlag(UnitFields.PLAYER_FLAGS, PlayerFlags.FLAGS_NO_XP_GAIN)
    const id = UTAG("trevis", "Talent Point Spell")
    const tier = player.GetLevel() / 10
    const stacks = player.GetAura(id)?.GetStackAmount()
    if (!stacks)
        return player.SetFlag(UnitFields.PLAYER_FLAGS, PlayerFlags.FLAGS_NO_XP_GAIN)
    console.log(stacks >= 8 * tier)
    if (stacks >= 8 * tier) 
        return player.RemoveFlag(UnitFields.PLAYER_FLAGS, PlayerFlags.FLAGS_NO_XP_GAIN)
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