<?php
    $html = file_get_contents('htmlgetter.html');
    libxml_use_internal_errors(true);
    $doc = new DOMDocument(); 
    $doc->loadHTML($html);
    //get the element you want to append to
    if(isset($_GET["button"])){
        $descBox = $doc->getElementById('addmorecrap');
        //create the element to append to #element1
        $appended = $doc->createElement('div');
        //actually append the element
        $descBox->appendChild($appended);
        header("Location:htmlgetter.html");
        exit;
    }
?>