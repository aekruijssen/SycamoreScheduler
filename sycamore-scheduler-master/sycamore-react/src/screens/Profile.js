import React, {Component} from 'react';
import {
    Box, 
    Button,
	Heading,
    FormField,
    TextInput,
    Text,
    Select
} from 'grommet';

const default_programs = require('./programs.json');

class ProfileField extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			errormsg: '',
			success: false
        }
	}

	doUpdate = () => {
        this.props.updateFunc().then(({error, msg}) => {
            if (error) {
                this.setState({
                    error: true,
                    errormsg: msg,
                    success: false
                })
            } else {
                this.setState({
                    error: false,
                    errormsg: '',
                    success: true
                })
            }
        })
	}

	render() {
		return (
			<Box
                flex
				direction='column'
				align='start'
                justify='start'
                margin='large'
			>
				<Heading level='3'>
					{this.props.name}
				</Heading>
				<Box
					direction='row'
					align='center'
					justify='between'
					gap='medium'
				>
					{this.props.children}
					<Button
						label="save"
						hoverIndicator
						onClick={() => {
							this.doUpdate();
						}}
					>
					</Button>
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
				</Box>
			</Box>
		);
	}
}


class Profile extends Component {
    constructor(props) {
		super(props);
		this.fNameRef = React.createRef();
		this.lNameRef = React.createRef();
		this.emailRef = React.createRef();
		this.passwordRef = React.createRef();
		this.focusSomething = function (obj) {
			obj.current.focus();
		}
		this.focusSomething.bind(this);
        this.state = {
            fName: '',
            lName: '',
            email: '',
            password: '',
            major1: '',
            major2: '',
            minor1: '',
            minor2: '',
            programs: default_programs
        }
        this.props.reloadFunc();
    }
    
    componentWillReceiveProps(props) {
        this.setState({
            fName: props.info.fName,
            lName: props.info.lName,
            email: props.info.email,
            password: props.info.password,
            major1: props.info.major1,
            major2: props.info.major2,
            minor1: props.info.minor1,
            minor2: props.info.minor2
        })
    }

	ufName = () => {
        return new Promise((resolve, reject) => {
            let bodystr="email="+this.props.info.email+"&key=fName&value="+this.state.fName;
            console.log('bodystr\t'+bodystr);
            fetch('/SycamoreScheduler/ProfileServlet', {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: bodystr
            })
            .then((response) => {
                console.log(response);
                console.log(response.ok);
                if (response.ok) {
                    resolve({error: false, msg: ''})
                } else {
                    resolve({error: true, msg: 'Error with fName'})
                }
                return response.json();
            })
            .then((json) => {
                console.log(json);
            })
        })
	}

	ulName = () => {
		return new Promise((resolve, reject) => {
            let bodystr="email="+this.props.info.email+"&key=lName&value="+this.state.lName;
            console.log('bodystr\t'+bodystr);
            fetch('/SycamoreScheduler/ProfileServlet', {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: bodystr
            })
            .then((response) => {
                console.log(response);
                console.log(response.ok);
                if (response.ok) {
                    resolve({error: false, msg: ''})
                } else {
                    resolve({error: true, msg: 'Error with lName'})
                }
                return response.json();
            })
            .then((json) => {
                console.log(json);
            })
        })
	}

	uemail = () => {
		return {error: false, msg: ''};
	}

	upassword = () => {
        return new Promise((resolve, reject) => {
            let bodystr="email="+this.props.info.email+"&key=pass&value="+this.state.password;
            console.log('bodystr\t'+bodystr);
            fetch('/SycamoreScheduler/ProfileServlet', {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: bodystr
            })
            .then((response) => {
                console.log(response);
                console.log(response.ok);
                if (response.ok) {
                    resolve({error: false, msg: ''})
                } else {
                    resolve({error: true, msg: 'Error with password'})
                }
                return response.json();
            })
            .then((json) => {
                console.log(json);
            })
        })
	}

	umajor1 = () => {
		return {error: false, msg: ''};
	}

	umajor2 = () => {
		return {error: false, msg: ''};
	}

	uminor1 = () => {
		return {error: false, msg: ''};
	}

	uminor2 = () => {
		return {error: false, msg: ''};
	}


	render ( ) {
		return (
			<Box
				flex
				direction='column'
				justify='start'
				align='start'
				animation={{
					type: 'fadeIn',
					delay: 50,
					duration: 750,
					size: 'large'
				}}
				pad='large'
                gap='medium'
                overflow={{vertical: 'auto'}}
			>
				<Heading level='1'>{this.state.fName + ' ' + this.state.lName}</Heading>
				<ProfileField
					name='First Name'
					updateFunc={this.ufName}
				>
				<FormField
				>
					<TextInput
						ref={this.fNameRef}
						id='fName'
						size='large'
						focusIndicator
						value={this.state.fName}
						onChange={(event) => this.setState({fName: event.target.value})}
					>
					</TextInput>
				</FormField>
				</ProfileField>
				<ProfileField
					name='Last Name'
					updateFunc={this.ulName}
				>
				<FormField
				>
					<TextInput
						ref={this.lNameRef}
						id='lName'
						size='large'
						focusIndicator
						value={this.state.lName}
						onChange={(event) => this.setState({lName: event.target.value})}
					>
					</TextInput>
				</FormField>
				</ProfileField>
                <ProfileField
					name="Major"
					updateFunc={this.umajor1}
				>
				<Select
					size='medium'
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
				</ProfileField>
				<ProfileField
					name="Minor"
					updateFunc={this.uminor1}
				>
				<Select
					size='medium'
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
				</ProfileField>
				<ProfileField
					name='Email'
					updateFunc={this.uemail}
				>
				<FormField
				>
					<TextInput
						ref={this.emailRef}
						id='email'
						size='large'
						focusIndicator
						value={this.state.email}
						onChange={(event) => this.setState({email: event.target.value})}
					>
					</TextInput>
				</FormField>
				</ProfileField>
				<ProfileField
					name='Password'
					updateFunc={this.upassword}
				>
				<FormField
				>
					<TextInput
						ref={this.passwordRef}
						id='password'
						size='large'
						type='password'
						focusIndicator
						value={this.state.password}
						onChange={(event) => this.setState({password: event.target.value})}
					>
					</TextInput>
				</FormField>
				</ProfileField>
			</Box>
		);
	}
}

export default Profile;