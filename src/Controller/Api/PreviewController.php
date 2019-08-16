<?php
namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/previews", name="api_previews", options={"expose"=false})
 */
class PreviewController extends ApiController
{
    /**
     * @Route("/screenshot/{id}", name="_screenshot")
     *
     * @param int $id
     *
     * @return Response
     */
    public function screenshotAction($id)
    {
        $project = $this->getProject($id);

        return $this->render('api/previews/project.html.twig', [
            'project' => $project
        ]);
    }
}
