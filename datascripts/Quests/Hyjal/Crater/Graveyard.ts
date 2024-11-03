import { std } from "wow/wotlk";
import { AreasID } from "../../Utils/QuestCreator";

const pos = {map:1,x:5335.193848,y:-3200.542969,z:1610.794556,o:0.414126}
std.WorldSafeLocs.createGraveyard(AreasID.HYJAL, 'BOTH', pos)
std.CreatureTemplates.load(6491).Spawns.add("trevis", "HyjalCraterSpiritHealer", pos)