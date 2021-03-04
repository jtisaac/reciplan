import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
// import '../css/profile.css';
import axios from 'axios';
import UserProfile, { SERVICE_URL } from '../utils.js';
import NotLoggedIn from './notloggedin.js';

/**
 * Edit user profile
 * @extends Component
 */
class EditProfile extends Component {
  constructor(props) {
    super(props);
    let userObj = null;
    if (UserProfile.isLoggedIn()) {
      userObj = UserProfile.getUserObject();
    }
    this.state = {
      user: userObj,
      loggedIn: (userObj !== null),
      username: userObj ? userObj.username : '',
      name: userObj ? userObj.name : '',
      password: userObj ? userObj.password : '',
      location: userObj ? userObj.location : '',
      bio: userObj ? userObj.bio : '',
      pictureURL: userObj ? userObj.pictureURL : '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.updateAccount = this.updateAccount.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const attr = target.name;
    const value = target.value;
    this.setState({
      [attr]: value
    });
  }

  // validation should happen here as well
  async updateAccount(event) {
    event.preventDefault();
    let updatedUser = {
      creatorId: 'test',
      username: this.state.username,
      name: this.state.name,
      password: this.state.password,
      location: this.state.location,
      bio: this.state.bio,
      pictureURL: this.state.pictureURL
    };
    try {
      const response = await axios.put(`${SERVICE_URL}/newUserRegistration/`, updatedUser);
      UserProfile.setUserObject(updatedUser);
      return "updated!";
    } catch(e) {
      alert('Encountered an error editing your profile.');
      return {};
    }
  }

  async deleteAccount() {
    try {
      const response = await axios.delete(`${SERVICE_URL}/newUserRegistration/`, this.state.username);
      UserProfile.setUserObject(null);
      this.props.history.push('/signup')
      return "deleted";
    } catch(e) {
      alert('Encountered an error editing your profile.');
      return {};
    }
  }

  render() {
    const {user, loggedIn} = this.state;
    console.log(user)
    let loginBtn = {};
    if (!loggedIn) {
      return(
        <Container>
          <NotLoggedIn message='In order to view your profile, please log in or sign up for our application.' children={[loginBtn]} />
        </Container>
      );
    } else {
      return(
        <Container>
          <Form onSubmit={this.updateAccount}>
            <FormGroup>
              <Row>
                <Col sm="3">
                  <div className="insert-picture" onClick={this.addPicture}>
                    <a href="/"/>
                    Edit Picture
                  </div>
                </Col>
                <Col sm="9">
                  <FormGroup>
                    <Label for="username">Userame</Label>
                    <Input name="username" id="username" placeholder={user.username} style={{width: '98%'}} disabled />
                  </FormGroup>
                  <FormGroup>
                    <Label for="full-name">Name</Label>
                    <Input name="name" id="full-name" placeholder='Your Name' value={this.state.name} onChange={this.handleChange} style={{width: '98%'}} required />
                  </FormGroup>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input name="password" id="password" placeholder='Enter a new password' value={this.state.password} onChange={this.handleChange} style={{width: '98%'}} required />
            </FormGroup>
            <FormGroup>
              <Label for="location">Location</Label>
              <Input name="location" id="location" placeholder='Location' value={this.state.location} onChange={this.handleChange} style={{width: '98%'}} required />
            </FormGroup>
            <FormGroup>
              <Label for="bio">Bio</Label>
              <Input type="textarea" name="bio" id="instructions" placeholder="Create a bio to tell the world about yourself!" value={this.state.bio} onChange={this.handleChange} style={{width: '98%'}} required />
            </FormGroup>
            <Row>
              <Col sm="12">
                <Button style={{width:'98%'}}>Submit</Button>
              </Col>
            </Row>
            <br />
            <Button onClick={this.deleteAccount} style={{width:'98%'}}>Delete My Account</Button>
          </Form>
        </Container>
      )
    }
  }
}

export default EditProfile;
