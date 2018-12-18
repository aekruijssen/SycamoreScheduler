import React, {Component} from 'react';
import {
	Box, 
	Button,
	FormField,
	Heading,
	RoutedButton,
	Select,
	Text,
	TextInput,
	RadioButton,

} from 'grommet';

import {
	Checkmark,
	LinkPrevious
} from 'grommet-icons';

const default_programs = require('./programs.json');

class Register extends Component {

	constructor(props) {
		super(props);
		this.fNameRef = React.createRef();
		this.lNameRef = React.createRef();
		this.emailRef = React.createRef();
		this.passwordRef = React.createRef();
		this.startyearref = React.createRef();
		this.endyearref = React.createRef();
		this.focusSomething = function (obj) {
			obj.current.focus();
		}
		this.focusSomething.bind(this);
	}

	state = {
		fName: '',
		lName: '',
		email: '',
		password: '',
		major1: '',
		major2: '',
		minor1: '',
		minor2: '',
		error: false,
		errormsg: '',
		success: false,
		startRadio: 'fall',
		endRadio: 'spring',
		startYear: 2017,
		endYear: 2021,
		programs: default_programs
	}
	
	handleChange = (element, value) => {
		this.setState({form_elements: {[element]: value}});
	}

	doRegister = (event) => {
		var required = ['fName', 'lName', 'email', 'password', 'major1'];
		var error = false;
		var message = 'Please enter your ';
		var errorkeys = [];
		if (this.state.email.indexOf('@') === -1 || this.state.email.indexOf('.') === -1 || (this.state.email.indexOf('.')-this.state.email.indexOf('@')) < 2) {
			this.setState({
				success: false,
				error: true,
				errormsg: 'Email is not formatted correctly.'
			});
			return;
		}
		required.map(key => {
			if (this.state[key] === '') {
				error = true;
				if (key === 'fName') errorkeys.push('first name');
				else if (key === 'lName') errorkeys.push('last name');
				else if (key === 'email') errorkeys.push('email');
				else if (key === 'password') errorkeys.push('password');
				else if (key === 'major1') errorkeys.push('major')
			}
			return 0;
		});
		
		if (error) {
			for (let i = 0; i < errorkeys.length; i++) {
				message += errorkeys[i];
				if (i === errorkeys.length-1) message += '.';
				else message += ', ';
				if (i === errorkeys.length-2) message += 'and ';
			}
			this.setState({
				error: true,
				errormsg: message
			})
		} else {
			var keys = ['fName', 'lName', 'email', 'password', 'major1', 'major2', 'minor1', 'minor2'];
			var bodystr = '';
			for (let i = 0; i < keys.length; i++) {
				var key = keys[i];
				if (this.state[key] === '') {
					continue;
				} else {
					if (i !== 0) {
						bodystr += '&';
					}
					bodystr += key + '=' + this.state[key];
				}
			}
			bodystr += "&startTerm="+this.state.startYear.toString()+(this.state.startRadio === 'fall'? '3': '1');
			bodystr += "&endTerm="+this.state.endYear.toString()+(this.state.endRadio === 'fall'? '3': '1');
            var ok = false;
			fetch('/SycamoreScheduler/RegisterServlet', {
				method: 'POST',
				headers: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				body: bodystr
			})
			.then((response) => {
                ok = response.ok;
				return response.json();
			})
			.then(json => {
				if (ok) {
					this.setState({
						error: false,
						errormsg: '',
						success: true
					}, () => {
						setTimeout(() => {this.props.history.push('/SignIn');}, 1000);
					})
				} else {
					this.setState({
						error: true,
						errormsg: json.error,
						success: false
					});
				}
			});
		}
	};

