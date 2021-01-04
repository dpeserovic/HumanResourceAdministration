var oJobCategories = [];

oDbJobCategories.on('value', function(oServerResponse) 
{
	oServerResponse.forEach(function(oJobCategoriesSnapshot)
	{
		var sJobCategoriesKey = oJobCategoriesSnapshot.key;
		var jobCategories = oJobCategoriesSnapshot.val();
		var jobCategories =
		{
			key: sJobCategoriesKey,
			name: jobCategories.name,
			description: jobCategories.description
		};
		oJobCategories.push(jobCategories);
	});
});

oDbPersons.on('value', function(oServerResponse) 
{
	var oTablePersons = $('#table-persons');
	oTablePersons.find('tbody').empty();
	var n = 1;
	oServerResponse.forEach(function(oPersonSnapshot)
	{
		var sPersonKey = oPersonSnapshot.key;
		var oPerson = oPersonSnapshot.val();
		var sDropdown='<ul class="list-unstyled">';
		for(var i=0; i<oPerson.job_categories.length; i++)
		{
			var sCategoryName = GetJobCategory(oPerson.job_categories[i]);
			sDropdown+='<li id="' + oPerson.job_categories[i] + '">' + sCategoryName + '</li>';
		}
		sDropdown+='</ul>';
		var sRow = '<tr><td>' + n++ + '.</td><td>' + oPerson.name + '</td><td>' + oPerson.surname + '</td><td>' + oPerson.oib + '</td><td>' + oPerson.birth_year + '</td><td>' + oPerson.qualifications + '</td><td>' + oPerson.years_of_experience + '</td><td>'+sDropdown+'</td><td><button type="button" onclick="BiographyModal(\'' + sPersonKey + '\')" class="btn btn-info"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></button></td><td><button type="button" onclick="ModalEditPerson(\'' + sPersonKey + '\')" class="btn btn-primary"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></button></td><td><button onclick="DeletePerson(\'' + sPersonKey + '\')" type="button" class="btn btn-danger"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button></td></tr>';
		oTablePersons.find('tbody').append(sRow);
	});
	$(document).ready( function () {
	$('#table-persons').DataTable();
	});
});

function GetJobCategory(key)
{
	var sCategory='';
	oJobCategories.forEach(function(job_category)
	{	
		if(key == job_category.key)
		{
			sCategory = job_category.name;
		}
	});
	return sCategory;
}

function OpenAddPersonModal()
{
	$('#inptName').val('');
	$('#inptSurname').val('');
	$('#inptOIB').val('');
	$('#inptBirthYear').val('');
	$('#inptQualifications').val('');
	$('#inptYearsOfExperience').val('');

	var job_categories_wrapper = $('#job-categories-wrapper');
	job_categories_wrapper.empty();

	oJobCategories.forEach(function(job_category)
	{
		var checkbox = '<input type="checkbox" name="job_categories" value="' + job_category.key + '">' + job_category.name + '<br>';
		job_categories_wrapper.append(checkbox);
	});

	$('#txtBiography').val('');
	$('#add-person').modal('show');
}

function AddPerson() 
{
	var sName = $('#inptName').val();
	var sSurname = $('#inptSurname').val();
	var nOIB = $('#inptOIB').val();
	var nBirthYear = $('#inptBirthYear').val();
	var sQualifications = $('#inptQualifications').val();
	var nYearsOfExperience = $('#inptYearsOfExperience').val();
	var aJobCategories = [];

	$('input[name="job_categories"]:checked').each(function()
	{
		aJobCategories.push($(this).attr('value'));
	});

	var sBiography = $('#txtBiography').val();

	var oPerson = 
    {
        name: sName,
        surname: sSurname,
        oib: nOIB,
        birth_year: nBirthYear,
        qualifications: sQualifications,
        years_of_experience: nYearsOfExperience,
        job_categories: aJobCategories,
        biography: sBiography,
    };

    if
    (
    	sName == '' ||
    	sSurname == '' ||
    	nOIB == 0 ||
    	nBirthYear == 0 ||
    	sQualifications == '' ||
    	nYearsOfExperience == '' ||
    	aJobCategories.length == 0 ||
    	sBiography == ''
    )
    {
    	alert('Fill all inputs!');
    	return false;
    }

	var sKey = firebase.database().ref().child('persons').push().key;
    var oRecord = {};
    oRecord[sKey] = oPerson;
    oDbPersons.update(oRecord);
}

function BiographyModal(sPersonKey)
{
	var oPersonRef = oDb.ref('persons/' + sPersonKey);
	oPersonRef.once('value', function(oServerResponse)
	{
		var oPerson = oServerResponse.val();
		$('#showBiography').val(oPerson.biography);
		$('#show-biography').modal('show');
	});
}

function ModalEditPerson(sPersonKey)
{
	var oPersonRef = oDb.ref('persons/' + sPersonKey);
	oPersonRef.once('value', function(oServerResponse)
	{
		var oPerson = oServerResponse.val();
		$('#inptEditName').val(oPerson.name);
		$('#inptEditSurname').val(oPerson.surname);
		$('#inptEditOIB').val(oPerson.oib);
		$('#inptEditBirthYear').val(oPerson.birth_year);
		$('#inptEditQualifications').val(oPerson.qualifications);
		$('#inptEditYearsOfExperience').val(oPerson.years_of_experience);

		var job_categories = oPerson.job_categories.map(key => key.toString());
		var job_categories_wrapper_edit = $('#job-categories-wrapper-edit');
		job_categories_wrapper_edit.empty();
		
		oJobCategories.forEach(function(job_category)
		{
			var checked_text = '';
			if(job_categories.includes(job_category.key))
			{
				checked_text = "checked";
			}
			var checkbox = '<input '+checked_text+' type="checkbox" name="job_categories" value="' + job_category.key + '"> ' + job_category.name + '<br>';
			job_categories_wrapper_edit.append(checkbox);
		});

		$('#txtEditBiography').val(oPerson.biography);
		$('#bEditPerson').attr('onclick', 'SaveEditedPerson("'+sPersonKey+'")');
		$('#edit-person').modal('show');
	});
}

