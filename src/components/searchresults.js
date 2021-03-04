import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import '../css/recipe.css';
import axios from 'axios';
import { SERVICE_URL } from '../utils.js';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

/**
 * Displays the search results for recipe search.
 * @extends Component
 */
class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return(
      <Container>

      </Container>
    )
  }
}

export default SearchResults;
