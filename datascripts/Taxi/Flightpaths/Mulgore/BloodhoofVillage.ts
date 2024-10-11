import { std } from "wow/wotlk"

const nodes = [
    {map:1,x:-1190.139282,y:27.765800,z:180.278458,o:6.249003},
    {map:1,x:-1134.585693,y:23.019348,z:175.057022,o:6.197953},
    {map:1,x:-1059.444458,y:55.317856,z:166.493484,o:0.920077},
    {map:1,x:-1040.475220,y:137.348984,z:159.688446,o:1.890044},
    {map:1,x:-1099.622681,y:195.575302,z:156.995224,o:2.903208},
    {map:1,x:-1268.965454,y:209.322342,z:152.333481,o:3.213441},
    {map:1,x:-2164.357178,y:-362.126648,z:-4.628969,o:3.763220},
]

const THUNDERBLUFF_NODE = 22
std.Taxi.createBiFromNode("trevis", "Bloodhoof Village Flight Path", 'FLIGHTPATH', THUNDERBLUFF_NODE, 0, 0, nodes)
.EndName.enGB.set("Bloodhoof Village, Mulgore")