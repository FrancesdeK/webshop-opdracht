<?php
// regel is:
// http://localhost/webshop-opdracht/php/bestellen_stap1.php
//      ?naam=Johan
//      &adres=iets
//      &postcode=4152ee
//      &plaats=Leerdam
//      &rekeningnr=464836585475

    $servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "database";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Informatie uit aanroep halen
    if (isset($_GET['naam']) && isset($_GET['adres']) && isset($_GET['postcode']) && isset($_GET['plaats']) && isset($_GET['rekeningnr'])) {
        $name = $_GET['naam'];
        $adress = $_GET['adres'];
        $postcode = $_GET['postcode'];
        $place = $_GET['plaats'];
        $rekeningnr = $_GET['rekeningnr'];
    } else {
        // ga naar pagina met foutmelding
        die("Niet alle data compleet");
        exit();
    }

    // Opslaan account
    $sql = "INSERT INTO account (naam, adres, postcode, plaats, rekeningnr)
    VALUES ('$name', '$adress', '$postcode', '$place', '$rekeningnr')";


    if ($conn->query($sql) === TRUE) {
        // ga naar stap 2: bestellen_stap2.php
    } else {
        // ga naar pagina met foutmelding
    }

    $conn->close();
?>