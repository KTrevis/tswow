import { std } from "wow/wotlk";

std.CreatureTemplates.create("trevis", "Crater Repair", 3314)
	.Spawns.add("trevis", "Crater Repair Spawn", { map: 1, x: 5410.045898, y: -3105.519043, z: 1579.108521, o: 2.644661 },)
	.FactionTemplate.NEUTRAL_PASSIVE.set()
	.Emote.set(233)
	.Level.set(30)

std.CreatureTemplates.create("trevis", "Crater Human Guard", 29712)
	.Spawns.add("trevis", "Crater Human Guard Spawn", [
		{map:1,x:5418.917480,y:-3149.340820,z:1577.192017,o:1.635425},
		{map:1,x:5416.379883,y:-3140.421631,z:1577.375488,o:5.169715},
	])
	.FactionTemplate.NEUTRAL_PASSIVE.set()
	.NPCFlags.GOSSIP.set(false)
	
	std.CreatureTemplates.create("trevis", "Crater Orc Guard", 31416)
	.Spawns.add("trevis", "Crater Orc Guard Spawn", [
		{map:1,x:5413.254883,y:-3145.724609,z:1577.387939,o:0.151019},
		{map:1,x:5423.649902,y:-3144.014893,z:1577.539062,o:3.155171},
	])
	.FactionTemplate.NEUTRAL_PASSIVE.set()
	.NPCFlags.GOSSIP.set(false)
	.Level.set(30)