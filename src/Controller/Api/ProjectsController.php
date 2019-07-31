<?php
namespace App\Controller\Api;

use App\Entity\Block;
use App\Entity\Project;
use App\Http\Request;
use App\Repository\BlockRepository;
use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
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
        $projects = $projectRepository->findBy(['isTemplate' => false]);

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

/*        $blocks   = new ArrayCollection();
        $project2 = clone $project;
        $project2->setIsTemplate(true);
        foreach($project->getBlocks() as $block) {
            $b = clone $block;
            $b->setProject($project2);
            $blocks->add($b);
            $this->em->persist($b);
        }
        $project2->setName('Starter');
        $project2->setBlocks($blocks);
        $this->em->persist($project2);
        $this->em->flush();*/

/*        if ($project->getUser()->getId() !== $user->getId()) {
            // throw $this->createAccessDeniedException();
        }*/

        return $this->jsonEntityResponse($project);
    }

    /**
     * @Route("/{id}", name="_save", methods={"POST"})
     *
     * @param int               $id
     * @param Request           $request
     * @param ProjectRepository $projectRepository
     * @param BlockRepository   $blockRepository
     *
     * @return JsonResponse
     */
    public function saveAction($id, Request $request, ProjectRepository $projectRepository, BlockRepository $blockRepository)
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

        $blocks     = $request->json->get('blocks', []);
        $screenshot = $request->json->get('screenshot');
        if (!is_array($blocks)) {
            throw new BadRequestHttpException();
        }
        if (!$screenshot) {
            throw new BadRequestHttpException();
        }

        $sortOrder     = 0;
        $updatedBlocks = new ArrayCollection();
        foreach($blocks as $block) {
            if ($block['id'][0] === 'n') {
                $block = (new Block())
                    ->setType(Block::TYPES[$block['type']])
                    ->setProject($project)
                    ->setSortOrder($sortOrder++);
                $this->em->persist($block);
                $updatedBlocks->add($block);
            } else {
                $block = $blockRepository->findByID($block['id']);
                if (!$block) {
                    continue;
                }
                $block->setSortOrder($sortOrder++);
                $updatedBlocks->add($block);
            }
        }

        $project->setBlocks($updatedBlocks);
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

        $templates = [
            [
                'id'         => 't-1',
                'name'       => 'Blank',
                'blocks'     => [],
                'screenshot' => ''
            ]
        ];

        $projects = $repo->findBy(['isTemplate' => true]);
        foreach($projects as $project) {
            $templates[] = json_decode($this->serializeGroup($project), true);
        }

        return $templates;
    }
}
