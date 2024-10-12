import { std } from "wow/wotlk"

const nodes = [{map:1,x:1676.090454,y:-4316.415039,z:61.732349,o:4.069322},
    {map:1,x:1651.672974,y:-4357.424316,z:63.628445,o:4.175350},
    {map:1,x:1515.631348,y:-4407.379395,z:42.699875,o:3.382097},
    {map:1,x:1446.034302,y:-4420.879395,z:29.418978,o:2.478889},
    {map:1,x:1436.838989,y:-4381.451172,z:30.134861,o:2.6},
    {map:1,x:1381.031616,y:-4370.591797,z:31.225510,o:3},
    {map:1,x:1029.362671,y:-4468.565918,z:69.495422,o:3.433148},
    {map:1,x:590.279541,y:-4634.818359,z:74.298088,o:3.519542},
    {map:1,x:350.059631,y:-4730.709473,z:20.574648,o:3.586301},
    {map:1,x:273.128326,y:-4767.356934,z:12.332074,o:3.708038},
]

const ORGRIMMAR_NODE = 23
std.Taxi.createBiFromNode("trevis", "RazorHill Flight Path", 'FLIGHTPATH', ORGRIMMAR_NODE, 0, 0, nodes)
.EndName.enGB.set("Razor Hill, Durotar")