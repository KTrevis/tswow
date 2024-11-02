import { std } from "wow/wotlk";

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

std.CreatureTemplates.load(3491)
.Spawns.add("trevis", "HyjalIntroZoneRepair", {map:1,x:5389.289062,y:-3765.105713,z:1611.110107,o:0.873584},)