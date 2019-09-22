<?php
namespace App\Repository;

use App\Entity\Activity;
use App\Entity\Block;
use App\Entity\Note;
use App\Entity\Project;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class ActivityRepository
 */
class ActivityRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Activity::class);
    }

    /**
     * @param int $id
     *
     * @return object|Activity
     */
    public function findByID($id)
    {
        return $this->findOneBy(['id' => $id]);
    }

    /**
     * @param User $user
     * @param int  $limit
     * @param int  $offset
     *
     * @return Activity[]
     */
    public function findByUser(User $user, $limit = 20, $offset = 0)
    {
        return $this->findBy(['user' => $user], ['id' => 'desc'], $limit, $offset);
    }

    /**
     * @param Project $project
     * @param int     $limit
     * @param int     $offset
     *
     * @return Activity[]
     */
    public function findByProject(Project $project, $limit = 20, $offset = 0)
    {
        return $this->findBy(['project' => $project], ['id' => 'desc'], $limit, $offset);
    }

    /**
     * @param Block $block
     * @param int   $limit
     * @param int   $offset
     *
     * @return Activity[]
     */
    public function findByBlock(Block $block, $limit = 20, $offset = 0)
    {
        return $this->findBy(['block' => $block], ['id' => 'desc'], $limit, $offset);
    }

    /**
     * @param Note  $note
     * @param int   $limit
     * @param int   $offset
     *
     * @return Activity[]
     */
    public function findByNote(Note $note, $limit = 20, $offset = 0)
    {
        return $this->findBy(['note' => $note], ['id' => 'desc'], $limit, $offset);
    }
}
