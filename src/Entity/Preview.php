<?php
namespace App\Entity;

use DateTime;
use Exception;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Table(
 *     name="preview",
 *     uniqueConstraints={
 *          @ORM\UniqueConstraint(name="hash_idx", columns={"project_id", "hash"})
 *     }
 * )
 * @ORM\Entity(repositoryClass="App\Repository\PreviewRepository")
 */
class Preview
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
     * @var Project
     * @ORM\ManyToOne(targetEntity="Project", inversedBy="previews")
     * @ORM\JoinColumn(name="project_id", onDelete="CASCADE", referencedColumnName="id")
     */
    protected $project;

    /**
     * @var string
     * @ORM\Column(type="string", length=32, unique=true)
     * @Groups({"web"})
     */
    protected $hash;

    /**
     * @var DateTime
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"web"})
     */
    protected $dateExpires;

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
     * @param int $id
     *
     * @return Preview
     */
    public function setId(int $id): Preview
    {
        $this->id = $id;

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
     * @return Preview
     */
    public function setProject(Project $project): Preview
    {
        $this->project = $project;

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
     * @return Preview
     */
    public function setHash(string $hash): Preview
    {
        $this->hash = $hash;

        return $this;
    }

    /**
     * @return DateTime
     */
    public function getDateExpires(): ?DateTime
    {
        return $this->dateExpires;
    }

    /**
     * @param DateTime $dateExpires
     *
     * @return Preview
     */
    public function setDateExpires(?DateTime $dateExpires): Preview
    {
        $this->dateExpires = $dateExpires;

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
     * @return Preview
     */
    public function setDateCreated(DateTime $dateCreated): Preview
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }
}
