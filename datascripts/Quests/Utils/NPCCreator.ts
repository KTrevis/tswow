import { spawn } from "child_process";
import { std } from "wow/wotlk";
import { CreatureTemplate } from "wow/wotlk/std/Creature/CreatureTemplate";
import { Position } from "wow/wotlk/std/Misc/Position";

function createNPC(name: string, spawns: Position[], parent: number = 0): CreatureTemplate {
	let npc: CreatureTemplate
	if (parent)
		npc = std.CreatureTemplates.create("trevis", "trevis" + name, parent)
	else
		npc = std.CreatureTemplates.create("trevis", "trevis" + name)

	npc.Name.enGB.set(name)
	if (spawns.length == 0)
		return npc
	npc.Spawns.add("trevis", "trevisspawn" + name, spawns)
	return npc
}

export const NPCCreator = {
	createNPC
}