<?php
namespace App\Repository;

use App\Entity\Block;
use App\Entity\Project;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class BlockRepository
 */
class BlockRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Block::class);
    }

    /**
     * @param int $id
     *
     * @return object|Block
     */
    public function findByID($id)
    {
        return $this->findOneBy(['id' => $id]);
    }

    /**
     * @param Project $project
     *
     * @return Block[]|array
     */
    public function findByProject(Project $project)
    {
        return $this->findBy(['project' => $project]);
    }
}
