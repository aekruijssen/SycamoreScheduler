import React, {Component} from 'react';
import PropTypes from "prop-types";

import {
	Box, 
	Button,
	Heading,
	InfiniteScroll,
    Tabs, 
	Text,
	TextInput,
	Tab
} from 'grommet';

import {
	FormSearch
} from 'grommet-icons';

const CourseButton = props => (
	<Box
		direction='column'
		align='center'
		justify='center'
		width='medium'
		height='xsmall'
	>
		<Button 
			fill
			onClick={() => {props.clickFunc(props.id)}}
			label={<strong>{props.name}</strong>}
            hoverIndicator
			style={{
                background: 'white',
				radius: '4px',
				border: '3px solid main',
				fontSize: '30px'
			}}
		>
		</Button>
	</Box>
);

class CourseList extends Component {

	state = {
		clickFunc: this.props.clickFunc,
        list: this.props.defList,
        major: this.props.major,
        minor: this.props.minor
	}

	componentWillReceiveProps(props) {
		this.setState({
			list: props.list
		});
	}

	render() {
		let i = 0;
		return (
			this.state.list !== null && 
				<InfiniteScroll items={this.state.list} step={20}>
				{item => (
					<Box
					align="center"
					pad='small'
					key={(i++).toString()}
					>
					<CourseButton clickFunc={this.state.clickFunc} name={item} id={item}></CourseButton>
					</Box>
				)}
				</InfiniteScroll>
			
		);
	}
}

const RichTabTitle = ({label}) => (
    <Box direction="row" align="center" justify='center' margin="xsmall" pad='2%'>
      <Text size="xlarge">
        <strong>{label}</strong>
      </Text>
    </Box>
);
  
RichTabTitle.propTypes = {
	label: PropTypes.string.isRequired
};
  
  
class Classes extends Component {

	constructor(props) {
		super(props);
		this.state = {
			courseTab: 0,
			search: '',
			allClasses: props.classes,
			searchClasses: props.classes,
		}
		this.onSearch = function (query) {
			const exp = new RegExp(query, 'i');
			this.setState({
				search: query,
				searchClasses: this.state.allClasses.filter(s => exp.test(s))
			});
		}.bind(this);
    }
    
    componentWillReceiveProps(props) {
        if (props.info !== null) {
            this.setState({
                allMajorClasses: props.classes.filter(s => new RegExp(props.info.major1, 'i').test(s)),
                searchMajorClasses: props.classes.filter(s => new RegExp(props.info.major1, 'i').test(s)),
                allMinorClasses: props.classes.filter(s => new RegExp(props.info.minor1, 'i').test(s)),
                searchMinorClasses: props.classes.filter(s => new RegExp(props.info.minor1, 'i').test(s)),
            })
        }
    }
	render () {
		const {courseTab} = this.state;
		return (
			<Tabs
				activeIndex={courseTab}
				onActive={i => {
					this.setState({ courseTab: i });
				}}
			>
				<Tab
					title={<FormSearch size='large'></FormSearch>}
				>
					<Box
						direction='column'
						align='center'
						justify='start'
						style={{
							position: 'sticky',
							top: '0',
							zIndex: 500
						}}
						background='light-2'
						pad={{
							horizontal: 'medium',
							bottom: 'medium'
						}}
					>
						<Heading level='2'>find any class</Heading>
							<TextInput
								placeholder="search"
								background='white'
								value={this.state.search}
								onChange={(event) => {
									const nextSearch = event.target.value;
									this.onSearch(nextSearch);
								}}
								style={{
									fontFamily: 'Inconsolata'
								}}
						/>
					</Box>
					<Box
						className='classBox'
						direction='column'
						align='center'
						justify='start'
						pad='small'
						animation={{
							type: 'fadeIn',
							size: 'xlarge'
						}}
					>
						<CourseList clickFunc={this.props.clickFunc} defList={this.state.allClasses} list={this.state.searchClasses} />	
					</Box>
				</Tab>
			</Tabs>
		);
	}
}

export default Classes;