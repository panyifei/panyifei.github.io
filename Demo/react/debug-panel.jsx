'use strict';
import React from 'react';
var Perf =require('react/lib/ReactPerf');
import {render, unmountComponentAtNode} from 'react-dom';

window.Perf = Perf;

const panelStyle = {
    position: 'fixed',
    right: 0,
    top: 0,
    width: '150px',
    height: '30px',
    backgroundColor: 'rgba(0,0,0,.5)'
};

const buttonStyle = {
    width: '50px',
    height: '30px',
    lineHeight: '30px',
    color: 'white',
    float: 'left',
    textAlign: 'center'
};

const toastStyle = {
    position: 'fixed',
    left: '50%',
    top: '50%',
    width: '95%',
    boxSizing: 'border-box',
    padding: '10px',
    borderRadius: '5px',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'black',
    color: 'white',
    zIndex: 1000
};

const cellStyle = {
    border: '1px solid grey',
    wordBreak: 'break-all'
};

const Toast = ({head, rows}) => {
    return (
        <div style={toastStyle} onClick={hideToast}>
            <table style={{borderCollapse: 'collapse'}}>
                <thead>
                <tr>{head.map(h => <th style={cellStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                {rows.map(row => (
                    <tr>{row.map(col => <td style={cellStyle}>{col}</td>)}</tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const toastDiv = document.createElement('div');
document.body.appendChild(toastDiv);

function showToast(head, rows) {
    unmountComponentAtNode(toastDiv);
    render(<Toast head={head} rows={rows}/>, toastDiv);
}

function hideToast() {
    setTimeout(() => unmountComponentAtNode(toastDiv), 0);
}

let recording = false;

class DebugPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            show: true,
            lastMeasurement: null
        };
        this.expand = this.expand.bind(this);
        this.hide = this.hide.bind(this);
        this.stop = this.stop.bind(this);
        this.showData = this.showData.bind(this);
    }

    getContent() {
        if (!this.state.expanded) {
            return (<div>
                <div style={buttonStyle} onClick={this.expand}>调试</div>
                <div style={buttonStyle}></div>
                <div style={buttonStyle} onClick={this.hide}>关闭</div>
            </div>);
        } else {
            return (<div>
                <div style={buttonStyle} onClick={this.start}>start</div>
                <div style={buttonStyle} onClick={this.stop}>stop</div>
                <div style={buttonStyle} onClick={this.showData}>show</div>
            </div>);
        }
    }

    expand() {
        this.setState(Object.assign({}, this.state, { expanded: true }));
    }

    hide() {
        this.setState(Object.assign({}, this.state, { show: false }));
    }

    start() {
        if (recording) return;
        recording = true;
        setTimeout(()=> {
            Perf.start();
        }, 0);
    }

    stop() {
        if (!recording) return;
        recording = false;
        Perf.stop();
        Perf.printWasted();
        let m = Perf.getLastMeasurements();
        this.setState(Object.assign({}, this.state, {lastMeasurement: m}));
    }

    showData() {
        let m = Perf.getWasted(this.state.lastMeasurement);
        if (!m || !m.length) return;
        let head = Object.keys(m[0]);
        let rows = m.map(row => head.map(key => {
            let item = row[key];
            if (typeof item === 'number' && item % 1 != 0) {
                item = item.toFixed(1);
            }
            return item;
        }));
        showToast(head, rows);
    }

    render() {
        if (!this.state.show) return null;
        return (
            <div style={panelStyle}>
                {this.getContent()}
            </div>
        )
    }
}

export function display() {
    const d = document.createElement('div');
    document.body.appendChild(d);
    render(<DebugPanel/>, d);
}
