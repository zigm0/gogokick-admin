<?php
namespace App\Repository;

use App\Entity\Note;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class NoteRepository
 */
class NoteRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Note::class);
    }

    /**
     * @param int $id
     *
     * @return object|Note
     */
    public function findByID($id)
    {
        return $this->findOneBy(['id' => $id]);
    }
}
