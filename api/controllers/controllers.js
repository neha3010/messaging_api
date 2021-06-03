'use strict';

function validateLength(input, highLimit, lowLimit) {
	if (input.length > highLimit) return false
	else if (input.length < lowLimit) return false
	return true
}

function checkForRequiredFields(fields, inputBody) {
	fields.forEach(f => {
		if(!inputBody[f]) return new Error(`${f} is missing`)
	})
}

function validateSmsInput(requestBody) {
	if (Object.keys(requestBody).length < 0) return new Error('Too less parameters')
	if (Object.keys(requestBody).length > 3) return new Error('Too many parameters')
	const fieldsCheck = checkForRequiredFields(['from', 'to', 'text'], requestBody)
	if (fieldsCheck instanceof Error) return fieldsCheck
	// if input is not type string and lenght not between 6,16
	if (!(typeof requestBody.from === 'string') && validateLength(requestBody.from, 16, 6)) {
		return new Error('from is invalid')
	} else if (!(typeof requestBody.to === 'string') && validateLength(requestBody.from, 16, 6)) {
		return new Error('to is invalid')
	} else if (!(typeof requestBody.text === 'string') && validateLength(requestBody.from, 120, 1)) {
		return new Error('text is invalid')
	}
}

const ddbModel = require("../models/model");

// DEFINE CONTROLLER FUNCTIONS
exports.inboundSMS = (req, res) => {
	// validate input
	const inputCheck = validateSmsInput(req.body)
	if (inputCheck instanceof Error) {
		res.status(400).send({message: '', error: inputCheck.message})
	}
	if (req.body.text === 'STOP') {
		// add from,to to cache|ddb
	}
	res.status(200).send({message: 'inbound sms is ok', error: ''})
}

exports.outboundSMS = async (req, res) => {
	const inputCheck = validateSmsInput(req.body)
	if (inputCheck instanceof Error) {
		res.status(400).send({message: '', error: inputCheck.message})
	}
	// store (from, to, timestamp) triplet for outbound requests
	let ddbEntry = new ddbModel(req.body);
	ddbEntry.save((err, entry) => {
		if (err) {
			res.status(502).send({message: '', error: 'Issue with server'})
		} else {
			// entry posted to ddb/cache
		}
	})
	// check for request limit for from > 50

	await ddbModel.find({ from: req.body.from, timestamp: { $gte: Date.now() - 1000 * 60 * 60} }, (err) => {
		if (err) res.status(404).send({message: '', error: 'Issue with server'})
		res.status(429).send({message: '', error: `limit reached for from ${req.body.from}`})
	})
	// check for from to pairs in ddb|cache
	await ddbModel.find({ from: req.body.from, to: req.body.to}, (err, results) => {
		if (err) res.status(404).send({message: '', error: 'Issue with server'})
		else if (results.length >= 50) res.status(409).send({message: '', error: `sms from ${req.body.from} and to ${req.body.to} blocked by STOP request`})
	})
	res.status(200).send({message: 'outbound sms is ok', error: ''})
}

exports.wrongApiMethods = (req, res) => {
	res.status(405).send({message: '', error: 'Invalid API method'})
}
