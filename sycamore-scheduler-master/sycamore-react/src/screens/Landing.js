import React, {Component} from 'react';
import {
	Box,
	Button,
	RoutedButton,
	Heading,
	Image,
	Text
} from 'grommet';

class Landing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			signedIn: this.props.signedIn
		}
	}
	render ( ) {
		return (
			<Box
				flex
				direction='row'
				align='center'
				justify='center'
				gap='small'
			>
					<Box 
						height='small'
						width='small'
						animation={{
							type: 'slideRight',
							delay: 0,
							duration: 500,
							size: 'large'
						}}
						border={{
							side: 'all',
							size: 'small',
							color: 'dark-1'
						}}
						pad='small'
						background='main'
						style={{
							borderRadius: '20px'
						}}
					>
						<Image fit='contain' src='/SycamoreScheduler/leaf.png' />
					</Box>
					<Box
						direction='column'
						justify='center'
						align='center'
						height='small'
					>
						<Box 
							flex
							direction='row'
							pad={{
								top: 'medium',
								horizontal: 'medium',
								bottom: '0'
							}}
							gap='small'
						>
							<Box 
								pad='0' 
								margin='0' 
								animation={{
									type:'slideDown',
									delay:0,
									duration:500,
									size:'large'
								}}
							>
								<Heading 
									margin='0' 
									level='1' 
									color='black'
								>
									Sycamore
								</Heading>
							</Box>
							<Box
								pad='0'
								margin='0'
								animation={{
									type: 'fadeIn',
									delay: 200,
									duration: 400,
									size: 'large'
								}}
							>
								<Heading 
									margin='0' 
									level='1' 
									color='main'
								>
									Scheduler
								</Heading>
							</Box>
						</Box>
						<Box
							direction='row'
							align='center'
							justify='center'
							animation={{
								type: 'slideUp',
								delay: 0,
								duration: 500,
								size: 'large'
							}}
							margin={{
								bottom: 'large'
							}}
						>
							{!this.state.signedIn && 
								<RoutedButton
									path='/Register'
									hoverIndicator
									label={<Text size='large'><strong>Register</strong></Text>}
									color='main'
									margin={{
										right: 'medium'
									}}
								>
								</RoutedButton>
							}
							{!this.state.signedIn && 
								<RoutedButton
									path='/SignIn'
									hoverIndicator
									label={<Text size='large'><strong>Sign In</strong></Text>}
									color='main'
									margin={{
										right: 'medium'
									}}
								>
								</RoutedButton>
							}
							{this.state.signedIn && 
								<Button
									hoverIndicator
									label={<Text size='large'><strong>Sign Out</strong></Text>}
									color='main'
									onClick={() => {this.props.onSignOut();}}
									margin={{
										right: 'medium'
									}}
								>
								</Button>
							}
							{!this.state.signedIn && 
								<RoutedButton
									path='/Home'
									hoverIndicator
									label={<Text size='large'><strong>Guest</strong></Text>}
									color='main'
								>
								</RoutedButton>
							}
							{this.state.signedIn && 
								<RoutedButton
									path='/Home'
									hoverIndicator
									label={<Text size='large'><strong>Home</strong></Text>}
									color='main'
								>
								</RoutedButton>
							}
						</Box>
					</Box>
			</Box>
		);
	}
}

export default Landing;