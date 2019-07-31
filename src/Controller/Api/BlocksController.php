<?php
namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/blocks", name="api_blocks_", options={"expose"=true})
 */
class BlocksController
{
    /**
     * @Route("/{id}", name="open", methods={"GET"})
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
     * @Route("/{id}", name="save", methods={"POST"})
     */
    public function saveAction($id, Request $request)
    {
        sleep(1);
        return new JsonResponse('ok');
    }
}
