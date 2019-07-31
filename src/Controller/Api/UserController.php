<?php
namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/user", name="api_user", options={"expose"=true})
 */
class UserController extends ApiController
{
    /**
     * @Route("/me", name="_me", methods={"GET"})
     *
     * @return JsonResponse
     */
    public function meAction()
    {
        $user = $this->getUser();

        return $this->jsonEntityResponse($user);
    }
}
