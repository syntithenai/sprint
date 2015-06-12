function newSprint() {
	$('.sprintusers .sprintuser').remove();
	$('.sprintgoals .sprintgoal').remove();
	$('.sprintlists .sprintgroup, .sprintlists .sprintitem').remove();
	$('.sprint  h3.header').text('New Sprint');
	$('.sprint').attr('data-id',Math.random().toString(36).substr(2, 9));
	
	saveSprint();
}	
function addSprintTask() {
	var a=prompt('Task name');
	var newContent=$('<div class="sprintitem" data-id="'+ Math.random().toString(36).substr(2, 9)+'" >'+'<div class="sprintitemdescription">'+a+'</div></div>');
	$('.product_backlog > h3').after(newContent);
	bindDragDrop(newContent.parent());
	saveSprint();
}
function addSprintGroup() {
	var a=prompt('Group name');
	var id=Math.random().toString(36).substr(2, 9);
	var newContent=$('<div class="sprintgroup" data-id="'+ id+'" ><h3>'+a+'</h3></div>');
	$('.product_backlog > h3').after(newContent);								
	bindDragDrop(newContent.parent());
	$('.sprintgoals').append('<div class="sprintgoal" data-id="'+id+'" ><b>'+a+'</b><span class="sprintgoaldescription" >&nbsp;&nbsp;</span></div>');;
	saveSprint();
}
function addSprintUser() {
	var a=prompt('User name');
	var newContent=$('<div class="sprintuser" data-id="'+ Math.random().toString(36).substr(2, 9)+'" >'+a+'</div>');
	$('.sprintusers').append(newContent);								
	bindDragDrop(newContent.parent());
	saveSprint();
}

function initSprint() {
	console.log('init');
	try {
		var currentSprint=localStorage.getItem('currentsprint');
		if (currentSprint!=null)  {
			restoreSprint(JSON.parse(currentSprint));
		} else {
			newSprint();
		}
	} catch (e) {
		console.log(e);
	}
	// start polling
	var pollTimeout;
	function poll() {
		pollTimeout=setTimeout(function() {
			if ($('#polling').get(0).checked) {
				var lastSaved=$('.sprint').attr('data-lastsaved');
				$.ajax({ url: "scrumsprint.php?sprint="+$('.sprint').attr('data-id')+"&poll="+lastSaved, complete: function(data) {
					try {
						//var json=JSON.parse(data.replace("\n","")+';');
						if (data.responseText && data.responseText.length>0)  {
							var json=JSON3.parse(data.responseText.replace("\r","").replace("\n",""));
							if (json.id!=null && json.id.length>0) {
								//alert('restore');
								restoreSprint(json);
							}
						}
					} catch (e) {
						console.log(e);
					}
					poll();
			   } });
			}
		}, 3000);
	}
	$('#polling').click(function() {
		if (this.checked) {
			clearTimeout(pollTimeout);
			poll();
		}
	})
	poll();
}

function saveSprint() {
	var currentSprint=serialiseSprint();
	localStorage.setItem('currentsprint',JSON.stringify(currentSprint));
	console.log(['save',currentSprint]);
	$.post('scrumsprint.php',{'sprint':JSON.stringify(currentSprint)},function(content) {
		console.log(['loaded',content]);
		$('.sprint').attr('data-lastsaved',content);	
	});
}

function restoreSprint(sprint) {
	if (sprint!=null) {
		console.log(['restore',sprint]);
		var users='';
		$('.sprint').attr('data-id',sprint.id);
		$('.sprint').attr('data-lastsaved',sprint.lastsaved);
		$('.sprint h3.header').text(sprint.header);
		// dates
		$('#sprintstartdate').val(sprint.startdate);
		$('#sprintenddate').val(sprint.enddate);
		if (typeof sprint.users=='object') {
			$.each(sprint.users,function(key,value) {
				users+='<div class="sprintuser" data-id="'+key+'" >'+value+'</div>';
			});
			$('.sprintusers .sprintuser').remove();
			$('.sprintusers').append(users);
			bindDragDrop($('.sprintusers'));
		}
		var goals='';
		if (typeof sprint.goals=='object') {
			$.each(sprint.goals,function(key,value) {
				goals+='<div class="sprintgoal" data-id="'+key+'" ><b>'+value.name+'</b><span class="sprintgoaldescription" >'+value.text+'</span></div>';
			});
			$('.sprintgoals .sprintgoal').remove();
			$('.sprintgoals').append(goals);
			bindDragDrop($('.sprintgoals'));
		}
		if (typeof sprint.lists=='object') {
			$.each(sprint.lists,function(key,value) {
				var items='';
				if (typeof value.items=='object') {
					$.each(value.items,function(key,value) {
						var users='';
						if (value.users) {
							$.each(value.users,function(key,value) {
								users+='<div class="sprintuser" data-id="'+key+'" >'+value+'</div>';
							});
						}
						var storyPoint='';
						if (value.storypoints && value.storypoints>0) {
							storyPoint='<div class="storypoint button tiny right" >'+value.storypoints+'</div>';
						}
						items+='<div class="sprintitem" data-id="'+key+'" >'+storyPoint+'<div class="sprintitemdescription">'+value.text+'</div>'+users+'</div>';
					});
				}
				if (typeof value.groups=='object') {
					$.each(value.groups,function(key,value) {
						var groupItems='';
						if (typeof value.items=='object') {
							$.each(value.items,function(key,value) {
								var users='';
								if (value.users) {
									$.each(value.users,function(key,value) {
										users+='<div class="sprintuser" data-id="'+key+'" >'+value+'</div>';
									});
								}								
								var storyPoint='';
								if (value.storypoints && value.storypoints>0) {
									storyPoint='<div class="storypoint button tiny right" >'+value.storypoints+users+'</div>';
								}								
								groupItems+='<div class="sprintitem" data-id="'+key+'" >'+storyPoint+'<div class="sprintitemdescription">'+value.text+'</div></div>';
							});
						}
						var groupTitle=$('.sprintgoals .sprintgoal[data-id="'+key+'"] b').text();
						items+='<div class="sprintgroup" data-id="'+key+'" ><h3>'+groupTitle+'</h3>'+groupItems+'</div>';
					});
				}
				$('.sprintgroup,.sprintitem',$('.sprintlist.'+key)).remove();
				$('.sprintlist.'+key).append(items);
				bindDragDrop($('.sprintlist.'+key));
			});
		}
	}
}




