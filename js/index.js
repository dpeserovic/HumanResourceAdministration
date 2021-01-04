var usersArray = [];

oDbUsers.once('value', function(oServerResponse) 
{
	oServerResponse.forEach(function(oUsersSnapshot)
	{
		var sUsersKey = oUsersSnapshot.key;
		var users = oUsersSnapshot.val();
        var users = 
        {
            username: users.username,
			password: users.password
		};
		usersArray.push(users);
	});
});

console.log(usersArray);

function LogIn()
{
	var username = $('#username').val();
	var password = $('#password').val();
	isLoggedIn = false;
	if(username == '' || password == '')
	{
        alert('Enter username & password!');
	}
	else
	{
		usersArray.forEach(function(users)
		{
			if((username == users.username) && (password == users.password))
			{
                isLoggedIn = true;
			}
		});
		if(isLoggedIn)
		{
			window.open('human_resource_administration.html', '_self');
		}
		else
		{
			alert('Wrong credentials, try again!');
		}
	}
}

$('#username').keypress(function(event)
{
	if(event.which == 13)
	{
		$('#bLogIn').click();
	}
});
$('#password').keypress(function(event)
{
	if(event.which == 13)
	{
		$('#bLogIn').click();
	}
});