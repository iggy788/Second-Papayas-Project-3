import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, FormControl } from 'react-bootstrap';
import 'whatwg-fetch';
import Button from '../../elements/CustomButton/CustomButton';
import avatar from '../../assets/img/faces/face-4.jpg';
import Sidebar from '../Sidebar/Sidebar';
import { Card } from '../Card/Card';
import { UserCard } from '../UserCard/UserCard';
import { getFromStorage } from '../utils/storage';
import ChartistGraph from 'react-chartist';


class TranscribeAudio extends Component {
	constructor(props) {
		super(props);
		/* Set State */
		this.state = {
			isLoading: true,
			token: '',
			element1: '',
			element2: '',
			uploadError: '',
			selectedFile: null,
			transcription: '',
			transcriptionId: '',
			crutchWords: '',
			count: '',
			wordsLoading: true,
			chartData: '',
			dataBar: {
				labels: '',
				series: ''
			}
		}
		/* Binding the audio files & crutch words entered in the selected file & Crutch Words text box to the constructor */
		this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
		this.fileUploadHandler = this.fileUploadHandler.bind(this);
	}
	/* Initialization that requires DOM nodes should go here is invoked immediately after a component is mounted */
	componentDidMount() {
		const obj = getFromStorage('papayas_app');
		if (obj && obj.token) {
			const { token } = obj;
			console.log('token: \n' + token);
			/* Verify Token */
			fetch('/api/account/verify?token=' + token)
				.then(res => res.json())
				.then(json => {
					if (json.success) {
						this.setState({
							token,
							isLoading: false
						});
					} else {
						this.setState({
							isLoading: false
						});
					}
				})
		} else {
			this.setState({
				isLoading: false
			});
		}

	}

	/* Get the Select a File from Upload */
	fileSelectedHandler = event => {
		this.setState({
			selectedFile: event.target.files[0]
		});
		console.log(event.target.files);
	}

	/* Take Uploaded File & Send to the Back End */
	fileUploadHandler = () => {
		/* Set State */
		this.setState({
			isLoading: true,
		});

		/* Send File to Backend Server for Transcribing */
		const obj = getFromStorage('papayas_app');
		const { token } = obj;

		/* POST Request to Backend in Production. */
		let uri = '/api/account/upload';

		const formData = new FormData();
		formData.append('element1', token);
		formData.append('element2', this.state.selectedFile);

		const options = {
			method: 'POST',
			mode: 'cors',
			body: formData
		}
		const req = new Request(uri, options);
		console.log(options.body);

		fetch(req)
			.then(res => res.json())
			.then(json => {
				console.log('json:', json);
				console.log('transcription:', json.transcription);
				console.log('transcriptionId:', json._id);
					if(json.success){
						this.setState({
							transcription: json.transcription,
							transcriptionId: json._id,
							isLoading: false
						});
					}else{
						this.setState({
							Error: json.message,
							isLoading: false
						})
				}
				console.log('?id=' + json._id);
				if (json._id) {
					let uri = '/api/account/words?id=' + json._id;

					const options = {
						method: 'GET',
						mode: 'cors'
					}

					const req = new Request(uri, options);
					console.log(req);

					fetch(req)
						.then(res => res.json())
						.then(json => {
							if (json.success) {
								this.setState({
									wordsLoading: false,
									crutchWords: json.doc[0].words,
									count: json.doc[0].count,
								})

								/* Total of Times Crutch Words Was Said */
								const totalWords = json.doc[0].words.reduce(function (acc, curr) {
									if (typeof acc[curr] === 'undefined') {
										acc[curr] = 1;
									} else {
										acc[curr] += 1;
									}
									return acc;

								}, {});

								/* Create Key : Value Pairs for Table Data */
								var tableData = Object.keys(totalWords).map(k => {return {key: k, value: totalWords[k]}});
								console.log(tableData);

								/* Seperate Keys & Values for Bar Graph */
								var dataBack = {};
								tableData.forEach(o => dataBack[o.key] = o.value);
								console.log(dataBack);
								console.log(Object.values(dataBack));

								/* Bar Chart for Crutch Words Said */
								this.setState({
									dataBar: {
										labels: Object.keys(dataBack),
										series: [
											Object.values(dataBack)
										]
									}
								})
								console.log('==========');
								console.log('this.state words\n==========');
								console.log(this.state.crutchWords);
								console.log(this.state.count);
								console.log('Current State\n==========');
								console.log(this.state);
								console.log('Current Data Labels\n==========');
								console.log(this.state.dataBar.labels);
								console.log('Current Data Series\n==========');
								console.log(totalWords);
								console.log(Object.keys(dataBack));
								console.log(Object.values(dataBack));
								console.log('==========');
							} else {
								this.setState({
									wordsLoading: false
								})
							}
						})
					}
			})
			.catch(function (error) {
				console.log('request failed', error)
			});

	}
	/* End all of functions */

