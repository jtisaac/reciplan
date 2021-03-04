import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import '../css/home.css';
import axios from 'axios';
import { SERVICE_URL } from '../utils.js';

/**
 * Home page - preview a recipe or something
 * @extends Component
 */
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ret: {}
    }
  }

  componentDidMount() {
    axios.get(`${SERVICE_URL}`)
    .then(res => {
      console.log(res)
      this.setState({ ret: res.data });
    })
    .catch(err => console.log(err));
  }

  render() {
    return(
      <Container>
        {JSON.stringify(this.state.ret)}
      </Container>
    )
  }
}

export default Home;
