export function learnSpells(player: TSPlayer) {
  player.AdvanceSkillsToMax();
  player.LearnClassSpells(true, true, true);
}
