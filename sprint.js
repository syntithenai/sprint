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
	$('.sprintgoals').append('<div class="sprintgoal" data-id="'+id+'" ><b>'+a+'</b><span class="sprintgoaldescription" ></span></div>');;
	saveSprint();
}
function addSprintUser() {
	var a=prompt('User name');
	var newContent=$('<span class="sprintuser" data-id="'+ Math.random().toString(36).substr(2, 9)+'" >'+a+'</span>');
	$('.sprintusers').append(newContent);								
	bindDragDrop(newContent.parent());
	saveSprint();
}
/** 
 * when page is first loaded/reloaded pull from local storage 
 * then start polling for updates
 */
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
				$.ajax({ url: "scrumsprint.php?sprint="+$('.sprint').attr('data-id')+"&poll="+lastSaved}).success(function(data) {
					try {
						//var json=JSON.parse(data.replace("\n","")+';');
						if (data.responseText && data.responseText.length>0)  {
							var json=JSON3.parse(data.responseText.replace("\r","").replace("\n",""));
							if (json.id!=null && json.id.length>0) {
								console.log('restore');
								restoreSprint(json);
							}
						}
					} catch (e) {
						console.log(e);
					}
					poll();
			   }) ;
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
	RESTAPI().saveSprint(currentSprint).then(function(content) {
		console.log(['save complete',content]);
		// REST save sprint returns last saved timestamp
		$('.sprint').attr('data-lastsaved',content);	
		$('.undosprintbutton').attr('data-undo','');
		$('.redosprintbutton').attr('data-undo','');
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
				users+='<span class="sprintuser" data-id="'+key+'" >'+value+'</span>';
			});
			$('.sprintusers .sprintuser').remove();
			$('.sprintusers').append(users);
			bindDragDrop($('.sprintusers'));
		}
		if (typeof sprint.goals=='object') {
			var goals='';
			$.each(sprint.goals,function(key,value) {
				// ensure a space is rendered to allow double click editing
				var v=value.text;
				if ($.trim(v).length==0)  {
					v='&nbsp;';
				}
				var n=value.name;
				if ($.trim(n).length==0)  {
					n='&nbsp;';
				}
				
				goals+='<div class="sprintgoal row" data-id="'+key+'" ><b class="title small-2 columns">'+n+'</b><span class="sprintgoaldescription small-10 columns" >'+v+'</span></div>';
			});
			$('.sprintgoals').html('');
			$('.sprintgoals').append(goals);
			bindDragDrop($('.sprintgoals'));
			bindInlineEditing($('.sprintgoals'));
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
				var item={'text':$('.sprintitemdescription',this).text(),'storypoints':storyPoints,'users':users}
				console.log(['READ',item]);
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
	$('#loadsprintlist').remove();
	$('body').append($('<div id="loadsprintlist" class="reveal-modal" data-reveal aria-hidden="true" role="dialog"><label for="loadsprintlistsearchinput" ><input id="loadsprintlistsearchinput"  type="text" /></label><div id="loadsprintlistrows" ></div><a class="close-reveal-modal" >&#215;</a></div>'));
	$('#loadsprintlist').foundation('reveal','open');
	function refreshSprintList() {
		RESTAPI().searchSprints($('.sprint').attr('data-id'),$('#loadsprintlistsearchinput').val(),$('.sprint').attr('data-lastsaved')).then(function(res) {	
			var rendered='';
			JSON.parse(res).forEach(function(value) {
				rendered+='<div class="row" ><span class="sprintloadtitle">'+value['sprinttitle']+'</span><a class="right button tiny dbdeletesprintbutton" href="#" data-id="'+value['sprintkey']+'" >Delete</a> <a class="right button tiny dbloadsprintbutton" data-id="'+value['sprintkey']+'" href="#"  >Load</a></div>';
			});
			$('#loadsprintlistrows').html(rendered);
			$('#loadsprintlist .dbloadsprintbutton').click(function() {
				RESTAPI().loadSprint($(this).attr('data-id')).then( function(data) {
					console.log(['loaded',data]);
					try {
						if (data && data.length>0)  {
							var json=JSON3.parse(data.replace("\r","").replace("\n",""));
							if (json.id!=null && json.id.length>0) {
								restoreSprint(json);
							}
						}
					} catch (e) {
						console.log(e);
					}
					$('#loadsprintlist').foundation('reveal','close');
				});
			});
			$('#loadsprintlist .dbdeletesprintbutton').click(function() {
				var saveAs='ll'; //$(this).parent().data('filename');
				if (confirm('Really delete sprint '+$('span.sprintloadtitle',$(this).parent()).text() +' ?')) { 
					var button=this;
					RESTAPI().deleteSprint($(this).attr('data-id')).then(function(res) {
						$(button).parent().remove();
					}).fail(function() {
						alert('FAILED TO DELETE SPRINT');
					});
				}
			});
		});
	}
	var timeout;
	$('#loadsprintlistsearchinput').keyup(function() {
		clearTimeout(timeout);
		timeout=setTimeout(function() {
			refreshSprintList();
		}, 500);
	});
	refreshSprintList();
}
