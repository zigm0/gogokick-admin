<?php
namespace App\Entity;

use DateTime;
use Exception;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Table(name="content")
 * @ORM\Entity(repositoryClass="App\Repository\ContentRepository")
 */
class Content
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
     * @ORM\Column(type="string", length=60)
     * @Groups({"web"})
     */
    protected $name;

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     * @Groups({"web"})
     */
    protected $title;

    /**
     * @var string
     * @ORM\Column(type="text")
     * @Groups({"web"})
     */
    protected $html;

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
        return (string)$this->getName();
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
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string $name
     *
     * @return Content
     */
    public function setName(string $name): Content
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @param string $title
     *
     * @return Content
     */
    public function setTitle(string $title): Content
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string
     */
    public function getHtml(): ?string
    {
        return $this->html;
    }

    /**
     * @param string $html
     *
     * @return Content
     */
    public function setHtml(string $html): Content
    {
        $this->html = $html;

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
     * @return Content
     */
    public function setDateCreated(DateTime $dateCreated): Content
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }
}
