<?php
namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\Collection;
use Exception;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Table(name="block")
 * @ORM\Entity(repositoryClass="App\Repository\BlockRepository")
 */
class Block
{
    const TYPE_TEXT  = 1;
    const TYPE_IMAGE = 2;
    const TYPE_VIDEO = 3;
    const TYPES      = [
        self::TYPE_TEXT,
        self::TYPE_IMAGE,
        self::TYPE_VIDEO
    ];

    /**
     * @var int
     * @ORM\Id
     * @ORM\Column(type="integer", options={"unsigned"=true})
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Groups({"web"})
     */
    protected $id;

    /**
     * @var Project
     * @ORM\ManyToOne(targetEntity="Project", inversedBy="blocks")
     * @ORM\JoinColumn(name="project_id", onDelete="CASCADE", referencedColumnName="id")
     */
    protected $project;

    /**
     * @var int
     * @ORM\Column(type="smallint")
     * @Groups({"web"})
     */
    protected $type;

    /**
     * @var DateTime
     * @ORM\Column(type="datetime")
     * @Groups({"web"})
     */
    protected $dateCreated;

    /**
     * @var DateTime
     * @ORM\Column(type="datetime")
     */
    protected $dateUpdated;

    /**
     * Constructor
     */
    public function __construct()
    {
        try {
            $this->dateCreated = new DateTime();
            $this->dateUpdated = new DateTime();
        } catch (Exception $e) {}
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return Project
     */
    public function getProject(): Project
    {
        return $this->project;
    }

    /**
     * @param Project $project
     *
     * @return Block
     */
    public function setProject(Project $project): Block
    {
        $this->project = $project;

        return $this;
    }

    /**
     * @return int
     */
    public function getType(): ?int
    {
        return $this->type;
    }

    /**
     * @param int $type
     *
     * @return Block
     */
    public function setType(int $type): Block
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return DateTime
     */
    public function getDateCreated(): DateTime
    {
        return $this->dateCreated;
    }

    /**
     * @param DateTime $dateCreated
     *
     * @return Block
     */
    public function setDateCreated(DateTime $dateCreated): Block
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }

    /**
     * @return DateTime
     */
    public function getDateUpdated(): DateTime
    {
        return $this->dateUpdated;
    }

    /**
     * @param DateTime $dateUpdated
     *
     * @return Block
     */
    public function setDateUpdated(DateTime $dateUpdated): Block
    {
        $this->dateUpdated = $dateUpdated;

        return $this;
    }
}
