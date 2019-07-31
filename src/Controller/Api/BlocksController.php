<?php
namespace App\Controller\Api;

use App\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/blocks", name="api_blocks", options={"expose"=true})
 */
class BlocksController
{
    /**
     * @Route("/{id}", name="_open", methods={"GET"})
     *
     * @param int $id
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function openAction($id, Request $request)
    {
        return new JsonResponse([
            ['id' => 4, 'type' => 'text'],
            ['id' => 5, 'type' => 'image'],
            ['id' => 6, 'type' => 'video'],
            ['id' => 7, 'type' => 'text'],
            ['id' => 8, 'type' => 'text'],
        ]);
    }

    /**
     * @Route("/{id}", name="_save", methods={"POST"})
     *
     * @param int $id
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function saveAction($id, Request $request)
    {
        $blocks = $request->json->get('blocks');

        sleep(1);
        return new JsonResponse($blocks);
    }
}
