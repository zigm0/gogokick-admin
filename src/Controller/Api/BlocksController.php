<?php
namespace App\Controller\Api;

use App\Entity\Block;
use App\Entity\Project;
use App\Http\Request;
use App\Repository\ProjectRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/blocks", name="api_blocks", options={"expose"=true})
 */
class BlocksController extends ApiController
{
    /**
     * @Route("/{id}", name="_open", methods={"GET"})
     *
     * @param int $id
     * @param Request $request
     * @param ProjectRepository $projectRepository
     *
     * @return JsonResponse
     */
    public function openAction($id, Request $request, ProjectRepository $projectRepository)
    {
/*        $user = $this->getUser();
        if (!$user) {
            // throw $this->createAccessDeniedException();
        }
        $project = $projectRepository->findByID($id);
        if (!$project) {
            throw $this->createNotFoundException();
        }
        if ($project->getUser()->getId() !== $user->getId()) {
            // throw $this->createAccessDeniedException();
        }

        return $this->jsonEntityResponse($project);*/

/*        $project = (new Project())
            ->setUser($user)
            ->setName('The Flappy Project');
        $this->em->persist($project);

        $blocks = [
            ['id' => 4, 'type' => 1],
            ['id' => 5, 'type' => 2],
            ['id' => 6, 'type' => 3],
            ['id' => 7, 'type' => 1],
            ['id' => 8, 'type' => 1]
        ];
        foreach($blocks as $b) {
            $block = (new Block())
                ->setProject($project)
                ->setType($b['type']);
            $this->em->persist($block);
        }

        $this->em->flush();*/


        return new JsonResponse([
            'name'   => 'The Flappy Project',
            'blocks' => [
                ['id' => 4, 'type' => 'text'],
                ['id' => 5, 'type' => 'image'],
                ['id' => 6, 'type' => 'video'],
                ['id' => 7, 'type' => 'text'],
                ['id' => 8, 'type' => 'text']
            ]
        ]);
    }

    /**
     * @Route("/{id}", name="_save", methods={"POST"})
     *
     * @param int               $id
     * @param Request           $request
     * @param ProjectRepository $projectRepository
     *
     * @return JsonResponse
     */
    public function saveAction($id, Request $request, ProjectRepository $projectRepository)
    {
        $user = $this->getUser();
        if (!$user) {
            throw $this->createAccessDeniedException();
        }
        $project = $projectRepository->findByID($id);
        if (!$project) {
            throw $this->createNotFoundException();
        }
        if ($project->getUser()->getId() !== $user->getId()) {
            throw $this->createAccessDeniedException();
        }

        $blocks     = $request->json->get('blocks');
        $screenshot = $request->json->get('screenshot');

/*        list(, $data) = explode(';', $screenshot);
        list(, $data)      = explode(',', $data);
        $data = base64_decode($data);*/

        $project->setScreenshot($screenshot);

        $this->em->flush();

        return new JsonResponse($blocks);
    }
}
