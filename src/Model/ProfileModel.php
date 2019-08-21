<?php
namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Class ProfileModel
 */
class ProfileModel
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
    protected $bio;

    /**
     * @var string
     * @Assert\Type("string")
     */
    protected $avatar;

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
     * @return ProfileModel
     */
    public function setName(string $name): ProfileModel
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getBio(): string
    {
        return $this->bio;
    }

    /**
     * @param string $bio
     *
     * @return ProfileModel
     */
    public function setBio(string $bio): ProfileModel
    {
        $this->bio = $bio;

        return $this;
    }

    /**
     * @return string
     */
    public function getAvatar(): string
    {
        return $this->avatar;
    }

    /**
     * @param string $avatar
     *
     * @return ProfileModel
     */
    public function setAvatar(string $avatar): ProfileModel
    {
        $this->avatar = $avatar;

        return $this;
    }
}
