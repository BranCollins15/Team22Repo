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
	let lastname = document.getElementById("lastnameText").value;
	let email = document.getElementById("emailText").value;
	let phone = document.getElementById("phoneText").value;
	let address = document.getElementById("addressText").value;
	let notes = document.getElementById("notesText").value;

	if(firstname === "")
	{
		document.getElementById("contactAddResult").innerHTML = "required field";
		return;
	}
	if(lastname === "")
	{
		document.getElementById("contactAddResult").innerHTML = "required field";
		return;
	}
	if(email === "")
	{
		document.getElementById("contactAddResult").innerHTML = "required field";
		return;
	}
	if(phone === "")
	{
		document.getElementById("contactAddResult").innerHTML = "required field";
		return;
	}
	if(phone.length !== 12)
	{
		document.getElementById("contactAddResult").innerHTML = "required field";
		return;
	}
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
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
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
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) have been retrieved";
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
						<strong>${contact.FirstName} ${contact.LastName}</strong><br />
						Email: ${contact.Email}<br />
						Phone: ${contact.Phone}<br />
						Address: ${contact.Address}<br />
						Notes: ${contact.Notes}<br />
						<button onclick="deleteContact(${contactId})">Delete</button>
						<button onclick="prefillForm(${contactId}, '${contact.FirstName}', '${contact.LastName}', '${contact.Email}', '${contact.Phone}', '${contact.Address}', '${contact.Notes}')">Update</button>
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
				document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated";
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
	}
}