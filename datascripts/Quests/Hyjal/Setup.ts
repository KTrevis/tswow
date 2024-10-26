import { std } from "wow/wotlk"
import { Position } from "wow/wotlk/std/Misc/Position"
import { AreaSort } from "../Utils/KillingQuest"
import { Area } from "wow/wotlk/std/Area/Area"

std.Spells.load(42202).delete() // makes hyjal accessible

export const HYJAL_SPAWN = {map:1,x:5495.605957,y:-3725.211914,z:1600,o:3.041286}

const HYJAL_MAP = std.WorldMapAreas.create()
.Map.set(1)
.Area.set(AreaSort.HYJAL)
.Directory.set("Hyjal")
// .Boundary.setMinimapCoords([1,1,6,6], 4800, )
.Boundary.Top.set(6000)
.Boundary.Bottom.set(4000)
.Boundary.Left.set(-1100)
.Boundary.Right.set(-4200)

const OVERLAY = HYJAL_MAP.Overlays.addGet()
.Areas.addId(AreaSort.HYJAL)
.Texture.set("HyjalWorldMap", 1000, 667)

std.GMTeleports.create()
.Name.set("spawn")
.Position.set(HYJAL_SPAWN)

function changeHyjalDoor() {
    const OLD_HYJAL_DOOR = std.GameObjectInstances.load(49094)
    const POS = OLD_HYJAL_DOOR.Position
    const position: Position = {map: POS.Map.get(), x: POS.X.get(), y: POS.Y.get(), z: POS.Z.get(), o: POS.O.get()}
    
    const HYJAL_DOOR = std.GameObjectTemplates.Doors.create("trevis", "HyjalDoor")
    .Spawns.add("trevis", "HyjalDoorSpawn", position)
    .Display.set(4751)
    .AutoClose.set(5000)
    
    OLD_HYJAL_DOOR.Position.Y.set(-4000) // hide old door, not deleting it to avoid bugs
}

changeHyjalDoor()

std.GameObjectInstances.create("trevis", "HyjalGoblinWorkshopSpawn")
.Template.set(192033)
.Position.set({map:1,x:5493.584961,y:-3733.395508,z:1593.542358,o:1.475291},)

std.InlineScripts.Player.OnLogin((player, firstLogin) => {
    const HYJAL_SPAWN = {map:1,x:5495.605957,y:-3725.211914,z:1597.186523,o:3.041286}
    if (!firstLogin) return
    player.Teleport(HYJAL_SPAWN.map, HYJAL_SPAWN.x, HYJAL_SPAWN.y, HYJAL_SPAWN.z, HYJAL_SPAWN.o)
})