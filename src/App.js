import React, { Component } from 'react';
import './App.css';
import MyMap from './Map';
import Grid from '@material-ui/core/Grid';

class App extends Component {

  constructor(props) {
    super(props)
    this.firsttimeitloadsthemap = true
    this.state = {
      lanName: ''
    }
  }

  HandleLanName = (lanName) => {
    this.setState(oldstate =>{
      return {
        ...oldstate, kommunname: "",lanName:lanName
      }
    })
  }
  HandleKommunName = (kommun) => {
    this.setState(oldstate => {
      return {
        ...oldstate, kommunname: kommun.properties.kommunnamn
      }
    })
  }
  render() {
    let lanName = this.state.lanName
    return (
      <Grid container className="App">
        <Grid item sm={6}> <h1>{lanName}</h1>
          <Grid item sm={6}> <h2>{this.state.kommunname}</h2></Grid>
          </Grid>
          <Grid item sm={6}><MyMap LanName={(e) => this.HandleLanName(e)}  changeKommunName={(e) => this.HandleKommunName(e) }/></Grid>

        </Grid>
    );
  }
}

export default App;
