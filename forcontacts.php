<?php
        $name = $_POST["userName"];
        $email = $_POST["userEmail"];
        $msg = $_POST["userMessage"];
        $adminmail = "joridesigns24@gmail.com";
        $priority = $_POST["priority"];

        if (isset($_POST["submit"])){
            if($priority != null){
                $msg = wordwrap($msg,70);
                mail($adminmail, $userName."'s ". $priority, $msg);
            }
        }
?>