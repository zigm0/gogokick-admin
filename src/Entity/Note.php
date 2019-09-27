<?php
namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Exception;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Table(name="note")
 * @ORM\Entity(repositoryClass="App\Repository\NoteRepository")
 */
class Note
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
     * @ORM\ManyToOne(targetEntity="User", inversedBy="notes")
     * @ORM\JoinColumn(name="user_id", onDelete="CASCADE", referencedColumnName="id")
     * @Groups({"web"})
     */
    protected $user;

    /**
     * @var Block
     * @ORM\ManyToOne(targetEntity="Block", inversedBy="notes")
     * @ORM\JoinColumn(name="block_id", onDelete="CASCADE", referencedColumnName="id")
     * @Groups({"web"})
     */
    protected $block;

    /**
     * @var string
     * @ORM\Column(type="text")
     * @Groups({"web"})
     */
    protected $text;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Activity", mappedBy="note")
     */
    protected $activities;

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
            $this->activities  = new ArrayCollection();
        } catch (Exception $e) {}
    }

    /**
     * @Groups({"web"})
     *
     * @return int|null
     */
    public function getProjectID(): ?int
    {
        if ($this->block) {
            return $this->block->getProject()->getId();
        }

        return null;
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
     * @return Note
     */
    public function setUser(User $user): Note
    {
        $this->user = $user;

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
     * @return Note
     */
    public function setBlock(Block $block): Note
    {
        $this->block = $block;

        return $this;
    }

    /**
     * @return Collection
     */
    public function getActivities(): Collection
    {
        return $this->activities;
    }

    /**
     * @param Collection $activities
     *
     * @return Note
     */
    public function setActivities(Collection $activities): Note
    {
        $this->activities = $activities;

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
     * @return Note
     */
    public function setText(string $text): Note
    {
        $this->text = $text;

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
     * @return Note
     */
    public function setDateCreated(DateTime $dateCreated): Note
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }
}
