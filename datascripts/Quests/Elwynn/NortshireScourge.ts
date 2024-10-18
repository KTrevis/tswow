import { std } from "wow/wotlk";
import { FactionTemplateValues } from "wow/wotlk/std/Faction/FactionTemplates";

const name = "Northshire Scourge"
const zombie = std.CreatureTemplates.create("trevis", name)
.Models.addIds(25286)
.Name.enGB.set("Ghoul")
.Spawns.add("trevis", name + " Spawns", [
    {map:0,x:-8682.494141,y:-292.813721,z:84.566322,o:5.290771},
    {map:0,x:-8676.949219,y:-302.500793,z:85.663689,o:3.291933},
    {map:0,x:-8694.076172,y:-306.919678,z:85.308250,o:3.606092},
    {map:0,x:-8702.470703,y:-280.194611,z:91.125999,o:5.522463},
    {map:0,x:-8708.197266,y:-301.044403,z:87.772079,o:3.413675},
    {map:0,x:-8719.494141,y:-279.394958,z:87.467400,o:3.103441},
    {map:0,x:-8731.371094,y:-278.941589,z:82.776443,o:3.103441},
    {map:0,x:-8741.002930,y:-283.773193,z:81.042557,o:4.395420},
    {map:0,x:-8739.511719,y:-294.166779,z:80.616386,o:4.854877},
    {map:0,x:-8733.656250,y:-304.389404,z:80.686104,o:5.310407},
    {map:0,x:-8723.320312,y:-303.518646,z:82.703064,o:6.107586},
    {map:0,x:-8715.381836,y:-291.771820,z:93.337090,o:2.962076},
])
.Type.UNDEAD.set()
.FactionTemplate.NEUTRAL_NON_AGGRESSIVE.set()

zombie.Spawns.forEach((instance, index) => {
    instance.WanderDistance.set(5)
    .MovementType.RANDOM_MOVEMENT.set()
})

console.log(std.Compare(zombie.objectify(), std.CreatureTemplates.load(6).objectify()))