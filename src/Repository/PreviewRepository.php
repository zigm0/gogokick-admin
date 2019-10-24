<?php
namespace App\Repository;

use App\Entity\Preview;
use App\Entity\Project;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Exception;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * Class PreviewRepository
 */
class PreviewRepository extends ServiceEntityRepository
{
    /**
     * Constructor
     *
     * @param RegistryInterface $registry
     */
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Preview::class);
    }

    /**
     * @param int $id
     *
     * @return object|Preview
     */
    public function findByID($id)
    {
        return $this->findOneBy(['id' => $id]);
    }

    /**
     * @param Project $project
     * @param string  $hash
     *
     * @return object|Preview
     */
    public function findByProjectAndHash(Project $project, $hash)
    {
        return $this->findOneBy([
            'project' => $project,
            'hash' => $hash
        ]);
    }

    /**
     * @param Project  $project
     *
     * @return Preview
     * @throws Exception
     */
    public function create(Project $project)
    {
        do {
            $hash  = substr(md5(mt_rand() . uniqid()), 0, 16);
            $found = $this->findByProjectAndHash($project, $hash);
        } while($found);

        $preview = (new Preview())
            ->setHash($hash)
            ->setProject($project)
            ->setDateExpires(new DateTime('1 month'));
        try {
            $this->getEntityManager()->persist($preview);
        } catch (ORMException $e) {
            throw new Exception($e->getMessage(), $e);
        }
        try {
            $this->getEntityManager()->flush();
        } catch (OptimisticLockException $e) {
            throw new Exception($e->getMessage(), $e);
        } catch (ORMException $e) {
            throw new Exception($e->getMessage(), $e);
        }

        return $preview;
    }
}
