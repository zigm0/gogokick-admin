<?php
namespace App\Entity;

use DateTime;
use Exception;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Table(
 *     name="project_user",
 *     uniqueConstraints={
 *          @ORM\UniqueConstraint(name="team_idx", columns={"user_id", "project_id"})
 *     }
 * )
 * @ORM\Entity(repositoryClass="App\Repository\ProjectUserRepository")
 */
class ProjectUser
{
    const ROLE_OWNER    = 1;
    const ROLE_LEAD     = 2;
    const ROLE_WRITER   = 3;
    const ROLE_GRAPHICS = 4;
    const ROLE_VIDEO    = 5;
    const ROLE_AUDIO    = 6;
    const ROLES = [
        'owner'    => self::ROLE_OWNER,
        'lead'     => self::ROLE_LEAD,
        'writer'   => self::ROLE_WRITER,
        'graphics' => self::ROLE_GRAPHICS,
        'video'    => self::ROLE_VIDEO,
        'audio'    => self::ROLE_AUDIO
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
     * @ORM\ManyToOne(targetEntity="User", inversedBy="teamProjects")
     * @ORM\JoinColumn(name="user_id", onDelete="CASCADE", referencedColumnName="id")
     * @Groups({"web"})
     */
    protected $user;

    /**
     * @var Project
     * @ORM\ManyToOne(targetEntity="Project", inversedBy="team")
     * @ORM\JoinColumn(name="project_id", onDelete="CASCADE", referencedColumnName="id")
     */
    protected $project;

    /**
     * @var array
     * @ORM\Column(type="array")
     * @Groups({"web"})
     */
    protected $roles = [];

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
     * @return string
     */
    public function __toString()
    {
        if (!$this->user) {
            return '';
        }

        return (string)$this->user->getName();
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
     * @return ProjectUser
     */
    public function setUser(User $user): ProjectUser
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
     * @return ProjectUser
     */
    public function setProject(Project $project): ProjectUser
    {
        $this->project = $project;

        return $this;
    }

    /**
     * @return array
     */
    public function getRoles(): ?array
    {
        if (!$this->roles) {
            return [];
        }

        return $this->roles;
    }

    /**
     * @param array $roles
     *
     * @return ProjectUser
     */
    public function setRoles(array $roles): ProjectUser
    {
        $this->roles = $roles;

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
     * @return ProjectUser
     */
    public function setDateCreated(DateTime $dateCreated): ProjectUser
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }
}
