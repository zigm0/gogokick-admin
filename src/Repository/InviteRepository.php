<?php
namespace App\Repository;

use App\Entity\Invite;
use App\Entity\Project;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class InviteRepository
 */
class InviteRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Invite::class);
    }

    /**
     * @param int $id
     *
     * @return object|Invite
     */
    public function findByID($id)
    {
        return $this->findOneBy(['id' => $id]);
    }

    /**
     * @param string $hash
     *
     * @return object|Invite
     */
    public function findByHash($hash)
    {
        return $this->findOneBy(['hash' => $hash]);
    }

    /**
     * @param Project $project
     * @param string $email
     *
     * @return object|Invite
     */
    public function findByProjectAndEmail(Project $project, $email)
    {
        return $this->findOneBy([
            'project' => $project,
            'email'   => $email
        ]);
    }

    /**
     * @param Project $project
     * @param string  $email
     * @param array   $roles
     *
     * @return Invite
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function create(Project $project, $email, array $roles)
    {
        do {
            $hash = md5($project->getId() . microtime(true));
        } while($this->findByHash($hash));

        $invite = (new Invite())
            ->setHash($hash)
            ->setEmail($email)
            ->setRoles($roles)
            ->setProject($project)
            ->setStatus(Invite::STATUS_WAITING);
        $this->getEntityManager()->persist($invite);
        $this->getEntityManager()->flush();

        return $invite;
    }
}
