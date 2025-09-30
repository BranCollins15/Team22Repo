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
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
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
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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
	//let newContact = document.getElementById("contactText").value;
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
		} //else {
			//firstnameError.innerText = ""; 
		//}
		if(lastname === "")
		{
			errorMessage = errorMessage + "Last Name is required<br>";
		}
		//else {
		//	lastnameError.innerText = ""; 
		//}
		if(email === "")
		{
			errorMessage = errorMessage + "Email is required<br>";
		}
		else if (!email.includes("@")) {
			errorMessage = errorMessage + "Invalid email format<br>";
		}
		//else {
		//	emailError.innerText = ""; 
		//}
		if(phone === "")
		{
			errorMessage = errorMessage + "Phone Number is required<br>";

		}
		/*if(phone.length !== 12)
		{
			document.getElementById("contactAddResult").innerHTML = "Phone Number isn't long enough";
			return;
		}*/
		else if (!phone.match(/^\d{3}-\d{3}-\d{4}$/)) {
			errorMessage = errorMessage + "Phone must be in format XXX-XXX-XXXX<br>";
		}//else {
			//phoneError.innerText = ""; 
		//}

	firstnameError.innerHTML = errorMessage;
	if(errorMessage !== "")
	{
		return;
	}
	//if (hasError) {
	//	return; // stop further processing since errors exist
	//}
	
	// add if check to make sure the format matches XXX-XXX-XXXX
	// also add if check to make sure email has @

	//console.log("UserId:", userId);
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
				//document.getElementById("contactSearchResult").innerHTML = "Contact(s) have been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				if( jsonObject.error !== "" )
					{		
						document.getElementById("contactSearchResult").innerHTML = "contact couldn't be found";
						return;
					}

				for( let i=0; i<jsonObject.results.length; i++ )
				{
					
				let contact = jsonObject.results[i];
				let contactId = contact.ContactID; // adjust key if needed
				
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
			

				document.getElementById("contactListDisplay").innerHTML = contactList;

				}
				
				//document.getElementsByTagName("p")[0].innerHTML = contactList;
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
	// let deleteContact = document.getElementById("contactText").value;
	// document.getElementById("contactDeleteResult").innerHTML = "";

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
					//document.getElementById("contactDeleteResult").innerHTML = "Contact couldn't be deleted.";
					return;
				}

				let contactDiv = document.getElementById("contact-" + contactid);
				if (contactDiv) {
					contactDiv.remove();
				}
				//document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";
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
	document.getElementById("updatefirstnameText").value = firstName;
	document.getElementById("updatelastnameText").value = lastName;
	document.getElementById("updateemailText").value = email;
	document.getElementById("updatephoneText").value = phone;
	document.getElementById("updateaddressText").value = address;
	document.getElementById("updatenotesText").value = notes;

	//document.getElementById("modalBackdrop").style.display = "block";
	// Show the form if hidden
	document.getElementById("updateContactForm").style.display = "block";

	// Optionally store the contact ID in a hidden field
	document.getElementById("updateContactId").value = id;
}


function updateContact()
{
	//let updateContact = document.getElementById("updateContactText").value;
	//document.getElementById("contactAddResult").innerHTML = "";
	//if(!updateContact) return;
	/*if(!contactid) 
	{
		document.getElementById("contactUpdateResult").innerHTML = "Missing contact ID.";
		return;
	}*/
	
	let data = {
		firstName : document.getElementById("updatefirstnameText").value,
		lastName : document.getElementById("updatelastnameText").value,
		email : document.getElementById("updateemailText").value,
		phone : document.getElementById("updatephoneText").value,
		address : document.getElementById("updateaddressText").value,
		notes : document.getElementById("updatenotesText").value,
		userId : userId,
		contactId : document.getElementById("updateContactId").value
	}

	//let tmp = {firstname: firstname, lastname: lastname, email: email, phone: phone};
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
				//document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated";
				searchContact(); 

				document.getElementById("updateContactForm").style.display = "none";
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
		//document.getElementById("modalBackdrop").style.display = "block";
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

/*function prefillForm(contactId, firstName, lastName, email, phone, address, notes) {
	document.getElementById("updateContactId").value = contactId;
	document.getElementById("updatefirstnameText").value = firstName;
	document.getElementById("updatelastnameText").value = lastName;
	document.getElementById("updateemailText").value = email;
	document.getElementById("updatephoneText").value = phone;
	document.getElementById("updateaddressText").value = address;
	document.getElementById("updatenotesText").value = notes;
  
	document.getElementById("modalBackdrop").style.display = "block";
	document.getElementById("updateContactForm").style.display = "block";
  }*/
  
	function hideUpdateForm() {
		document.getElementById("updateContactForm").style.display = "none";
		document.getElementById("modalBackdrop").style.display = "none";
	  }

	function hideAddForm(){
		document.getElementById("contactForm").style.display = "none";
		document.getElementById("modalBackdrop").style.display = "none";
	}
	  
  
