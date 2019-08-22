<?php
namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Class InviteModel
 */
class InviteModel
{
    /**
     * @var int
     * @Assert\Type("integer")
     */
    protected $project;

    /**
     * @var string
     * @Assert\Type("string")
     */
    protected $email;

    /**
     * @var array
     * @Assert\Type("array")
     */
    protected $roles = [];

    /**
     * @return int
     */
    public function getProject(): int
    {
        return $this->project;
    }

    /**
     * @param int $project
     *
     * @return InviteModel
     */
    public function setProject(int $project): InviteModel
    {
        $this->project = $project;

        return $this;
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param string $email
     *
     * @return InviteModel
     */
    public function setEmail(string $email): InviteModel
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return array
     */
    public function getRoles(): array
    {
        return $this->roles;
    }

    /**
     * @param array $roles
     *
     * @return InviteModel
     */
    public function setRoles(array $roles): InviteModel
    {
        $this->roles = $roles;

        return $this;
    }
}
