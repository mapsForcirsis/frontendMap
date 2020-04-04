import React, { Component } from 'react';
import './App.css';
import MyMap from './Map';
import Grid from '@material-ui/core/Grid';

class App extends Component {
  
  constructor(props) {
    super(props)
    this.firsttimeitloadsthemap = true
    this.state = {
      lanName:''
    }
  }

  HandleLanName=(lanName)=>{
    this.setState({lanName})
  }
  render() {
    let lanName=this.state.lanName
    return (
      <Grid container className="App">
        <Grid item sm={6}> <h1>{lanName}</h1>
</Grid>
        <Grid item sm={6}><MyMap LanName={(e)=>this.HandleLanName(e)}/></Grid>
        
      </Grid>
    );
  }
}

export default App;
