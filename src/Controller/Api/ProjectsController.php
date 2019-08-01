<?php
namespace App\Controller\Api;

use App\Entity\Block;
use App\Entity\Project;
use App\Entity\User;
use App\Http\Request;
use App\Repository\BlockRepository;
use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use RuntimeException;
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
     * @param ProjectRepository $projectRepository
     *
     * @return JsonResponse
     */
    public function getAction(ProjectRepository $projectRepository)
    {
        $user = $this->getUser();
        if (!$user) {
            throw $this->createAccessDeniedException();
        }

        $projects = $projectRepository->findByUser($user);

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
     * @param ProjectRepository $projectRepository
     *
     * @return JsonResponse
     */
    public function openAction($id, ProjectRepository $projectRepository)
    {
        $user = $this->getUser();
        if (!$user) {
            throw $this->createAccessDeniedException();
        }
        $project = $projectRepository->findByID($id);
        if (!$project || $project->getUser()->getId() !== $user->getId()) {
            throw $this->createNotFoundException();
        }

        return $this->jsonEntityResponse($project);
    }

    /**
     * @Route("/{id}", name="_delete", methods={"DELETE"})
     *
     * @param int $id
     * @param ProjectRepository $projectRepository
     *
     * @return JsonResponse
     */
    public function deleteAction($id, ProjectRepository $projectRepository)
    {
        $user = $this->getUser();
        if (!$user) {
            throw $this->createAccessDeniedException();
        }
        $project = $projectRepository->findByID($id);
        if (!$project || $project->getUser()->getId() !== $user->getId()) {
            throw $this->createNotFoundException();
        }

        $this->em->remove($project);
        $this->em->flush();

        return $this->jsonEntityResponse($projectRepository->findByUser($user));
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
    public function saveAction(
        $id,
        Request $request,
        ProjectRepository $projectRepository,
        BlockRepository $blockRepository
    )
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

        $name       = $request->json->get('name');
        $blocks     = $request->json->get('blocks', []);
        $screenshot = $request->json->get('screenshot');
        if (!is_array($blocks)) {
            throw new BadRequestHttpException();
        }
        if (!$screenshot || !$name) {
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

        $project->setName($name);
        $project->setBlocks($updatedBlocks);
        $project->setScreenshot($this->saveScreenshot($user, $project, $screenshot));
        $this->em->flush();

        return $this->jsonEntityResponse($projectRepository->findByUser($user));
    }

    /**
     * @Route(name="_save_new", methods={"PUT"})
     *
     * @param Request           $request
     * @param ProjectRepository $projectRepository
     *
     * @return JsonResponse
     */
    public function saveNewAction(Request $request, ProjectRepository $projectRepository)
    {
        $user = $this->getUser();
        if (!$user) {
            throw $this->createAccessDeniedException();
        }

        $name       = $request->json->get('name');
        $blocks     = $request->json->get('blocks', []);
        $screenshot = $request->json->get('screenshot');
        if (!is_array($blocks)) {
            throw new BadRequestHttpException();
        }
        if (!$screenshot || !$name) {
            throw new BadRequestHttpException();
        }

        $project = (new Project())
            ->setUser($user)
            ->setName($name)
            ->setScreenshot('');
        $this->em->persist($project);

        $sortOrder = 0;
        $newBlocks = new ArrayCollection();
        foreach($blocks as $block) {
            $block = (new Block())
                ->setType(Block::TYPES[$block['type']])
                ->setProject($project)
                ->setSortOrder($sortOrder++);
            $this->em->persist($block);
            $newBlocks->add($block);
        }

        // Save project first because the screenshot filename needs the project id.
        $project->setBlocks($newBlocks);
        $this->em->flush();
        $project->setScreenshot($this->saveScreenshot($user, $project, $screenshot));
        $this->em->flush();

        return $this->jsonEntityResponse($projectRepository->findByUser($user));
    }

    /**
     * @param User    $user
     * @param Project $project
     * @param string $data
     *
     * @return string
     */
    protected function saveScreenshot(User $user, Project $project, $data)
    {
        list(, $data) = explode(';', $data);
        list(, $data) = explode(',', $data);
        $data = base64_decode($data);

        $dir = sprintf('%s/public/cdn/%d', $this->getParameter('kernel.project_dir'), $user->getId());
        if (!file_exists($dir)) {
            if (!mkdir($dir)) {
                throw new RuntimeException(
                    sprintf('Unable to make directory %s', $dir)
                );
            }
        }
        $filename = sprintf('%s/%d.png', $dir, $project->getId());
        if (!file_put_contents($filename, $data)) {
            throw new RuntimeException(
                sprintf('Unable to write file %s', $filename)
            );
        }

        return sprintf('/cdn/%d/%d.png', $user->getId(), $project->getId());
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
