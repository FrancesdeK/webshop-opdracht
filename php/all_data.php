<?php

include 'fetchers.php';
include 'converters.php';

$sql = "SELECT * FROM producten";

$result = fetchDataFromSql($sql);
convertDataToJson($result);
?>