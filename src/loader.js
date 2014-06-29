var Loader = function Loader() {

};

Loader.prototype.load = function load(url, success, error) {
	var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    
    request.onload = function (e) {
    	var req = e.target;
		if (req.status === 200 && req.response) {
			success(req.response)
		} else {
			error(req.response, req.status, req.statusText);
		}
    };
    
    request.send(null);
};

module.exports = Loader;