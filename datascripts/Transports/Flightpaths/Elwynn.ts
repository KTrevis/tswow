import { std } from "wow/wotlk"

let nodes = [
    {map:0,x:-8848.356445,y:461.466858,z:115.269440,o:1.333525},
    {map:0,x:-9034.700195,y:379.097809,z:145.255173,o:3.820855},
    {map:0,x:-9183.627930,y:244.465698,z:90.485626,o:3.938665},
    {map:0,x:-9306.226562,y:145.162354,z:70.572632,o:3.659848},
    {map:0,x:-9430.226562,y:87.487625,z:56.927204,o:3.381032},
]

const STORMWIND_NODE = 2
const goldshireNode = std.Taxi.createBiFromNode("trevis", "Goldshire Flight Path", 'FLIGHTPATH', STORMWIND_NODE, 0, 0, nodes)
.EndName.enGB.set("Goldshire, Elwynn")

nodes = [
    {map:0,x:-9436.972656,y:84.284866,z:57.861496,o:4.745106},
    {map:0,x:-9434.124023,y:20.924892,z:98.800735,o:4.757324},
    {map:0,x:-9441.858398,y:-404.202698,z:142.690323,o:4.659590},
    {map:0,x:-9442.829102,y:-1160.772339,z:135.742340,o:4.723725},
    {map:0,x:-9461.560547,y:-1306.244263,z:46.052116,o:4.482439},    
]

std.Taxi.createBiFromNode("trevis", "Elwynn Logging Camp Flight Path", 'FLIGHTPATH', goldshireNode.EndNode.get().ID, 0, 0, nodes)
.EndName.enGB.set("Eastvale Logging Camp, Elwynn")