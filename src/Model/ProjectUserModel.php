<?php
namespace App\Model;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Class ProjectUserModel
 */
class ProjectUserModel
{
    /**
     * @var array
     * @Assert\Type("array")
     */
    protected $roles = [];

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
     * @return ProjectUserModel
     */
    public function setRoles(array $roles): ProjectUserModel
    {
        $this->roles = $roles;

        return $this;
    }
}
