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
     * @var int
     * @Assert\Type("integer")
     */
    protected $campaignType;

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

    /**
     * @return int
     */
    public function getCampaignType(): ?int
    {
        return $this->campaignType;
    }

    /**
     * @param int $campaignType
     *
     * @return ProjectModel
     */
    public function setCampaignType(int $campaignType): ProjectModel
    {
        $this->campaignType = $campaignType;

        return $this;
    }
}
