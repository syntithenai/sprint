<?php
include('config.php');
if (array_key_exists('list',$_GET) && strlen($_GET['list'])>0) {
	try {
		$limit='';
		if ($_GET['list']>0) {
			$limit=' LIMIT '.intval($_GET['list']);
		}
		$where='';
		$whereClauses=array();
		if (array_key_exists('groups',$_GET) && strlen($_GET['groups'])>0) {
			$whereClauses[]=" find_in_set(task_group_id,'".$_GET['groups']."') ";
			
			if (array_key_exists('title',$_GET) && strlen($_GET['title'])>0) {
				$whereClauses[]=" title like '%".$_GET['title']."%' ";
			} 
			if (count($whereClauses)>0) {
				$where=' WHERE '.implode(" AND ",$whereClauses).' ';
			}
			$dbh = new PDO('mysql:host=localhost;dbname='.$database, $user, $pass);
			echo "SELECT id,title,task_group_id from task ".$where." order by id asc ".$limit;
			//die();
			$rows=array();
			foreach($dbh->query("SELECT id,title,task_group_id from task ".$where." order by id asc ".$limit) as $row) {
				$rows[$row['sprintkey']]=$row;
			}
			echo json_encode($rows);
		}
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
// POST REQUEST - SAVE AND DELETE	
}  else if (array_key_exists('title',$_POST) && strlen($_POST['title'])>0) {
	try {
		$dbh = new PDO('mysql:host=localhost;dbname='.$database, $user, $pass);
		if (array_key_exists('delete',$_POST) && $_POST['delete']=='1' && array_key_exists('id',$_POST) && strlen($_POST['id'])>0) {
			$dbh->query("DELETE from task where id='".$_POST['id']."'");
		} else {
			$time=time();
			$groupUpdate='';
			if (array_key_exists('group',$_POST) && strlen($_POST['group'])>0) {
				$groupUpdate=",task_group_id='".$_POST['group']."'";
			}
			if (array_key_exists('id',$_POST) && strlen($_POST['id'])>0) {
				$query="update task set title='".$sprint->header."' ,sprintdata='".str_replace("\n","",json_encode($sprint))."',lastsaved='".$time."' WHERE sprintkey='".$sprint->id."'";
				$dbh->query($query);
			} else {
				
			}
			/*$found=false;
			foreach($dbh->query("SELECT * from sprint where sprintkey='".$sprint->id."'") as $row) {
				if (strlen($row['sprintdata'])>0) {
					$found=true;
				}
			}
			// UPDATE
			if ($found)  {
				$sprint->lastsaved=$time;
				$query="update sprint set sprinttitle='".$sprint->header."' ,sprintdata='".str_replace("\n","",json_encode($sprint))."',lastsaved='".$time."' WHERE sprintkey='".$sprint->id."'";
				$dbh->query($query);
		//		echo $query;
				echo $time;
			// INSERT
			} else {
				$sprint->lastsaved=$time;
				$query="insert into sprint (sprinttitle,sprintkey,sprintdata,lastsaved) values ('".$sprint->header."','".$sprint->id."','".str_replace("\n","",json_encode($sprint))."','".$time."') ";
				$dbh->query($query);
				echo $time;
			}*/
			$sprint->lastsaved=$time;
			$query="insert into sprint (sprinttitle,sprintkey,sprintdata,lastsaved) values ('".$sprint->header."','".$sprint->id."','".str_replace("\n","",json_encode($sprint))."','".$time."') ";
			//echo $query;
			$dbh->query($query);
			echo $time;
		}
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

