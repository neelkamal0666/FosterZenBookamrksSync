<?php
require_once('./connect.php');

if(isset($_REQUEST['do'])){
                           if(isset( $_COOKIE['profile_id']))
                            {
                            
                              if(isset($_REQUEST['category']))$category= "'".$_REQUEST['category']."'";
                              if(isset($_REQUEST['access']))$access= "'".$_REQUEST['access']."'";
							  $userid1= $_COOKIE['profile_id'];
                              $url1= $_REQUEST['url'];
                              $title1= $_REQUEST['title'];
                              $access1=0;
                              if(isset($_REQUEST['category']))$category1= $_REQUEST['category'];
							   if(isset($_REQUEST['comment'])) { $comment= strip_tags($_REQUEST['comment']); } else { $comment='Value not reached';}
							   if(isset($_REQUEST['toread']))$toread= $_REQUEST['toread'];
                              if(isset($_REQUEST['access']))$access1= $_REQUEST['access'];
							  
							  $topics=str_replace('[','',$category1);
 $topics=str_replace('"]',' ',$topics);
$topics= str_replace('"',' ',$topics);
	$topics=str_replace(' tags ,',' ',$topics);
							$topics=str_replace(' tags ,',' ',$topics);
							
                            $tag=explode(' , ',$topics);
							for($i=0;$i<6;i++) {
							$tag[$i]=ltrim($tag[$i]);
                              $tag[$i]=rtrim($tag[$i]); 
							}
							                          
							                             $insert = "INSERT INTO bookmark_table set profile_id='".$userid1."',title='".$title1."',url='".$url1."',privacy='".$access1."',cat='".$tag[0]."',cat1='".$tag[1]."',cat2='".$tag[2]."',cat3='".$tag[3]."',cat4='".$tag[4]."',cat5='".$tag[5]."',comment='".$comment."'";
                                                  
                              $insertresults = mysql_query($insert);
							  if($insertresults) {
							   $link_id=mysql_insert_id();
										if($toread=='toread')
							{
							 $type = 'bookmark';

      	 $insert = "INSERT INTO table_read_later set profile_id='".$userid1."',link_id='".$link_id."',type='".$type."'";
		
	$result=mysql_query($insert);
	
							}		
							
							
										   
							 
							 $activity='bookmarked a link';
							 $tracker=$_REQUEST['url']; 
							 	$i=0;
							while($tag[$i]!='') {
							$sql_query="select sn from tableforTAG where name='".$tag[$i]."'";
							$res=mysql_query($sql_query);
							$row=mysql_fetch_array($res);
							if($row['sn']==''){
							                  $u=0;
											  $channel_pic='default.png';
							                  $insert_tag= "INSERT INTO tableforTAG set profile_id='".$u."',name='".$tag[$i]."',channel_pic='".$channel_pic."'";
                                              
                              $insert_tag_results = mysql_query($insert_tag);
							 
							                
							  $i++; } //end of while
						
							 
							   } else { echo 'You have already fostered this link'; }
                          
							
                           }
                            else echo "Please Login To Your Fosterzen Account";
                          }
else if(isset( $_COOKIE['profile_id']))
{
   $userid= $_COOKIE['profile_id'];
    if(isset($_REQUEST['data']))
    {

    $data=$_REQUEST['data'];
    echo $data;
    $list = explode("|||", $data);
    $len=count($list);
       for ($i=1; $i<$len; $i+=2)
        {
                              $title= "'".$list[$i]."'";
                              $url= "'".$list[$i+1]."'";
                              $insert = "INSERT INTO bookmark_table
                                                  (profile_id,url,title)
                                                      VALUES  ($userid,$url,$title)";
                              $insertresults = mysql_query($insert);
        }

    } else if(isset($_REQUEST['options']))
       {
         $default=0;
        $q="select name from TABLEForTag where profile_id=$userid OR profile_id=$default";
        $results = mysql_query($q)
            or die(mysql_error());

        $result="";

    while($row = mysql_fetch_array($results)){
                                           $result.=$row[0]."|||";
                                          }         

    echo $result; 
     } else {
      $q="select title,url from bookmark_table where profile_id=$userid order by date";
      $results = mysql_query($q)
            or die(mysql_error());

       if(isset($_REQUEST['sync']))
       {
       $result="";

        while($row = mysql_fetch_array($results)){
                                           $result.=$row[0]."|||".$row[1]."|||";
                                          } 

       echo $result;
      }
else
{

echo '<link type="text/css" href="style.css" rel="stylesheet">';
  
  echo '<div id="showbookmarks">';
echo "<ul>";
while($row = mysql_fetch_array($results)){
                                           echo '<li><a href="'.$row[1].'" target="_blank"'.'>'.$row[0].'</a></li>';
                                          } 
echo "</ul>";
echo '</div>';
}
}
}
else echo "Please login to your Fosterzen account";

    
?>				
