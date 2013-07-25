/*This job will do the following operations:
1. authenticate with google
2. obtain data from chocolate google document
3. process data from document
4. save document in database
 */

var app = require('../app');


function authenticate(){


}

function getChocolateData(){

}

function processChocolateData(spreadsheet){

}

function saveChocolateData(data){

}


function start(){
	authenticate();
}



exports.job = {
	start: start,
	timeout: 1800000 //30m
};

exports.test = {
	authenticate: authenticate,
	getChocolateData: getChocolateData,
	processChocolateData: processChocolateData,
	saveChocolateData: saveChocolateData
}


