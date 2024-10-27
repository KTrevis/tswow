import { std } from "wow/wotlk"
import { Position } from "wow/wotlk/std/Misc/Position"

const OLD_HYJAL_DOOR = std.GameObjectInstances.load(49094)
const POS = OLD_HYJAL_DOOR.Position
const position: Position = {map: POS.Map.get(), x: POS.X.get(), y: POS.Y.get(), z: POS.Z.get(), o: POS.O.get()}

const HYJAL_DOOR = std.GameObjectTemplates.Doors.create("trevis", "HyjalDoor")
.Spawns.add("trevis", "HyjalDoorSpawn", position)
.Display.set(4751)
.AutoClose.set(5000)

OLD_HYJAL_DOOR.Position.Y.set(-4000) // hide old door, not deleting it to avoid bugs