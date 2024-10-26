import { std } from "wow/wotlk"
import { Position } from "wow/wotlk/std/Misc/Position"

std.Spells.load(42202).delete() // makes hyjal accessible

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
    if (!firstLogin) return
    player.Teleport(1, 5495.261719, -3725.772949, 1597.171753, 3.084047)
})