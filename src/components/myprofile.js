import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
// import '../css/profile.css';
import axios from 'axios';
import UserProfile, { SERVICE_URL } from '../utils.js';
import NotLoggedIn from './notloggedin.js';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

/**
 * Displays user's profile and favorites, and allows them to update their info.
 *
 * This component makes a GET call to the API to retrieve the user & favorites information,
 * a PUT call when the user updates their info or favorites,
 * a DELETE call if the user chooses to deactivate.
 * @extends Component
 */
class MyProfile extends Component {
  constructor(props) {
    super(props);
    let userObj = null;
    if (UserProfile.isLoggedIn()) {
      userObj = UserProfile.getUserObject();
    }
    this.state = {
      user: userObj,
      loggedIn: (userObj !== null)
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
          <Row>
            <img src={user.pictureURL} alt="Smiley face" height="42" width="42" class="insert-picture"/>
          </Row>
          <Row>
            <Col class="col-3">
              Username
            </Col>
            <Col class="col-3">
              <span>{user.username}</span>
            </Col>
          </Row>
          <Row>
            <Col class="col-3">
              Name
            </Col>
            <Col>
              <span>{user.name}</span>
            </Col>
          </Row>
          <Row>
            <Col class="col-3">
              Bio
            </Col>
            <Col>
              <span>{user.bio}</span>
            </Col>
          </Row>
          <Row>
            <Col class="col-3">
              Location
            </Col>
            <Col>
              <span>{user.location}</span>
            </Col>
          </Row>
          <Row>
            <Col class="col-3">
              Picture
            </Col>
            <Col>
              <span>{user.pictureURL}</span>
            </Col>
          </Row>
        </Container>
      )
    }
  }
}

export default MyProfile;
