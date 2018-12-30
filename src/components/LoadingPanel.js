import React from 'react'
import {Panel} from 'react-bootstrap'

const LoadingPanel = (props) => {
    return <Panel>
        <Panel.Body className='loading-panel'>
            <div className='loader' />
            <h1 className='panel-banner-text'>
                Loading...
            </h1>
        </Panel.Body>
    </Panel>
}

export default LoadingPanel