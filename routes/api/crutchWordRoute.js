const User = require('../../models/userModel');
const UserSession = require('../../models/userSessionModel');
const Transcription = require('../../models/transcriptionModel');
const CrutchWords = require('../../models/crutchWordsModel');

module.exports = (app) => {
	// app.get('/api/account/words', (req, res, next) => {
	// 	/* Get Transcription Object ID */
	// 	const { query } = req;
	// 	/* ?token=test */
    //     const { words } = query;
	// 	/* Get Words */
	// 	CrutchWords
	// 		.find({ crutchWordsId: transcription._id })
	// 		.populate('words')
	// 		.then(results => res.json(results))
	// 		.catch(err => res.json(err));
	// });
	app.get('/api/account/transcription', (req, res, next) => {
	Transcription
	.find({})
	.exec()
	.then(results =>{
		console.log(docs);
		res.status(200).json(results);
	}).catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});
}