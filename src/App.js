import React, {Component} from 'react'
import {Col, Grid, ListGroup, ListGroupItem, MenuItem, Nav, Navbar, NavDropdown, Row} from 'react-bootstrap'
import {HashRouter, Link, Redirect, Route} from 'react-router-dom'
import {createOauthFlow} from 'react-oauth-flow'
import {AuthConsumer, AuthProvider} from 'react-check-auth'
import './App.css'
import SVGIcon from './components/SVGIcon'
import MyDatasets from './components/MyDatasets'


const {Sender, Receiver} = createOauthFlow({
    authorizeUrl: 'https://data.world/oauth/authorize',
    tokenUrl: 'https://data.world/oauth/access_token',
    clientId: process.env.REACT_APP_DW_CLIENT_ID,
    clientSecret: process.env.REACT_APP_DW_CLIENT_SECRET,
    redirectUri: `${process.env.REACT_APP_ROOT_URL}/#/callback`,
})

class App extends Component {

    state = {
        accessToken: localStorage.getItem("accessToken")
    }

    successHandler = (refreshAuth) =>
        (accessToken, {response, state}) => {
            localStorage.setItem("accessToken", accessToken)
            this.setState({...state, accessToken})
            refreshAuth()
        }

    logout = () => {
        return new Promise((resolve) => {
            localStorage.removeItem("accessToken")
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
                        <div className="App">
                            <HashRouter basename={process.env.PUBLIC_URL}>
                                <div>
                                    <Navbar className='App-nav'>
                                        <Navbar.Header>
                                            <Link to={"/"}>
                                                <Navbar.Brand>
                                                    <div className='landing-logos nav-logos'>
                                                        <span className='int-logo'><SVGIcon glyph='sparkle'/></span>
                                                    </div>
                                                </Navbar.Brand>
                                            </Link>
                                        </Navbar.Header>
                                        <Nav pullRight onSelect={this.props.onLogout}>
                                            <NavDropdown eventKey={1}
                                                         title={(userInfo && userInfo.id) ? `@${userInfo.id}` : 'Options'}
                                                         id="profile-options">
                                                {userInfo && <MenuItem onClick={() => this.logout().then(refreshAuth)}>Log
                                                    out</MenuItem>}
                                                {!userInfo && <Sender
                                                    state={{to: "/"}}
                                                    render={({url}) => <MenuItem href={url}>Log in</MenuItem>}/>
                                                }
                                            </NavDropdown>
                                        </Nav>
                                    </Navbar>

                                    <Grid className='App-container'>
                                        <Row>
                                            <Col xs={12} sm={8} md={6} smOffset={2} mdOffset={3}>

                                                <Route exact path="/"
                                                       render={() => (
                                                           <div>
                                                               {userInfo &&<p>Welcome, {userInfo.displayName}.</p>}
                                                               {!userInfo && <p>ddw-react-oauth-start</p>}

                                                               {userInfo &&
                                                                   <ListGroup>
                                                                       <ListGroupItem href={`${process.env.PUBLIC_URL}/#/MyDatasets`}>My Datasets</ListGroupItem>
                                                                   </ListGroup>
                                                               }
                                                           </div>
                                                       )}/>

                                                <Route exact path="/MyDatasets"
                                                       render={(props) => <MyDatasets {...props} accessToken={this.state.accessToken}/>}/>

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
                                                                       return <p
                                                                           style={{color: 'red'}}>{error.message}</p>
                                                                   }
                                                                   return <Redirect to={state.to}/>
                                                               }}
                                                           />
                                                       )}/>
                                            </Col>
                                        </Row>
                                    </Grid>

                                </div>
                            </HashRouter>
                        </div>
                    )}
                </AuthConsumer>


            </AuthProvider>
        )
    }
}

export default App
