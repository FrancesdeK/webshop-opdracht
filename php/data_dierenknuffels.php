<?php

include 'fetchers.php';
include 'converters.php';

$sql = "SELECT * FROM producten WHERE categorie='beer'";

$result = fetchDataFromSql($sql);
convertDataToJson($result);

?>