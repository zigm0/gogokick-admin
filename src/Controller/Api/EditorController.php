<?php
namespace App\Controller\Api;

use App\Entity\Block;
use App\Http\ModelRequestHandler;
use App\Http\Request;
use App\Model\BlockSettingsModel;
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

    /**
     * @Route("/block/{id}/settings", name="_block_settings", methods={"POST"})
     *
     * @param int                 $id
     * @param Request             $request
     * @param ModelRequestHandler $handler
     *
     * @return JsonResponse
     */
    public function blockSettingsAction($id, Request $request, ModelRequestHandler $handler)
    {
        $block = $this->getBlock($id);
        $model = new BlockSettingsModel();
        $handler->handleRequest($model, $request);

        $block
            ->setWidth($model->getWidth())
            ->setHeight($model->getHeight())
            ->setIsLocked($model->isLocked());
        $this->em->flush();

        return $this->jsonEntityResponse($block);
    }

    /**
     * @param int $id
     *
     * @return Block|object
     */
    protected function getBlock($id)
    {
        $block = $this->em->getRepository(Block::class)->findByID($id);
        if (!$block) {
            throw $this->createNotFoundException();
        }

        return $block;
    }
}
