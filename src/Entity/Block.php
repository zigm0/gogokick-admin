<?php
namespace App\Entity;

use DateTime;
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
    const TYPE_AUDIO = 4;
    const TYPES      = [
        'text'  => self::TYPE_TEXT,
        'image' => self::TYPE_IMAGE,
        'video' => self::TYPE_VIDEO,
        'audio' => self::TYPE_AUDIO
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
     * @var string
     * @ORM\Column(type="string", length=60)
     * @Groups({"web"})
     */
    protected $description;

    /**
     * @var int
     * @ORM\Column(type="smallint", options={"unsigned"=true})
     * @Groups({"web"})
     */
    protected $sortOrder;

    /**
     * @var string
     * @ORM\Column(type="text")
     * @Groups({"web"})
     */
    protected $text = '';

    /**
     * @var Media
     * @ORM\OneToOne(targetEntity="Media")
     * @ORM\JoinColumn(name="media_id", referencedColumnName="id", nullable=true)
     * @Groups({"web"})
     */
    protected $media;

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     * @Groups({"web"})
     */
    protected $videoUrl = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     * @Groups({"web"})
     */
    protected $audioUrl = '';

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     * @Groups({"web"})
     */
    protected $caption = '';

    /**
     * @var bool
     * @ORM\Column(type="boolean")
     * @Groups({"web"})
     */
    protected $isHeadline = false;

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
            $this->description = 'Description';
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
     * @return string
     * @Groups({"web"})
     */
    public function getTypeString(): ?string
    {
        if ($this->type === null) {
            return '';
        }

        return (string)array_search($this->type, self::TYPES);
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
     * @return Block
     */
    public function setDescription(string $description): Block
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return string
     */
    public function getCaption(): ?string
    {
        return $this->caption;
    }

    /**
     * @param string $caption
     *
     * @return Block
     */
    public function setCaption(string $caption): Block
    {
        $this->caption = $caption;

        return $this;
    }

    /**
     * @return string
     */
    public function getText(): ?string
    {
        return $this->text;
    }

    /**
     * @param string $text
     *
     * @return Block
     */
    public function setText(string $text): Block
    {
        $this->text = $text;

        return $this;
    }

    /**
     * @return string
     */
    public function getVideoUrl(): ?string
    {
        return $this->videoUrl;
    }

    /**
     * @param string $videoUrl
     *
     * @return Block
     */
    public function setVideoUrl(string $videoUrl): Block
    {
        $this->videoUrl = $videoUrl;

        return $this;
    }

    /**
     * @return string
     */
    public function getAudioUrl(): ?string
    {
        return $this->audioUrl;
    }

    /**
     * @param string $audioUrl
     *
     * @return Block
     */
    public function setAudioUrl(string $audioUrl): Block
    {
        $this->audioUrl = $audioUrl;

        return $this;
    }

    /**
     * @return bool
     */
    public function isHeadline(): ?bool
    {
        return $this->isHeadline;
    }

    /**
     * @param bool $isHeadline
     *
     * @return Block
     */
    public function setIsHeadline(bool $isHeadline): Block
    {
        $this->isHeadline = $isHeadline;

        return $this;
    }

    /**
     * @return Media
     */
    public function getMedia(): ?Media
    {
        return $this->media;
    }

    /**
     * @param Media $media
     *
     * @return Block
     */
    public function setMedia(Media $media): Block
    {
        $this->media = $media;

        return $this;
    }

    /**
     * @return int
     */
    public function getSortOrder(): ?int
    {
        return $this->sortOrder;
    }

    /**
     * @param int $sortOrder
     *
     * @return Block
     */
    public function setSortOrder(int $sortOrder): Block
    {
        $this->sortOrder = $sortOrder;

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
