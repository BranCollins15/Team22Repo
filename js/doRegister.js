const urlBase = 'http://smallproject.shop/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doRegister()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let first = document.getElementById("firstname").value;
	let last = document.getElementById("lastname").value;
	let login = document.getElementById("user").value;
	let password = document.getElementById("password").value;

	let errorMessage = "";
	
	if(first === "")
	{
		errorMessage = errorMessage + "First Name Required<br>";
	}
	if(last === "")
	{
		errorMessage = errorMessage + "Last Name Required<br>";
	}
	if(login === "")
	{
		errorMessage = errorMessage + "Username Required<br>";
	}
	if(password === "")
	{
		errorMessage = errorMessage + "Password Required<br>";
	}
	document.getElementById("registerResult").innerHTML = errorMessage;
	if(errorMessage !== "")
	{
		return;
	}
	let tmp = {firstName:first,lastName:last,login:login,passwordHash:password};

	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/SignUp.' + extension;

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
					document.getElementById("registerResult").innerHTML = jsonObject.error;
					return;
				}
	
				window.location.href = "index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
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