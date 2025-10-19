import { std } from "wow/wotlk";

// warbringer talent is now on the first row of the protection tree
const PROT_TALENT_TREE = std.Classes.load("WARRIOR").TalentTrees.get()[2];
PROT_TALENT_TREE.Talents.forEach((talent) => {
  if (talent.Position.Column.get() == 0 && talent.Position.Row.get() == 8) {
    talent.Position.set(0, 3);
  }
});
