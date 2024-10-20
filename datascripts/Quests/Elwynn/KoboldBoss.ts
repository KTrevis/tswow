import { std } from "wow/wotlk";
import { AreaSort, createKillingQuest } from "../Utils/KillingQuest";
import { talentPointItem } from "../../Items/TalentPoint";

const name = "Kobold Boss"
const spawn = {map:0,x:-8565.484375,y:-214.808640,z:85.709366,o:0.329260}

const mob = std.CreatureTemplates.create("trevis", name, 80)
.Level.set(10)
.Name.enGB.set(name)
.Spawns.add("trevis", name + "spawn", spawn)
.Scale.set(2)
.Rank.ELITE.set()
mob.Stats.HealthMod.set(5)
.Stats.DamageMod.set(3)

const quest = createKillingQuest(name, std.CreatureTemplates.load(197), [{id: mob.ID, quantity: 1}], 4, AreaSort.NORTHSHIRE)
.PickupText.enGB.set(`I think we finally found how to get rid of all these kobolds!

You will find their boss the bottom of the cave. Kill him, and I think we will be done with them for good.
Be careful, he is quite strong, it's dangerous to go alone!`)
.POIs.add(0, [spawn])
.QuestInfo.GROUP.set()
.Rewards.Difficulty.DIFFICULTY_7.set()
.Level.Target.set(10)
.QuestLevel.set(10)
.Rewards.Item.add(talentPointItem.ID, 1)