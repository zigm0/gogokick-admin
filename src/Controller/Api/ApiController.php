<?php
namespace App\Controller\Api;

use App\Controller\Controller;
use App\Entity\Block;
use App\Entity\Media;
use App\Entity\Project;
use App\Media\CDNInterface;
use App\Service\ScreenshotService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Class ApiController
 */
class ApiController extends Controller
{
    /**
     * @var SerializerInterface
     */
    protected $serializer;

    /**
     * @var CDNInterface
     */
    protected $cdn;

    /**
     * @var ScreenshotService
     */
    protected $screenshotService;

    /**
     * Constructor
     *
     * @param EntityManagerInterface   $em
     * @param EventDispatcherInterface $eventDispatcher
     * @param SerializerInterface      $serializer
     * @param CDNInterface             $cdn
     * @param ScreenshotService        $screenshotService
     */
    public function __construct(
        EntityManagerInterface $em,
        EventDispatcherInterface $eventDispatcher,
        SerializerInterface $serializer,
        CDNInterface $cdn,
        ScreenshotService $screenshotService
    )
    {
        parent::__construct($em, $eventDispatcher);
        $this->serializer        = $serializer;
        $this->cdn               = $cdn;
        $this->screenshotService = $screenshotService;
    }

    /**
     * @param object $entity
     * @param string $group
     *
     * @return string
     */
    public function serializeGroup($entity, $group = 'web')
    {
        return $this->serializer->serialize($entity, 'json', ['groups' => $group]);
    }

    /**
     * @param object $entity
     * @param int    $statusCode
     * @param array  $headers
     *
     * @return JsonResponse
     */
    public function jsonEntityResponse($entity, $statusCode = 200, $headers = [])
    {
        $json = $this->serializeGroup($entity);

        return new JsonResponse($json, $statusCode, $headers, true);
    }

    /**
     * @param object $entity
     * @param string $group
     *
     * @return array
     */
    public function arrayEntityGroup($entity, $group = 'web')
    {
        $json = $this->serializeGroup($entity, $group);

        return json_decode($json, true);
    }

    /**
     * @param int $id
     *
     * @return Project|object
     */
    public function getProject($id)
    {
        $project = $this->em->getRepository(Project::class)
            ->findByID($id);
        if (!$project || $project->isDeleted()) {
            throw $this->createNotFoundException();
        }

        return $project;
    }

    /**
     * @param int $id
     *
     * @return Block|object
     */
    public function getBlock($id)
    {
        $block = $this->em->getRepository(Block::class)->findByID($id);
        if (!$block) {
            throw $this->createNotFoundException();
        }

        return $block;
    }

    /**
     * @param int $id
     *
     * @return Media|object
     */
    public function getMedia($id)
    {
        $media = $this->em->getRepository(Media::class)->findByID($id);
        if (!$media) {
            throw $this->createNotFoundException();
        }

        return $media;
    }
}
