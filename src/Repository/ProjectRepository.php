<?php
namespace App\Repository;

use App\Entity\Project;
use App\Entity\ProjectUser;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Join;
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
            'user' => $user
        ]);
    }

    /**
     * @param User $user
     *
     * @return Project[]|array
     */
    public function findByTeamMember(User $user)
    {
        return $this->createQueryBuilder('p')
            ->leftJoin(ProjectUser::class, 'pu', Join::WITH, 'pu.project = p')
            ->where('p.isDeleted = 0')
            ->andWhere('(p.user = :user OR pu.user = :user)')
            ->setParameter(':user', $user)
            ->orderBy('p.dateUpdated', 'desc')
            ->getQuery()
            ->execute();
    }

    /**
     * @param User $user
     *
     * @return object|Project
     */
    public function findLastUpdatedByUser(User $user)
    {
        return $this->findOneBy([
            'user'       => $user
        ], ['dateUpdated' => 'desc']);
    }
}
