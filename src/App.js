import React, {Component} from 'react';
import './App.css';
import Header from './Components/Header'
import routes from './routes';
import { withRouter } from 'react-router-dom';

class App extends Component {
  componentDidMount(){
    this.props.history.push('/dashboard')
  }
  render(){
    return (
      <div className="App">
        <Header />
        {routes}
      </div>
      );
    }
}

export default withRouter(App);
