<?php
namespace App\Controller\Api;

use App\Entity\Media;
use App\Http\Request;
use Exception;
use Gumlet\ImageResize;
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
     *
     * @return JsonResponse
     */
    public function uploadAction(Request $request)
    {
        $file    = $request->files->get('file');
        $system  = $request->request->get('system');
        $block   = $request->request->get('block');

        if (!$file || $file->getError()) {
            throw new BadRequestHttpException();
        }
        if (!$system) {
            throw new BadRequestHttpException();
        }
        $config = $this->getParameter('cdn');
        if (!isset($config[$system])) {
            throw new BadRequestHttpException();
        }

        $ext  = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
        $data = file_get_contents($file->getPathName());
        $path = sprintf('%d-%s.%s', microtime(true), uniqid(), $ext);
        $url  = $this->cdn->upload($system, $path, $data);

        $media = (new Media())
            ->setUrl($url)
            ->setSystem($system)
            ->setPath($path)
            ->setOrigFilename($file->getClientOriginalName())
            ->setUser($this->getUser());
        $this->em->persist($media);
        $this->em->flush();

        $media = $this->arrayEntityGroup($media);
        $media['block'] = $block;

        return new JsonResponse($media);
    }

    /**
     * @Route("/{id}", name="_replace", methods={"POST"})
     *
     * @param int     $id
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function replaceAction($id, Request $request)
    {
        $media = $this->getMedia($id);
        if ($media->getUser()->getId() !== $this->getUser()->getId()) {
            throw $this->createAccessDeniedException();
        }
        $data = $request->json->get('dataUrl');
        if (!$data) {
            throw new BadRequestHttpException();
        }

        $this->cdn->remove($media->getSystem(), $media->getPath());

        $data = explode(',', $data);
        $data = base64_decode($data[1]);
        $data = $this->resizeImage($data, $media->getSystem());
        $path = sprintf('%d-%s.png', microtime(true), uniqid());
        $url  = $this->cdn->upload($media->getSystem(), $path, $data);

        $media
            ->setUrl($url)
            ->setPath($path);
        $this->em->flush();

        return $this->jsonEntityResponse($media);
    }

    /**
     * @param string $data
     * @param string $system
     *
     * @return string
     */
    public function resizeImage($data, $system)
    {
        try {
            $tmp = tempnam(sys_get_temp_dir(), 'resize');
            file_put_contents($tmp, $data);

            switch($system) {
                case 'project_images':
                    $resize = new ImageResize($tmp);
                    $resize->resize(1024, 576, true);
                    $resize->save($tmp);
                    break;
                case 'avatars':
                    $resize = new ImageResize($tmp);
                    $resize->resize(200, 200, true);
                    $resize->save($tmp);
                    break;
            }

            $resized = file_get_contents($tmp);
            unlink($tmp);
        } catch (Exception $e) {
            return $data;
        }

        return $resized;
    }
}
