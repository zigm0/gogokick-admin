<?php
namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Constraints\Type;

/**
 * Class ProjectModel
 */
class ProjectModel
{
    /**
     * @var string
     * @Type("string")
     */
    protected $name;

    /**
     * @var string
     * @Type("string")
     */
    protected $subtitle;

    /**
     * @var string
     * @Assert\Type("string")
     */
    protected $pictureURL;

    /**
     * @var array
     * @Assert\All({
     *      @Assert\Collection(
     *          fields = {
     *              "id"          = @Assert\NotBlank,
     *              "type"        = @Type("integer"),
     *              "text"        = @Type("string"),
     *              "link"        = @Type("string"),
     *              "caption"     = @Type("string"),
     *              "description" = @Type("string"),
     *              "height"      = @Type("integer"),
     *              "width"       = @Type("integer"),
     *              "wordCount"   = @Type("integer"),
     *              "aspectRatio" = @Type("string"),
     *              "isHeadline"  = @Type("boolean"),
     *              "videoUrl"    = @Type("string"),
     *              "audioUrl"    = @Type("string")
     *          },
     *          allowExtraFields = true
     *      )
     * })
     */
    protected $blocks = [];

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
     * @return string
     */
    public function getSubtitle(): string
    {
        return $this->subtitle;
    }

    /**
     * @param string $subtitle
     *
     * @return ProjectModel
     */
    public function setSubtitle(string $subtitle): ProjectModel
    {
        $this->subtitle = $subtitle;

        return $this;
    }

    /**
     * @return string
     */
    public function getPictureURL(): string
    {
        return $this->pictureURL;
    }

    /**
     * @param string $pictureURL
     *
     * @return ProjectModel
     */
    public function setPictureURL(string $pictureURL): ProjectModel
    {
        $this->pictureURL = $pictureURL;

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
