<?php

include 'fetchers.php';
include 'converters.php';

$sql = "SELECT * FROM producten WHERE categorie = 'gans'";

$result = fetchDataFromSql($sql);
convertDataToJson($result);

?>