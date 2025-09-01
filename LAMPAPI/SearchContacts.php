<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "Database1");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("select FirstName, LastName, Email, Phone, Address from Contacts where (FirstName like ? or LastName like ? or Email like ? or Phone like ? or Address like ?) and UserID=?");
		$contactFirstName = "%" . $inData["searchFirstName"] . "%";
		$contactLastName = "%" . $inData["searchLastName"] . "%";
		$contactEmail = "%" . $inData["searchEmail"] . "%";
		$contactPhone = "%" . $inData["searchPhone"] . "%";
		$contactAddress = "%" . $inData["searchAddress"] . "%";
		$stmt->bind_param("ssssss", $contactFirstName, $contactLastName,  $contactEmail, $contactPhone, $contactAddress, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '"' . $row["FirstName"] . '"';
			$searchResults .= " ";
			$searchResults .= '"' . $row["LastName"] . '"';
			$searchResults .= " ";
			$searchResults .= '"' . $row["Email"] . '"';
			$searchResults .= " ";
			$searchResults .= '"' . $row["Phone"] . '"';
			$searchResults .= " ";
			$searchResults .= '"' . $row["Address"] . '"';

		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>