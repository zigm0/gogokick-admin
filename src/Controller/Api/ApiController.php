<?php
namespace App\Controller\Api;

use App\Controller\Controller;
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
     * Constructor
     *
     * @param EntityManagerInterface   $em
     * @param EventDispatcherInterface $eventDispatcher
     * @param SerializerInterface      $serializer
     */
    public function __construct(
        EntityManagerInterface $em,
        EventDispatcherInterface $eventDispatcher,
        SerializerInterface $serializer
    )
    {
        parent::__construct($em, $eventDispatcher);
        $this->serializer = $serializer;
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
}
