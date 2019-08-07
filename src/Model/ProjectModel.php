<?php
namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Class ProjectModel
 */
class ProjectModel
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
    protected $screenshot;

    /**
     * @var array
     * @Assert\Type("array")
     */
    protected $blocks;

    /**
     * @var array
     * @Assert\Type("array")
     */
    protected $removed;

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
     * @return ProjectModel
     */
    public function setName(string $name): ProjectModel
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getScreenshot(): string
    {
        return $this->screenshot;
    }

    /**
     * @param string $screenshot
     *
     * @return ProjectModel
     */
    public function setScreenshot(string $screenshot): ProjectModel
    {
        $this->screenshot = $screenshot;

        return $this;
    }

    /**
     * @return array
     */
    public function getBlocks(): array
    {
        return $this->blocks;
    }

    /**
     * @param array $blocks
     *
     * @return ProjectModel
     */
    public function setBlocks(array $blocks): ProjectModel
    {
        $this->blocks = $blocks;

        return $this;
    }

    /**
     * @return array
     */
    public function getRemoved(): array
    {
        return $this->removed;
    }

    /**
     * @param array $removed
     *
     * @return ProjectModel
     */
    public function setRemoved(array $removed): ProjectModel
    {
        $this->removed = $removed;

        return $this;
    }
}
