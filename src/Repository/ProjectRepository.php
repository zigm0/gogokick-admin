<?php
namespace App\Repository;

use App\Entity\Project;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class ProjectRepository
 */
class ProjectRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Project::class);
    }

    /**
     * @param int $id
     *
     * @return object|Project
     */
    public function findByID($id)
    {
        return $this->findOneBy(['id' => $id]);
    }

    /**
     * @param User $user
     *
     * @return Project[]|array
     */
    public function findByUser(User $user)
    {
        return $this->findBy([
            'isTemplate' => false,
            'user'       => $user
        ]);
    }
}
