<?php
// regel is:
// http://localhost/webshop-opdracht/php/bestellen_stap2.php
//      ?account_id=1
//      &WinkelmandItem=%5B%7B%22artikel_id%22%3A%20%221%22%2C%20%22aantal%22%3A%20%226%22%7D%2C%20%7B%22artikel_id%22%3A%20%222%22%2C%20%22aantal%22%3A%20%224%22%7D%2C%20%7B%22artikel_id%22%3A%20%223%22%2C%20%22aantal%22%3A%20%222%22%7D%5D
//
//  JSON: [{"artikel_id": "1", "aantal": "6"}, {"artikel_id": "2", "aantal": "4"}, {"artikel_id": "3", "aantal": "2"}]
//  na url encoding: %5B%7B%22artikel_id%22%3A%20%221%22%2C%20%22aantal%22%3A%20%226%22%7D%2C%20%7B%22artikel_id%22%3A%20%222%22%2C%20%22aantal%22%3A%20%224%22%7D%2C%20%7B%22artikel_id%22%3A%20%223%22%2C%20%22aantal%22%3A%20%222%22%7D%5D
//
// Explanation of the Encoding:
// The special characters like [ and ] become %5B and %5D.
// The curly braces { and } become %7B and %7D.
// The quotes " are encoded as %22.
// The colon : becomes %3A.
// The commas , become %2C.
// The spaces become %20.
    $servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "database";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
        // header("Location: /bestelling-error.php");
    }

    // Account ID uit aanroep halen
    if (isset($_GET['account_id'])) {
        $account_id = $_GET['account_id'];
    } else {
        // ga naar pagina met foutmelding
        die("Niet alle data compleet");
        // header("Location: /bestelling-error.php");
    }

    // items die in de winkelmand zitten uit de url halen
    if (isset($_GET['WinkelmandItem'])) {  
        $jsonString = $_GET['WinkelmandItem'];        
        $winkelmandItems = json_decode($jsonString);
    } else {
        // ga naar pagina met foutmelding
        die("WinkelmandItem niet compleet");
        // header("Location: /bestelling-error.php");
    }

    // Bepalen van de winkelmand id
    $sql = "SELECT COALESCE(MAX(id), 0) as maxid FROM winkelmand";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $winkelmand_id = $row['maxid'] + 1;
    }
    else {
        $winkelmand_id = 1;
    }

    foreach ($winkelmandItems as $item) {
        $artikel_id = $item->artikel_id;
        $aantal = $item->aantal;

        // Opslaan winkelmand artikel
        $sql = "INSERT INTO winkelmand (id, artikel_id, aantal) 
        VALUES ('$winkelmand_id', '$artikel_id', '$aantal')";

        // Opslaan winkwagen artikel
        if ($conn->query($sql) !== TRUE) {
            // ga naar pagina met foutmelding
            die("stap 1 gaat fout");
            // header("Location: /bestelling-error.php");
        }
    }

    // Genereer een bestellingsnummer
    $bestelling_nummer = rand(100000, 999999);

    // Opslaan bestelling
    $sql = "INSERT INTO bestelling (bestellingnr, account_id, winkelmand_id)
    VALUES ('$bestelling_nummer', '$account_id', '$winkelmand_id')";

    // Opslaan winkwagen artikel
    if ($conn->query($sql) === TRUE) {
        // bevestig de bestelling met bestellingsnummer        
        echo "bestelling nummer: $bestelling_nummer";
    } else {
        // ga naar pagina met foutmelding
        die("stap 2 gaat fout");
        // header("Location: /bestelling-error.php");
    }

    $conn->close();

    // uiteindelijk iets van: http://localhost/webshop-opdracht/bevestiging.html?bestelling=$bestelling_nummer
    header("Location: /another-page.php");
?>