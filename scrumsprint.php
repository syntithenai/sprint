<?php
/*
drop table if exists sprint;
create table sprint (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  sprintkey VARCHAR(255),
  sprinttitle VARCHAR(255),
  sprintdata VARCHAR(2048),
  lastsaved INTEGER
)
*/
$user='root';
$pass='';
$database='scrumsprint';
if (array_key_exists('list',$_GET) && strlen($_GET['list'])>0) {
	try {
		$limit='';
		if ($_GET['list']>0) {
			$limit=' LIMIT '.intval($_GET['list']);
		}
		$where='';
		$whereClauses=array();
		if (array_key_exists('sprint',$_GET) && strlen($_GET['sprint'])>0) {
			$whereClauses[]=" sprintkey!='".$_GET['sprint']."' ";
		}
		if (array_key_exists('title',$_GET) && strlen($_GET['title'])>0) {
			$whereClauses[]=" sprinttitle like '%".$_GET['title']."%' ";
		} 
		if (count($whereClauses)>0) {
			$where=' WHERE '.implode(" AND ",$whereClauses).' ';
		}
		$dbh = new PDO('mysql:host=localhost;dbname='.$database, $user, $pass);
		//echo "SELECT * from sprint order by sprinttitle ".$where.$limit;
		//echo "SELECT id,sprintkey,sprinttitle from sprint ".$where." order by id asc group by sprintkey ".$limit;
		//die();
		$rows=array();
		foreach($dbh->query("SELECT id,sprintkey,sprinttitle from sprint ".$where." group by sprintkey order by id asc ".$limit) as $row) {
			$rows[]=$row;
		}
		echo json_encode($rows);
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
} else if (array_key_exists('poll',$_GET) && strlen($_GET['poll'])>0 && array_key_exists('sprint',$_GET) && strlen($_GET['sprint'])>0) {
	//echo "poll ".$_GET['poll'].':'.$_GET['sprint'];
	try {
		//echo "SELECT * from sprint where sprintkey='".$_GET['sprint']."' and  lastsaved > '".intval($_GET['poll'])."' order by uid DESC LIMIT 1";
		//die();
		$undo='';
		if (array_key_exists('undo',$_GET) && intval($_GET['undo'])>0) {
			$undo=$undo.',';
		}
		$dbh = new PDO('mysql:host=localhost;dbname='.$database, $user, $pass);
		foreach($dbh->query("SELECT * from sprint where sprintkey='".$_GET['sprint']."' and  lastsaved > '".intval($_GET['poll'])."' order by id DESC LIMIT ".$undo."1") as $row) {
			echo $row['sprintdata'];
		}
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
// POST REQUEST - SAVE AND DELETE	
}  else if (array_key_exists('sprint',$_POST) && count($_POST['sprint'])>0) {
	// save sprint
	//echo "POSt<br>";
	//print_r($_POST['sprint']);
//	die();
	try {
		//print_r($sprint);
		//print_r(['dbconnect','mysql:host=localhost;dbname='.$database, $user, $pass]);
		$dbh = new PDO('mysql:host=localhost;dbname='.$database, $user, $pass);
		if (array_key_exists('delete',$_POST) && $_POST['delete']=='1' && array_key_exists('sprint',$_POST) && strlen($_POST['sprint'])>0) {
			$dbh->query("DELETE from sprint where sprintkey='".$_POST['sprint']."'");
		} else {
			$sprint=json_decode($_POST['sprint']);
			$time=time();
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
			$dbh->query($query);
			echo $time;
		}
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

