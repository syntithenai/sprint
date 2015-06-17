/*
* All server communications are handled in this class
* 
*/
 
RESTAPI= function() {
	var token='thisisthetoken';
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

/************************
 * SPRINTS
 ************************/
	var saveSprint = function(sprintData) {
		var promise=new $.Deferred();
		getToken().then(function() {
			$.post('sprint.php',{'token': token, 'sprint':JSON.stringify(sprintData)}).done(function(response) {
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
		getToken().then(function(token) {
			$.post('sprint.php',{'token':token,'delete':'1','sprint':id}).success(function(response) {
				if (response.length>0) {
					promise.reject(response);
				} else {
					promise.resolve(response);
				}
			}).fail(function(response) {
				promise.reject(response);
			}); 
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
			$.get('sprint.php?list=20'+currentSprintText+'&title='+title+lastSavedText+'&token='+token).done(function(response) {
				promise.resolve(response);
			}).fail(function(response) {
				promise.reject(response);
			}); 
		});
		return promise;
	};
	var pollSprint = function(sprintKey,lastSaved) {
		var promise=new $.Deferred();
		getToken(token).then(function() {
			var lastSavedText='&lastsaved=0';
			if (lastSaved.length>0) {
				lastSavedText='&poll='+lastSaved;
			}
			var sprint='';
			if (sprintKey && sprintKey.length>0) {
				sprint='&sprint='+sprintKey;
			}
			$.get('sprint.php?a=1'+sprint+lastSavedText+'&token='+token).done(function(response) {
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
			$.ajax({ url: "sprint.php?poll=0&sprint="+sprintKey+historyText+'&token='+tokem}).success(function(response) {
				promise.resolve(response);
			}).fail(function(response) {
				promise.reject(response);
			});
		});
		return promise;
	}
/************************
 * TASKS
 ************************/
    var newTask = function (title,group) {
    	var promise=new $.Deferred();
		getToken().then(function() {
			$.post('task.php',{'token': token, 'title':title, 'group':group}).done(function(response) {
				promise.resolve(response);
			}).fail(function(response) {
				promise.reject(response);
			}); 
		});
		return promise;
    };
    var updateTask = function (id,title,group) {
		var promise=new $.Deferred();
		getToken().then(function() {
			$.post('task.php',{'token': token, 'id':id ,'title':title, 'group':group}).done(function(response) {
				promise.resolve(response);
			}).fail(function(response) {
				promise.reject(response);
			}); 
		});
		return promise;
    };
    var deleteTask = function (id) {
		var promise=new $.Deferred();
		getToken().then(function() {
			$.post('task.php',{'token': token, 'id':id ,'delete':1}).done(function(response) {
				promise.resolve(response);
			}).fail(function(response) {
				promise.reject(response);
			}); 
		});
		return promise;
    };
    var searchTasks = function (title) {
		var promise=new $.Deferred();
		getToken().then(function() {
			$.get('task.php',{'token': token, 'id':id ,'title':title, 'group':group}).done(function(response) {
				promise.resolve(response);
			}).fail(function(response) {
				promise.reject(response);
			}); 
		});
		return promise;
	};
	var taskComplete = function (id,hours) {
		
	};
/************************
 * GROUPS
 ************************/
	var updateGroup = function (id,title) {
		
	};
	var searchGroups = function (title) {
		
	};
	return {pollSprint:pollSprint,saveSprint:saveSprint,deleteSprint:deleteSprint,searchSprints:searchSprints,loadSprint:loadSprint,getToken:getToken,updateTask:updateTask,deleteTask:deleteTask,searchTasks:searchTasks,updateGroup:updateGroup,searchGroups:searchGroups,taskComplete:taskComplete}
};

