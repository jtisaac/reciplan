import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import '../css/recipe.css';
import axios from 'axios';
import UserProfile, { SERVICE_URL } from '../utils.js';
import NotLoggedIn from './notloggedin.js';
import NewRecipe from './newrecipe.js';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

/**
 * Displays my recipes.
 * @extends Component
 */
class MyRecipes extends Component {
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
      ingredientRows: [<Input name="ingredient-0" id="ingredient-0" placeholder="Quantity + ingredient" key="ingredient-0" required />],
      username: userObj.username,
      my_recipes: [<h1>TEdsdsfadfsafds</h1>,<h1>vffv</h1>],
      current_recipe: null
    }
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.resetFields = this.resetFields.bind(this);

    this.validateRecipe = this.validateRecipe.bind(this);
    this.modifyRecipe = this.modifyRecipe.bind(this);
    this.addIngredients = this.addIngredients.bind(this);
    this.addPicture = this.addPicture.bind(this);

  }

  resetFields() {
    this.setState({ ingredientRows: [<Input name="ingredient-0" id="ingredient-0" placeholder="Quantity + ingredient" key="ingredient-0" required />] });
    document.getElementById('recipe-name').value = '';
    this.setState({ current_recipe: null});
    document.getElementById('instructions').value = '';
    document.getElementById('ingredient-0').value = '';
  }

  async modifyRecipe(recipe) {
    try {
      const response = await axios.put(`${SERVICE_URL}/myRecipes/`, recipe);
      const data = await response;
      this.getUserRecipes();
      this.resetFields();
      return data;
    } catch(e) {
      console.log('Encountered an error modifying recipe.');
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
      recipeId: this.state.current_recipe,
      recipeOwner: this.state.username,
      recipeTitle: form['recipe-name'].value,
      recipeIngredients: ingredients,
      recipeInstructions: form['instructions'].value,
      recipePictureURL: this.state.pictureURL
    };
    let response = this.modifyRecipe(recipeJson);
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

  async edit(e) {
    console.log(e.target.name);
    this.setState({ current_recipe: e.target.name });
    let params = {params: {recipeID: e.target.name}}
    try {
        const response = await axios.get(`${SERVICE_URL}/recipe/`, params);
        const data = await response;
        console.log(data);
        var dat = JSON.parse(data['data']);
        console.log(dat);
        document.getElementById('recipe-name').value = dat.recipeTitle;
        document.getElementById('instructions').value = dat.recipeInstructions;
        var ingredients = dat.recipeIngredients.split(',');
        for (var i = 0; i < ingredients.length; i++) {
          var ingredient = ingredients[i].replace('[','').replace(']','').replace('\'','').replace('\'','').trim(); // May need to pay attention to this
          if (i != 0) {
            this.addIngredients();
          }
          document.getElementById('ingredient-' + i.toString()).value = ingredient;
        }
        return data;
      } catch(e) {
        console.log('Encountered an error searching for recipes.');
        console.log(e.toString());
        return {};
      }
  }

  async delete(e) {
    console.log(e.target.name);
    axios.delete(`${SERVICE_URL}/myRecipes/`, { data: {recipe_id: e.target.name }})
    this.getUserRecipes();
  }

  async getUserRecipes() {
    if (this.state.loggedIn) {
      let jsonedUser = {params: {username: this.state.user.username}};
      try {
        const response = await axios.get(`${SERVICE_URL}/myRecipes/`, jsonedUser);
        const data = await response;
        var dat = JSON.parse(JSON.parse(data['data'])['recipe_list']);
        let t = [];
        for (var i = 0; i < dat.length; i++) {
          t.push(<div key={dat[i]['recipe_id']}><Button key={dat[i]['recipe_id'] + 'edit'} onClick={this.edit} name={dat[i]['recipe_id']} color="success" className="edit">Edit</Button> <Button key={dat[i]['recipe_id'] + 'delete'} onClick={this.delete} name={dat[i]['recipe_id']} color="danger" className="delete">Delete</Button> {dat[i]['name']}</div>);
        }
        console.log(t);
        this.setState({ my_recipes: t });
        return data;
      } catch(e) {
        console.log('Encountered an error searching for recipes.');
        console.log(e.toString());
        return {};
      }
    }
  }

  componentDidMount() {
    this.getUserRecipes();
  }

  render() {
    return(
      <Container>
        <h1> Edit Recipe </h1>
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
        <Row>
          <Col md="12">
            <h1> My Recipes </h1>
            {this.state.my_recipes.map(child => child)}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default MyRecipes;
