<?php
namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Constraints\Type;

/**
 * Class ProjectSettingsModel
 */
class ProjectSettingsModel
{
    /**
     * @var string
     * @Assert\Type("string")
     */
    protected $name;

    /**
     * @var string
     * @Assert\Type("string")
     */
    protected $subtitle;

    /**
     * @var boolean
     * @Assert\Type("boolean")
     */
    protected $isPublic;

    /**
     * @var array
     * @Assert\Type("array")
     */
    protected $image;

    /**
     * @var array
     */
    protected $social;

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     *
     * @return ProjectSettingsModel
     */
    public function setName(string $name): ProjectSettingsModel
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getSubtitle(): string
    {
        return $this->subtitle;
    }

    /**
     * @param string $subtitle
     *
     * @return ProjectSettingsModel
     */
    public function setSubtitle(string $subtitle): ProjectSettingsModel
    {
        $this->subtitle = $subtitle;

        return $this;
    }

    /**
     * @return bool
     */
    public function isPublic(): bool
    {
        return $this->isPublic;
    }

    /**
     * @param bool $isPublic
     *
     * @return ProjectSettingsModel
     */
    public function setIsPublic(bool $isPublic): ProjectSettingsModel
    {
        $this->isPublic = $isPublic;

        return $this;
    }

    /**
     * @return array
     */
    public function getImage(): array
    {
        return $this->image;
    }

    /**
     * @param array $image
     *
     * @return ProjectSettingsModel
     */
    public function setImage(array $image): ProjectSettingsModel
    {
        $this->image = $image;

        return $this;
    }

    /**
     * @return array
     */
    public function getSocial(): array
    {
        return $this->social;
    }

    /**
     * @param array $social
     *
     * @return ProjectSettingsModel
     */
    public function setSocial(array $social): ProjectSettingsModel
    {
        $this->social = $social;

        return $this;
    }
}
