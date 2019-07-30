<?php
namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/blocks", name="api_blocks_")
 */
class BlocksController
{
    /**
     * @Route("/{id}", name="get")
     */
    public function getAction($id, Request $request)
    {
        sleep(1);
        return new JsonResponse([
            ['id' => 4, 'type' => 'text'],
            ['id' => 5, 'type' => 'image'],
            ['id' => 6, 'type' => 'video'],
            ['id' => 7, 'type' => 'text'],
            ['id' => 8, 'type' => 'text'],
        ]);
    }
}
