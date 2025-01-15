<?php

include 'fetchers.php';
include 'converters.php';

$sql = "SELECT * FROM producten WHERE gelegenheid IS NOT NULL";

$result = fetchDataFromSql($sql);
convertDataToJson($result);

?>