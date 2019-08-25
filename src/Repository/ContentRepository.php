<?php
namespace App\Repository;

use App\Entity\Content;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class ContentRepository
 */
class ContentRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Content::class);
    }

    /**
     * @param int $id
     *
     * @return object|Content
     */
    public function findByID($id)
    {
        return $this->findOneBy(['id' => $id]);
    }

    /**
     * @param string $name
     *
     * @return object|Content
     */
    public function findByName($name)
    {
        return $this->findOneBy(['name' => $name]);
    }
}
