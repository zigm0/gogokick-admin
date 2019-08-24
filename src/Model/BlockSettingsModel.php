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
}
