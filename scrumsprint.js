function errorMessage(message) {
	$('#errormessage').remove();
	$('body').append($('<div id="errormessage" class="reveal-modal" data-reveal aria-hidden="true" role="dialog"><h3>Error</h3><div class="message" >'+message+'</div><a class="close-reveal-modal" >&#215;</a></div>'));
	$('#errormessage').foundation('reveal','open');
	
};
function updateStoryPointsTotal() {
	var sum=0;
	console.log('updateStoryPointsTotal');
	$.each($('.sprintlists .storypoint'),function(key,value) {
		console.log(value);
		sum+=parseFloat($(value).text());
	});
	console.log(sum);		
	$('#totalstorypoints').text(sum.toFixed(1));
}
var bindInlineEditing = function(context) {
	$( ".sprintgoal b, .sprintgoal .sprintgoaldescription ,.sprintitem .sprintitemdescription,.sprint h3.header",context ).unbind('dblclick.sprint');
	$( ".sprintgoal b, .sprintgoal .sprintgoaldescription ,.sprintitem .sprintitemdescription,.sprint h3.header,.sprintuser",context ).bind('dblclick.sprint',function(e) {
		console.log('dbl click');
		var res='';
		if ($(this).hasClass('sprintitemdescription')) {
			var parent=$(this).parent();
			var text=$(e.target).text();
			var input=$('<textarea>'+text+'</textarea>');
			$(this).before(input);
			$(this).hide();
			$('.storypoint',parent).hide();
			input.focus();
			var desc=this;
			input.bind('blur',function() {
				console.log('restore vals');
				$(desc).text(input.val());
				RESTAPI().updateTask(parent.attr('data-id'),input.val(),null);
				input.hide();
				$(desc).show();
				$('.storypoint',parent).show();
				saveSprint();
			});
		} else if ($(this).hasClass('sprintuser')) {
			var parent=$(this).parent();
			var text=$(e.target).text();
			var user=$(this);
			var input=$('<input type="text"  width="20" value="'+text+'" />');
			$(this).before(input);
			$(this).hide();
			input.focus();
			var desc=this;
			input.bind('blur',function() {
				var cb=$('input[type="checkbox"]',desc);
				$(desc).text($.trim(input.val())).prepend(cb);
				$('.sprintuser[data-id="'+user.attr('data-id')+'"]').text(input.val());
				//RESTAPI().updateUser(parent.attr('data-id'),input.val(),null);
				input.hide();
				$(desc).show();
				saveSprint();
			});
		} else if ($(this).hasClass('sprintgoaldescription')) {
			var parent=$(this).parent();
			var text=$(e.target).text();
			var input=$('<textarea>'+text+'</textarea>');
			$(this).before(input);
			$(this).hide();
			input.focus();
			var desc=this;
			input.bind('blur',function() {
				$(desc).text($.trim(input.val()));
				RESTAPI().updateGroup(parent.attr('data-id'),input.val(),null);
				input.hide();
				$(desc).show();
				saveSprint();
			});
		} else if ($(this).parent().parent().hasClass('sprintgoal') && this.tagName=="B") {
			var parent=$(this).parent();
			var text=$.trim($(e.target).text());
			var input=$('<input  size="15"  value="'+text+'" />');
			$(this).before(input);
			$(this).hide();
			input.focus();
			var desc=this;
			input.bind('blur',function() {
				var v=input.val();
				console.log('blur'+v);
				if (v.length>0)  {
					$(desc).text(v);
					$('.sprintgroup[data-id="'+parent.attr('data-id')+'"] h3').text(v);
				} else {
					$(desc).text('&nbsp;');
					$('.sprintgroup[data-id="'+parent.attr('data-id')+'"] h3').text('&nbsp;');
				}
				//RESTAPI().updateTask(parent.attr('data-id'),input.val(),null);
				input.hide();
				$(desc).show();
				saveSprint();
			});
		} else if ($(this).hasClass('header') && $(this).parent().parent().parent().parent().hasClass('sprint')) {
			$(this).attr('contentEditable','true');
			 this.contentEditable=true;
			// IE10 ?? $('#container *').prop('contentEditable', 'true');
			$(this).focus();
			$(this).blur(function() {
				saveSprint();
			});
			
		}/* else if ($(this).hasClass('sprintitem')) {
			$('#sprintitemeditor').remove();
			res='<textarea id="sprintitemeditortextarea" data-id="'+$(this).attr('data-id')+'" >'+$(this).text()+'</textarea>';
			$('body').append($('<div id="sprintitemeditor" class="reveal-modal" data-reveal aria-hidden="true" role="dialog">'+res+'<a class="close-reveal-modal" aria-label="Close">&#215;</a><a class="button tiny savesprintitembutton" >Save</a></div>'));
			$('#sprintitemeditor').foundation('reveal','open');
			$('#sprintitemeditortextarea').focus();
			e.preventDefault()
			$('#sprintitemeditor .savesprintitembutton').click(function() {
				console.log('CLOSE');
				console.log($('#sprintitemeditortextarea').val());
				//console.log('.sprintitem[data-id="'+$('#sprintitemeditortextarea').attr('data-id')+'"] .sprintitemdescription');
				$('.sprintitem[data-id="'+$('#sprintitemeditortextarea').attr('data-id')+'"] .sprintitemdescription').text($('#sprintitemeditortextarea').val());
				$('#sprintitemeditor').foundation('reveal','close');
			});
		}*/
	});
}

