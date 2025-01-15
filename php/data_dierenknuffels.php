<?php

include 'fetchers.php';
include 'converters.php';

$sql = "SELECT * FROM producten WHERE categorie = 'gans' OR categorie='olifant' OR categorie='beer' OR categorie='egel' OR categorie='konijn' OR categorie='hond' OR categorie='schildpad' OR categorie='aap' OR categorie='rendier' OR categorie='vos'";

$result = fetchDataFromSql($sql);
convertDataToJson($result);

?>