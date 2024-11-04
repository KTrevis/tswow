function learnSkills(player: TSPlayer, oldLevel: number) {
    player.LearnClassSpells(true, true, true)
    player.AdvanceSkillsToMax()
}

export default function onLevelChange(events: TSEvents) {
    events.Player.OnLevelChanged(learnSkills)
}