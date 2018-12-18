import React, {Component} from 'react';
import {
	Box, 
	Button,
	Heading,
	Layer,
	Image,
	Paragraph,
	Meter,
    Stack,
    Select,
	Text
} from 'grommet';

import {
	Add
} from 'grommet-icons';

class ClassView extends Component {

	state = {
		classInfo: this.props.defaultInfo,
        open: false,
        selectedTerm: ''
    }
    
    addClass = () => {
        if (this.state.selectedTerm === '') {
            return;
        } else {
            var termKey = '';
            termKey += parseInt(this.state.selectedTerm.substring(this.state.selectedTerm.length-4));
            if (this.state.selectedTerm.substring(0, 4) === 'Fall') {
                termKey += '3';
            } else {
                termKey += '1';
            }
            var bodystr = "profileEmail="+this.props.email+"&action=add&className="+this.state.classInfo.longName+"&term="+termKey;
            console.log(bodystr);
            var ok = false;
            fetch('/SycamoreScheduler/ScheduleServlet', {
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
            .then((json) => {
                if (ok) {
                    this.setState({
                        open: false,
                        selectedTerm: ''
                    })
                }
            })
        }
    }

	componentWillReceiveProps(props) {
		this.setState({ 
            classInfo: props.classInfo,
            userInfo: props.userInfo
        });
	}
	
	render ( ) {
		const classInfo = this.state.classInfo;
		return (
			<Box
				flex
				direction='column'
				justify='start'
				align='start'
				pad='5%'
				animation={{
					type: 'fadeIn',
					delay: 50,
					duration: 750,
					size: 'large'
                }}
                style={{
                    overflow: 'auto'
                }}
			>
				<Box 
					direction='row'
					align='center'
					gap='large'
				>
				<Heading level='1'>{classInfo.degreeName+' '+classInfo.classNumber}</Heading>
				{this.props.isSignedIn && 
					<Button 
						primary
						color='main'
						label={<Add size='medium' color='white'></Add>} 
						pad='large'
						onClick={() => {
							this.setState({
								open: true
							})
						}}
					>
					</Button>
				}
				</Box>
				<Heading level='2'>{classInfo.className}</Heading>
				<Text size='large'>{classInfo.units} units</Text>
				<Paragraph>
					{classInfo.summary}
				</Paragraph>
				{classInfo.instructorName && 
				<Heading level='1'>Instructors</Heading>
				}
				{classInfo.instructorName ? 
					<Heading level='2'>&bull; {classInfo.instructorName}</Heading> : 
					<Heading level='2'>No instructors found</Heading>
				}
				{classInfo.rmpID !== 0 &&  
					<Box 
						direction='row'
						align='center'
						justify='between'
						gap='medium'
						margin={{top: 'medium'}}
					>
						<Box align="start">
							<Stack anchor="center">
								<Meter
								type="circle"
								background="light-2"
								values={[{
									value: classInfo.instructorRating/5*100,
									color: 'main',
									highlight: true,
								}]}
								size="xsmall"
								thickness="small"
								/>
								<Box direction="row" align="center" pad={{ bottom: "xsmall" }}>
								<Text size="xlarge" weight="bold">
									{classInfo.instructorRating}
								</Text>
								<Text size="small">/5</Text>
								</Box>
							</Stack>
						</Box>
						<Image style={{height: '100px'}} src='/SycamoreScheduler/rmp.png' />
					</Box>
				}
				{this.state.open && (
					<Layer
						position="center"
						modal
						onClickOutside={() => {
							this.setState({
								open: false,
							});
						}}
						onEsc={() => {
							this.setState({
								open: false,
							});
						}}
					>
						<Box pad="medium" gap="small" width="medium">
						<Heading level={3} margin="none">
							Add {classInfo.longName}
						</Heading>
						<Text>Select a term to add {classInfo.longName}</Text>
                        <Select
							size='small'
							placeholder={<Text size='large'>term</Text>}
							value={this.state.selectedTerm}
							options={this.props.titleList}
							onChange={(option) => {this.setState({selectedTerm: option.value});}}
						>
						</Select>
                        <Box
							tag="footer"
							gap="small"
							direction="row"
							align="center"
							justify="end"
							pad={{ top: "medium", bottom: "small" }}
						>
							<Button 
								label="Cancel" 
								onClick={() => {
									this.setState({
										open: false,
									});
								}} 
								color="dark-6"
							/>
							<Button
								label={
									<Text color="white">
									<strong>Add</strong>
									</Text>
								}
								onClick={() => {
                                    this.addClass();
								}}
								primary
								color="main"
							/>
						</Box>
						</Box>
					</Layer>
					)}
			</Box>
		);
	}
}

export default ClassView;