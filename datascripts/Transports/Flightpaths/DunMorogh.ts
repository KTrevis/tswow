import { std } from "wow/wotlk"

const nodes = [
    {map:0,x:-4855.519531,y:-1055.164185,z:553.217651,o:2.603907},
    {map:0,x:-4931.569336,y:-1002.236938,z:542.107361,o:2.026639},
    {map:0,x:-4969.640625,y:-897.688660,z:543.481873,o:2.250478},
    {map:0,x:-5020.669434,y:-835.866089,z:506.888000,o:2.242624},
    {map:0,x:-5495.970703,y:-492.637085,z:446.135590,o:3.177248},
    {map:0,x:-5657.739258,y:-494.076294,z:396.850952,o:3.208663},
    
]

const IRONFORGE_NODE = 6
std.Taxi.createBiFromNode("trevis", "Kharanos Flight Path", 'FLIGHTPATH', IRONFORGE_NODE, 0, 0, nodes)
.EndName.enGB.set("Kharanos, Dun Morogh")