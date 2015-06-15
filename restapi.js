/*
* All server communications are handled in this class
* 
*/
 
RESTAPI= function() {
	var token='&token=thisisthetoken';
	var getToken =  function () {
		var promise=new $.Deferred();
		promise.resolve(token);
		return promise;
	};
    var getLoginUserId = function() {
		var promise=new $.Deferred();
		promise.resolve('stever');
		return promise;
	};
	var saveSprint = function(sprintData) {
		var promise=new $.Deferred();
		getToken().then(function() {
			$.post('scrumsprint.php',{'token': token, 'sprint':JSON.stringify(sprintData)}).done(function(response) {
				promise.resolve(response);
			}).fail(function(response) {
				promise.reject(response);
			}); 
		});
		return promise;
	};
	
	/**
	 * Delete sprint with sprintkey matching id parameter
	 */
	var deleteSprint = function(id) {
		var promise=new $.Deferred();
		$.post('scrumsprint.php',{'delete':'1','sprint':id}).success(function(response) {
			if (response.length>0) {
				promise.reject(response);
			} else {
				promise.resolve(response);
			}
		}).fail(function(response) {
			promise.reject(response);
		}); 
		return promise;
	}; 
	var searchSprints = function(currentSprint,title,lastSaved) {
		var promise=new $.Deferred();
		getToken(token).then(function() {
			var lastSavedText='&lastsaved=0';
			if (lastSaved.length>0) {
				lastSavedText='&lastsaved='+lastSaved;
			}
			var currentSprintText='';
			if (currentSprint && currentSprint.length>0) {
				currentSprintText='&sprint='+currentSprint;
			}
			$.get('scrumsprint.php?list=20'+currentSprintText+'&title='+title+lastSavedText+token).done(function(response) {
				promise.resolve(response);
			}).fail(function(response) {
				promise.reject(response);
			}); 
		});
		return promise;
	};
	var loadSprint = function(sprintKey,history) {
		var promise=new $.Deferred();
		var historyText='';
		if (history && parseInt(history)>0)  {
			historyText='&undo='+history;
		}
		getToken(token).then(function() {
			$.ajax({ url: "scrumsprint.php?poll=0&sprint="+sprintKey+historyText}).success(function(response) {
				promise.resolve(response);
			}).fail(function(response) {
				promise.reject(response);
			});
		});
		return promise;
	}

    var updateTask = function (id,title,group) {
    
    };
    var deleteTask = function (id) {
    
    };
    var searchTasks = function (title) {
		
	};
	var updateGroup = function (id,title) {
		
	};
	var searchGroups = function (title) {
		
	};
	var taskComplete = function (id,hours) {
		
	};
	return {saveSprint:saveSprint,deleteSprint:deleteSprint,searchSprints:searchSprints,loadSprint:loadSprint,getToken:getToken,updateTask:updateTask,deleteTask:deleteTask,searchTasks:searchTasks,updateGroup:updateGroup,searchGroups:searchGroups,taskComplete:taskComplete}
};

