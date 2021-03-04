import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
// import '../css/profile.css';
import axios from 'axios';
import UserProfile, { SERVICE_URL } from '../utils.js';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

/**
 *
 * @extends Component
 */
class NewUser extends Component {
  constructor(props) {
    super(props);
    this.validateNewUser = this.validateNewUser.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  async signUp(user) {
    try {
      const response = await axios.post(`${SERVICE_URL}/newUserRegistration/`, user);
      UserProfile.setUserObject(user);
      return "ok";
    } catch(e) {
      console.log('Encountered an error registering new user.');
      return {};
    }
  }

  // build the json from the form values and validate them
  async validateNewUser(event) {
    event.preventDefault();
    let form = event.target;
    console.log(form['userid'].value);
    // get the password
    let userJson = {
      creatorId: 'makingNewLogin',
      username: form['userid'].value,
      password: form['password'].value,
      name: form['name'].value,
      location: form['location'].value,
      bio: form['bio'].value,
      pictureURL: form['pictureURL'].value
    };
    let response = this.signUp(userJson);
    // this.props.history.push('/search')
  }

  render() {
    return(
      <Container>
        <Form onSubmit={this.validateNewUser}>
          <h1>Create a new profile</h1>
          <FormGroup>
            <Row>
              <Col sm="9">
                <Label for="userid">Username</Label>
                <Input name="userid" id="userid" placeholder="Enter new Username" style={{width: '98%'}} required />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input name="password" id="password" placeholder="Enter Password" style={{width: '98%'}} required />
          </FormGroup>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input name="name" id="name" placeholder="Enter Name" style={{width: '98%'}} required/>
          </FormGroup>
          <FormGroup>
            <Label for="bio">Bio</Label>
            <Input name="bio" id="bio" placeholder="Enter Bio" style={{width: '98%'}} required/>
          </FormGroup>
          <FormGroup>
            <Label for="location">Location</Label>
            <Input name="location" id="location" placeholder="Enter Location" style={{width: '98%'}} required/>
          </FormGroup>
          <FormGroup>
            <Label for="pictureURL">Picture URL</Label>
            <Input name="pictureURL" id="pictureURL" placeholder="Enter Picture URL" style={{width: '98%'}} required/>
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

export default NewUser;
