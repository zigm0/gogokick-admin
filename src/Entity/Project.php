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
    const CAMPAIGN_TYPE_KICKSTARTER  = 1;
    const CAMPAIGN_TYPE_INDIEGOGO    = 2;
    const CAMPAIGN_TYPES             = [
        'kickstarter' => self::CAMPAIGN_TYPE_KICKSTARTER,
        'indiegogo'   => self::CAMPAIGN_TYPE_INDIEGOGO
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
     * @ORM\ManyToOne(targetEntity="User", inversedBy="projects")
     * @ORM\JoinColumn(name="user_id", onDelete="CASCADE", referencedColumnName="id")
     * @Groups({"web"})
     */
    protected $user;

    /**
     * @var int
     * @ORM\Column(type="smallint")
     * @Groups({"web"})
     */
    protected $campaignType;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="ProjectUser", mappedBy="project")
     * @Groups({"web"})
     */
    protected $team;

    /**
     * @var string
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"web"})
     */
    protected $name;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"web"})
     */
    protected $subtitle = '';

    /**
     * @var Media
     * @ORM\OneToOne(targetEntity="Media")
     * @Groups({"web"})
     */
    protected $image;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Block", mappedBy="project")
     * @Groups({"web"})
     */
    protected $blocks;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"web"})
     */
    protected $description;

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
            $this->team        = new ArrayCollection();
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
     * @return int
     */
    public function getCampaignType(): ?int
    {
        return $this->campaignType;
    }

    /**
     * @return string
     * @Groups({"web"})
     */
    public function getCampaignTypeString(): ?string
    {
        if ($this->campaignType === null) {
            return '';
        }

        return (string)array_search($this->campaignType, self::CAMPAIGN_TYPES);
    }

    /**
     * @param int $campaignType
     *
     * @return Project
     */
    public function setCampaignType(int $campaignType): Project
    {
        $this->campaignType = $campaignType;

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
    public function getSubtitle(): ?string
    {
        return $this->subtitle;
    }

    /**
     * @param string $subtitle
     *
     * @return Project
     */
    public function setSubtitle(string $subtitle): Project
    {
        $this->subtitle = $subtitle;

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
     * @return Media
     */
    public function getImage(): ?Media
    {
        return $this->image;
    }

    /**
     * @param Media $image
     *
     * @return Project
     */
    public function setImage(Media $image): Project
    {
        $this->image = $image;

        return $this;
    }

    /**
     * @return string
     */
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @param string $description
     *
     * @return Project
     */
    public function setDescription(string $description): Project
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection|ProjectUser[]
     */
    public function getTeam(): Collection
    {
        return $this->team;
    }

    /**
     * @param Collection $team
     *
     * @return Project
     */
    public function setTeam(Collection $team): Project
    {
        $this->team = $team;

        return $this;
    }

    /**
     * @param User $user
     *
     * @return bool
     */
    public function hasTeamMember(User $user): bool
    {
        foreach($this->getTeam() as $projectUser) {
            if ($projectUser->getUser()->getId() === $user->getId()) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param ProjectUser $user
     *
     * @return Project
     */
    public function addTeamUser(ProjectUser $user): Project
    {
        $this->team->add($user);

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
