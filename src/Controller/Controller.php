<?php
namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * Class Controller
 */
class Controller extends AbstractController
{
    /**
     * @var EntityManagerInterface
     */
    protected $em;

    /**
     * @var EventDispatcherInterface
     */
    protected $eventDispatcher;

    /**
     * Constructor
     *
     * @param EntityManagerInterface   $em
     * @param EventDispatcherInterface $eventDispatcher
     */
    public function __construct(EntityManagerInterface $em, EventDispatcherInterface $eventDispatcher)
    {
        $this->em              = $em;
        $this->eventDispatcher = $eventDispatcher;
    }
}
