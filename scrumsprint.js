

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
			drop: function( event, ui ) {
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
						$('.sprintuser[data-id="'+$(ui.draggable).attr('data-id')+'"]').remove();
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
			
		});
		// INLINE EDITING OF TEXT
		$( ".sprintgoal h3, .sprintgoal .sprintgoaldescription ,.sprintitem" ).disableSelection();
		$( ".sprintgoal h3, .sprintgoal .sprintgoaldescription ,.sprintitem .sprintitemdescription,.sprint h3.header" ).unbind('dblclick.sprint');
		$( ".sprintgoal h3, .sprintgoal .sprintgoaldescription ,.sprintitem .sprintitemdescription,.sprint h3.header" ).bind('dblclick.sprint',function(e) {
			console.log('dbl click');
			var res='';
			if ($(this).hasClass('sprintitemdescription')) {
				var sprint=$(this).parent();
				console.log(['soru',sprint]);
				var text=$(e.target).text();
				var input=$('<input type="text" class="small" value="'+text+'" />');
				$(this).before(input);
				$(this).hide();
				$('.storypoint',sprint).hide();
				input.focus();
				var desc=this;
				input.bind('blur',function() {
					console.log('restore vals');
					$(desc).text(input.val());
					input.hide();
					$(desc).show();
					$('.storypoint',sprint).show();
				});
			} else if ($(this).hasClass('header') && $(this).parent().parent().hasClass('sprint')) {
				$(this).attr('contentEditable','true');
				 this.contentEditable=true;
				// IE10 ?? $('#container *').prop('contentEditable', 'true');
				$(this).focus();
				$(this).blur(function() {
					saveSprint();
				});
				
			} else if ($(this).hasClass('sprintitem')) {
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
			}
		});

	}
			
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
	
});
