<?php
namespace App\Repository;

use App\Entity\Project;
use App\Entity\User;
use App\Entity\Watch;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class WatchRepository
 */
class WatchRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Watch::class);
    }

    /**
     * @param int $id
     *
     * @return object|Watch
     */
    public function findByID($id)
    {
        return $this->findOneBy(['id' => $id]);
    }

    /**
     * @param User $user
     *
     * @return Watch[]
     */
    public function findByUser(User $user)
    {
        return $this->findBy(['user' => $user], ['id' => 'desc']);
    }

    /**
     * @param User    $user
     * @param Project $project
     *
     * @return object|Watch
     */
    public function findByUserAndProject(User $user, Project $project)
    {
        return $this->findOneBy([
            'user'    => $user,
            'project' => $project
        ]);
    }
}
