import { std } from "wow/wotlk"
import { createKillingQuest, AreasID } from "../Utils/KillingQuest"
import { WELCOME_QUEST } from "./Welcome"
import { GNOME } from "./Welcome"
import { HYJAL_MAP } from "./Setup/Map"
const name = "HyjalFirstTask"

const CORRUPTED_SYLVAIN = std.CreatureTemplates.create("trevis", name + "Sylvain", 299)
.Level.set(1, 2)
.Spawns.add("trevis", name + "SylvainSpawn", [
    {map:1,x:5599.982910,y:-3778.076660,z:1613.671997,o:2.778143},
    {map:1,x:5617.885742,y:-3765.430908,z:1618.547729,o:0.555466},
    {map:1,x:5621.502441,y:-3735.324951,z:1616.966187,o:2.236218},
    {map:1,x:5605.661621,y:-3714.417969,z:1611.230225,o:1.980964},
    {map:1,x:5611.403809,y:-3702.842285,z:1611.118042,o:0.637932},
    {map:1,x:5628.313477,y:-3692.791992,z:1616.950073,o:0.166693},
    {map:1,x:5651.789551,y:-3687.161133,z:1624.816406,o:1.065974},
    {map:1,x:5653.773438,y:-3670.291016,z:1623.354248,o:2.032014},
    {map:1,x:5634.853516,y:-3654.494873,z:1614.997314,o:2.821340},
    {map:1,x:5602.859863,y:-3648.961182,z:1605.908447,o:3.131572},
    {map:1,x:5585.362305,y:-3649.172607,z:1601.278809,o:3.143353},
    {map:1,x:5569.761719,y:-3652.917236,z:1598.522339,o:3.630300},
    {map:1,x:5548.442383,y:-3668.985107,z:1596.567505,o:3.940532},
    {map:1,x:5538.878418,y:-3682.122559,z:1595.484009,o:4.274324},
    {map:1,x:5663.514160,y:-3722.367920,z:1625.652222,o:5.138271},
    {map:1,x:5668.892578,y:-3747.730225,z:1628.279297,o:4.706308},
    {map:1,x:5658.928223,y:-3766.874268,z:1627.057861,o:3.665659},
    {map:1,x:5617.595215,y:-3671.987061,z:1611.201782,o:3.909132},
    {map:1,x:5627.959961,y:-3713.622559,z:1617.669678,o:5.578098},
    {map:1,x:5649.420410,y:-3713.628174,z:1625.145142,o:0.649721},
    {map:1,x:5640.942383,y:-3736.894287,z:1623.829590,o:4.490318},
    {map:1,x:5649.615723,y:-3753.820557,z:1624.009766,o:4.392138},
    {map:1,x:5635.596680,y:-3766.459229,z:1621.492798,o:4.380357},
    {map:1,x:5602.344727,y:-3753.416992,z:1612.098877,o:3.673499},
    {map:1,x:5595.602051,y:-3735.538330,z:1608.394775,o:1.898498},
    {map:1,x:5623.852051,y:-3668.693848,z:1613.200317,o:1.505799},
    {map:1,x:5580.008789,y:-3664.514160,z:1599.911499,o:4.081906},
    {map:1,x:5558.021973,y:-3691.737793,z:1599.603394,o:4.011224},
    {map:1,x:5524.072266,y:-3736.708740,z:1595.529663,o:4.466750},
    {map:1,x:5546.309082,y:-3746.288818,z:1597.034912,o:0.103859},
    {map:1,x:5560.428223,y:-3771.218506,z:1602.653320,o:5.079356},
    
])
.Models.mod(0, ref => ref.set(18922))
.Name.enGB.set("Treant")
.Type.ELEMENTAL.set()
.TypeFlags.clearAll()
.Auras.set('')

CORRUPTED_SYLVAIN.Spawns.get().forEach(value => {
    value.WanderDistance.set(10)
    value.MovementType.RANDOM_MOVEMENT.set()
})

const POIs = [
    {map:1,x:5531.914551,y:-3655.350586,z:1593.751831,o:0.001773},
    {map:1,x:5646.271973,y:-3640.696045,z:1617.398438,o:6.041487},
    {map:1,x:5669.409668,y:-3770.125732,z:1630.355713,o:4.780927},
    {map:1,x:5519.863770,y:-3810.039551,z:1609.844360,o:3.418262},
]

const FIRST_TASK = createKillingQuest("Branching Out Problems", GNOME, [{id: CORRUPTED_SYLVAIN.ID, quantity: 8}], 1, AreasID.HYJAL)
.PickupText.enGB.set(`Finally, a recruit who's not just here to grab energy!
Those goblins can hardly see past the gold glint, but we've got some... roots to dig up here.

The corrupted treants around Nordrassil—forest spirits with a serious attitude problem—have become downright nasty.
We suspect they've had a bit too much of that magical residue left from Archimonde's "grand finale." 

Take a few down so we can get to work without dodging thorny attitudes!`)
.CompleteText.enGB.set(`Well done!
    
With those treants taken care of, we can actually start studying the energy here.
Who knows, maybe we can restore some balance, too. Thanks for the help!`)
.POIs.add(0, POIs)
.POIs.add(1, POIs)
.POIs.forEach(value => value.WorldMapArea.set(HYJAL_MAP.ID))
.PrevQuest.set(WELCOME_QUEST.ID)