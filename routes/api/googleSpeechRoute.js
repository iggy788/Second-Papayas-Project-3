require('dotenv').config();
//Take these keys in keys.js add the program to this one
const btoa = require('btoa');
const key = require('../keys/keys');
const Transcription = require('../../models/transcriptionModel');
const CrutchWords = require('../../models/crutchWordsModel');
const User = require('../../models/userModel');
const UserSession = require('../../models/userSessionModel');
const Busboy = require('busboy');
const busboyPromise = require('busboy-promise');
const speech = require('@google-cloud/speech');
const request = require('request');
const fs = require('fs');



module.exports = (app) => {
    /* Uploading and Transcribing Audio File */
	app.post('/api/account/upload', async function (req, res, next) {
		/* Use Token in Query Params */
		const { body } = req.body;

		/* If Audio File is Uploaded Follow the Below */
        const busboy = new Busboy({
			headers: req.headers
		});
		const token = req.body.element1;
		console.log(token);
        const convertedFile = btoa(req.files.element2.data);

        /* The file upload has completed */
		busboy.on('finish', function () {
			/* Converts File to Base64 */
			const file = convertedFile;
			console.log('Upload finished... Starting Translation');
			/* Call googleTranslate Function */
			googleTranslate(file, token)
		})
		req.pipe(busboy)




	async function googleTranslate(file, token) {
	/* Set Up Request to Google Speech API */
    const options = {
        method: 'POST',
        url: 'https://speech.googleapis.com/v1/speech:recognize',
        qs: {
            key: 'AIzaSyBmBNjnnHCRvNv8pdo_90qo5Fu-hjdIz8M'
        },
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
        },
        body: {
            audio: {
                content: file
            },
            config: {
				'languageCode': 'en-US',
            }
        },
        json: true
	};

	// const res = await (request);
	// const status = await res.status;

	request(options, function (err, results, body) {
			if (err) throw new Error(err);
			/* The File Uploaded Object */
		// console.log(JSON.stringify(body.results));
		// console.log('==========================');
		// 	for (var i = 0; i < body.results.length; i++) {
		// 		console.log(JSON.stringify(body.results[i]));
		// 	}
		console.log('==========================');
		for (var i = 0; i < body.results.length; i++) {
			// console.log(JSON.stringify(body.results[i]));
			// console.log('==========================');
			for (var j = 0; j < body.results[i].alternatives.length; j++) {
				console.log(JSON.stringify(body.results[i].alternatives[j]));
			}
		}
		console.log('==========================');
			let transcription = {
				transcription: JSON.stringify(body.results[0].alternatives[0].transcript),
				// transcription: JSON.stringify(body.results),
				transcriptionId: token
		};

			/* Create a the Transcription in the Transcriptions Collection */
			Transcription.create(transcription);
			/* Save the Transcription to the User's Profile */
			console.log(transcription);
			// console.log(transcription.transcription);
			console.log(transcription.transcriptionId);

			const newTranscription = new Transcription(
				{transcription: transcription, transcriptionId: transcription._id}
			);
			newTranscription.save(function () {
				console.log('transcription saved');
				console.log(newTranscription);
				console.log(newTranscription._id);


				User.findOneAndUpdate({
					/* This has to be Equal to the User's Object ID */
						_id: transcription.transcriptionId
					}, {
						$push: {
							transcriptions: newTranscription
						}
					}, {
						new: true
					})
					.then(function (result, _id) {
						console.log(JSON.stringify(body.results));
						JSON.stringify(body.results);

						/* Call Crutch Words Promise Function Here */
						let finalT = transcription.transcription.toLowerCase();
						console.log(token);
						getCrutchWords(finalT, token)
						/* Make the Response from Our Request */
						Transcription.findOne({
							_id: newTranscription._id
						},
							function (err, doc) {
								if (err) {
									return res.send({
										success: false,
										message: 'Error: Server Error During Sign In'
									});
								}
								return res.send({
									success: true,
									transcription: transcription.transcription,
									transcriptionId: transcription.transcriptionId
								})
							})
					})
				});
			});
	} /* End Google Transcription Function */
});
	/* Find the Crutch Words in Transcription User Identified */
	function getCrutchWords(transcript, token) {
		console.log('Token Passed in Associated to UserSession, also Token and also transcriptionId::');
		console.log(token);
    	const crutchWords = [{
                "word": "just",
				"count": 0,
				crutchWordsId: token
            },
            {
                "word": "almost",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "basically",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "actually",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "definitely",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "literally",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "really",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "very",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "truly",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "essentially",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "seriously",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "totally",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "honestly",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "obviously",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "so",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "anyway",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "well",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "right",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "okay",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "well",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "great",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "fantastic",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "awesome",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "excellent",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "definite",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "like",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "up",
                "count": 0,
                crutchWordsId: token
            },
            {
                "word": "presently",
                "count": 0,
                crutchWordsId: token
            }
        ];

        let crutchSaid = [];
        let crutchCount;
		let crutchReturn = [];


        if (crutchWords.length > 0) {
            for (let i = 0; i < crutchWords.length; i++) {
                const rgxp = new RegExp("(\\S*)?(" + crutchWords[i].word + ")(\\S*)?", "ig");

				crutchCount = (transcript.split(crutchWords[i].word).length - 1);

                transcript.replace(rgxp, function(match, $1, $2, $3) {
                    crutchSaid.push(($1 || "") + $2 + ($3 || ""));

                });
                //console.log(crutchWords[i] + " " + crutchCount);
				crutchReturn.push(crutchWords[i].count = crutchCount);


            }
        }
		console.log(crutchWords);
		CrutchWords.create(crutchWords);
    }
	/* Find the Crutch Words in Transcription User Identified */

	/* Save the Count of How Many Times Transcribed Words appear in Transcription */

	/* Get the Transcription and Amount of Times Crutch Words are Said from DB */
}

