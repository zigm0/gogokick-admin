<?php
namespace App\Repository;

use App\Entity\Block;
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
}
