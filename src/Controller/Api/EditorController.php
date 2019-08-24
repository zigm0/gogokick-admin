<?php
namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/editor", name="api_editor", options={"expose"=true})
 */
class EditorController extends ApiController
{
    /**
     * @Route("/load", name="_load")
     */
    public function loadAction()
    {
        $permissions = $this->getParameter('permissions');

        return new JsonResponse([
            'permissions' => $permissions
        ]);
    }
}
