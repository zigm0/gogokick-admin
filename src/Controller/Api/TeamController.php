<?php
namespace App\Controller\Api;

use App\Http\ModelRequestHandler;
use App\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/team", name="api_team", options={"expose"=true})
 */
class TeamController extends ApiController
{
    /**
     * @Route("/invite", name="_invite", methods={"POST"})
     *
     * @param Request $request
     * @param ModelRequestHandler $handler
     *
     * @return JsonResponse
     */
    public function inviteAction(Request $request, ModelRequestHandler $handler)
    {
        $values = $request->json->all();

        return new JsonResponse($values);
    }
}
