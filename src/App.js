import React, {Component} from 'react';
import {BrowserRouter, Redirect, Route} from 'react-router-dom';
import {createOauthFlow} from 'react-oauth-flow';
import {AuthConsumer, AuthProvider} from 'react-check-auth'
import logo from './logo.svg';
import './App.css';

const {Sender, Receiver} = createOauthFlow({
    authorizeUrl: 'https://data.world/oauth/authorize',
    tokenUrl: 'https://data.world/oauth/access_token',
    clientId: process.env.REACT_APP_DW_CLIENT_ID,
    clientSecret: process.env.REACT_APP_DW_CLIENT_SECRET,
    redirectUri: (process.env.REACT_APP_ROOT_URL || 'http://localhost:3000') + '/callback',
});

class App extends Component {

    state = {
        accessToken: sessionStorage.getItem("accessToken")
    }

    successHandler = (refreshAuth) =>
        (accessToken, {response, state}) => {
            sessionStorage.setItem("accessToken", accessToken);
            this.setState({...state, accessToken})
            refreshAuth()
        }

    logout = () => {
        return new Promise((resolve) => {
            sessionStorage.removeItem("accessToken");
            this.setState({...this.state, accessToken: null})
            resolve()
        })
    }

    render() {
        const authUrl = "https://api.data.world/v0/user"
        const reqOptions = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + this.state.accessToken
            }
        }

        return (
            <AuthProvider authUrl={authUrl} reqOptions={reqOptions}>

                <AuthConsumer>
                    {({userInfo, isLoading, error, refreshAuth}) => (
                        <BrowserRouter>
                            <div className="App">
                                <header className="App-header">
                                    <img src={logo} className="App-logo" alt="logo"/>
                                    <h1 className="App-title">ddw-react-oauth-start</h1>
                                    {
                                        isLoading ?
                                            (<span>loading...</span>) :
                                            userInfo ?
                                                (<span>Hi, {userInfo.displayName}
                                                    (<button
                                                        onClick={() => this.logout().then(refreshAuth)}>logout</button> )
                                                </span>) :
                                                <Sender
                                                    state={{to: "/"}}
                                                    render={({url}) => <a href={url}>login</a>}/>
                                    }
                                </header>

                                <Route exact path="/"
                                       render={() => (
                                           <div>
                                               {
                                                   userInfo ?
                                                       <p>You are logged in</p> :
                                                       <p>You are not logged in</p>
                                               }
                                           </div>
                                       )}/>

                                <Route exact path="/callback"
                                       render={({location}) => (
                                           <Receiver
                                               location={location}
                                               onAuthSuccess={this.successHandler(refreshAuth)}
                                               onAuthError={this.handleError}
                                               render={({processing, state, error}) => {
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

                            </div>
                        </BrowserRouter>)}
                </AuthConsumer>


            </AuthProvider>
        );
    }
}

export default App;
