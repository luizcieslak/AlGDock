// Source code for downloading docking results from the cluster

var fs = require('fs');
var url = require('url');
var http = require('http');
var exports = module.exports = {};


// OLD function 
/*exports.download_file = function() {
	var options = {
    	host: url.parse(file_url).host,
    	port: 3000,
    	path: url.parse(file_url).pathname
	};
	var file_name = url.parse(file_url).pathname.split('/').pop();
	console.log("The file name is " + file_name);
	var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);
	
	http.get(options, function(res) {
		res.on('data', function(data) {
				file.write(data);
			}).on('end', function() {
				file.end();
				console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
		});
	}); 
}; */

// Function to download file using HTTP.get
// This function is exported when another script requires downloads.js
// On the cluster, results files are stored in the TARGET directory (see REST.py), under the user's email and the protein/ligand folders for the job
exports.download_file = function(email, prot, lig) {
	var file_url = "http://localhost:5000/api/v1.0/download/" + email + "/"+prot+"/"+lig; //file path on cluster to download
	// This must be changed so it is no longer hardcoded. Do a 'Save As' prompt?:
	var DOWNLOAD_DIR = '/Users/Iva/Downloads/'; //directory to download to
	//windows
	if (navigator.appVersion.indexOf("Win")!=-1) DOWNLOAD_DIR = 'C:/';
	//mac
	else if (navigator.appVersion.indexOf("Mac")!=-1) DOWNLOAD_DIR = 'Users/';
	//unix
	else if (navigator.appVersion.indexOf("X11")!=-1) DOWNLOAD_DIR = '/home/';
	//linux
	else if (navigator.appVersion.indexOf("Linux")!=-1) DOWNLOAD_DIR = '/home/';
	//default
	else DOWNLOAD_DIR = '/Users/Iva/Downloads/';
	
	//TARGET variable on cluster should be set to /home/ldasilva/target/
	var file_name = url.parse(file_url).pathname.split('/').pop();
	filename += '.gz';
	console.log("The file URL is " + file_url);
	console.log("The file name is " + file_name);
	var file = fs.createWriteStream(DOWNLOAD_DIR + 	file_name);
	var request = http.get(file_url, function(response) {
		response.pipe(file);
		console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
	});
};