function handleDrop( event, ui ) {
	var dropTarget=$(event.target);
	// allow for positioning scheme (foundation grid)
	$(ui.draggable).css('top','0');
	$(ui.draggable).css('left','0');
//		console.log('drop',dropTarget,ui.draggable);
	// DRAG STORY POINT
	if ($(ui.draggable).hasClass('storypoint')) {
		console.log('droptpoint');
		if ($(dropTarget).hasClass('sprintitem')) {
			console.log('on ite');
			$('.storypoint',dropTarget).remove();
			var newPoint=$(ui.draggable).clone(true,true);
			$(dropTarget).prepend(newPoint);
			newPoint.addClass('right');
			updateStoryPointsTotal();
			saveSprint();
		}
	// DRAG USER
	} else if ($(ui.draggable).hasClass('sprintuser')) {
//		console.log('user',dropTarget);
			
		if ($(dropTarget).hasClass('sprintitem')) {
	//		console.log('user onto item');
			if ($('.sprintitemusers',$(dropTarget)).length ==0) {
				$('.sprintuser',dropTarget).remove();
				$(dropTarget).append('<div class="sprintitemusers"></div>');
			}
			$('.sprintuser[data-id="'+$(ui.draggable).attr('data-id')+'"]',dropTarget).remove();
			var newUser=$('<div class="sprintuser" data-id="'+$(ui.draggable).attr('data-id')+'" >'+$(ui.draggable).text()+'</div>').draggable({'revert':'invalid'});
			$('.sprintitemusers',dropTarget).append(newUser);
			saveSprint();
		} else if ($(dropTarget).hasClass('sprintgroup')) {
			console.log('user onto item user onto group - apply to all in group after confirm');
			console.log('TODO');
		}
	// DRAG ITEM
	} else if ($(ui.draggable).hasClass('sprintitem')) {
		// ONTO ITEM
		if ($(dropTarget).hasClass('sprintitem')) {
	//		console.log('item onto item - draggable after target');
			// ITEM IN GROUP ?
			if (draggableParent.hasClass('sprintgroup')) {
				var groupName=$('h3',draggableParent).text();
				var groupId=draggableParent.attr('data-id');
		//		console.log(['GROUP',groupId,groupName]);
				// ADD TO EXISTING PARENT GROUP
				if ($(dropTarget).parents('.sprintgroup').length>0)  {
		//			console.log('item existing parent group');
					$(dropTarget).after(ui.draggable)
				// ADD TO EXISTING GROUP IN THIS LIST
				} else if ($('.sprintgroup[data-id="'+groupId+'"]',$(dropTarget)).length>0) {
		//			console.log('item existing group');
					$('.sprintgroup[data-id="'+groupId+'"]',$(dropTarget)).append($(ui.draggable));
				// CREATE THIS GROUP IN THIS LIST
				} else {
		//			console.log('item new group');
					var newGroup=$('<div class="sprintgroup" data-id="'+groupId+'" ><h3>'+groupName+'</h3></div>');
					newGroup.append($(ui.draggable));
					//$('h3',$(dropTarget).parent()).append(newGroup);
					$(dropTarget).after(newGroup);
					bindDragDrop(newGroup.parent());
				}
				// CLEANUP GROUP IN LIST IF NO MORE ITEMS
				if ($('.sprintitem',draggableParent).length==0) {
					draggableParent.remove();
				}
			// NO GROUP JUST DRAG ITEM
			} else {
				//console.log(['set draggable to here',this]);
				$(dropTarget).after($(ui.draggable));
			}
			
			if ($('.sprintitem',draggableParent).length==0 && draggableParent.hasClass('sprintgroup')) {
				draggableParent.remove();
			}
		// DRAG ONTO GROUP
		} else if ($(dropTarget).hasClass('sprintgroup')) {
			//console.log('item onto group ');
			$(dropTarget).append($(ui.draggable));
			if ($('.sprintitem',draggableParent).length==0 && draggableParent.hasClass('sprintgroup')) {
				draggableParent.remove();
			}
		// DRAG ONTO LIST
		} else if ($(dropTarget).hasClass('sprintlist')) {
			//console.log('item onto top of list ');
			//console.log(draggableParent);
			if (draggableParent.hasClass('sprintgroup')) {
				var groupName=$('h3',draggableParent).text();
				var groupId=draggableParent.attr('data-id');
				//console.log(['GROUP',groupId,groupName]);
				if ($('.sprintgroup[data-id="'+groupId+'"]',$(dropTarget)).length>0) {
					//console.log('item existing group');
					$('.sprintgroup[data-id="'+groupId+'"]',$(dropTarget)).append($(ui.draggable));
				} else {
					//console.log('item new group');
					var newGroup=$('<div class="sprintgroup" data-id="'+groupId+'" ><h3>'+groupName+'</h3></div>');
					newGroup.append($(ui.draggable));
					$(dropTarget).append(newGroup);
					bindDragDrop(newGroup.parent());
				}
				if ($('.sprintitem',draggableParent).length==0) {
					draggableParent.remove();
				}
			} else {
				//console.log(['set draggable to here',this]);
				$(this).children('h3').after($(ui.draggable));
			}
		}
	// DRAG GROUP
	} else if ($(ui.draggable).hasClass('sprintgroup')) {
		//console.log('drop group');
		// ONLY ONTO LIST
		if ($(dropTarget).hasClass('sprintlist')) {
			var groupName=$('h3',ui.draggable).text();
			var groupId=$(ui.draggable).attr('data-id');
			//console.log('.sprintgroup[data-id="'+groupId+'"]');
			if ($('.sprintgroup[data-id="'+groupId+'"]',dropTarget).length>0)  {
				if ($(draggableParent).attr('data-id')!=$(dropTarget).attr('data-id')) {
					$.each($('.sprintitem',ui.draggable),function() {
						$('.sprintgroup[data-id="'+groupId+'"]').append(this);
					});
					$(ui.draggable).remove();
					bindDragDrop($('.sprintgroup[data-id="'+groupId+'"]'));
				} else {
					console.log('ignore');
				}
			} else {
				$(dropTarget).append($(ui.draggable));
			}
		}
	}
	saveSprint();
	return false;
}



