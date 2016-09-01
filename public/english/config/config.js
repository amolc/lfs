if (document.location.hostname == "node.fountaintechies.com") {

    var baseUrl = "http://node.fountaintechies.com:11000/api/";
    var imageURL = "http://node.fountaintechies.com:11000/assets/images";
  	var pdfURL = "http://node.fountaintechies.com:11000/assets/pdf";
  	var engURL = "http://node.fountaintechies.com:11000/en/#/home";	
  	var frURL = "http://node.fountaintechies.com:11000/fr/#/home";
    var downloadUrl = "http://node.fountaintechies.com:11000/en/#/brochure";
  	
} else {

    var baseUrl = "http://localhost:11000/api/";
    var imageURL = "http://node.fountaintechies.com:11000/assets/images";
    var pdfURL = "http://node.fountaintechies.com:11000/assets/pdf";
    var engURL = "http://localhost:11000/en/#/home";	
  	var frURL = "http://localhost:11000/fr/#/home";	
    var downloadUrl = "http://localhost:11000/en/#/brochure";
}
