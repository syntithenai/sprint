/*
* Copy and tweak this file for your tasks framework
*/
 
RESTInterface= function() {
	var token='';
	var getToken =  function () {
		
	};
    var getLoginUserId = function() {
		
	};
	var saveSprint = function(sprintKey,sprintTitle,sprintData) {
		
	};
    var searchSprints = function(title,lastSaved) {
		
	};
	var loadSprint = function(sprintKey) {
		
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
	var taskComplete = function (id) {
		
	};
	return {saveSprint:saveSprint,searchSprints:searchSprints,loadSprint:loadSprint,getToken:getToken,updateTask:updateTask,deleteTask:deleteTask,searchTasks:searchTasks,updateGroup:updateGroup,searchGroups:searchGroups,taskComplete:taskComplete}
};

