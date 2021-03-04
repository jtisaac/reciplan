import React, { Component } from 'react';
import { NavLink as Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
// import '../css/profile.css';
import axios from 'axios';
import UserProfile, { SERVICE_URL } from '../utils.js';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

/**
 * This is the page that pops up when a user needs to log in.
 * It calls the 'redirect' prop to return the user to the application.
 *
 * This component makes a POST call to the API to log a user in,
 * and a POST call to create a new user.
 * @extends Component
 */
class Login extends Component {
  constructor(props) {
    super(props);
    this.validateUser = this.validateUser.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  async signIn(user) {
    try {
      const response = await axios.post(`${SERVICE_URL}/login/`, user);
      const data = response.data;
      UserProfile.setUserObject(data);
      return data;
    } catch(e) {
      console.log('Encountered an error logging in.');
      // trigger either your password is wrong OR signup!
      return {};
    }
  }

  // build the json from the form values and validate them
  async validateUser(event) {
    event.preventDefault();
    let form = event.target;
    // console.log(form['userid'].value);
    // get the password
    let userJson = {
      creatorId: 'makingNewLogin',
      username: form['userid'].value,
      password: form['password'].value,
    };
    let response = this.signIn(userJson);
    // this.props.history.push('/search')
  }

  render() {
    return(
      <Container>
        <Form onSubmit={this.validateUser}>
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
            <Link to='/signup'>New user? Sign up!</Link>
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

export default Login;
