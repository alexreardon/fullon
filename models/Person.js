function Person(firstname, lastname, sold, attributed){
	this.firstname = firstname;
	this.lastname = lastname;
	this.sold = sold || 0;
	this.attributed = attributed || 0;
}

module.exports = Person;