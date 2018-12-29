import React, {Component} from "react"
import Async from "react-async"

class HelloUser extends Component {

    loadUser = ({accessToken}) =>
        fetch('https://api.data.world/v0/user', {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        })
            .then(response => response.json())

    render() {
        return (
            <Async promiseFn={this.loadUser} accessToken={this.props.accessToken}>
                <Async.Loading>
                    <div>Loading...</div>
                </Async.Loading>
                <Async.Resolved>
                    {data => <div>Hi, {data.displayName}</div>}
                </Async.Resolved>
            </Async>
        )
    }
}

export {HelloUser}