import React, {Component} from 'react';

import {
	Box, 
	Heading,
	Table,
	TableBody,
	TableCell, 
	TableHeader,
	TableRow,
	Text,
	Button
} from 'grommet';

import {
	SubtractCircle
} from 'grommet-icons';

class CoursePlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
        var ws = new WebSocket('ws://localhost:8080/SycamoreScheduler/ss1');
        ws.onopen = e => {
            console.log('WebSocket Connected!', e);
        };
        ws.onmessage = e => {
            console.log('Received:', e);
            this.getScheduleServlet();
        };
        ws.onclose = e => {
            console.log('Closed!', e);
        };
        ws.onerror = e => {
            console.log('Error:', e);
        };
        var info = this.props.info;
        var startYear = parseInt(info.startTerm.substring(0, 4));
        var startTerm = parseInt(info.startTerm.charAt(4)) === 3 ? 'Fall' : 'Spring';
        var endYear = parseInt(info.endTerm.substring(0, 4));
        var endTerm = parseInt(info.endTerm.charAt(4)) === 3 ? 'Fall' : 'Spring';
        console.log('startYear: '+startYear+'\nendYear: '+endYear);
        this.setState({
            socket: ws,
            info: info,
            startYear: startYear,
            startTerm: startTerm,
            endYear: endYear,
            endTerm: endTerm,
            email: this.props.email
        });

        // GET /ScheduleServlet
        this.getScheduleServlet = function() {
            let ok = false;
            fetch('/SycamoreScheduler/ScheduleServlet?email='+props.email, {
                method: 'GET'
            })
            .then((response) => {
                ok = response.ok;
                return response.json();
            })
            .then((json) => {
                console.log("Got JSON back from GET /ScheduleServlet ...");
                console.log(json);
                if (ok) {
                    var datamap = {};
                    for (var yr = startYear; yr <= endYear; yr++) {
                        for (var sp = 1; sp >= 0; sp--) {
                            var key = '';
                            var title = '';
                            if (sp === 1 && !(yr === startYear && startTerm === 'Fall')) { // fall
                                key += yr+'1';
                                title += 'Spring ' + yr;
                            } else if (sp === 0 && !(yr === endYear && endTerm === 'Spring')) { // spring
                                key += yr+'3';
                                title += 'Fall ' + yr;
                            }
                            if (key !== '' && title !== '') {
                                if (json[key] === undefined || json[key] === null) {
                                    datamap[title] = [];
                                } else datamap[title] = json[key];
                            }
                        }
                    }
                    this.setState({
                        data: datamap
                    });
                } else {
                    this.setState({
                        data: null
                    });
                }
            })
        }.bind(this);
        this.getScheduleServlet();
    }

	render ( ) {
		return (
			<Box
				flex
				direction='column'
				justify='start'
				align='center'
				animation={{
					type: 'fadeIn',
					delay: 50,
					duration: 750,
					size: 'large'
				}}
			>
				<Heading 
                    level='1'
					margin={{
                        top: 'large',
                        bottom: '0',
                        left: 'large'
					}}
				>
					Course Plan
				</Heading>
				<Box
					flex
					direction='row'
					align='start'
                    justify='center'
                    overflow='auto'
                    style={{
                        flexWrap: 'wrap'
                    }}
				>
					{
                    this.state.data !== null &&
                    Object.keys(this.state.data).map(key => (
                        <Box
							key={key}
							flex
                            margin='large'
                            basis='large'
						>
							<Table caption={key}>
								<TableHeader>
									<TableRow>
										<TableCell>
											<Heading level='3'>
												{key}
											</Heading>
										</TableCell>
									</TableRow>
								</TableHeader>
								<TableBody>
									{this.state.data[key].map(course => (
										<TableRow key={course.longName}>
											<TableCell>
												<Box 
													direction='row'
													align='center'
													justify='between'
												>
													<Text size='large'>
														{course.longName}
													</Text>
													<Button
														hoverIndicator
                                                        icon={<SubtractCircle color='main'></SubtractCircle>}
                                                        onClick={() => {
                                                            var termKey = '';
                                                            termKey += parseInt(key.substring(key.length-4));
                                                            if (key.substring(0, 4) === 'Fall') {
                                                                termKey += '3';
                                                            } else {
                                                                termKey += '1';
                                                            }
                                                            var bodystr = "profileEmail="+this.props.email+"&action=remove&className="+course.longName+"&term="+termKey;
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
                                                                console.log(json);
                                                            })
                                                        }}
													>
													</Button>
												</Box>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>))
                    }
				</Box>
			</Box>
		);
	}
}

export default CoursePlan;