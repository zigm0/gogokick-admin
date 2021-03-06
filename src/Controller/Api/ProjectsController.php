<?php
namespace App\Controller\Api;

use App\Entity\Block;
use App\Entity\Project;
use App\Entity\Watch;
use App\Http\ModelRequestHandler;
use App\Http\Request;
use App\Model\ProjectModel;
use App\Model\ProjectSettingsModel;
use App\Repository\BlockRepository;
use App\Repository\MediaRepository;
use App\Repository\ProjectRepository;
use App\Repository\WatchRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Exception;
use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;
use ZipArchive;

/**
 * @Route("/api/projects", name="api_projects", options={"expose"=true}, requirements={"id"="\d+"})
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
     * @Route("/public/{id}", name="_public", methods={"GET"})
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function publicAction($id)
    {
        $project = $this->getProject($id);
        if (!$project->isPublic()) {
            throw $this->createNotFoundException();
        }

        $project = $this->arrayEntityGroup($project);
        $uid = $project['user']['id'];

        unset($project['user']);
        unset($project['blocks']);
        unset($project['team']);
        if (!empty($project['image'])) {
            unset($project['image']['user']);
        }
        $project['user'] = ['id' => $uid];

        return new JsonResponse($project);
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
        if (!$project || !$project->hasTeamMember($user) || $project->isDeleted()) {
            throw $this->createNotFoundException();
        }

        $blocks = $project->getBlocks()->toArray();
        usort($blocks, function(Block $a, Block $b) {
            return ($a->getSortOrder() > $b->getSortOrder()) ? 1 : -1;
        });
        $project->setBlocks(new ArrayCollection($blocks));


        // $project->getUser();

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

        $project->setIsDeleted(true);
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
            if ($blockData['id'][0] !== 'n') {
                $block = $blockRepository->findByID($blockData['id']);
                if (!$block) {
                    throw new BadRequestHttpException('Unknown block.');
                }
            } else {
                $block = (new Block())
                    ->setProject($project)
                    ->setType($blockData['type']);
            }

            $block
                ->setSortOrder($sortOrder++)
                ->setDescription($blockData['description'])
                ->setHeight($blockData['height'])
                ->setWidth($blockData['width'])
                ->setWordCount($blockData['wordCount'])
                ->setAspectRatio($blockData['aspectRatio']);
            switch($block->getType()) {
                case Block::TYPE_TEXT:
                    $blockData['text'] = str_replace('<h1>', '', $blockData['text']);
                    $blockData['text'] = str_replace('</h1>', '', $blockData['text']);
                    $block->setText($blockData['text']);
                    $block->setIsHeadline($blockData['isHeadline']);
                    break;
                case Block::TYPE_IMAGE:
                    $block
                        ->setLink($blockData['link'])
                        ->setCaption($blockData['caption']);
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

            if ($blockData['id'][0] !== 'n') {
                $updatedBlocks->add($block);
                $removeBlocks = array_filter($removeBlocks, function(Block $item) use($block) {
                    return $item->getId() !== $block->getId();
                });
            } else {
                $this->em->persist($block);
                $updatedBlocks->add($block);
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
     * @Route("/blocks/{id}", name="_save_block", methods={"POST"})
     *
     * @param int                 $id
     * @param Request             $request
     * @param ModelRequestHandler $handler
     *
     * @return JsonResponse
     * @throws Exception
     */
    public function saveBlockAction($id, Request $request, ModelRequestHandler $handler)
    {
        $block  = $this->getBlock($id);
        $values = $request->json->all();
        if ($values['media']) {
            $values['media'] = $this->getMedia($values['media']['id']);
        }

        $handler->handleRequest($block, $values);
        $block->getProject()->setDateUpdated(new DateTime());
        $this->em->flush();

        return $this->jsonEntityResponse($block);
    }

    /**
     * @Route("/{id}/settings", name="_settings", methods={"POST"})
     *
     * @param int                 $id
     * @param Request             $request
     * @param MediaRepository     $mediaRepository
     * @param ModelRequestHandler $handler
     *
     * @return JsonResponse
     */
    public function settingsAction($id, Request $request, MediaRepository $mediaRepository, ModelRequestHandler $handler)
    {
        $project = $this->getProject($id);
        $model   = new ProjectSettingsModel();
        $handler->handleRequest($model, $request);

        foreach($model->getSocial() as $key => $value) {
            if (!in_array($key, ['twitter', 'facebook', 'youtube', 'instagram'])) {
                throw new BadRequestHttpException("Invalid social media key ${key}.");
            }
            if ($value && filter_var($value, FILTER_VALIDATE_URL) === false) {
                throw new BadRequestHttpException("Invalid social media url ${value}.");
            }
        }

        if ($model->getName()) {
            $project->setName($model->getName());
        }

        $project
            ->setIsPublic($model->isPublic())
            ->setSocial($model->getSocial())
            ->setSubtitle($model->getSubtitle());

        $image = $model->getImage();
        if ($image) {
            $media = $mediaRepository->findByID($image['id']);
            if ($media) {
                $project->setImage($media);
            }
        }

        $this->em->flush();

        return $this->jsonEntityResponse($project);
    }

    /**
     * @Route("/{id}/watch", name="_watch", methods={"POST"})
     *
     * @param int             $id
     * @param WatchRepository $repository
     *
     * @return JsonResponse
     */
    public function watchAction($id, WatchRepository $repository)
    {
        $project = $this->getProject($id);
        $user    = $this->getUser();
        if (!$user) {
            throw $this->createNotFoundException();
        }

        $watch = $repository->findByUserAndProject($user, $project);
        if ($watch) {
            $this->em->remove($watch);
        } else {
            $watch = (new Watch())
                ->setUser($user)
                ->setProject($project);
            $this->em->persist($watch);
        }

        $this->em->flush();

        $watching = [];
        $watches  = $repository->findByUser($user);
        $watches  = $this->arrayEntityGroup($watches);
        foreach($watches as $watch) {
            $project = $watch['project'];
            unset($project['user']);
            unset($project['blocks']);
            unset($project['team']);
            $watching[] = $project;
        }

        return new JsonResponse($watching);
    }

    /**
     * @Route("/watching", name="_fetch_watching", methods={"GET"})
     *
     * @param WatchRepository $repository
     *
     * @return JsonResponse
     */
    public function watchingAction(WatchRepository $repository)
    {
        $watching = [];
        $watches  = $repository->findByUser($this->getUser());
        $watches  = $this->arrayEntityGroup($watches);
        foreach ($watches as $watch) {
            $p = $watch['project'];
            unset($p['user']);
            unset($p['blocks']);
            unset($p['team']);
            $watching[] = $p;
        }

        return new JsonResponse($watching);
    }

    /**
     * @Route("/{id}/images", name="_images", methods={"GET"})
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function imagesAction($id)
    {
        $project = $this->getProject($id);
        $blocks  = $project->getBlocks()->toArray();
        usort($blocks, function(Block $a, Block $b) {
            return ($a->getSortOrder() > $b->getSortOrder()) ? 1 : -1;
        });
        $project->setBlocks(new ArrayCollection($blocks));

        $zipFile = tempnam(sys_get_temp_dir(), 'export');
        $guzzle  = new Client();
        $zip     = new ZipArchive();
        $zip->open($zipFile, ZipArchive::CREATE);

        $counter = 1;
        foreach($project->getBlocks() as $block) {
            if ($block->getType() === Block::TYPE_IMAGE && $block->getMedia()) {
                $url  = $block->getMedia()->getUrl();
                $path = parse_url($url, PHP_URL_PATH);
                $name = pathinfo($path, PATHINFO_BASENAME);

                $tmpFile = tempnam(sys_get_temp_dir(), 'export');
                $guzzle->get($url, ['sink' => $tmpFile]);
                $zip->addFile($tmpFile, 'ProjectPageImages/' . $counter . '-' . $name);
                $counter++;
            }
        }

        $zip->close();

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $project->getName())));
        $data = file_get_contents($zipFile);
        $path = sprintf('%s-%s.zip', $slug, date('Y-m-d-h-i'));
        $url  = $this->cdn->upload('downloads', $path, $data);

        return new JsonResponse(['url' => $url]);
    }
}
