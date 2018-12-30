import React, {Component} from 'react'
import Async from "react-async"
import LoadingPanel from "./LoadingPanel"
import {ListGroup, ListGroupItem, Pager} from 'react-bootstrap'


class MyDatasets extends Component {
    state = {
        q: {
            limit: 5,
            next: 0
        }
    }

    fetchUrl = () => {
        const url = new URL("https://api.data.world/v0/user/datasets/own"),
            {q} = this.state
        Object.keys(q).forEach(k => url.searchParams.append(k, q[k]))
        return url
    }

    loadDatasets = () => fetch(this.fetchUrl(), {
        method: "GET",
        headers: {
            Authorization: `Bearer ${this.props.accessToken}`
        }
    })
        .then(res => res.json())

    render() {

        return (
            <Async promiseFn={() => this.loadDatasets()}>
                {({data, error, isLoading}) => {
                    if (isLoading) return <LoadingPanel/>
                    if (error) return `Something went wrong: ${error.message}`
                    if (data && data.records)
                        return (
                            <div>
                                    <ListGroup>
                                        {
                                            data.records.map(
                                                record =>
                                                    <ListGroupItem key={record.id}
                                                                   href={`https://data.world/${record.owner}/${record.id}`}>
                                                        {record.title}
                                                    </ListGroupItem>)
                                        }
                                    </ListGroup>
                                    <Pager>
                                        <Pager.Item previous
                                                    disabled={this.state.q.next <= 0}
                                                    onClick={() => this.setState({
                                                        ...this.state,
                                                        q: {
                                                            ...this.state.q,
                                                            next: this.state.q.next - this.state.q.limit
                                                        }
                                                    })}>Previous</Pager.Item>
                                        <Pager.Item next
                                                    disabled={!(data.nextPageToken)}
                                                    onClick={() => this.setState({
                                                        ...this.state,
                                                        q: {...this.state.q, next: data.nextPageToken}
                                                    })}>Next</Pager.Item>
                                    </Pager>
                            </div>
                        )
                }}
            </Async>
        )
    }
}

export default MyDatasets
