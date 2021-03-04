import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import '../css/recipe.css';
import axios from 'axios';
import UserProfile, { SERVICE_URL } from '../utils.js';
import NotLoggedIn from './notloggedin.js';
import NewRecipe from './newrecipe.js';

/**
 * Displays leaderboard.
 * @extends Component
 */
class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaderboard: []
    }
  }

  async getLeaderboard() {
    try {
      const response = await axios.get(`${SERVICE_URL}/AF1/`);
      const data = await response;
      var dat = JSON.parse(data['data']);
      console.log(dat);
      let t = [];
      for (var i = 0; i < dat.length; i++) {
        t.push(<div key={dat[i].name}>{dat[i].name} {dat[i].count} total favorites</div>);
      }
      console.log(t);
      this.setState({ leaderboard: t });
      return data;
    } catch(e) {
      console.log('Encountered an error getting leaderboard.');
      console.log(e.toString());
      return {};
    }
  }

  componentDidMount() {
    this.getLeaderboard();
  }

  render() {
    return(
      <Container>
        <Row>
          <Col md="12">
            <h1> Leaderboard </h1>
            {this.state.leaderboard.map(child => child)}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Leaderboard;
