<?php

namespace App\Controller;

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

        file_put_contents($chemin.$nomFichier, $fichier);

        $reponse = array($nomFichier, $chemin);
        return new JsonResponse($reponse);
    }
}
