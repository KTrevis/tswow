import { std } from "wow/wotlk";
import { AreasID, QuestCreator } from "../../Utils/QuestCreator";
import { GearmasterGizwizzle } from "./HelpFromMyFremenies";

// kill 5 malfunctioning machines

const name = "Power Play"

const overloadPrime = std.CreatureTemplates.create("trevis", name + "OverloadPrime", 27883)
.Name.enGB.set("Overload Prime")
.Spawns.add("trevis", name + "OverloadPrimeSpawn", {map:1,x:5583.669434,y:-3444.049072,z:1606.502686,o:0.088209},)
.FactionTemplate.NEUTRAL_HOSTILE.set()
.Level.set(10)

const shredder = std.CreatureTemplates.create("trevis", name + "Shredder", 27883)
.Level.set(3, 4)
.MovementType.RANDOM_MOVEMENT.set()
.Spawns.add("trevis", name + "ShredderSpawn", [
    {map:1,x:5618.284180,y:-3480.855713,z:1592.057007,o:2.676078},
    {map:1,x:5596.601562,y:-3474.481934,z:1592.276367,o:1.333048},
    {map:1,x:5609.785645,y:-3444.142578,z:1594.261108,o:1.721820},
    {map:1,x:5602.748047,y:-3415.894287,z:1594.451538,o:0.932494},
    {map:1,x:5624.940918,y:-3416.395020,z:1594.451538,o:5.648815},
    {map:1,x:5628.521973,y:-3453.642334,z:1594.451538,o:4.686699},
    {map:1,x:5576.461914,y:-3481.740479,z:1592.318481,o:2.444388},
    {map:1,x:5598.268555,y:-3463.975098,z:1605.668335,o:6.265348},
    {map:1,x:5622.619629,y:-3462.088623,z:1605.471558,o:0.233489},
    {map:1,x:5625.562988,y:-3440.031494,z:1605.668579,o:2.856720},    
], spawn => 
    spawn.MovementType.RANDOM_MOVEMENT.set()
    .WanderDistance.set(10)
)
.Name.enGB.set("Shredder")
.FactionTemplate.NEUTRAL_HOSTILE.set()
.Stats.HealthMod.set(1)

const powerPlay = QuestCreator.createKillingQuest(name, GearmasterGizwizzle, [{id: shredder.ID, quantity: 8}], 3, AreasID.HYJAL)
.PickupText.enGB.set(`Ah, hello there!

You've arrived just in time! We have constructed a small factory next to the World Tree, eager to harness the immense power left behind by Archimonde.
But, oh dear, it seems the goblins have really messed things up! Their machines are malfunctioning all over the place, sending bizarre energy surges that are warping the area.

Your mission, brave adventurer, is to investigate these disturbances and set things right before we have a catastrophic meltdown—or worse, wake up some very angry spirits!`)
.CompleteText.enGB.set(`Well done, intrepid adventurer! 
    
You've disabled those gloriously malfunctioning machines!
Honestly, I'm not surprised—those goblins never did have the best reputation for craftsmanship!
Now we can finally get back to harnessing that power... for science, of course! 

But be warned—this power is as unpredictable as it is potent. Who knows what other surprises Archimonde's legacy might have in store? Stay vigilant; the forest has a way of keeping us on our toes!`)
.POIs.add(0, [
    {map:1,x:5568.344727,y:-3494.653320,z:1597.479614,o:1.537250},
    {map:1,x:5562.239746,y:-3412.375000,z:1609.523315,o:1.655060},
    {map:1,x:5629.793945,y:-3394.290283,z:1603.088867,o:0.099970},
    {map:1,x:5645.541992,y:-3494.579346,z:1603.500488,o:4.474646},
])
.POIs.forEach(value => value.WorldMapArea.set(AreasID.HYJAL))