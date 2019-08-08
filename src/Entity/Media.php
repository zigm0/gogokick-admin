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
     * @var string
     * @ORM\Column(type="string", length=255)
     * @Groups({"web"})
     */
    protected $url;

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
