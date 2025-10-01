const urlBase = 'http://smallproject.shop/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};

	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "landingpage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	document.getElementById("contactAddResult").innerHTML = "";

	let firstname = document.getElementById("firstnameText").value;
	let firstnameError = document.getElementById("contactAddResult");
	let lastname = document.getElementById("lastnameText").value;
	let lastnameError = document.getElementById("contactAddResult");
	let email = document.getElementById("emailText").value;
	let emailError = document.getElementById("contactAddResult");
	let phone = document.getElementById("phoneText").value;
	let phoneError = document.getElementById("contactAddResult");
	let address = document.getElementById("addressText").value;
	let notes = document.getElementById("notesText").value;
	let errorMessage = "";


	if(firstname === "")
	{
		errorMessage = errorMessage + "First Name is required<br>";
	} 
	if(lastname === "")
	{
		errorMessage = errorMessage + "Last Name is required<br>";
	}
	if(email === "")
	{
		errorMessage = errorMessage + "Email is required<br>";
	}
	else if (!email.includes("@")) {
		errorMessage = errorMessage + "Invalid email format<br>";
	}
	if(phone === "")
	{
		errorMessage = errorMessage + "Phone Number is required<br>";
	}
	else if (!phone.match(/^\d{3}-\d{3}-\d{4}$/)) {
		errorMessage = errorMessage + "Phone must be in format XXX-XXX-XXXX<br>";
	}

	firstnameError.innerHTML = errorMessage;
	if(errorMessage !== "")
	{
		return;
	}

	let tmp = {firstName: firstname, lastName: lastname, email: email, phone: phone, address: address, notes: notes, userId: userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				// userId = jsonObject.id;
		
				if( jsonObject.error !== "" )
				{		
					document.getElementById("contactAddResult").innerHTML = "contact couldn't be added";
					return;
				}
				document.getElementById("contactAddResult").innerHTML = "Contact has been added!";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				
				if( jsonObject.error !== "" )
					{		
						document.getElementById("contactListDisplay").innerHTML = "";
						document.getElementById("contactSearchResult").innerHTML = "contact couldn't be found";
						return;
					}

				for( let i=0; i<jsonObject.results.length; i++ )
				{
					
				let contact = jsonObject.results[i];
				let contactId = contact.ContactID;
				
				let contactDisplay = `
					<div class="contact-entry" id="contact-${contactId}" style="margin-bottom:10px;">
						<strong 
							style="cursor: pointer; color: blue;" 
							onclick="toggleContactDetails(${contactId})"
						>
							${contact.FirstName} ${contact.LastName}
						</strong><br />
						Email: ${contact.Email}<br />
						Phone: ${contact.Phone}<br />
						
						<!-- Hidden details -->
						<div id="details-${contactId}" style="display: none; margin-top: 2px; ">
						Address: ${contact.Address}<br />
						Notes: ${contact.Notes}<br />
						</div>
						<div id="contactButtons">
						<button onclick="deleteContact(${contactId})">Delete</button>
						<button onclick="prefillForm(${contactId}, '${contact.FirstName}', '${contact.LastName}', '${contact.Email}', '${contact.Phone}', '${contact.Address}', '${contact.Notes}')">Update</button>
						</div>
					</div>
				`;


				contactList += contactDisplay;

				}
				document.getElementById("contactListDisplay").innerHTML = contactList;
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function deleteContact(contactid)
{

	let tmp = {contactId:contactid,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	if(!confirm("are you sure you want to delete this contact?"))
	{
		return;
	}
	let url = urlBase + '/DeleteContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if(jsonObject.error !== "")
				{
					return;
				}

				const updateForm = document.getElementById("updateContactForm");
				const currentUpdateId = document.getElementById("updateContactId").value;

				if (updateForm && updateForm.style.display === "block" && parseInt(currentUpdateId) === contactid) {

					document.body.appendChild(updateForm); 
					
					updateForm.style.display = "none";

					document.getElementById("updatefirstnameText").value = "";
					document.getElementById("updatelastnameText").value = "";
					document.getElementById("updateemailText").value = "";
					document.getElementById("updatephoneText").value = "";
					document.getElementById("updateaddressText").value = "";
					document.getElementById("updatenotesText").value = "";
					document.getElementById("updateContactId").value = "";
					document.getElementById("contactUpdateResult").innerHTML = "";
				}

				let contactDiv = document.getElementById("contact-" + contactid);

				if (contactDiv) {
					contactDiv.remove();
				}
				searchContact();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}

function prefillForm(id, firstName, lastName, email, phone, address, notes) {
	const form = document.getElementById("updateContactForm");

	// Hide the form first to reset it
	form.style.display = "none";

	// Populate the form
	document.getElementById("updatefirstnameText").value = firstName;
	document.getElementById("updatelastnameText").value = lastName;
	document.getElementById("updateemailText").value = email;
	document.getElementById("updatephoneText").value = phone;
	document.getElementById("updateaddressText").value = address;
	document.getElementById("updatenotesText").value = notes;
	document.getElementById("updateContactId").value = id;

	const contactDiv = document.getElementById("contact-" + id);

	// Move form below the correct contact and show it
	if (form && contactDiv) {
		contactDiv.insertAdjacentElement('afterend', form);
		form.style.display = "block";
		// form.scrollIntoView({ behavior: 'smooth' });
	}
}

function updateContact()
{
	let updateContactResult = document.getElementById("contactUpdateResult");
	updateContactResult.innerHTML = "";

	let firstName = document.getElementById("updatefirstnameText").value;
	let lastName = document.getElementById("updatelastnameText").value;
	let email = document.getElementById("updateemailText").value;
	let phone = document.getElementById("updatephoneText").value;

	let data = {
	firstName,
	lastName,
	email,
	phone,
	address: document.getElementById("updateaddressText").value,
	notes: document.getElementById("updatenotesText").value,
	userId: userId,
	contactId: document.getElementById("updateContactId").value
	};

	let errorMessage = "";

	if (firstName === "") {
		errorMessage += "First Name is required<br>";
	}
	if (lastName === "") {
		errorMessage += "Last Name is required<br>";
	}
	if (email === "") {
		errorMessage += "Email is required<br>";
	} else if (!email.includes("@")) {
		errorMessage += "Invalid email format<br>";
	}
	if (phone === "") {
		errorMessage += "Phone Number is required<br>";
	} else if (!phone.match(/^\d{3}-\d{3}-\d{4}$/)) {
		errorMessage += "Phone must be in format XXX-XXX-XXXX<br>";
	}

	updateContactResult.innerHTML = errorMessage;

	if (errorMessage !== "") {
	return;
	}

	let jsonPayload = JSON.stringify( data );

	let url = urlBase + '/UpdateContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if(jsonObject.error !== "")
				{
					document.getElementById("contactUpdateResult").innerHTML = "Contact couldn't be updated.";
					return;
				}
			
				const updateForm = document.getElementById("updateContactForm");
				updateForm.style.display = "none";

				document.getElementById("accessUIDiv").appendChild(updateForm);

				document.getElementById("updatefirstnameText").value = "";
				document.getElementById("updatelastnameText").value = "";
				document.getElementById("updateemailText").value = "";
				document.getElementById("updatephoneText").value = "";
				document.getElementById("updateaddressText").value = "";
				document.getElementById("updatenotesText").value = "";
				document.getElementById("updateContactId").value = "";
				document.getElementById("contactUpdateResult").innerHTML = "";

				searchContact(); 
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactUpdateResult").innerHTML = err.message;
	}
}

function Form()
{
	if(document.getElementById("contactForm").style.display === "block")
	{
		document.getElementById("contactForm").style.display = "none";
	} 
	else 
	{
		document.getElementById("contactForm").style.display = "block";
	}
}

function toggleContactDetails(contactId) {
	const details = document.getElementById(`details-${contactId}`);
	if (details.style.display === "none") {
		details.style.display = "block";
	} else {
		details.style.display = "none";
	}
}