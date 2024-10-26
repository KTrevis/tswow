import { std } from "wow/wotlk";
import { StringLookupsDBCFile } from "wow/wotlk/dbc/StringLookups";
import { ClassIDs } from "wow/wotlk/std/Class/ClassIDs";
import { RaceMask } from "wow/wotlk/std/Race/RaceType";

std.Classes.load(ClassIDs.HUNTER)
.Races.add(RaceMask.HUMAN)
std.EquipSkills.Bows.enableAutolearnClass(ClassIDs.HUNTER)
std.EquipSkills.Bows.enableAutolearnRace(RaceMask.HUMAN)