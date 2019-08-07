<?php
namespace App\Repository;

use App\Entity\ProjectUser;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class ProjectUserRepository
 */
class ProjectUserRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, ProjectUser::class);
    }

    /**
     * @param int $id
     *
     * @return object|ProjectUser
     */
    public function findByID($id)
    {
        return $this->findOneBy(['id' => $id]);
    }
}
