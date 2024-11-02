import { std } from "wow/wotlk";
import { zevrinRustwhistle } from "../IntroZone/ContactInTheCrater";
import { AreasID, QuestCreator } from "../../Utils/QuestCreator";

const name = "Sabotage In The Shadows"

// const lock = std.Locks.create("trevis", "BasicLock")

// const unlockSpell = std.Spells.create("trevis", name + "Unlock")
// .Effects.addMod(eff => {
// 	eff.Type.OPEN_LOCK.set()
// 	.LockType.set(lock.ID)
// })
// .Tags.addUnique("trevis", "UnlockSpell")

const generator = std.GameObjectTemplates.Goobers.create("trevis", "GeneratorTemplate" + name)
	.Display.set(6706)
	.Spawns.add("trevis", name + "generatorspawn", [
		{ map: 1, x: 5705.775879, y: -2983.927979, z: 1562.788818, o: 3.143397 },
		{ map: 1, x: 5616.014648, y: -2985.965088, z: 1562.176880, o: 4.922324 },
		{ map: 1, x: 5630.522461, y: -3010.923340, z: 1563.558716, o: 3.728521 },
		{ map: 1, x: 5615.937500, y: -3038.915771, z: 1563.115112, o: 3.595007 },
		{ map: 1, x: 5639.625488, y: -3083.624023, z: 1572.013428, o: 5.676306 },
		{ map: 1, x: 5678.129883, y: -3010.865234, z: 1561.922729, o: 0.170667 },
	],
		30)
	.Name.enGB.set("Destroy Fel Generator")
	.Flags.CONDITIONAL_SELECT.set(true)
	.Consumable.set(1)
	.Lock.set(43)

export const quest = QuestCreator.createInteractQuest(name, zevrinRustwhistle, [{ id: generator.ID, quantity: 2 }], 5, AreasID.HYJAL)
	.PickupText.enGB.set(`Finally! With all these demons around, I could use an extra pair of hands.

Listen up: the Legion's got portals and fel machinery set up all over the crater, reinforcing their ranks faster than we can fight them.
We're gonna start by throwing a wrench into their operations—literally.
I've spotted a few key fel generators powering their portals.

Head out there, disable those generators, and send those demons back where they came from. And watch yourself—these demons don't play nice!`)
	.CompleteText.enGB.set(`Ha! That should slow 'em down!
Taking out those generators will cut their portal capacity, which means fewer demons to deal with.
Nicely done! Now that we've put a dent in their operations, let's see what else we can mess with.`)

generator.Quest.set(quest.ID)