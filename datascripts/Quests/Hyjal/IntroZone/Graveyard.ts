import { std } from "wow/wotlk";
import { AreasID } from "../../Utils/QuestCreator";

const pos = {map:1,x:5478.302734,y:-3705.372803,z:1594.455322,o:4.211528}
std.WorldSafeLocs.createGraveyard(AreasID.HYJAL, 'BOTH', pos)
std.CreatureTemplates.load(6491).Spawns.add("trevis", "HyjalIntroZoneSpiritHealer", pos)