<?php
namespace App\Entity;

use DateTime;
use Exception;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Table(name="media")
 * @ORM\Entity(repositoryClass="App\Repository\MediaRepository")
 */
class Media
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
     * @ORM\ManyToOne(targetEntity="User", inversedBy="media")
     * @ORM\JoinColumn(name="user_id", onDelete="CASCADE", referencedColumnName="id")
     * @Groups({"web"})
     */
    protected $user;

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     * @Groups({"web"})
     */
    protected $url;

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     * @Groups({"web"})
     */
    protected $origFilename;

    /**
     * @var string
     * @ORM\Column(type="string", length=60)
     * @Groups({"web"})
     */
    protected $system;

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     * @Groups({"web"})
     */
    protected $path;

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
     * @return Media
     */
    public function setUser(User $user): Media
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return string
     */
    public function getUrl(): ?string
    {
        return $this->url;
    }

    /**
     * @param string $url
     *
     * @return Media
     */
    public function setUrl(string $url): Media
    {
        $this->url = $url;

        return $this;
    }

    /**
     * @return string
     */
    public function getOrigFilename(): ?string
    {
        return $this->origFilename;
    }

    /**
     * @param string $origFilename
     *
     * @return Media
     */
    public function setOrigFilename(string $origFilename): Media
    {
        $this->origFilename = $origFilename;

        return $this;
    }

    /**
     * @return string
     */
    public function getSystem(): ?string
    {
        return $this->system;
    }

    /**
     * @param string $system
     *
     * @return Media
     */
    public function setSystem(string $system): Media
    {
        $this->system = $system;

        return $this;
    }

    /**
     * @return string
     */
    public function getPath(): ?string
    {
        return $this->path;
    }

    /**
     * @param string $path
     *
     * @return Media
     */
    public function setPath(string $path): Media
    {
        $this->path = $path;

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
     * @return Media
     */
    public function setDateCreated(DateTime $dateCreated): Media
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }
}
