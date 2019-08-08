<?php
namespace App\Controller\Api;

use App\Entity\Media;
use App\Http\Request;
use App\Media\CDNInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/media", name="api_media", options={"expose"=true})
 */
class MediaController extends ApiController
{

    /**
     * @Route("/upload", name="_upload", methods={"POST"})
     *
     * @param Request      $request
     * @param CDNInterface $cdn
     *
     * @return JsonResponse
     */
    public function uploadAction(Request $request, CDNInterface $cdn)
    {
        $file = $request->files->get('file');
        $system = $request->request->get('system');
        $project = $request->request->get('project');

        if (!$file || $file->getError()) {
            throw new BadRequestHttpException();
        }
        if (!$system || !$project) {
            throw new BadRequestHttpException();
        }

        $project = $this->getProject($project);
        $config  = $this->getParameter('cdn');
        if (!isset($config[$system])) {
            throw new BadRequestHttpException();
        }

        $ext  = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
        $data = file_get_contents($file->getPathName());
        $path = sprintf('%d/%d.%s', $project->getId(), microtime(true), $ext);
        $url  = $cdn->upload($system, $path, $data);

        $media = (new Media())
            ->setUrl($url);
        $this->em->persist($media);
        $this->em->flush();

        return $this->jsonEntityResponse($media);
    }
}
