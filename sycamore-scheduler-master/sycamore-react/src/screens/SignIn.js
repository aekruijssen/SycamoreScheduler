import React, {Component} from 'react';
import {
	Box, 
	Button,
	FormField,
	Heading,
	Keyboard,
	Text,
	TextInput,
	RoutedButton
} from 'grommet';

import {
	Checkmark,
	LinkPrevious
} from 'grommet-icons';

class SignIn extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			error: false,
			errormsg: '',
			success: false,
		}
		this.emailRef = React.createRef();
		this.passwordRef = React.createRef();
		this.focusSomething = function (obj) {
			obj.current.focus();
		}
		this.focusSomething.bind(this);
	}
	
	doLogin = (event) => {
		if (this.state.email === '' || this.state.password === '') {
			let msg = 'Please enter your ';
			if (this.state.email === '') {
				msg += 'email';
			}
			if (this.state.password === '') {
				if (this.state.email === '') msg += ' and ';
				msg += 'password.';
			} else {
				msg += '.';
			}
			this.setState({
				error: true,
				errormsg: msg
			});
			return;
		}
		if (this.state.email.indexOf('@') === -1 || this.state.email.indexOf('.') === -1 || (this.state.email.indexOf('.')-this.state.email.indexOf('@')) < 2) {
			this.setState({
				success: false,
				error: true,
				errormsg: 'Email is not formatted correctly.'
			});
			return;
		}
		let bodystr = 'email='+this.state.email+'&password='+this.state.password;
		let ok = false;
		fetch('/SycamoreScheduler/LoginServlet', {
			method: 'POST',
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			body: bodystr
		})
		.then((response) => {
			ok = response.ok
			return response.json();
		})
		.then((json) => {
			if (ok) {
				this.setState({
					success: true,
					error: false,
					errormsg: ''
				}, () => {
					this.props.onSignIn(this.state.email);
					setTimeout(() => {
						this.props.history.push('/Home');
					}, 1000);
				});
			} else {
				this.setState({
					success: false,
					error: true,
					errormsg: json.error
				})
			}
		});
	};

	handleChange = (element, event) => {
		if (element === 'email') {
			this.setState({email: event.target.value});
		} else if (element === 'password') {
			this.setState({password: event.target.value});
		}
	}
	
	render ( ) {
		return (
			<Keyboard
				onEnter={() => {
					this.doLogin(null); // doesn't matter what event we pass into the function
				}}
				onEsc={() => {
					this.props.history.push('/');
				}}
			>
			<Box
				flex
				direction='column'
				justify='center'
				align='center'
			>
				<Box
					direction='column'
					align='center'
					justify='start'
					pad='xlarge'
					gap='large'
					border={{
						side: 'all',
						color: 'main',
						size: 'medium'
					}}
					style={{
						borderRadius: '20px'
					}}
					animation={{
						type: 'fadeIn',
						delay: 0,
						duration: 500,
						size: 'large'
					}}
				>	
					<Heading 
						level='1'
						margin='0'
					>
						Sign In
					</Heading>
					<FormField
					>
						<TextInput
							id='email'
							ref={this.emailRef}
							size='medium'
							focusIndicator
							placeholder={<Box onClick={() => {this.focusSomething(this.emailRef)}} direction='row' align='center' justify='between' gap='small'><Text style={{fontFamily: 'Inconsolata'}} size='large'>email</Text><Text style={{fontFamily: 'Inconsolata'}} size='large' color='main'>*</Text></Box>}
							value={this.state.email}
							onChange={(event) => {this.handleChange('email', event);}}
						>
						</TextInput>
					</FormField>
					<FormField
					>
						<TextInput
							id='password'
							ref={this.passwordRef}
							size='medium'
							type='password'
							focusIndicator
							placeholder={<Box onClick={() => {this.focusSomething(this.passwordRef)}} direction='row' align='center' justify='between' gap='small'><Text style={{fontFamily: 'Inconsolata'}} size='large'>password</Text><Text style={{fontFamily: 'Inconsolata'}} size='large' color='main'>*</Text></Box>}
							value={this.state.password}
							onChange={(event) => {this.handleChange('password', event)}}
						>
						</TextInput>
					</FormField>
					{this.state.error && 
						<Box
							flex
							background='main'
							direction='column'
							align='center'
							justify='center'
							pad='medium'
							style={{
								borderRadius: '10px'
							}}
						>
							<Text color='white'>{this.state.errormsg}</Text>
						</Box>
					}
					{this.state.success &&
						<Box
							flex
							background='neutral-3'
							animation={{
								type: 'fadeIn',
								delay: 0,
								duration: 700,
								size: 'large'
							}}
							direction='column'
							align='center'
							justify='center'
							pad='small'
							style={{
								borderRadius: '10px'
							}}
						>
							<Text color='white'>Success!</Text>
						</Box>
					}
					<Box
						direction='row'
						align='center'
						justify='center'
						gap='medium'
					>
						<RoutedButton
							path='/'
							hoverIndicator
							color='dark-2'
							label={<LinkPrevious color='main' size='large'></LinkPrevious>}
						>
						</RoutedButton>
						<Button
							hoverIndicator
							label={<Checkmark size='large' color='green'></Checkmark>}
							color='dark-2'
							onClick={(event) => {this.doLogin(event);}}
						>
						</Button>
					</Box>
				</Box>
			</Box>
			</Keyboard>
		);
	}
}

export default SignIn;