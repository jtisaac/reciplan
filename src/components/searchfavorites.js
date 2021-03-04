import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import '../css/recipe.css';
import axios from 'axios';
import UserProfile, { SERVICE_URL } from '../utils.js';
import NotLoggedIn from './notloggedin.js';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

/**
 * Displays the search results for recipe search.
 * @extends Component
 */
class SearchFavorites extends Component {
  constructor(props) {
    super(props);
    let userObj = null;
    if (UserProfile.isLoggedIn()) {
      userObj = UserProfile.getUserObject();
    }
    this.state = {
      user: userObj,
      loggedIn: (userObj !== null),
      returnedRecipeNames: []
    }
    this.runSearch = this.runSearch.bind(this);
  }

  async runSearch() {
    var search = document.getElementById('search-input').value;
    let jsonedSearch = {params: {username: parseInt(search)}};
    try {
      const response = await axios.get(`${SERVICE_URL}/favorites/`, jsonedSearch);
      const data = await response;
      var dat = JSON.parse(data['data'])['favorites'];
      console.log(dat);
      var currHTML = '<table style="width:100%">';
      var t = []
      for (var i = 0; i < dat.length; i++) {
        var curr = dat[i];
        console.log("curr " + curr);
        t.push(<div key={curr['recipe_id']}>{curr['name']}</div>);
        console.log(dat[i]['recipeName']);
      }
      this.setState({ returnedRecipeNames: t });
      //document.getElementById('res').innerHTML = currHTML
      return data;
    } catch(e) {
      console.log('Encountered an error searching for recipes.');
      console.log(e.toString());
      return {};
    }
  }

  render() {
    return(
      <Container>
        <h1> View Others' Favorites </h1>
        <Row>
          <Col md="8">
            <Input name="search-input" id="search-input" placeholder="Enter a User ID" style={{width: '98%'}} required />
          </Col>
          <Col md="4">
            <Button onClick={this.runSearch} color="success" style={{position:'absolute', bottom: 0}}>Search</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {this.state.returnedRecipeNames.map(child => child)}
          </Col>
          <div id="res">
          </div>
        </Row>
      </Container>
    )
  }
}

export default SearchFavorites;
