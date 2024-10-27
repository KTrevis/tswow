import { std } from "wow/wotlk"

std.Spells.load(42202).delete() // makes hyjal accessible

export const HYJAL_SPAWN = {map:1,x:5496.201172,y:-3734.774414,z:1597.045044,o:2.593613}

std.GMTeleports.create()
.Name.set("spawn")
.Position.set(HYJAL_SPAWN)

std.InlineScripts.Player.OnLogin((player, firstLogin) => {
    const HYJAL_SPAWN = {map:1,x:5496.201172,y:-3734.774414,z:1597.045044,o:2.593613}
    if (!firstLogin) return
    player.Teleport(HYJAL_SPAWN.map, HYJAL_SPAWN.x, HYJAL_SPAWN.y, HYJAL_SPAWN.z, HYJAL_SPAWN.o)
})

std.GameObjectTemplates.Elevators.createLocalTemplate("trevis", "GnomeElevator", [
    {x:0,y:0,z:0,o:0,time:0},
    {x:0,y:0,z:0,o:0,time:2000},
    {x:0,y:0,z:13,o:0,time:3000},
    {x:0,y:0,z:13,o:0,time:5000},
    {x:0,y:0,z:0,o:0,time:6000},
])
.Spawns.add("trevis", "GnomeElevatorSpawn", [
    {map:1,x:5360.685547,y:-3742.861816,z:1611.463623,o:1.203441},
])
.Display.set(1587)