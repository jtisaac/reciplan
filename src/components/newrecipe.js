import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import '../css/recipe.css';
import axios from 'axios';
import UserProfile, { SERVICE_URL } from '../utils.js';
import NotLoggedIn from './notloggedin.js';

/**
 * Create a new recipe
 * Contains a form to create a new recipe and POSTs it to our service.
 * @extends Component
 */
class NewRecipe extends Component {
  constructor(props) {
    super(props);
    let userObj = null;
    if (UserProfile.isLoggedIn()) {
      userObj = UserProfile.getUserObject();
    }
    this.state = {
      user: userObj,
      loggedIn: (userObj !== null),
      pictureURL: '',
      recipe: {},
      ingredientRows: [<Input name="ingredient-0" id="ingredient-one" placeholder="Quantity + ingredient" key="ingredient-one" required />],
      username: userObj.username
    }
    this.validateRecipe = this.validateRecipe.bind(this);
    this.postNewRecipe = this.postNewRecipe.bind(this);
    this.addIngredients = this.addIngredients.bind(this);
    this.addPicture = this.addPicture.bind(this);
  }

  async postNewRecipe(recipe) {
    try {
      const response = await axios.post(`${SERVICE_URL}/newRecipe/`, recipe);
      const data = await response;
      return data;
    } catch(e) {
      console.log('Encountered an error posting a new recipe.');
      return {};
    }
  }

  // build the json from the form values and validate them
  async validateRecipe(event) {
    event.preventDefault();
    let form = event.target;
    console.log(form['recipe-name'].value);
    // get the ingredients
    let ingredients = [];
    this.state.ingredientRows.map(child => {
      let ingredient = child.props.id;
      ingredient = document.getElementById(ingredient).value;
      ingredients.push(ingredient);
    })
    let recipeJson = {
      recipeOwner: this.state.username, /* to do: don't hardcode */
      recipeTitle: form['recipe-name'].value,
      recipeIngredients: ingredients,
      recipeInstructions: form['instructions'].value,
      recipePictureURL: this.state.pictureURL
    };
    let response = this.postNewRecipe(recipeJson);
    // this.props.history.push('/search')
  }

  addIngredients() {
    let t = this.state.ingredientRows;
    let id = `ingredient-${t.length}`;
    t.push(<Input name={id} id={id} placeholder="Quantity + ingredient" key={id} required />);
    this.setState({ ingredientRows: t });
  }

  addPicture() {
    // add code that opens a window, uploads a file?, and stores url here
  }

  render() {
    const {user, loggedIn} = this.state;
    console.log(user)
    let loginBtn = {};
    if (!loggedIn) {
      return(
        <Container>
          <NotLoggedIn message='In order to add recipes, please log in or sign up for our application.' children={[loginBtn]} />
        </Container>
      );
    } else {
      return(
        <Container>
          <Form onSubmit={this.validateRecipe}>
            <FormGroup>
              <Row>
                <Col sm="3">
                  <div className="insert-picture" onClick={this.addPicture}>
                    <a href="/"/>
                    Insert Picture
                  </div>
                </Col>
                <Col sm="9">
                  <Label for="recipe-name">Recipe Name</Label>
                  <Input name="recipe-name" id="recipe-name" placeholder="Enter the name of your recipe" style={{width: '98%'}} required />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Label for="ingredients">Ingredients</Label>
              <Row>
                <Col sm="11" style={{paddingRight: 0}}>
                  {this.state.ingredientRows.map(child => child)}
                </Col>
                <Col className="no-padding">
                  <Button onClick={this.addIngredients} color="success" style={{position:'absolute', bottom: 0}}>+</Button>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Label for="instructions">Instructions</Label>
              <Input type="textarea" name="instructions" id="instructions" placeholder="Type out the instructions for your recipe in paragraphs." style={{width: '98%'}} required />
            </FormGroup>
            <Row>
              <Col sm="12">
                <Button style={{width:'98%'}}>Submit</Button>
              </Col>
            </Row>
          </Form>
        </Container>
      )
    }
  }
}

export default NewRecipe;