	render() {
		const {
			transcription,
			isLoading
		} = this.state;
		console.log('Selected File:');
		console.log(this.state.selectedFile);
		console.log(transcription);
		/* If the Audio File Has Not Been Uploaded & Transcribed Render this */
		if (isLoading) {
			return (<div><h3>Geniuses at Work...</h3></div>);
		}
		if (!transcription) {
			return (
				<div className='wrapper'>

					<Sidebar {...this.props} />
					<div id='main-panel' className='main-panel'>
						<Grid fluid>
							<Row>
								<Col md={8}>
									<Card title='Upload & Transcribe Audio' content={
										<form>
											<Row>
												<Col md={12}>
													<FormGroup controlId='formControlsTextarea'>
														<FormControl
															rows='5'
															type='file'
															bsClass='form-control'
															value={this.selectedFile}
															onChange={this.fileSelectedHandler}
														/>
													</FormGroup>
												</Col>
											</Row>
											<Button
												bsStyle='info'
												pullRight
												fill
												onClick={this.fileUploadHandler}>
												Upload & Transcribe Audio
											</Button>
											<div className='clearfix'></div>
										</form>
									}
									/>
								</Col>
								<Col md={4}>
									<UserCard
										bgImage='https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400'
										avatar={avatar}
										name='Mike Ignaczak'
										socials={
											<div>
												<Button simple><i className='fa fa-facebook-square'></i></Button>
												<Button simple><i className='fa fa-twitter'></i></Button>
												<Button simple><i className='fa fa-google-plus-square'></i></Button>
											</div>
										}
									/>
								</Col>
							</Row>
						</Grid>
					</div>

				</div>
			);
		}
		/* If the Audio File Has Been Uploaded & Transcribed Render this */
		return (
			<div className='wrapper'>
				<Sidebar {...this.props} />
				<div id='main-panel' className='main-panel'>
					<Grid fluid>
						<Row>
						<Col md={8}>
							<div className="TranscriptionItems">
								<h3><strong>Latest Transcriptions</strong></h3>
									<p>{this.state.transcription}</p>
									<h3><strong>You Said {this.state.count} Crutch Words</strong></h3>
									<div className="ct-chart">
										<ChartistGraph
											data={this.state.dataBar}
											type="Bar"
										/>

									</div>
								<Button
									bsStyle='info'
									className='AddCrutchWords'
									pullRight
									fill
									href='/dashboard'
									onClick={this.addCrutchWordsHandler}>
									Add Crutch Words to Dashboard
									</Button>
								<div className='clearfix'></div>
								</div>
							</Col>
							<Col md={4}>
							<UserCard
								bgImage='https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400'
								avatar={avatar}
								name='Mike Ignaczak'
								socials={
									<div>
										<Button simple><i className='fa fa-facebook-square'></i></Button>
										<Button simple><i className='fa fa-twitter'></i></Button>
										<Button simple><i className='fa fa-google-plus-square'></i></Button>
									</div>
								}
							/>

							</Col>
						</Row>
					</Grid>
				</div>
			</div>
		);
	}
}

export default TranscribeAudio;