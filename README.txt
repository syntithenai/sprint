SPRINT

This web application provides a drag and drop UI to help manage a todo list among a team of people.
It is inspired by the scrum methodology.

The interface manages Sprints with labels, dates, Users and Lists with Tasks and Groups of tasks.
It is possible to 
- associate users with a sprint and then further associate selected users with tasks.
- add a Task to the product backlog List
- add a Group to the product backlog List
- drag tasks onto groups or lists or after another task.
- double click to rename the sprint or a group or a task.
- drag story points onto tasks
- remove a story point or user or group from the sprint by dragging onto the trash.
- delete a task by dragging onto the trash


All changes to the current sprint are saved automatically to local storage so the application works without Internet access.

Where the server component is installed, sprints are saved automatically and the server is polled continuously for changes by other users to this sprint which are reflected in your UI allowing collaborative editing of the sprint.

When a sprint is complete, the "Next Sprint" button will create a new sprint with all items on the Done list removed and all other items moved to the Sprint Backlog list. Sprint dates will be updated so the new sprint starts on the old sprint end date and the current end date is set by the duration of the last sprint. Sprint title will be updated where there is an integer on the end isolated by a space to incremenent the number. If there is no number in the title, the number 1 will be appended to the old sprint and 2 appended to the new sprint.


TECHNICAL
index.html - defines the basic UI, the core lists and ties all the scripts together
scrumsprint.js - defines event bindings
sprint.sj - provides functions that operate on the sprint including serialisation/deserialisation of sprints between UI and storage.
scrumsprint.php - provides complete sample server implementation for mysql storage
RESTInterface.js - all calls to the server component are implemented here.

The JSON3 library is used for parsing.
Foundation and jquery and jquery UI are used.

BUGS
- user inside story point after drag ???
- Double check selectors on serialise/deserialise and add testing. MUST NOT LOSE LIST DATA.
	- currently eating users/story points

TODO
- REST API
- tabs for backlog/active - drag onto tab to move to TODO list
- label length limit for sprint item description with mouseover
- Edit group title, goal text by double clicking
	- Tickboxes in goal list to hide all group items 
	- Cross to remove group from sprint.
	- Auto remove group from sprint when no more items (but don't lose goal text)
- Dialog for new task and new group and new user
	- Select task, select group
- Next sprint - - archive sprint 
- total story points
- Group/goal render - checkbox disable, button delete group
- check task title on save/load - BEFOrE SAVE Avoid conflicts where task/group title updated elsewhere
- request hours worked when dropping into Done list
- checkbox next to sprint users to hide/show items by user

MAYBE
- User based interactions
   - collaborative story point average for many users
- Undo (safety feature?)
- meeting request button on sprint item
- reporting - burndown generation on "Next sprint"



