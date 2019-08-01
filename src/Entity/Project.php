<?php
namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Exception;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Table(name="project")
 * @ORM\Entity(repositoryClass="App\Repository\ProjectRepository")
 */
class Project
{
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
     * @ORM\ManyToOne(targetEntity="User", inversedBy="projects")
     * @ORM\JoinColumn(name="user_id", onDelete="CASCADE", referencedColumnName="id")
     */
    protected $user;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"web"})
     */
    protected $name;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"web"})
     */
    protected $screenshot;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Block", mappedBy="project")
     * @Groups({"web"})
     */
    protected $blocks;

    /**
     * @var bool
     * @ORM\Column(type="boolean")
     */
    protected $isTemplate = false;

    /**
     * @var DateTime
     * @ORM\Column(type="datetime")
     * @Groups({"web"})
     */
    protected $dateCreated;

    /**
     * @var DateTime
     * @ORM\Column(type="datetime")
     * @Groups({"web"})
     */
    protected $dateUpdated;

    /**
     * Constructor
     */
    public function __construct()
    {
        try {
            $this->blocks      = new ArrayCollection();
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
     * @return User
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @param User $user
     *
     * @return Project
     */
    public function setUser(User $user): Project
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return string
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string $name
     *
     * @return Project
     */
    public function setName(string $name): Project
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getScreenshot(): ?string
    {
        return $this->screenshot;
    }

    /**
     * @param string $screenshot
     *
     * @return Project
     */
    public function setScreenshot(string $screenshot): Project
    {
        $this->screenshot = $screenshot;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getBlocks(): Collection
    {
        return $this->blocks;
    }

    /**
     * @param Collection $blocks
     *
     * @return Project
     */
    public function setBlocks(Collection $blocks): Project
    {
        $this->blocks = $blocks;

        return $this;
    }

    /**
     * @return bool
     */
    public function isTemplate(): bool
    {
        return $this->isTemplate;
    }

    /**
     * @param bool $isTemplate
     *
     * @return Project
     */
    public function setIsTemplate(bool $isTemplate): Project
    {
        $this->isTemplate = $isTemplate;

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
     * @return Project
     */
    public function setDateCreated(DateTime $dateCreated): Project
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
     * @return Project
     */
    public function setDateUpdated(DateTime $dateUpdated): Project
    {
        $this->dateUpdated = $dateUpdated;

        return $this;
    }
}
