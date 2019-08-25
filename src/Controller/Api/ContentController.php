<?php
namespace App\Controller\Api;

use App\Repository\ContentRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/content", name="api_content", options={"expose"=true})
 */
class ContentController extends ApiController
{
    /**
     * @Route("/{name}", name="_index", methods={"GET"})
     *
     * @param string            $name
     * @param ContentRepository $repository
     *
     * @return JsonResponse
     */
    public function indexAction($name, ContentRepository $repository)
    {
        $content = $repository->findByName($name);
        if (!$content) {
            return new JsonResponse([
                '_error' => 'Not found'
            ]);
        }

        return $this->jsonEntityResponse($content);
    }
}
