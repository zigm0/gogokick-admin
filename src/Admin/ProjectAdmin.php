<?php
namespace App\Admin;

use App\Entity\Media;
use App\Entity\Project;
use App\Form\ProjectUserType;
use App\Media\CDNInterface;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\ORMException;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

/**
 * Class ProjectAdmin
 */
class ProjectAdmin extends AbstractAdmin
{
    /**
     * @var CDNInterface
     */
    protected $cdn;

    /**
     * @var Collection
     */
    protected $origTeam;

    /**
     * @param CDNInterface $cdn
     */
    public function setCDN(CDNInterface $cdn)
    {
        $this->cdn = $cdn;
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
        /** @var Project $subject */
        $subject = $this->getSubject();
        $this->origTeam = clone $subject->getTeam();

        $formMapper
            ->add('name', TextType::class)
            ->add('subtitle', TextareaType::class, [
                'required'   => false,
                'empty_data' => ''
            ])
            ->add('user', null, [
                'label' => 'Owner'
            ])
            ->add('imageFile', FileType::class, [
                'required' => false,
                'label'    => 'Image'
            ])
            ->add('isPublic')
            ->add('team', CollectionType::class, [
                'label'        => 'Team (Not including owner.)',
                'required'     => false,
                'entry_type'   => ProjectUserType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'delete_empty' => true
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
            ->add('user', null, [
                'label' => 'Owner'
            ])
            ->add('campaignTypeString', null, [
                'label' => 'Campaign Type'
            ])
            ->add('isPublic', null, [
                'label' => 'Public'
            ])
            ->add('dateCreated');
    }

    /**
     * @param $object
     *
     * @throws ORMException
     */
    public function prePersist($object)
    {
        $this->updateProject($object);
        parent::prePersist($object);
    }

    /**
     * @param $object
     *
     * @throws ORMException
     */
    public function preUpdate($object)
    {
        $this->updateProject($object);
        parent::preUpdate($object);
    }

    /**
     * @param Project $project
     *
     * @throws ORMException
     */
    protected function updateProject(Project $project)
    {
        if ($file = $project->getImageFile()) {
            $ext  = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
            $data = file_get_contents($file->getPathName());
            $path = sprintf('%d-%s.%s', microtime(true), uniqid(), $ext);
            $url  = $this->cdn->upload('project_images', $path, $data);

            $media = (new Media())
                ->setUrl($url)
                ->setSystem('project_images')
                ->setPath($path)
                ->setOrigFilename($file->getClientOriginalName())
                ->setUser($project->getUser());
            $project->setImage($media);

            $container = $this->getConfigurationPool()->getContainer();
            $em = $container->get('doctrine.orm.entity_manager');
            $em->persist($media);
            $em->flush();
        }

        $container = $this->getConfigurationPool()->getContainer();
        $em = $container->get('doctrine.orm.entity_manager');

        $team = $project->getTeam();
        foreach($team as $projectUser) {
            if (!$projectUser->getId()) {
                $projectUser->setProject($project);
                $em->persist($projectUser);
            }
        }

        foreach($this->origTeam as $projectUser) {
            if (!$team->contains($projectUser)) {
                $team->removeElement($projectUser);
                $em->remove($projectUser);
            }
        }
    }
}
