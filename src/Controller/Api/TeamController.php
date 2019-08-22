<?php
namespace App\Controller\Api;

use App\Http\ModelRequestHandler;
use App\Http\Request;
use App\Model\ProjectUserModel;
use App\Repository\ProjectUserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/team", name="api_team", options={"expose"=true}, requirements={"id"="\d+"})
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

    /**
     * @Route("/{id}", name="_update", methods={"POST"})
     *
     * @param int                   $id
     * @param Request               $request
     * @param ProjectUserRepository $repository
     * @param ModelRequestHandler   $handler
     *
     * @return JsonResponse
     */
    public function updateAction($id, Request $request, ProjectUserRepository $repository, ModelRequestHandler $handler)
    {
        $projectUser = $repository->findByID($id);
        if (!$projectUser) {
            throw $this->createNotFoundException();
        }

        $model = new ProjectUserModel();
        $handler->handleRequest($model, $request);

        $projectUser->setRoles($model->getRoles());
        $this->em->flush();

        return $this->jsonEntityResponse($projectUser);
    }
}