	render ( ) {
		return (
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
					gap='large'
					pad={{
						vertical: 'large',
						horizontal: 'xlarge'

					}}
					border={{
						side: 'all',
						color: 'main',
						size: 'medium'
					}}
					animation={{
						type: 'fadeIn',
						delay: 0,
						duration: 500,
						size: 'large'
					}}
					style={{
						borderRadius: '20px'
					}}
				>	

					<Box
						flex
						width='100%'
						align='center'
						justify='center'
					>
						<Heading 
							level='1'
							margin='0'
						>
							Register
						</Heading>
					</Box>
					<Box
						flex
						width='100%'
						direction='row'
						align='center'
						justify='between'
						gap='large'
					>
						<FormField
						>
							<TextInput
								ref={this.fNameRef}
								id='fName'
								size='medium'
								focusIndicator
								placeholder={<Box onClick={() => {this.focusSomething(this.fNameRef)}} direction='row' align='center' justify='between' gap='small' ><Text style={{fontFamily: 'Inconsolata'}} size='large'>first name</Text><Text style={{fontFamily: 'Inconsolata'}} size='large' color='main'>*</Text></Box>}
								value={this.state.fName}
								onChange={(event) => this.setState({fName: event.target.value})}
							>
							</TextInput>
						</FormField>
						<FormField
						>
							<TextInput
								ref={this.lNameRef}
								id='lName'
								size='medium'
								focusIndicator
								placeholder={<Box onClick={() => {this.focusSomething(this.lNameRef)}} direction='row' align='center' justify='between' gap='small' ><Text style={{fontFamily: 'Inconsolata'}} size='large'>last name</Text><Text style={{fontFamily: 'Inconsolata'}} size='large' color='main'>*</Text></Box>}
								value={this.state.lName}
								onChange={(event) => this.setState({lName: event.target.value})}
							>
							</TextInput>
						</FormField>
					</Box>
					<Box
						flex
						width='100%'
						direction='row'
						align='center'
						justify='between'
						gap='large'
					>
						<FormField
						>
							<TextInput
								ref={this.emailRef}
								id='email'
								size='medium'
								focusIndicator
								placeholder={<Box onClick={() => {this.focusSomething(this.emailRef)}} direction='row' align='center' justify='between' gap='small'><Text style={{fontFamily: 'Inconsolata'}} size='large'>email</Text><Text style={{fontFamily: 'Inconsolata'}} size='large' color='main'>*</Text></Box>}
								value={this.state.email}
								onChange={(event) => this.setState({email: event.target.value})}
							>
							</TextInput>
						</FormField>
						<FormField
						>
							<TextInput
								ref={this.passwordRef}
								id='password'
								size='medium'
								type='password'
								focusIndicator
								placeholder={<Box onClick={() => {this.focusSomething(this.passwordRef)}} direction='row' align='center' justify='between' gap='small' ><Text style={{fontFamily: 'Inconsolata'}} size='large'>password</Text><Text style={{fontFamily: 'Inconsolata'}} size='large' color='main'>*</Text></Box>}
								value={this.state.password}
								onChange={(event) => this.setState({password: event.target.value})}
							>
							</TextInput>
						</FormField>
					</Box>
					<Box
						flex
						width='100%'
						direction='row'
						align='center'
						justify='between'
						gap='large'
					>
						<Box
							flex
							width='100%'
							direction='column'
							align='start'
							justify='center'
							gap='small'
						>
							<Text fontFamily='Inconsolata' size='large'>start term</Text>
							<Box
								flex
								width='100%'
								direction='row'
								align='center'
								justify='between'
							>
								<RadioButton
									label="fall"
									name="fa_start"
									value="fall"
									checked={this.state.startRadio === 'fall'}
									onChange={e => {
										console.log("Start Term: " + e.target.value)
										this.setState({
											startRadio: e.target.value
										});
									}}
								/>
								<RadioButton
									label="spring"
									name="sp_start"
									value="spring"
									checked={this.state.startRadio === 'spring'}
									onChange={e => {
										console.log("Start Term: " + e.target.value)
										this.setState({
											startRadio: e.target.value
										});
									}}
								/>
							</Box>
							<Box
								flex
							>
								<TextInput
									ref={this.startyearref}
									id='startyear'
									type='number'
									focusIndicator
									value={this.state.startYear}
									onChange={(event) => this.setState({startYear: event.target.value})}
								/>
							</Box>
						</Box>
						<Box
							flex
							direction='column'
							align='start'
							justify='center'
							gap='small'
						>
							<Text fontFamily='Inconsolata' size='large'>end term</Text>
							<Box
								flex
								width='100%'
								direction='row'
								align='center'
								justify='between'
							>
								<RadioButton
									label="fall"
									name="fa_end"
									value="fall"
									checked={this.state.endRadio === 'fall'}
									onChange={e => {
										console.log("End Term: " + e.target.value)
										this.setState({
											endRadio: e.target.value
										});
									}}
								/>
								<RadioButton
									label="spring"
									name="sp_end"
									value="spring"
									checked={this.state.endRadio === 'spring'}
									onChange={e => {
										console.log("End Term: " + e.target.value)
										this.setState({
											endRadio: e.target.value
										});
									}}
								/>
							</Box>
							<Box
								flex
							>
									<TextInput
										ref={this.endyearref}
										id='endyear'
										type='number'
										focusIndicator
										value={this.state.endYear}
										onChange={(event) => this.setState({endYear: event.target.value})}
									/>
							</Box>
						</Box>
					</Box>
					<Box
						flex
						width='100%'
						direction='row'
						align='center'
						justify='between'
						gap='large'
					>
						<Select
							size='small'
							placeholder={<Text size='large'>major</Text>}
							value={this.state.major1}
							options={this.state.programs}
							onChange={(option) => {this.setState({major1: option.value});}}
							onClose={() => this.setState({programs: default_programs})}
							onSearch={text => {
								const exp = new RegExp(text, "i");
								this.setState({programs: default_programs.filter(o => exp.test(o))});
							}}
						>

						</Select>
						<Select
							size='small'
							placeholder={<Text size='large'>minor</Text>}
							value={this.state.minor1}
							options={this.state.programs}
							onChange={(option) => {this.setState({minor1: option.value});}}
							onClose={() => this.setState({programs: default_programs})}
							onSearch={text => {
								const exp = new RegExp(text, "i");
								this.setState({programs: default_programs.filter(o => exp.test(o))});
							}}
						>

						</Select>
					</Box>
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
						flex
						width='100%'
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
							onClick={(event) => {this.doRegister(event);}}
						>
						</Button>
					</Box>
				</Box>
			</Box>
		);
	}
}

export default Register;