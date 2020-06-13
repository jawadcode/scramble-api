#!/usr/bin/env node
const express = require('express');
const Scrambow = require('scrambow').Scrambow;
const fetch = require('node-fetch');
const svgToDataUrl = require('svg-to-dataurl');
const chalk = require('chalk');

const app = express();

// This function is called in a for loop to convert any whitespace into a single space in the scramble_string of each element of the array
function fix_spaces(value, index, array) {
	array[index].scramble_string = value.scramble_string.replace(/\s\s+/g, ' ');
}

// This function is also called in a for loop to generate images for the already generated scrambles.
async function setImage(value, index, array, puzzleTypeCubePreview){
	let FRUurl = 'http://cube.rider.biz/visualcube.php?fmt=png&size=350&bg=t&pzl=' + puzzleTypeCubePreview + '&alg=z2y2' + array[index].scramble_string.replace(/ /g,'');
	let BLDurl = 'http://cube.rider.biz/visualcube.php?fmt=png&size=350&bg=t&pzl=' + puzzleTypeCubePreview + '&alg=' + array[index].scramble_string.replace(/ /g,'');

	const type = 'png';
	return [
		await fetch(FRUurl).then(r => r.buffer()).then(buf => 'data:image/' + type +';base64,' + buf.toString('base64')),
		await fetch(BLDurl).then(r => r.buffer()).then(buf => 'data:image/' + type +';base64,' + buf.toString('base64'))
	];
}

scrambler = new Scrambow();

// Get any amount of any type of puzzle
app.get('/:puzzle/:n', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	const puzzleReq = req.params.puzzle;
	const puzzleType =
		puzzleReq === 'skewb' ? 'skewb':
		puzzleReq === 'pyra' ? 'pyra':
		puzzleReq === 'mega' ? 'mega':
		puzzleReq === 'sq1' ? 'sq1':
		puzzleReq === '222' ? '222':
		puzzleReq === '333' ? '333':
		puzzleReq === '444' ? '444':
		puzzleReq === '555' ? '555':
		puzzleReq === '666' ? '666':
		puzzleReq === '777' ? '777':
		null;

	const numOfPuzzles = parseInt(req.params.n);
	if(puzzleType !== null && !isNaN(numOfPuzzles) && numOfPuzzles !== 0) {
		const scrambleArray = scrambler.setType(puzzleType).get(numOfPuzzles);
		scrambleArray.forEach(fix_spaces);
		res.send(scrambleArray);
		console.log(chalk`{greenBright.bold [GET] }{gray.underline ${req.originalUrl}}`);
	} else if(puzzleType === null) {
		res.send({ error: 'Invalid puzzle type' });
	} else if(isNaN(numOfPuzzles)) {
		const err = `${req.params.n} is not a valid integer`;
		res.send({ error: err });
	} else if(numOfPuzzles === 0) {
		res.send({ error: 'You cannot have 0 scrambles' });
	}
});

// Get any amount of any type of puzzle with an image, unfortunately, crider visualcube only supports 2x2-9x9
app.get('/withimg/:puzzle/:n', async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	const puzzleReq = req.params.puzzle;
	const puzzleType =
		puzzleReq === 'skewb' ? 'skewb':
		puzzleReq === 'pyra' ? 'pyra':
		puzzleReq === 'mega' ? 'mega':
		puzzleReq === 'sq1' ? 'sq1':
		puzzleReq === '222' ? '222':
		puzzleReq === '333' ? '333':
		puzzleReq === '444' ? '444':
		puzzleReq === '555' ? '555':
		puzzleReq === '666' ? '666':
		puzzleReq === '777' ? '777':
		null;
	const puzzleTypeCubePreview = 
		puzzleType === '222' ? '2':
		puzzleType === '333' ? '3':
		puzzleType === '444' ? '4':
		puzzleType === '555' ? '5':
		puzzleType === '666' ? '6':
		puzzleType === '777' ? '7':
		null;
	let numOfPuzzles = parseInt(req.params.n);
	numOfPuzzles = isNaN(numOfPuzzles) ? 1 : numOfPuzzles === 0 ? 1 : numOfPuzzles;
	if(puzzleType !== null) {
		if(puzzleTypeCubePreview !== null) {
			let scrambleArray = scrambler.setType(puzzleType).get(numOfPuzzles);
			for(let i = 0; i < scrambleArray.length; i++) {
				fix_spaces(scrambleArray[i], i, scrambleArray);
			}
			for(let i = 0; i < scrambleArray.length; i++) {
				let imgs = await setImage(scrambleArray[i], i, scrambleArray, puzzleTypeCubePreview);
				scrambleArray[i].scramble_images = {
					FRUimage: imgs[0],
					BLDimage: imgs[1]
				} 
			}
			res.send(scrambleArray);
			console.log(chalk`{greenBright.bold [GET] }{gray.underline ${req.originalUrl}}`);
		} else {
			const err = `${req.params.puzzle}, currently doesn't have a scramble image generator`;
			res.send({ error: err });
		}
	} else if(puzzleType === null) {
		res.send({ error: 'Invalid puzzle type' })
	} else if(isNaN(numOfPuzzles)) {
		const err = `${req.params.n} is not a valid integer`;
		res.send({ error: err });
	} else if(numOfPuzzles === 0) {
		res.send({ error: 'You cannot have 0 scrambles' });
	}
});

app.listen(3000, '0.0.0.0', () => {
	console.log('Scramble API listening on port 3000');
});
