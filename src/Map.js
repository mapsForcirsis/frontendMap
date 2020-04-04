import React from 'react'
import { Map as LeafletMap, TileLayer, Polygon } from 'react-leaflet';
import L from 'leaflet'
import { CRS } from 'proj4leaflet';
let lan = require('./län.json');

const crs = new L.Proj.CRS('EPSG:3006',
  '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  {
    resolutions: [
      4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8
    ],
    origin: [-1200000.000000, 8500000.000000],
    bounds: L.bounds([-1200000.000000, 8500000.000000], [4305696.000000, 2994304.000000])
  });

class App extends React.Component {
  constructor(props) {
    super(props)
    this.firsttimeitloadsthemap = true
    this.state = {
      lat: 57,
      lng: 18,
      zoom: 5,
      bluemarble: false,
      clickedLanskod: 0
    }
  }
  handleMoveend = (e) => {
    this.refs.map.leafletElement.invalidateSize(false)
    console.log(e.target.options.center);
    this.firsttimeitloadsthemap = false
  }
  lanClick=(e)=>{

    this.setState(old =>{
      console.log(e.properties.lanskod)
      return {...old, clickedLanskod: e.properties.lanskod}
    })
      let lanName= e.properties.lansnamn
      this.props.LanName(lanName)
  }

  render() {

return (

  <LeafletMap center={[62, 18]} zoom={1} crs={crs}>

    <TileLayer
      maxZoom={9}
      minZoom={0}
      attribution="&amp;copy <a href=&quot;https://www.lantmateriet.se/en/&quot;>Lantmäteriet</a> Topografisk Webbkarta Visning, CCB"
      url={`https://api.lantmateriet.se/open/topowebb-ccby/v1/wmts/token/474aa0a7-917a-3a55-88fc-72ecb5220ceb/1.0.0/topowebb/default/3006/{z}/{y}/{x}.png`}
    />
    {lan.features.map((lanne,i) => {
let superCord=[]
    lanne.properties.lansyta.coordinates.forEach(coords => {
        let ArrCords=[]
       coords.forEach(arr =>{
           let ArrOfCord=[]
           arr.forEach(e=>{
            ArrOfCord.push(crs.unproject(L.point(e)))
           })
           ArrCords.push(ArrOfCord)
        })
        superCord.push(ArrCords)        
      })
      console.log(lanne.properties.lanskod)
      console.log(this.state.clickedLanskod)
     return <Polygon onClick={(e)=>this.lanClick(lanne)} key={i} positions={superCord} color={this.state.clickedLanskod == lanne.properties.lanskod ? "#B8860B" : "green"} />
    })}
  </LeafletMap>



);
  }
}

export default App