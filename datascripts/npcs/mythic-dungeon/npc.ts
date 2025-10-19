import { std } from "wow/wotlk";
import { MODULE_NAME } from "../../utils/constants";

const MYTHIC_DUNGEON_NPC = std.CreatureTemplates.create(
  MODULE_NAME,
  "mythic-dungeon-npc",
  24369
)
  .Spawns.add(MODULE_NAME, "mythic-dungeon-npc-spawns", [
    { map: 389, x: -3.318733, y: -14.053429, z: -16.968683, o: 6.212896 },
  ])
  .Tags.addUnique(MODULE_NAME, "mythic-dungeon-npc");
