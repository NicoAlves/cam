<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class FichierController extends AbstractController
{
    /**
     * @Route("/upload", name="upload")
     */
    public function upload()
    {
        $file = $_POST['fichier'];
        $chemin = $_POST['chemin'];
        $nomFichier = $_POST['nomFichier'].'.png';
        $fichier = base64_decode($file);

//        if (copy($nomFichier, $chemin)) {
//            echo "La copie $nomFichier du fichier a échoué...\n";
//        }
        file_put_contents($chemin.$nomFichier, $fichier);


        return new JsonResponse("file:" . $nomFichier . "chemin:". $chemin);
    }
}