function SaveEditedPerson(sPersonKey)
{
	var oPersonRef = oDb.ref('persons/' + sPersonKey);

	var sPersonName = $('#inptEditName').val();
	var sPersonSurname = $('#inptEditSurname').val();
	var nPersonOIB = $('#inptEditOIB').val();
	var nPersonBirthYear = $('#inptEditBirthYear').val();
	var sPersonQualifications = $('#inptEditQualifications').val();
	var nPersonYearsOfExperience = $('#inptEditYearsOfExperience').val();

	var job_categories_wrapper = $('#job-categories-wrapper');
	job_categories_wrapper.empty();

	oJobCategories.forEach(function(job_category)
	{
		var checkbox = '<input type="checkbox" name="job_categories" value="' + job_category.key + '">' + job_category.name + '<br>';
		job_categories_wrapper.append(checkbox);
	});

	var aJobCategories = [];
	$('input[name="job_categories"]:checked').each(function()
	{
	    aJobCategories.push($(this).attr('value'));

	});

	var sPersonBiography = $('#txtEditBiography').val();

	if
    (
    	sPersonName == "" ||
    	sPersonSurname == "" ||
    	nPersonOIB == 0 ||
    	nPersonBirthYear == 0 ||
    	sPersonQualifications == "" ||
    	nPersonYearsOfExperience == "" ||
    	aJobCategories.length == 0 ||
    	sPersonBiography == ""
    )
    {
    	alert('Fill every field!')
    	return false;
    }

	var oPerson = 
	{
		'name': sPersonName, 
		'surname': sPersonSurname,
		'oib': nPersonOIB,
		'birth_year': nPersonBirthYear,
		'qualifications': sPersonQualifications,
		'years_of_experience': nPersonYearsOfExperience,
		'job_categories': aJobCategories,
		'biography': sPersonBiography
	};
	
	oPersonRef.update(oPerson);
}

function DeletePerson(sPersonKey)
{
	var oPersonRef = oDb.ref('persons/' + sPersonKey);
	oPersonRef.remove();
}

/*Job categories*/

oDbJobCategories.on('value', function(oServerResponse) 
{
	var oTableJobCategories = $('#table-job-categories');
	oTableJobCategories.find('tbody').empty();
	var n = 1;
	oServerResponse.forEach(function(oJobCategoriesSnapshot)
	{
		var sJobCategoriesKey = oJobCategoriesSnapshot.key;
		var oJobCategories = oJobCategoriesSnapshot.val();
		var sRow = '<tr><td>' + n++ + '.</td><td>' + oJobCategories.name + '</td><td>' + oJobCategories.description + '</td><td><button type="button" onclick="ModalEditJobCategory(\'' + sJobCategoriesKey + '\')" class="btn btn-primary"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></button></td><td><button onclick="DeleteJobCategory(\'' + sJobCategoriesKey + '\')" type="button" class="btn btn-danger"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button></td></tr>';
		oTableJobCategories.find('tbody').append(sRow);
	});

	$(document).ready( function () {
	    $('#table-job-categories').DataTable();
	});
});

function OpenAddJobCategoryModal()
{
	$('#inptName').val('');
	$('#txtDescription').val('');
}

function AddJobCategory() 
{
	var sName = $('#inptName').val();
	var sDescription = $('#txtDescription').val();

	if
    (
    	sName == '' ||
    	sDescription == ''
    )
    {
    	alert('Fill every field!')
    	return false;
    }

    var oJobCategories = 
    {
        name: sName,
        description: sDescription,
    };

	var sKey = firebase.database().ref().child('job_categories').push().key;
    var oRecord = {};
    oRecord[sKey] = oJobCategories;
    oDbJobCategories.update(oRecord);
}

function ModalEditJobCategory(sJobCategoriesKey)
{	
	var oJobCategoriesRef = oDb.ref('job_categories/' + sJobCategoriesKey);
	oJobCategoriesRef.once('value', function(oServerResponse)
	{
		var oJobCategories = oServerResponse.val();
		$('#inptEditName').val(oJobCategories.name);
		$('#txtEditDescription').val(oJobCategories.description);
		
		$('#bEditJobCategory').attr('onclick', 'SaveEditedJobCategory("'+sJobCategoriesKey+'")');

		$('#edit-job-category').modal('show');
	});
}

function SaveEditedJobCategory(sJobCategoriesKey)
{
	var oJobCategoriesRef = oDb.ref('job_categories/' + sJobCategoriesKey);

	var sName = $('#inptEditName').val();
	var sDescription = $('#txtEditDescription').val();

	var oJobCategories = 
	{
		'name': sName, 
		'description': sDescription
	};

	if
    (
    	sName == '' ||
    	sDescription == ''
    )
    {
    	alert('Fill every field!')
    	return false;
    }

	oJobCategoriesRef.update(oJobCategories);
}

function DeleteJobCategory(sJobCategoriesKey)
{
	var oJobCategoriesRef = oDb.ref('job_categories/' + sJobCategoriesKey);
	oJobCategoriesRef.remove();
}