// BIND DRAG AND DROP TO DOM
function bindDragDrop(context) {
	$('.sprintgroup,.sprintitem,.sprintuser',context).draggable(
		{
			start: function(event,ui) {
				draggableParent=$(this).parent();
				draggableParentParent=$(this).parent().parent();
				console.log(['start',draggableParent]);
			},
			revert: true									
		}
	);
	$('.storypoints .storypoint').draggable({revert:true});
	$('.storypoints .storypoint').addClass('button').addClass('tiny');
	$( ".sprintlist,.sprintgroup,.sprintitem",context ).droppable({
		accept: '.sprintitem, .sprintgroup, .sprintuser,.storypoint',
		revert: 'invalid',
		greedy: 'true',
		tolerance: 'pointer',
		drop: handleDrop
		
	});
	// INLINE EDITING OF TEXT
	$( ".sprintgoal b, .sprintgoal .sprintgoaldescription ,.sprintitem" ).disableSelection();
	bindInlineEditing(context);
};
			
$(document).ready(function() {
	//$(document).foundation();
	// RENDERED ONCE ACTION BUTTONS
	$('.resetsprintbutton').click(function() {
		if (confirm('Really close this sprint and start a new one?')) {
			newSprint();
		}
	});
	
	$('.addtaskbutton').click(addSprintTask);
	$('.addgroupbutton').click(addSprintGroup);
	$('.addsprintuser').click(addSprintUser);
	$('.undosprintbutton').click(function() {
		console.log('undo');
		var undo=1;
		if (parseInt($(this).attr('data-undo'))>0) {
			undo=parseInt($(this).attr('data-undo'));
		}
		$(this).attr('data-undo',undo+1);
		$('.redosprintbutton').attr('data-undo',undo);
		RESTAPI().loadSprint($('.sprint').attr('data-id'),undo).then(function(data) {
			console.log('undo loaded');
			console.log(data);
			try {
				if (data && data.length>0)  {
					var json=JSON3.parse(data.replace("\r","").replace("\n",""));
					if (json.id!=null && json.id.length>0) {
						console.log('undo json OK, restore');
						restoreSprint(json);
					}
				}
			} catch (e) {
				console.log(e);
			}
		});
	});
	$('.redosprintbutton').click(function() {
		if (parseInt($(this).attr('data-undo'))>0) {
			undo=parseInt($(this).attr('data-undo'));
			RESTAPI().loadSprint($('.sprint').attr('data-id'),undo-1).then(function(data) {
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
			});
			$('.undosprintbutton').attr('data-undo',undo);
			$('.redosprintbutton').attr('data-undo',undo-1);
		}
		
	});
	// CACHE DRAGGABLE PARENT ON START (BEFORE DOM DETACH)
	var draggableParent=null;
	var draggableParentParent=null;
	
	// DROP ON TRASH 
	$('#trashcan').parent().droppable({
		accept: '.sprintitem,.sprintuser,.sprintgroup',
		revert: 'invalid',
		drop: function( event, ui ) {
			if (confirm('Really delete ?')) {
				$(ui.draggable).remove();
			}
			saveSprint();
		}
	});
	// DATE PICKER FOR SPRINT
	$('.datepicker').datepicker({dateFormat:"dd/mm/yy",onSelect:function() {saveSprint();}});
	// load sprint
	$('.loadsprintbutton').click(function() {
		loadSprintsWizard();
	});
	
	bindDragDrop($(document));
	initSprint();
	// keyboard bindings
	$(document).bind('keyup',function(e) {
		// ALT-t NEW task
		if (e.altKey==true && e.keyCode==84) {
			addSprintTask();
		// ALT-g NEW group
		} else if (e.altKey==true && e.keyCode==71) {
			addSprintGroup();
		// ALT-u NEW user
		} else if (e.altKey==true && e.keyCode==85) {
			addSprintUser();
		}
		
		console.log(e);
	});
	updateStoryPointsTotal();
});
