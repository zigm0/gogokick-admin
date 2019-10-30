<?php
namespace App\Admin;

use App\Entity\User;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Class UserAdmin
 */
class UserAdmin extends AbstractAdmin
{
    /**
     * @var UserPasswordEncoderInterface
     */
    protected $passwordEncoder;

    /**
     * @param UserPasswordEncoderInterface $passwordEncoder
     */
    public function setPasswordEncoder(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }


    /**
     * @param RouteCollection $collection
     */
    protected function configureRoutes(RouteCollection $collection)
    {
        $collection->remove('create');
    }

    /**
     * @param FormMapper $formMapper
     */
    protected function configureFormFields(FormMapper $formMapper)
    {
        /** @var User $subject */
        $subject = $this->getSubject();
        $social  = array_merge([
            'facebook'  => '',
            'twitter'   => '',
            'instagram' => '',
            'youtube'   => ''
        ], $subject->getSocial());
        $subject->setSocial($social);

        $formMapper
            ->add('isEnabled')
            ->add('name', TextType::class)
            ->add('email')
            ->add('password', PasswordType::class, [
                'required'   => false,
                'empty_data' => '',
                'help'       => 'Leave blank to keep existing password.'
            ])
            ->add('bio', TextareaType::class, [
                'required' => false
            ])
            ->add('skills', ChoiceType::class, [
                'label' => 'Skills',
                'multiple' => true,
                'required' => false,
                'choices' => [
                    'Copy Writer'  => 'Copy Writer',
                    'Graphics'     => 'Graphics',
                    'Video Editor' => 'Video Editor',
                    'Voice Talent' => 'Voice Talent'
                ]
            ])
            ->add('social', null, [
                'label' => false,
                'required' => false
            ])
            ->add('roles', ChoiceType::class, [
                'label' => 'Site Roles',
                'multiple' => true,
                'choices' => [
                    'User'  => 'ROLE_USER',
                    'Admin' => 'ROLE_ADMIN'
                ]
            ])
        ;
    }

    /**
     * @param DatagridMapper $datagridMapper
     */
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('name');
    }

    /**
     * @param ListMapper $listMapper
     */
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->add('id', NumberType::class)
            ->addIdentifier('name')
            ->add('email')
            ->add('isEnabled', null, [
                'label' => 'Enabled'
            ])
            ->add('dateLastLogin')
            ->add('dateCreated');
    }

    /**
     * @param $object
     */
    public function prePersist($object)
    {
        $this->updateUser($object);
        parent::prePersist($object);
    }

    /**
     * @param $object
     */
    public function preUpdate($object)
    {
        $this->updateUser($object);
        parent::preUpdate($object);
    }

    /**
     * @param User $user
     */
    public function updateUser(User $user)
    {
        if ($pass = $user->getPassword()) {
            $user->setPassword(
                $this->passwordEncoder->encodePassword($user, $pass)
            );
        }

        $roles = $user->getRoles();
        if (empty($roles)) {
            $user->setRoles(['ROLE_USER']);
        }
    }
}
