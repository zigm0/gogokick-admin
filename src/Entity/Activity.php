<?php
namespace App\Entity;

use DateTime;
use Exception;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Table(name="activity")
 * @ORM\Entity(repositoryClass="App\Repository\ActivityRepository")
 */
class Activity
{
    const TYPE_INVITE_ACCEPTED = 1;

    const TYPES = [
        'invite_accepted' => self::TYPE_INVITE_ACCEPTED
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
     * @var User
     * @ORM\ManyToOne(targetEntity="User", inversedBy="activities")
     * @ORM\JoinColumn(name="user_id", onDelete="CASCADE", referencedColumnName="id")
     * @Groups({"web"})
     */
    protected $user;

    /**
     * @var Project
     * @ORM\ManyToOne(targetEntity="Project", inversedBy="activities")
     * @ORM\JoinColumn(name="project_id", onDelete="CASCADE", referencedColumnName="id", nullable=true)
     */
    protected $project;

    /**
     * @var Block
     * @ORM\ManyToOne(targetEntity="Block", inversedBy="activities")
     * @ORM\JoinColumn(name="block_id", onDelete="CASCADE", referencedColumnName="id", nullable=true)
     */
    protected $block;

    /**
     * @var int
     * @ORM\Column(type="smallint", options={"unsigned"=true})
     * @Groups({"web"})
     */
    protected $type;

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     * @Groups({"web"})
     */
    protected $message;

    /**
     * @var DateTime
     * @ORM\Column(type="datetime")
     * @Groups({"web"})
     */
    protected $dateCreated;

    /**
     * Constructor
     */
    public function __construct()
    {
        try {
            $this->dateCreated = new DateTime();
        } catch (Exception $e) {}
    }

    /**
     * @return int
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return User
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User $user
     *
     * @return Activity
     */
    public function setUser(User $user): Activity
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Project
     */
    public function getProject(): ?Project
    {
        return $this->project;
    }

    /**
     * @param Project $project
     *
     * @return Activity
     */
    public function setProject(Project $project): Activity
    {
        $this->project = $project;

        return $this;
    }

    /**
     * @return Block
     */
    public function getBlock(): ?Block
    {
        return $this->block;
    }

    /**
     * @param Block $block
     *
     * @return Activity
     */
    public function setBlock(Block $block): Activity
    {
        $this->block = $block;

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
     * @return Activity
     */
    public function setType(int $type): Activity
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return string
     */
    public function getMessage(): ?string
    {
        return $this->message;
    }

    /**
     * @param string $message
     *
     * @return Activity
     */
    public function setMessage(string $message): Activity
    {
        $this->message = $message;

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
     * @return Activity
     */
    public function setDateCreated(DateTime $dateCreated): Activity
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }
}
