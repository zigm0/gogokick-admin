<?php
namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Exception;
use Doctrine\ORM\Mapping as ORM;
use InvalidArgumentException;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Table(name="user")
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User implements UserInterface
{
    const ROLE_USER = 'ROLE_USER';
    const ROLE_ADMIN = 'ROLE_ADMIN';
    const ROLE_SUPER_ADMIN = 'ROLE_SUPER_ADMIN';

    const ROLES
        = [
            self::ROLE_USER,
            self::ROLE_ADMIN,
            self::ROLE_SUPER_ADMIN
        ];

    /**
     * @var int
     * @ORM\Id
     * @ORM\Column(type="integer", options={"unsigned"=true})
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Groups({"web"})
     */
    protected $id;

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     * @Groups({"web"})
     */
    protected $email;

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     * @Groups({"web"})
     */
    protected $name;

    /**
     * @var string
     * @ORM\Column(type="string", length=60)
     */
    protected $password;

    /**
     * @var array
     * @ORM\Column(type="array")
     * @Groups({"web"})
     */
    protected $roles;

    /**
     * @var bool
     * @ORM\Column(type="boolean")
     */
    protected $isEnabled;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Project", mappedBy="user")
     */
    protected $projects;

    /**
     * @var DateTime
     * @ORM\Column(type="datetime")
     */
    protected $dateCreated;

    /**
     * @var DateTime
     * @ORM\Column(type="datetime")
     */
    protected $dateLastLogin;

    /**
     * Constructor
     */
    public function __construct()
    {
        try {
            $this->roles         = [];
            $this->projects      = new ArrayCollection();
            $this->dateCreated   = new DateTime();
            $this->dateLastLogin = new DateTime();
        } catch (Exception $e) {
        }
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $email
     *
     * @return User
     */
    public function setEmail(string $email): User
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return string
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string $name
     *
     * @return User
     */
    public function setName(string $name): User
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return bool
     */
    public function isEnabled(): bool
    {
        return $this->isEnabled;
    }

    /**
     * @param bool $isEnabled
     *
     * @return User
     */
    public function setIsEnabled(bool $isEnabled): User
    {
        $this->isEnabled = $isEnabled;

        return $this;
    }

    /**
     * @return DateTime
     */
    public function getDateCreated(): DateTime
    {
        return $this->dateCreated;
    }

    /**
     * @param DateTime $dateCreated
     *
     * @return User
     */
    public function setDateCreated(DateTime $dateCreated): User
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }

    /**
     * @return DateTime
     */
    public function getDateLastLogin(): DateTime
    {
        return $this->dateLastLogin;
    }

    /**
     * @param DateTime $dateLastLogin
     *
     * @return User
     */
    public function setDateLastLogin(DateTime $dateLastLogin): User
    {
        $this->dateLastLogin = $dateLastLogin;

        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function getRoles()
    {
        return $this->roles;
    }

    /**
     * @param string $role
     *
     * @return bool
     */
    public function hasRole($role): bool
    {
        return in_array(strtoupper($role), $this->getRoles(), true);
    }

    /**
     * @param array $roles
     *
     * @return User
     */
    public function setRoles(array $roles): User
    {
        $this->roles = [];
        foreach ($roles as $role) {
            $this->addRole($role);
        }

        return $this;
    }

    /**
     * @param string $role
     *
     * @return User
     */
    public function addRole($role): User
    {
        $role = strtoupper($role);
        if (!in_array($role, self::ROLES)) {
            throw new InvalidArgumentException(
                "Invalid role ${role}."
            );
        }
        if ($role !== self::ROLE_SUPER_ADMIN && !in_array($role, $this->roles, true)) {
            $this->roles[] = $role;
        }

        return $this;
    }

    /**
     * @param string $role
     *
     * @return User
     */
    public function removeRole($role): User
    {
        $role = strtoupper($role);
        if (!in_array($role, self::ROLES)) {
            throw new InvalidArgumentException(
                "Invalid role ${role}."
            );
        }

        $index = array_search($role, $this->roles);
        if ($index !== false) {
            unset($this->roles[$index]);
        }

        if (empty($this->roles)) {
            $this->roles = [self::ROLE_USER];
        }

        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @param string $password
     *
     * @return User
     */
    public function setPassword($password): User
    {
        $this->password = $password;

        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function getSalt()
    {
        return null;
    }

    /**
     * {@inheritDoc}
     */
    public function getUsername()
    {
        return $this->getEmail();
    }

    /**
     * {@inheritDoc}
     */
    public function eraseCredentials()
    {
        // Nothing here
    }
}
