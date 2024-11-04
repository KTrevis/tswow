import { std } from "wow/wotlk";
import { AreasID, QuestCreator } from "../../Utils/QuestCreator";
import { NPCCreator } from "../../Utils/NPCCreator";

const name = "Clearing The Way"
const questgiver = std.CreatureTemplates.create("trevis", name + "QuestGiver")
	.Name.enGB.set("Gromtak Bloodshout")
	.Spawns.add("trevis", name + "Gromtak BloodshoutSpawn", [{ map: 1, x: 5404.433594, y: -3181.781006, z: 1579.929688, o: 0.123543 },])
	.NPCFlags.QUEST_GIVER.set(true)
	.Models.get(0).set(14415)

const felguard = std.CreatureTemplates.create("trevis", name + "Felguard", 6115)
	.Level.set(5, 6)
	.Spawns.add("trevis", name + "FelguardSpawns", [
		{ map: 1, x: 5721.267090, y: -3001.313477, z: 1560.895508, o: 3.398689 },
		{ map: 1, x: 5687.881836, y: -2989.418213, z: 1558.963013, o: 3.481156 },
		{ map: 1, x: 5665.866699, y: -3012.063965, z: 1560.151489, o: 3.653940 },
		{ map: 1, x: 5633.884766, y: -3011.611572, z: 1560.144287, o: 2.546528 },
		{ map: 1, x: 5626.958984, y: -2987.525146, z: 1558.895874, o: 1.124957 },
		{ map: 1, x: 5657.826660, y: -2971.054688, z: 1550.492798, o: 1.081760 },
		{ map: 1, x: 5609.285645, y: -2959.638672, z: 1542.782227, o: 3.013841 },
		{ map: 1, x: 5556.919922, y: -2965.388672, z: 1543.839478, o: 4.101617 },
		{ map: 1, x: 5570.137207, y: -3005.459473, z: 1553.149292, o: 5.256150 },
		{ map: 1, x: 5572.557617, y: -3040.865479, z: 1557.812622, o: 4.871309 },
		{ map: 1, x: 5566.670410, y: -3087.898438, z: 1564.344360, o: 4.360802 },
		{ map: 1, x: 5598.097656, y: -3112.623535, z: 1568.516113, o: 0.033252 },
		{ map: 1, x: 5667.072266, y: -3066.318359, z: 1562.867310, o: 5.334691 },
		{ map: 1, x: 5703.168945, y: -3071.157715, z: 1564.615112, o: 0.422030 },
		{ map: 1, x: 5698.085449, y: -3047.458740, z: 1562.398560, o: 2.899960 },
		{ map: 1, x: 5621.475586, y: -3052.072754, z: 1556.419678, o: 3.673578 },
		{ map: 1, x: 5586.202148, y: -3059.028809, z: 1561.609619, o: 0.700840 },
		{ map: 1, x: 5590.125488, y: -3004.021484, z: 1552.636597, o: 0.535906 },
		{ map: 1, x: 5716.992188, y: -3036.500488, z: 1562.476440, o: 4.777052 },
	])
	.Spawns.forEach(value => value.
		MovementType.RANDOM_MOVEMENT.set()
		.WanderDistance.set(10)
	)
	.Stats.set(1, 1, 1, 1, 1)
	.FactionTemplate.NEUTRAL_HOSTILE.set()

const quest = QuestCreator.createKillingQuest(name, questgiver, [{ objective: felguard, quantity: 8 },], 5, AreasID.HYJAL)
	.PickupText.enGB.set(`Alright, now that we know where those Fel Generators are, there's one small problem—they're crawling with demons!
Those fiends are stationed around each portal, ready to fry anyone who gets close. If we're gonna sabotage those generators, we'll need you to clear out the guards first.
Take down those demons near the portals so we can safely move in and shut them off. Keep your wits about you—these aren't your everyday imps!`)
.CompleteText.enGB.set(`Now that's how you clean house!

With those demons out of the way, we'll be able to get up close to those generators without a fight breaking out.
You're making this look easy, but don't get too comfortable—there's still plenty more Legion to deal with.

Nice work, adventurer!`)
.POIs.add(0, [{map:1,x:5627.694824,y:-3001.700195,z:1597.499634,o:5.680238},])
.POIs.forEach(value => value.WorldMapArea.set(AreasID.HYJAL))