	var globIcoAddress = {
		/*'old-CoffeeMain': "0xfA171Cda184d815D20a318fCe9920AafdC04934e",
		'old-CoffeeUser': "0x26d723acFe39f93A9702592dD9371851f81cF59F",*/
		
		'SupplyChain': "0xa571E112188c5Df80FCB36A06e2bc3bdCfaDC15E",
		'User': "0x88b06b6df5c2FfA3b7EDB70421Da2Fb60cbf3632",
		'Database': "0x9e6562Fc3991cC158C94A3AD270B76a895f2e60C"
	};

	var globAdminAddress = "0x29B03EeF8735e41Ed2295644Cb9044B68cc14C36";
	var globMainContract = false;
	var globUserContract = false;
	var globCoinbase = false;	
	var globUserData = [];


	window.addEventListener('load', function() 
	{  
		$("#storageContractAddress").html(globIcoAddress.Database);
		$("#coffeeSupplychainContractAddress").html(globIcoAddress.SupplyChain);
		$("#userContractAddress").html(globIcoAddress.User);


		if (typeof web3 !== 'undefined') 
		{
		  web3 = new Web3(web3.currentProvider);
		  // web3 = new Web3("https://rinkeby.infura.io/8U0AE4DUGSh8lVO3zmma");
		} else {
		  // set the provider you want from Web3.providers
		  web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
		}
		
		getCurrentAccountAddress((address)=>{
			/*  To Restrict User in Admin Section */
			var currentPath = window.location.pathname;
			var tmpStack = currentPath.split("/");
			var currentPanel = tmpStack.pop();

			if(currentPanel == "admin.html")
			{
				console.log(address, globAdminAddress);
				if(address.toLowerCase() != globAdminAddress.toLowerCase()){
					window.location = "index.html";
					
				}
			}
		});

		initContract();

		updateLoginAccountStatus();
		/* setInterval(function () {
			updateLoginAccountStatus();
		}, 500); */
		
	});

	function initContract()
	{
		globMainContract = new web3.eth.Contract(SupplyChainAbi,globIcoAddress.SupplyChain);	
		// $(window).trigger("mainContractReady");

		globUserContract = new web3.eth.Contract(UserAbi,globIcoAddress.User);	
		// console.log(globUserContract, globMainContract);

		// $(window).trigger("userContractReady");
	}

	function updateLoginAccountStatus(){
		

		web3.eth.getAccounts(function(err,accounts){

			if(err){
				console.log('An error occurred '+ err);
				
			}else if(accounts.length == 0){
				sweetAlert('Error', 'Please login to MetaMask..!', 'error');
				$("#currentUserAddress").html("0x0000000000000000000000000000000000000000");
			}else{
				initAccountDetails();
			}
		});
	}

	function initAccountDetails(){
		/*
		* Get Current wallet account address
		*/
		getCurrentAccountAddress((address)=>{
			globCoinbase = address;	
			console.log(address);
			$("#currentUserAddress").html(globCoinbase);	

			$(window).trigger("coinbaseReady");		
		});
	}


	function getCurrentAccountAddress(callback){
		callback = callback || false;

		web3.eth.getCoinbase()
		.then((_coinbase)=>{
			callback(_coinbase);
		})
		.catch((err)=>{
			if(callback){
				callback(0);
			}
		})
	}

	function getUserDetails(contractRef,userAddress,callback){
		callback = callback || false;

		contractRef.methods.getUser(userAddress).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get User Details","error");
			callback(0);
		});
	}

	function getCultivationData(contractRef,batchNo,callback){
		console.log(batchNo);

		if(batchNo == undefined)
		{
			callback(0);
			return;
		}

		callback = callback || false;

		contractRef.methods.getAPIManufacturerDeets(batchNo).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			// sweetAlert("Error","Unable to get Cultivation Details","error");
			console.log("Error","Unable to get Cultivation Details",error);
			callback(0);
		});
	}

	function getFarmInspectorData(contractRef,batchNo,callback){

		if(batchNo == undefined)
		{
			callback(0);
			return;
		}


		callback = callback || false;

		contractRef.methods.getFormulatorDeets(batchNo).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get Farm Inspection Details","error");
			callback(0);
		});
	}

	function getHarvesterData(contractRef,batchNo,callback){

		if(batchNo == undefined)
		{
			callback(0);
			return;
		}


		callback = callback || false;

		contractRef.methods.getWholesalerDeets(batchNo).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get Harvesting Details","error");
			callback(0);
		});
	}

	function getExporterData(contractRef,batchNo,callback){

		if(batchNo == undefined)
		{
			callback(0);
			return;
		}

		callback = callback || false;

		contractRef.methods.getPharmacistDeets(batchNo).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get Exporting Details","error");
			callback(0);
		});
	}

	function getImporterData(contractRef,batchNo,callback){

		if(batchNo == undefined)
		{
			callback(0);
			return;
		}


		callback = callback || false;

		contractRef.methods.getCustomerDeets(batchNo).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get Importing Details","error");
			callback(0);
		});
	}

	function getProcessorData(contractRef,batchNo,callback){

		if(batchNo == undefined)
		{
			callback(0);
			return;
		}

		callback = callback || false;

		contractRef.methods.getCustomerDeets(batchNo).call()
		.then((result)=>{
			callback(result);
		})
		.catch((error)=>{
			sweetAlert("Error","Unable to get Processing Details","error");
			callback(0);
		});
	}

	function getUserEvents(contractRef)
	{
	    contractRef.getPastEvents('UserUpdate',{
	        fromBlock: 0 
	    }).then(function (events){

	        $("#tblUser").DataTable().destroy();
	        $("#tblUser tbody").html(buildUserDetails(events));
	        $("#tblUser").DataTable({
	        	"displayLength": 3,
	        	"order": [[ 1, "asc" ]]
	        });
	    }).catch((err)=>{
	    	console.log(err);
	    });
	}

	function buildUserDetails(events){
		
		var filteredUser = {};
		var isNewUser = false;
		/*filtering latest updated user record*/
		$(events).each(function(index,event){

			console.log("userevents",event);
			if(filteredUser[event.returnValues.user] == undefined)
			{
				filteredUser[event.returnValues.user] = {};
				filteredUser[event.returnValues.user].address = event.address;
				filteredUser[event.returnValues.user].designation = event.returnValues.designation;
				filteredUser[event.returnValues.user].user = event.returnValues.user;
				filteredUser[event.returnValues.user].name = event.returnValues.name;
				filteredUser[event.returnValues.user].contactNo = event.returnValues.contactNo;
				filteredUser[event.returnValues.user].blockNumber = event.blockNumber;
			}
			else if(filteredUser[event.returnValues.user].blockNumber < event.blockNumber)
			{
				filteredUser[event.returnValues.user].address = event.address;
				filteredUser[event.returnValues.user].designation = event.returnValues.designation;
				filteredUser[event.returnValues.user].user = event.returnValues.user;
				filteredUser[event.returnValues.user].name = event.returnValues.name;
				filteredUser[event.returnValues.user].contactNo = event.returnValues.contactNo;
				filteredUser[event.returnValues.user].blockNumber = event.blockNumber;
			}
		});

		var builtUser = [];
		for(tmpUser in filteredUser)
		{
			builtUser.push(filteredUser[tmpUser]);
		}

		/*build user Table*/
		$("#totalUsers").html(builtUser.length);
		return buildUserTable(builtUser);
	}

	function buildUserTable(globUserData){

		var tbody = "";
		var roleClass = "";

		$(globUserData).each(function(index,data){

			var role = data.designation;	

			if(role == 'API_MANUFACTURER'){
				roleClass = "info";
			}else if(role == 'FORMULATOR'){
				roleClass = "success";	
			}else if(role == 'WHOLESALER'){
				roleClass = "warning";
			}else if(role == 'PHARMACIST'){
				roleClass = "danger";
			}else if(role == 'PATIENT'){
				roleClass = "primary";
			}
{/* <td>`+data.contactNo+`</td> */}
			tbody += `<tr>
	                        <td>`+data.user+`</td>
	                        <td>`+data.name+`</td>
	                        
	                        <td><span class="label label-`+roleClass+` font-weight-100">`+role+`</span></td>
	                        <td><a href="javascript:void(0);" class="text-inverse p-r-10" data-toggle="tooltip" data-userAddress="`+data.user+`" onclick="openEditUser(this);" title="Edit"><i class="ti-marker-alt"></i></a> </td>
	                  </tr>`;
		});	

		return tbody;
	}

	function handleTransactionResponse(txHash,finalMessage)
	{
		var txLink = "https://rinkeby.etherscan.io/tx/" + txHash ;
	    var txLinkHref = "<a target='_blank' href='"+txLink+"'> Click here for Transaction Status </a>" ;

	    sweetAlert("Success", "Please Check Transaction Status here :  "+txLinkHref, "success");

	    $("#linkOngoingTransaction").html(txLinkHref);
	    $("#divOngoingTransaction").fadeIn();
	    /*scroll to top*/
	    $('html, body').animate({ scrollTop: 0 }, 'slow', function () {});
	}

	function handleTransactionReceipt(receipt,finalMessage)
	{
		$("#linkOngoingTransaction").html("");
	    $("#divOngoingTransaction").fadeOut();

	    // sweetAlert("Success", "Token Purchase Complete ", "success");
	    sweetAlert("Success", finalMessage, "success");
	}

	function handleGenericError(error_message)
	{
	    if(error_message.includes("MetaMask Tx Signature"))
	    {
	        sweetAlert("Error", "Transaction Refused ", "error");
	    }
	    else
	    {
	        // sweetAlert("Error", "Error Occured, Please Try Again , if problem persist get in touch with us. ", "error");
	        sweetAlert("Error", error_message, "error");
	    }

	}


	function changeSwitchery(element, checked) {
	  if ( ( element.is(':checked') && checked == false ) || ( !element.is(':checked') && checked == true ) ) {
	    element.parent().find('.switchery').trigger('click');
	  }
	}

	/*==================================Bootstrap Model Start=========================================*/

	function startLoader(){
		$(".preloader").fadeIn();
	}

	function stopLoader(){
		$(".preloader").fadeOut();
	}

	/*Set Default inactive*/
    $("#userFormClick").click(function(){
        $("#userForm").trigger('reset');
        changeSwitchery($("#isActive"),false);
        $("#userModelTitle").html("Add User");
        $("#imageHash").html('');
        $("#userFormModel").modal();    
    });

    /*Edit User Model Form*/
    function openEditUser(ref){
		var userAddress = $(ref).attr("data-userAddress");
		startLoader();
		getUserDetails(globUserContract,userAddress,function(result){
			$("#userWalletAddress").val(userAddress);
			$("#userName").val(result.name);
			$("#userContactNo").val(result.contactNo);
			$("#userProfileHash").val(result.profileHash);
			$('#userRoles').val(result.role).prop('selected', true);

			var profileImageLink = 'https://ipfs.io/ipfs/'+result.profileHash;
			var btnViewImage = '<a href="'+profileImageLink+'" target="_blank" class=" text-danger"><i class="fa fa-eye"></i> View Image</a>';
			$("#imageHash").html(btnViewImage);

			changeSwitchery($("#isActive"),result.isActive);
			$("#userModelTitle").html("Update User");
			stopLoader();
			$("#userFormModel").modal();
		});
	}

	// ipfs = window.IpfsApi('localhost', 5001);
	ipfs = window.IpfsApi('ipfs.infura.io', '5001', {protocol: 'https'})

	function handleFileUpload(event){
		const file = event.target.files[0];

	    let reader = new window.FileReader();
	    reader.onloadend = function () {
	       $("#userFormBtn").prop('disabled',true);
	       $("i.fa-spinner").show();
	        $("#imageHash").html('Processing......');	
	       saveToIpfs(reader)
	    }

	    reader.readAsArrayBuffer(file)
	}

	function saveToIpfs(reader){
		let ipfsId;

        const Buffer = window.IpfsApi().Buffer;
        const buffer = Buffer.from(reader.result);

        /*Upload Buffer to IPFS*/
        ipfs.files.add(buffer, (err, result) => { 
	        if (err) {
		          console.error(err)
		          return
			}
			
			var imageHash = result[0].hash;		

			var profileImageLink = 'https://ipfs.io/ipfs/'+imageHash;
			var btnViewImage = '<a href="'+profileImageLink+'" target="_blank" class=" text-danger"><i class="fa fa-eye"></i> View Image</a>';

	        $("#userProfileHash").val(imageHash);
	        $("#imageHash").html(btnViewImage);
	        
	        $("#userFormBtn").prop('disabled',false);
	        $("i.fa-spinner").hide();	
	    });
	}