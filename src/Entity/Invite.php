<?php
namespace App\Entity;

use DateTime;
use Exception;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Table(name="invite")
 * @ORM\Entity(repositoryClass="App\Repository\InviteRepository")
 */
class Invite
{
    const STATUS_WAITING  = 1;
    const STATUS_ACCEPTED = 2;
    const STATUS_REJECTED = 3;
    const STATUSES = [
        'waiting'  => self::STATUS_WAITING,
        'accepted' => self::STATUS_ACCEPTED,
        'rejected' => self::STATUS_REJECTED
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
     * @ORM\ManyToOne(targetEntity="Project", inversedBy="invites")
     * @ORM\JoinColumn(name="project_id", onDelete="CASCADE", referencedColumnName="id")
     */
    protected $project;

    /**
     * @var string
     * @ORM\Column(type="string", length=60)
     * @Groups({"web"})
     */
    protected $email;

    /**
     * @var string
     * @ORM\Column(type="string", length=32)
     * @Groups({"web"})
     */
    protected $hash;

    /**
     * @var array
     * @ORM\Column(type="array")
     * @Groups({"web"})
     */
    protected $roles = [];

    /**
     * @var int
     * @ORM\Column(type="smallint", options={"unsigned"=true})
     * @Groups({"web"})
     */
    protected $status;

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
     * @return Project
     */
    public function getProject(): ?Project
    {
        return $this->project;
    }

    /**
     * @param Project $project
     *
     * @return Invite
     */
    public function setProject(Project $project): Invite
    {
        $this->project = $project;

        return $this;
    }

    /**
     * @return string
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $email
     *
     * @return Invite
     */
    public function setEmail(string $email): Invite
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return string
     */
    public function getHash(): ?string
    {
        return $this->hash;
    }

    /**
     * @param string $hash
     *
     * @return Invite
     */
    public function setHash(string $hash): Invite
    {
        $this->hash = $hash;

        return $this;
    }

    /**
     * @return array
     */
    public function getRoles(): array
    {
        if (!$this->roles) {
            return [];
        }

        return $this->roles;
    }

    /**
     * @param array $roles
     *
     * @return Invite
     */
    public function setRoles(array $roles): Invite
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @return int
     */
    public function getStatus(): ?int
    {
        return $this->status;
    }

    /**
     * @param int $status
     *
     * @return Invite
     */
    public function setStatus(int $status): Invite
    {
        $this->status = $status;

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
     * @return Invite
     */
    public function setDateCreated(DateTime $dateCreated): Invite
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }
}
