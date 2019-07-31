<?php
namespace App\Controller\Api;

use App\Entity\Project;
use App\Http\Request;
use App\Repository\ProjectRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/projects", name="api_projects", options={"expose"=true})
 */
class ProjectsController extends ApiController
{
    /**
     * @Route("/", name="_get", methods={"GET"})
     *
     * @param Request $request
     * @param ProjectRepository $projectRepository
     *
     * @return JsonResponse
     */
    public function getAction(Request $request, ProjectRepository $projectRepository)
    {
        $projects = $projectRepository->findAll();

        return $this->jsonEntityResponse($projects);
    }

    /**
     * @Route("/templates", name="_templates", methods={"GET"})
     *
     * @return JsonResponse
     */
    public function templatesAction()
    {
        return new JsonResponse($this->getTemplates());
    }

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
        $user = $this->getUser();
        if (!$user) {
            // throw $this->createAccessDeniedException();
        }
        $project = $projectRepository->findByID($id);
        if (!$project) {
            throw $this->createNotFoundException();
        }
/*        if ($project->getUser()->getId() !== $user->getId()) {
            // throw $this->createAccessDeniedException();
        }*/


/*
        $project = (new Project())
            ->setUser($user)
            ->setName('BlockStarter');
        $this->em->persist($project);

        $blocks = [
            ['id' => 4, 'type' => 2],
            ['id' => 5, 'type' => 1],
            ['id' => 6, 'type' => 1],
            ['id' => 7, 'type' => 3],
            ['id' => 8, 'type' => 1]
        ];
        foreach($blocks as $b) {
            $block = (new Block())
                ->setProject($project)
                ->setType($b['type']);
            $this->em->persist($block);
        }

        $this->em->flush();*/
        return $this->jsonEntityResponse($project);

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

        $projects = $projectRepository->findAll();

        return $this->jsonEntityResponse($projects);
    }

    /**
     * @return array
     */
    protected function getTemplates()
    {
        $repo = $this->getDoctrine()->getRepository(Project::class);
        $project = $repo->find(1);
        $blocks  = json_decode($this->serializeGroup($project->getBlocks()), true);

        return [
            [
                'id'         => 't-1',
                'name'       => 'Blank',
                'blocks'     => [],
                'screenshot' => ''
            ],
            [
                'id'         => 't-2',
                'name'       => 'Starter',
                'blocks'     => $blocks,
                'screenshot' => $project->getScreenshot()
            ]
        ];
    }
}
