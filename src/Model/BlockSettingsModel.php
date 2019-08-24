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
    protected $isLocked;

    /**
     * @var int
     * @Assert\Type("integer")
     */
    protected $height;

    /**
     * @var int
     * @Assert\Type("integer")
     */
    protected $width;

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
}
