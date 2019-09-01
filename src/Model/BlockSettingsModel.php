<?php
namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Class BlockSettingsModel
 */
class BlockSettingsModel
{
    /**
     * @var bool
     * @Assert\Type("boolean")
     */
    protected $isLocked = false;

    /**
     * @var int
     * @Assert\Type("integer")
     */
    protected $height = 0;

    /**
     * @var int
     * @Assert\Type("integer")
     */
    protected $width = 0;

    /**
     * @var int
     * @Assert\Type("integer")
     */
    protected $wordCount = 0;

    /**
     * @var string
     * @Assert\Type("string")
     */
    protected $aspectRatio = '1:1';

    /**
     * @var string
     * @Assert\Type("string")
     */
    protected $description = '';

    /**
     * @return bool
     */
    public function isLocked(): bool
    {
        return $this->isLocked;
    }

    /**
     * @param bool $isLocked
     *
     * @return BlockSettingsModel
     */
    public function setIsLocked(bool $isLocked): BlockSettingsModel
    {
        $this->isLocked = $isLocked;

        return $this;
    }

    /**
     * @return int
     */
    public function getHeight(): int
    {
        return $this->height;
    }

    /**
     * @param int $height
     *
     * @return BlockSettingsModel
     */
    public function setHeight(int $height): BlockSettingsModel
    {
        $this->height = $height;

        return $this;
    }

    /**
     * @return int
     */
    public function getWidth(): int
    {
        return $this->width;
    }

    /**
     * @param int $width
     *
     * @return BlockSettingsModel
     */
    public function setWidth(int $width): BlockSettingsModel
    {
        $this->width = $width;

        return $this;
    }

    /**
     * @return int
     */
    public function getWordCount(): int
    {
        return $this->wordCount;
    }

    /**
     * @param int $wordCount
     *
     * @return BlockSettingsModel
     */
    public function setWordCount(int $wordCount): BlockSettingsModel
    {
        $this->wordCount = $wordCount;

        return $this;
    }

    /**
     * @return string
     */
    public function getAspectRatio(): string
    {
        return $this->aspectRatio;
    }

    /**
     * @param string $aspectRatio
     *
     * @return BlockSettingsModel
     */
    public function setAspectRatio(string $aspectRatio): BlockSettingsModel
    {
        $this->aspectRatio = $aspectRatio;

        return $this;
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @param string $description
     *
     * @return BlockSettingsModel
     */
    public function setDescription(string $description): BlockSettingsModel
    {
        $this->description = $description;

        return $this;
    }
}
