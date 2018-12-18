import React, {Component, Fragment} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {
	Box,
	Grommet,
} from 'grommet';
import {css} from 'styled-components';

import Main from './screens/Main';
import Landing from './screens/Landing';
import SignIn from './screens/SignIn';
import Register from './screens/Register';

const theme = {
	global: {
		colors: {
			main: '#ff3300',
			darker: '#d21e32'
		},
		font: {
			family: 'Karla',
			color: '#ffffff'
		},
		hover: {
			background: 'inherit'
		},
	},
	button: {
		color: 'dark-1',
		border: {
			color: 'main'
		}
	},
	anchor: {
		color: '#ff3300',
		hover: {
			textDecoration: 'none'
		}
	},
	tabs: {
		background: "light-2",
		header: {
		  background: "light-2",
		  extend: ({ theme }) => css`
			flex: 0 0;
			padding-top: ${theme.global.edgeSize.medium};
			padding-bottom: ${theme.global.edgeSize.medium};
			box-shadow: 0;
			flex-wrap: nowrap;
		  `
		},
        gap: "medium",
		extend: `
		div[role='tabpanel'] {
			overflow-y: auto;
			overflow-x: hidden;
			padding-bottom: 10%;
			font-family: 'Inconsolata';
			flex-wrap: nowrap;
		}
		div[role='tabpanel'] * {
			white-space: nowrap;
		}
        `
	},
	tab: {
		active: {
		  background: 'main',
		  color: 'white',
		},
		color: 'main',
		background: "white",
		hover: {
		  background: "pink",
		  border: {
			side: 'all',
			color: 'main',
			size: 'small'
		  },
		  color: 'white'
		},
		border: undefined,
		margin: undefined,
		pad: {
		  bottom: undefined,
		  horizontal: "xsmall"
		},
		extend: ({ theme }) => css`
			border-radius: ${theme.global.control.border.radius};
		`
	},
	textInput: {
		extend:`
			font-family: 'Inconsolata';
		`
	},
	select: {
		extend:`
			font-family: 'Inconsolata';
		`
	},
	radioButton: {
		size: "18px",
		border: {
			color: 'darker'
		},
		color: 'darker',
		hover: {
			border: {
			color: "main"
			}
		},
		check: {
			border: {
				color: "main"
			},
			color: {
			light: "main"
			}
		},
		icon: {
			size: "full"
		},
		extend:`
			font-family: 'Inconsolata';
			font-weight: normal;
		` 
	}
};

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			signedIn: false,
			userEmail: '',
        }
    }

	onSignIn = (email) => {
		setTimeout(() => {
			this.setState({
				signedIn: true,
				userEmail: email
			});
		}, 1000);
	}
	onSignOut = () => {
		this.setState({
			signedIn: false,
			userEmail: ''
		});
	}

	render() {	
		const Content = () => (
			<Box fill>
				<Route exact path='/' render={(props) => <Landing onSignOut={this.onSignOut} signedIn={this.state.signedIn} {...props}></Landing>} />
				<Route path='/Home' render={(props) => <Main signedIn={this.state.signedIn} email={this.state.userEmail} {...props}></Main>} />
				<Route path='/SignIn' render={(props) => (<SignIn onSignIn={this.onSignIn} {...props}></SignIn>)} />
				<Route path='/Register' component={Register} />
			</Box>
		);
		return (
			<Router basename="/SycamoreScheduler">
				<Grommet theme={theme} full>
					<Fragment>
					<Content />
					</Fragment>
				</Grommet>
			</Router>
		);
	}
}

export default App;