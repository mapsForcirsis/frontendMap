import React from 'react'
import { Map as LeafletMap, TileLayer, Polygon, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet'
import { CRS } from 'proj4leaflet';
let lan = require('./län.json');
let kommun = require('./kommun.json');
let vardgivareGBG = require('./vardgivare_GBG.json')
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
    this.vardCords = []
    this.state = {
      lat: 57,
      lng: 18,
      zoom: 5,
      bluemarble: false,
      clickedLanskod: 0,
      clickedKommunkod: 0
    }
  }
  handleMoveend = (e) => {
    this.refs.map.leafletElement.invalidateSize(false)
    console.log(e.target.options.center);
    this.firsttimeitloadsthemap = false
  }
  lanClick = (e, event) => {
    // this.map.props.zoom=3
    this.map.leafletElement.setView([event.latlng.lat, event.latlng.lng], 2)
    // this.map.setView([event.latlng.lat, event.latlng.lng]);
    this.setState(old => {
      return { ...old, clickedLanskod: e.properties.lanskod }
    })
    let lanName = e.properties.lansnamn
    this.props.LanName(lanName)
  }
  kommunClick = (kommun, event) => {
    this.map.leafletElement.setView([event.latlng.lat, event.latlng.lng], 6)

    //  let vardCords= this.vardCords;
    // console.log(vardCords)
    // this.map.leafletElement.fitBounds(vardCords).pad(0.1)

    this.props.changeKommunName(kommun)
    this.setState(oldstate => {
      return {
        ...oldstate, clickedKommunkod: parseInt(kommun.properties.kommunkod, 10)
      }
    })

  }

  render() {
    return (

      <LeafletMap center={[62, 18]} zoom={1} crs={crs} ref={(ref) => { this.map = ref; }} >

        <TileLayer

          maxZoom={9}
          minZoom={0}
          attribution="&amp;copy <a href=&quot;https://www.lantmateriet.se/en/&quot;>Lantmäteriet</a> Topografisk Webbkarta Visning, CCB"
          url={`https://api.lantmateriet.se/open/topowebb-ccby/v1/wmts/token/474aa0a7-917a-3a55-88fc-72ecb5220ceb/1.0.0/topowebb/default/3006/{z}/{y}/{x}.png`}
        />
        {lan.features.map((lanne, i) => {
          let superCord = []
          lanne.properties.lansyta.coordinates.forEach(coords => {
            let ArrCords = []
            coords.forEach(arr => {
              let ArrOfCord = []
              arr.forEach(e => {
                ArrOfCord.push(crs.unproject(L.point(e)))
              })
              ArrCords.push(ArrOfCord)
            })
            superCord.push(ArrCords)
          })
          let number = Math.random();

          return <Polygon onClick={(e) => this.lanClick(lanne, e)} key={i} positions={superCord} color={number < 0.5 ? "green" : "red"} />
        })}

        {
          kommun.features.map((kommun, i) => {
            let kommunCord = []
            kommun.properties.kommunyta.coordinates.forEach(coords => {
              let ArrCords = []
              coords.forEach(arr => {
                let ArrOfCord = []
                arr.forEach(e => {
                  ArrOfCord.push(crs.unproject(L.point(e)))
                })
                ArrCords.push(ArrOfCord)
              })
              kommunCord.push(ArrCords)
            })
            let tempString = kommun.properties.kommunkod.slice(0, 2);
            if (tempString.length == 1) {
              tempString = "0" + tempString
            }
            let kommunkodIntValue = parseInt(tempString, 10);
            if (kommunkodIntValue == this.state.clickedLanskod) {
              let number = Math.random();
              return <Polygon onClick={(e) => this.kommunClick(kommun, e)} key={i} positions={kommunCord} color={ number < 0.5 ? "white" : "blue"} />
            }


          })

        }

        {
          vardgivareGBG.map((vard, key) => {

            if (this.state.clickedKommunkod == 1480) {
              let vardCords = this.vardCords;
              vardCords.push(vard.coords);
              let number = Math.random();
              return <CircleMarker key={key} center={vard.coords} color={ number < 0.5 ? "brown" : "gold"} radius={6}>
                <Tooltip>
                  {vard.namn}
                </Tooltip>
              </CircleMarker>
            }
          })
        }
      </LeafletMap>



    );
  }
}

export default App