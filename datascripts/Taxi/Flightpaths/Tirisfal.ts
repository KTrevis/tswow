import { std } from "wow/wotlk"

const nodes = [{map:0,x:1572.922363,y:267.568420,z:-33.861572,o:5.798292},
    {map:0,x:1628.975708,y:238.983337,z:-30.415133,o:0.002051},
    {map:0,x:1729.184326,y:237.838974,z:-32.046970,o:0.155205},
    {map:0,x:1751.278564,y:262.033112,z:-38.134998,o:1.733855},
    {map:0,x:1689.207764,y:390.478333,z:5.604583,o:1.211565},    
    {map:0,x:1727.321289,y:467.119873,z:3.216118,o:1.703667},
    {map:0,x:1716.214478,y:513.727234,z:-6.695888,o:2.386964},
    {map:0,x:1697.499146,y:531.324951,z:-6.515934,o:2.386964},
    {map:0,x:1677.999268,y:548.875854,z:-6.422799,o:1.307041},
    {map:0,x:1693.544800,y:628.394104,z:14.941592,o:2.791444},
    {map:0,x:1619.102173,y:647.224670,z:42.235344,o:2.489065},
    {map:0,x:1589.850464,y:674.187012,z:56.522751,o:1.204939},
    {map:0,x:1599.716675,y:722.741272,z:74.585197,o:0.223191},
    {map:0,x:1664.720581,y:733.391663,z:90.102371,o:6.231489},
    {map:0,x:1947.430542,y:651.731140,z:124.826057,o:5.489302},
    {map:0,x:2184.212646,y:461.474457,z:78.751862,o:5.559981},
    {map:0,x:2267.846436,y:382.344116,z:37.081203,o:4.990584},
    {map:0,x:2271.690674,y:360.677856,z:35.087234,o:5.128027},
]

const UNDERCITY_NODE = 11
std.Taxi.createBiFromNode("trevis", "Tirisfal Flight Path", 'FLIGHTPATH', UNDERCITY_NODE, 0, 0, nodes)
.EndName.enGB.set("Tirisfal, Dun Morogh")