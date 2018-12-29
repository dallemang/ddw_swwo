import React, {Component} from "react";

class HelloUser extends Component {
    constructor(props) {
        super(props)
        this.state = {user: {}}
    }

    componentDidMount() {
        fetch('https://api.data.world/v0/user', {
            headers: {
                'Authorization': 'Bearer ' + this.props.accessToken
            }
        })
            .then(response => response.json())
            .then(data => this.setState({user: data}))
    }

    render() {
        if (this.state.user['displayName']) {
            return <div>Hello, {this.state.user['displayName']}</div>
        }
        return <div>loading...</div>
    }
}

export {HelloUser}