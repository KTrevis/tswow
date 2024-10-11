import { std } from "wow/wotlk"

const nodes = [
    {map:0,x:-8848.356445,y:461.466858,z:115.269440,o:1.333525},
    {map:0,x:-9034.700195,y:379.097809,z:145.255173,o:3.820855},
    {map:0,x:-9183.627930,y:244.465698,z:90.485626,o:3.938665},
    {map:0,x:-9306.226562,y:145.162354,z:70.572632,o:3.659848},
    {map:0,x:-9430.226562,y:87.487625,z:56.927204,o:3.381032},
]

const STORMWIND_FLIGHTMASTER = 2
std.Taxi.createBiFromNode("trevis", "Goldshire Flight Path", 'FLIGHTPATH', STORMWIND_FLIGHTMASTER, 0, 0, nodes)
.EndName.enGB.set("Goldshire, Elwynn")