function serialiseSprint() {
	var header=$('.sprint h3.header').text();
	var lastSaved=$('.sprint').attr('data-lastsaved');
		
	var sprint={'id':$('.sprint').attr('data-id'),'lastsaved':lastSaved,'startdate':$('#sprintstartdate').val(),'enddate':$('#sprintenddate').val(),header:header,'users':{},'goals':{},'lists':{}};
	$.each($('.sprintusers .sprintuser'),function() {
		var id=$(this).attr('data-id');
		var name=$(this).text();
		sprint.users[id]=name;
	});
	$.each($('.sprintgoals .sprintgoal'),function() {
		var id=$(this).attr('data-id');
		var name=$('b',this).text();
		var description=$('.sprintgoaldescription',this).text();		
		sprint.goals[id]={'name':name,'text':description};
	});
	$.each($('.sprintlist'),function() {
		var id=$(this).attr('data-id');
		var textCopy=$(this).clone(true);
		$('div,b,h3',textCopy).remove();
		var name=textCopy.text();
		var ungroupedItems={};
		$.each($('.sprintitem',this),function() {
			// ONLY UNGROUPED SPRINT ITEMS
	//		console.log(['item',$(this).parents('.sprintgroup').length]);
			if ($(this).parents('.sprintgroup').length==0) { 	
				var users={};
				$.each($('.sprintuser',this),function() {
					// dont need to store name text ??
					users[$(this).attr('data-id')]=$(this).text();
				});
				var storyPoints='';
				$.each($('.storypoint',this),function() {
					storyPoints=$(this).text();
				});
				var textCopy=$(this).clone(true);
				$('div,b,h3,span',textCopy).remove();
				var item={'text':textCopy.text(),'storypoints':storyPoints,'users':users};
				ungroupedItems[$(this).attr('data-id')]=item;
			}
		});
		// GROUPS
		var groups={};
		$.each($('.sprintgroup',this),function() {
			var items={};
			$.each($('.sprintitem',this),function() {
				var users={};
				$.each($('.sprintuser',this),function() {
					// dont need to store name text ??
					users[$(this).attr('data-id')]=$(this).text();
				});
				var storyPoints='';
				$.each($('.storypoint',this),function() {
					storyPoints=$(this).text();
				});

				var item={'text':$(this).text(),'storypoints':storyPoints,'users':users}
				items[$(this).attr('data-id')]=item;
			});
			var group={'items':items};
			groups[$(this).attr('data-id')]=group;
		});		
		sprint.lists[id]={'items':ungroupedItems,'groups':groups};
	});
	return sprint;
}
function loadSprintsWizard() {
	console.log('load sprints');
	var button=this;
	$.get('scrumsprint.php?list=20&sprint='+$('.sprint').attr('data-id'),function(res) {		
		$('#loadsprintlist').remove();
		$('body').append($('<div id="loadsprintlist" class="reveal-modal" data-reveal aria-hidden="true" role="dialog">'+res+'<a class="close-reveal-modal" aria-label="Close">&#215;</a></div>'));
		$('#loadsprintlist').foundation('reveal','open');
		$('#loadsprintlist .dbloadsprintbutton').click(function() {
			$.ajax({ url: "scrumsprint.php?poll=0&sprint="+$(this).attr('data-id'), complete: function(data) {
				try {
					if (data.responseText && data.responseText.length>0)  {
						var json=JSON3.parse(data.responseText.replace("\r","").replace("\n",""));
						if (json.id!=null && json.id.length>0) {
							restoreSprint(json);
						}
					}
				} catch (e) {
					console.log(e);
				}
				$('#loadsprintlist').foundation('reveal','close');
			} });
		});
		$('#loadsprintlist .dbdeletesprintbutton').click(function() {
			var saveAs='ll'; //$(this).parent().data('filename');
			if (confirm('Really delete database snapshot '+saveAs +' ?')) { 
				var button=this;
				
				$.get('dbmanager.php?deletesnapshot='+saveAs,function(res) {
					$(button).parent().remove();
				});
			}
		});
	});
}
