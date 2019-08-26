<?php
namespace App\Controller\Api;

use App\Entity\Block;
use App\Entity\Media;
use App\Entity\Project;
use App\Http\ModelRequestHandler;
use App\Http\Request;
use App\Model\ProjectModel;
use App\Repository\BlockRepository;
use App\Repository\MediaRepository;
use App\Repository\ProjectRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Exception;
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
            return new JsonResponse([]);
        }

        $projects = $projectRepository->findByTeamMember($user);

        return $this->jsonEntityResponse($projects);
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

        if ($id == '0') {
            $project = $projectRepository->findLastUpdatedByUser($user);
            if (!$project) {
                throw $this->createAccessDeniedException();
            }
        } else {
            $project = $projectRepository->findByID($id);
            if (!$project || !$project->hasTeamMember($user)) {
                throw $this->createNotFoundException();
            }
        }

        $project->getUser();

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

        return $this->jsonEntityResponse($projectRepository->findByTeamMember($user));
    }

    /**
     * @Route("/{id}", name="_save", methods={"POST"})
     *
     * @param int                 $id
     * @param Request             $request
     * @param ProjectRepository   $projectRepository
     * @param BlockRepository     $blockRepository
     * @param ModelRequestHandler $handler
     *
     * @return JsonResponse
     * @throws Exception
     */
    public function saveAction(
        $id,
        Request $request,
        ProjectRepository $projectRepository,
        BlockRepository $blockRepository,
        ModelRequestHandler $handler
    )
    {
        $project = $this->getProject($id);
        $model   = new ProjectModel();
        $handler->handleRequest($model, $request);

        $sortOrder     = 0;
        $removeBlocks  = $blockRepository->findByProject($project);
        $updatedBlocks = new ArrayCollection();

        foreach($model->getBlocks() as $blockData) {
            if ($blockData['id'][0] === 'n') {
                $block = (new Block())
                    ->setType($blockData['type'])
                    ->setProject($project)
                    ->setSortOrder($sortOrder++)
                    ->setDescription($blockData['description']);
                switch($block->getType()) {
                    case Block::TYPE_TEXT:
                        $block->setText($blockData['text']);
                        $block->setIsHeadline($blockData['isHeadline']);
                        break;
                    case Block::TYPE_IMAGE:
                        $block->setCaption($blockData['caption']);
                        if (!empty($blockData['media']) && !empty($blockData['media']['id'])) {
                            $media = $this->getMedia($blockData['media']['id']);
                            $block->setMedia($media);
                        }
                        break;
                    case Block::TYPE_VIDEO:
                        $block->setVideoUrl($blockData['videoUrl']);
                        break;
                    case Block::TYPE_AUDIO:
                        $block->setAudioUrl($blockData['audioUrl']);
                        break;
                }

                $this->em->persist($block);
                $updatedBlocks->add($block);
            } else {
                $block = $blockRepository->findByID($blockData['id']);
                if ($block) {
                    $block
                        ->setSortOrder($sortOrder++)
                        ->setDescription($blockData['description']);
                    switch($block->getType()) {
                        case Block::TYPE_TEXT:
                            $block->setText($blockData['text']);
                            $block->setIsHeadline($blockData['isHeadline']);
                            break;
                        case Block::TYPE_IMAGE:
                            $block->setCaption($blockData['caption']);
                            if (!empty($blockData['media']) && !empty($blockData['media']['id'])) {
                                $media = $this->getMedia($blockData['media']['id']);
                                $block->setMedia($media);
                            }
                            break;
                        case Block::TYPE_VIDEO:
                            $block->setVideoUrl($blockData['videoUrl']);
                            break;
                        case Block::TYPE_AUDIO:
                            $block->setAudioUrl($blockData['audioUrl']);
                            break;
                    }

                    $updatedBlocks->add($block);
                    $removeBlocks = array_filter($removeBlocks, function(Block $item) use($block) {
                        return $item->getId() !== $block->getId();
                    });
                }
            }
        }

        foreach($removeBlocks as $block) {
            $this->em->remove($block);
        }

        $project->setName($model->getName())
            ->setBlocks($updatedBlocks)
            ->setDateUpdated(new DateTime());

        $this->em->flush();

        $resp = [
            'project'  => $this->arrayEntityGroup($project),
            'projects' => $this->arrayEntityGroup($projectRepository->findByTeamMember($this->getUser()))
        ];

        return new JsonResponse($resp);
    }

    /**
     * @Route(name="_save_new", methods={"PUT"})
     *
     * @param Request             $request
     * @param ProjectRepository   $projectRepository
     * @param MediaRepository     $mediaRepository
     * @param ModelRequestHandler $handler
     *
     * @return JsonResponse
     */
    public function saveNewAction(
        Request $request,
        ProjectRepository $projectRepository,
        MediaRepository $mediaRepository,
        ModelRequestHandler $handler
    )
    {
        $user = $this->getUser();
        if (!$user) {
            throw $this->createAccessDeniedException();
        }

        $model = new ProjectModel();
        $handler->handleRequest($model, $request);

        if (!$model->getPictureURL()) {
            throw new BadRequestHttpException();
        }
        $media = $mediaRepository->findByUrl($model->getPictureURL());
        if (!$media) {
            throw new BadRequestHttpException();
        }

        $project = (new Project())
            ->setUser($user)
            ->setImage($media)
            ->setName($model->getName())
            ->setCampaignType($model->getCampaignType());
        $this->em->persist($project);

        $sortOrder = 0;
        $newBlocks = new ArrayCollection();
        foreach($model->getBlocks() as $b) {
            $block = (new Block())
                ->setType(Block::TYPES[$b['type']])
                ->setProject($project)
                ->setSortOrder($sortOrder++);
            switch($block->getType()) {
                case Block::TYPE_TEXT:
                    $block->setText($b['text']);
                    $block->setIsHeadline($b['isHeadline']);
                    break;
                case Block::TYPE_IMAGE:
                    $block->setCaption($b['caption']);
                    if (!empty($b['media']) && !empty($b['media']['id'])) {
                        $media = $this->getMedia($b['media']['id']);
                        $block->setMedia($media);
                    }
                    break;
                case Block::TYPE_VIDEO:
                    $block->setVideoUrl($b['videoUrl']);
                    break;
                case Block::TYPE_AUDIO:
                    $block->setAudioUrl($b['audioUrl']);
                    break;
            }
            $this->em->persist($block);
            $newBlocks->add($block);
        }

        $project->setBlocks($newBlocks);
        $this->em->flush();

        $resp = [
            'project'  => $this->arrayEntityGroup($project),
            'projects' => $this->arrayEntityGroup($projectRepository->findByTeamMember($user))
        ];

        return new JsonResponse($resp);
    }

    /**
     * @Route("/{id}/settings", name="_settings", methods={"POST"})
     *
     * @param int             $id
     * @param Request         $request
     * @param MediaRepository $mediaRepository
     *
     * @return JsonResponse
     */
    public function settingsAction($id, Request $request, MediaRepository $mediaRepository)
    {
        $project = $this->getProject($id);

        $name = $request->json->get('name');
        if ($name) {
            $project->setName($name);
        }

        $subtitle = $request->json->get('subtitle');
        $project->setSubtitle($subtitle);

        $image = $request->json->get('image');
        if ($image) {
            $media = $mediaRepository->findByID($image['id']);
            if ($media) {
                $project->setImage($media);
            }
        }

        $this->em->flush();

        return $this->jsonEntityResponse($project);
    }
}
