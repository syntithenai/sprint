drop table sprint;
create table sprint (
  id INTEGER  AUTO_INCREMENT PRIMARY KEY,
  sprintkey VARCHAR(255),
  sprinttitle VARCHAR(255),
  sprintdata VARCHAR(2048),
  lastsaved INTEGER
)
drop table task;
create table task (
  id INTEGER  AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  task_group_id INTEGER,
  lastsaved INTEGER
)
drop table if exists taskgroup;
create table taskgroup (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  lastsaved INTEGER
)
