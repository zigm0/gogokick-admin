<?php
namespace App\Controller\Api;

use App\Http\Request;
use App\Repository\PreviewRepository;
use DateTime;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/previews", name="api_previews", options={"expose"=false})
 */
class PreviewController extends ApiController
{
    /**
     * @Route("/project/{id}/{hash}", name="_open_project", methods={"GET"})
     *
     * @param int               $id
     * @param string            $hash
     * @param PreviewRepository $repo
     *
     * @return JsonResponse
     * @throws Exception
     */
    public function projectAction($id, $hash, PreviewRepository $repo)
    {
        $project = $this->getProject($id);
        $preview = $repo->findByProjectAndHash($project, $hash);
        if (!$preview) {
            throw $this->createNotFoundException();
        }

        $now = new DateTime();
        if ($preview->getDateExpires() < $now) {
            $this->em->remove($preview);
            $this->em->flush();
            throw $this->createNotFoundException();
        }

        return $this->jsonEntityResponse($project);
    }

    /**
     * @Route("/project/{id}", name="_save_project", methods={"POST"})
     *
     * @param int               $id
     * @param PreviewRepository $previewRepository
     * @param Request           $request
     *
     * @return JsonResponse
     */
    public function saveProjectAction($id, PreviewRepository $previewRepository, Request $request)
    {
        $project = $this->getProject($id);
        try {
            $preview = $previewRepository->create($project);
        } catch (Exception $e) {
            throw new BadRequestHttpException();
        }

        $url = sprintf(
            '%s/preview/project/%d/%s',
            $request->getSchemeAndHttpHost(),
            $project->getId(),
            $preview->getHash()
        );

        return new JsonResponse([
            'hash' => $preview->getHash(),
            'url'  => $url
        ]);
    }

    /**
     * @Route("/project/{id}/{hash}", name="_update_project", methods={"POST"})
     *
     * @param int               $id
     * @param string            $hash
     * @param Request           $request
     * @param PreviewRepository $previewRepository
     *
     * @return JsonResponse
     */
    public function updateProjectAction($id, $hash, Request $request, PreviewRepository $previewRepository)
    {
        $project = $this->getProject($id);
        $preview = $previewRepository->findByProjectAndHash($project, $hash);
        if (!$preview) {
            throw $this->createNotFoundException();
        }
        if ($preview->getProject()->getId() !== $project->getId()) {
            throw $this->createNotFoundException();
        }

        try {
            $expires = new DateTime($request->json->get('expires'));
            $preview->setDateExpires($expires);
            $this->em->flush();
        } catch (Exception $e) {
            throw new BadRequestHttpException();
        }

        return new JsonResponse([
            'expires' => $expires->format('Y-m-d H:i:s')
        ]);
    }
}
