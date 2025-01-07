<?php

include 'fetchers.php';
include 'converters.php';

$sql = "SELECT * FROM producten DIT GAAT NOG FOUT";

$result = fetchDataFromSql($sql);
convertDataToJson($result);

?>