import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { createOauthFlow } from 'react-oauth-flow';
import logo from './logo.svg';
import './App.css';

const { Sender, Receiver } = createOauthFlow({
    authorizeUrl: 'https://data.world/oauth/authorize',
    tokenUrl: 'https://data.world/oauth/access_token',
    clientId: process.env.REACT_APP_DW_CLIENT_ID,
    clientSecret: process.env.REACT_APP_DW_CLIENT_SECRET,
    redirectUri: (process.env.REACT_APP_ROOT_URL || 'http://localhost:3000') + '/callback',
});

class HelloUser extends Component {
    constructor(props) {
        super(props)
        this.state = { user: {}}
    }

    componentDidMount() {
        console.log("componentDidMount")
        fetch('https://api.data.world/v0/user', {
            headers: {
                'Authorization': 'Bearer ' + this.props.accessToken
            }
        })
            .then(response => response.json())
            .then(data => this.setState({ user: data }))
    }

    render() {
        console.log("render")
        console.log(this.state)
        if (this.state.user['displayName']) {
            return <div>Hello, {this.state.user['displayName']}</div>
        }
        return <div>loading...</div>
    }
}

class App extends Component {

    handleSuccess = (accessToken, {response, state}) => {
        sessionStorage.setItem("accessToken", accessToken);
    }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">ddw-react-oauth-start</h1>
          </header>

          <Route exact path="/"
                 render={() => (
                     <div>
                       <Sender
                        state={{ to: "/auth/success" }}
                        render={({url}) => <a href={url}>Connect to data.world</a>}/>
                     </div>
                 )}/>

          <Route exact path="/callback"
                 render={({location}) => (
                   <Receiver
                       location={location}
                       onAuthSuccess={this.handleSuccess}
                       onAuthError={this.handleError}
                       render={({ processing, state, error }) => {
                           if (processing) {
                               return <p>processing...</p>
                           }
                           if (error) {
                               return <p style={{color: 'red'}}>{error.message}</p>
                           }
                           return <Redirect to={state.to}/>
                       }}
                   />
                 )}/>

          <Route exact path="/auth/success"
                 render={() =>
                     <div>
                         Successfully authorized data.world!
                         <HelloUser accessToken={sessionStorage.getItem("accessToken")}/>
                     </div>
                 }/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
