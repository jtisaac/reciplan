import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import '../css/recipe.css';
import axios from 'axios';
import UserProfile, { SERVICE_URL } from '../utils.js';
import NotLoggedIn from './notloggedin.js';

/**
 * Displays the search results for recipe search.
 * @extends Component
 */
class Search extends Component {
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
    this.addToCart = this.addToCart.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
  }

  async addToCart(e) {
    var toAdd = e.target.name;
    var jsonToQuery = { username: this.state.user.username, recipe: toAdd};
    try {
        const response = await axios.post(`${SERVICE_URL}/cart/`, jsonToQuery);
        const data = await response;
        return data;
      } catch(e) {
        console.log('Encountered an error adding to Cart.');
        console.log(e.toString());
        return {};
      }
  }

  async addToFavorites(e) {
    var toAdd = e.target.name;
    var jsonToQuery = { username: this.state.user.username, recipe: toAdd};
    try {
        const response = await axios.post(`${SERVICE_URL}/favorites/`, jsonToQuery);
        const data = await response;
        return data;
      } catch(e) {
        console.log('Encountered an error adding to Favorites.');
        console.log(e.toString());
        return {};
      }
  }

  async runSearch() {
    var search = document.getElementById('search-input').value;
    //console.log(search);
    let jsonedSearch = {params: {searchVal: search}};
    try {
      const response = await axios.get(`${SERVICE_URL}/results/`, jsonedSearch);
      const data = await response;
      var dat = JSON.parse(JSON.parse(data['data'])['searchResults']);
      console.log(dat);
      var currHTML = '<table style="width:100%">';
      var t = []
      for (var i = 0; i < dat.length; i++) {
        t.push(<div key={dat[i]['recipeID']}><Button key={dat[i]['recipeID'] + 'add'} onClick={this.addToCart} name={dat[i]['recipeID']} color="success" className="edit">+ Cart</Button> <Button key={dat[i]['recipeID'] + 'add'} onClick={this.addToFavorites} name={dat[i]['recipeID']} color="success" className="edit">+ Favorite</Button> {dat[i]['recipeName']}</div>);
        currHTML += '<tr><td>' + dat[i]['recipeName'] + '</td></tr>';
        console.log(dat[i]['recipeName']);
      }
      currHTML += '</table>';
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
        <Row>
          <h1>&nbsp;&nbsp;Search </h1>
        </Row>
        <Row>
          <Col md="8">
            <Input name="search-input" id="search-input" placeholder="Search for a recipe" style={{width: '98%'}} required />
          </Col>
          <Col md="4">
            <Button onClick={this.runSearch} color="success" style={{position:'absolute', bottom: 0}}>Search</Button>
          </Col>
        </Row>
        <Row>
          <h2></h2>
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

export default Search;
