<?php
namespace App\Repository;

use App\Entity\Media;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class MediaRepository
 */
class MediaRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Media::class);
    }

    /**
     * @param int $id
     *
     * @return object|Media
     */
    public function findByID($id)
    {
        return $this->findOneBy(['id' => $id]);
    }

    /**
     * @param string $url
     *
     * @return object|Media
     */
    public function findByUrl($url)
    {
        return $this->findOneBy(['url' => $url]);
    }
}
