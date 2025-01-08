<?php
// regel is:
// http://localhost/webshop-opdracht/php/bestellen_stap2.php?account_id=1...????

    class WinkelmandItem {
        public $artikel_id;
        public $aantal;

        public function __construct($artikel_id, $aantal) {
            $this->artikel_id = $artikel_id;
            $this->aantal = $aantal;
        }
    }

    
    if (isset($_GET['WinkelmandItem'])) {  
        $jsonString = $_GET['WinkelmandItem'];        
        $winkelmandItems = json_decode($jsonString);
    } else {
        // ga naar pagina met foutmelding
        die("WinkelmandItem niet compleet");
        exit();
    }


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
    if (isset($_GET['account_id'])) {
        $account_id = $_GET['account_id'];
    } else {
        // ga naar pagina met foutmelding
        die("Niet alle data compleet");
        exit();
    }

    // Opslaan winkelmand
    $sql = "SELECT COALESCE(MAX(id), 1) as maxid FROM winkelmand";
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
        echo "opslaan artikel: $artikel_id, aantal: $aantal <br/>";

        // Opslaan winkelmand artikel
        $sql = "INSERT INTO winkelmand (id, artikel_id, aantal) 
        VALUES ('$winkelmand_id', '$artikel_id', '$aantal')";

        // Opslaan winkwagen artikel
        if ($conn->query($sql) !== TRUE) {
            // ga naar pagina met foutmelding
            die("stap 1 gaat fout");
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
        $conn->query("DELETE FROM winkelmand WHERE id = '$winkelmand_id'");
        die("stap 2 gaat fout");
    }

    $conn->close();
?>