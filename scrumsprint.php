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
		if (array_key_exists('sprint',$_GET) && strlen($_GET['sprint'])>0) {
			$where=" WHERE sprintkey!='".$_GET['sprint']."' ";
		}
		$dbh = new PDO('mysql:host=localhost;dbname='.$database, $user, $pass);
		//echo "SELECT * from sprint order by sprinttitle".$where.$limit;
		foreach($dbh->query("SELECT * from sprint ".$where." order by sprinttitle".$limit) as $row) {
			echo '<div class="row" >'.$row['sprinttitle'].'<a class="right button tiny dbdeletesprintbutton" href="#" data-id="'.$row['sprintkey'].'" >Delete</a> <a class="right button tiny dbloadsprintbutton" data-id="'.$row['sprintkey'].'" href="#"  >Load</a></div>';
		}
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
} else if (array_key_exists('poll',$_GET) && strlen($_GET['poll'])>0 && array_key_exists('sprint',$_GET) && strlen($_GET['sprint'])>0) {
	//echo "poll ".$_GET['poll'].':'.$_GET['sprint'];
	try {
		$dbh = new PDO('mysql:host=localhost;dbname='.$database, $user, $pass);
		foreach($dbh->query("SELECT * from sprint where sprintkey='".$_GET['sprint']."' and  lastsaved > '".intval($_GET['poll'])."' order by lastsaved DESC LIMIT 1") as $row) {
			echo $row['sprintdata'];
		}
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
	
}  else if (array_key_exists('sprint',$_POST) && count($_POST['sprint'])>0) {
	// save sprint
	//echo "POSt<br>";
	//print_r($_POST['sprint']);
//	die();
	try {
		$sprint=json_decode($_POST['sprint']);
		//print_r($sprint);
		//print_r(['dbconnect','mysql:host=localhost;dbname='.$database, $user, $pass]);
		$dbh = new PDO('mysql:host=localhost;dbname='.$database, $user, $pass);
		$found=false;
		//echo 'SELECT * from sprint where sprintkey='.$sprint->id;
		foreach($dbh->query("SELECT * from sprint where sprintkey='".$sprint->id."'") as $row) {
			if (strlen($row['sprintdata'])>0) {
				$found=true;
			}
		}
		// UPDATE
		$time=time();
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
		}
		
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

