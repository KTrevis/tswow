import { std } from "wow/wotlk"

let nodes = [
    {map:1,x:9869.189453,y:976.320129,z:1309.570557,o:0.400308},
    {map:1,x:9872.507812,y:979.104309,z:1309.955811,o:0.4},
]

const darnassusFlight = std.Taxi.createBi("trevis", "Darnassus Flight Path", 'FLIGHTPATH', 0, 0, nodes)
darnassusFlight.EndName.enGB.set("Darnassus, Teldrassil")

nodes = [
    {map:1,x:9866.833984,y:981.557007,z:1309.466431,o:2.689071},
    {map:1,x:9844.683594,y:994.902771,z:1309.863647,o:2.461305},
    {map:1,x:9817.311523,y:1104.843140,z:1318.458130,o:1.613075},
    {map:1,x:9855.022461,y:1202.353760,z:1321.705078,o:0.941559},
    {map:1,x:9956.951172,y:1369.873901,z:1324.566650,o:1.240010},
    {map:1,x:9985.816406,y:1497.532837,z:1337.651123,o:1.346039},
    {map:1,x:10012.845703,y:1635.401001,z:1345.770264,o:1.432433},
    {map:1,x:10016.734375,y:1771.860596,z:1346.473511,o:1.495265},
    {map:1,x:9998.590820,y:1866.184448,z:1351.822876,o:2.084314},
    {map:1,x:9961.090820,y:1953.241577,z:1375.571899,o:1.730885},
    {map:1,x:9954.898438,y:2225.982666,z:1410.047729,o:1.565951},
    {map:1,x:9959.762695,y:2413.359131,z:1378.794800,o:1.495265},
    {map:1,x:9971.614258,y:2620.896240,z:1315.793213,o:1.766227},
]

const dolanaarFlight = std.Taxi.createBiFromNode("trevis", "Dolanaar Flight Path", 'FLIGHTPATH', darnassusFlight.StartNode.get().ID, 0, 0, nodes)
.EndName.enGB.set("Dolanaar, Teldrassil")