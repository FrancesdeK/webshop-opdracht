<?php
function convertDataToJson($data) {
  echo '{"articles": ['; // start of json object

  // data binnen json object zetten
  $index = $data->num_rows;
  if ($index > 0) {
      while($row = $data->fetch_assoc()) {
          echo '{"id":' . $row["id"] . ',';
          echo '"name":"' . $row["name"] . '",';
          echo '"image":"' . $row["image"] . '",';
          echo '"price":' . $row["price"] . ',';
          echo '"type":"' . $row["categorie"] . '",';
          echo '"color":"' . $row["color"] . '"}';

          // zorgt ervoor dat de laatste regel geen komma krijgt
          $index--;
          if ($index > 0) {
              echo ',';
          }    
      }
  } else {
      echo "{}";
  }

  echo ']}'; // end of json object
}
?>