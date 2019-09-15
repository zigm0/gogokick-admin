<?php
namespace App\Controller;

use App\Controller\Api\ApiController;
use App\Entity\Block;
use App\Entity\Project;
use App\Entity\ProjectUser;
use App\Repository\ProjectRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class HomeController
 */
class HomeController extends ApiController
{
    /**
     * @Route("/", name="home")
     *
     * @return Response
     */
    public function indexAction()
    {
        return $this->render('home/index.html.twig');
    }

    /**
     * @Route("/editor", name="editor")
     *
     * @param ProjectRepository $repository
     *
     * @return Response
     */
    public function editorAction(ProjectRepository $repository)
    {
        $constants = [
            'blockTypes'    => array_flip(Block::TYPES),
            'campaignTypes' => array_flip(Project::CAMPAIGN_TYPES),
            'projectRoles'  => array_flip(ProjectUser::ROLES)
        ];

        $user = [
            'id'              => 0,
            'name'            => 'Guest',
            'isAuthenticated' => false
        ];
        if ($this->getUser()) {
            $user = $this->arrayEntityGroup($this->getUser());
            $user['isAuthenticated'] = true;
        }

        $projects = $repository->createQueryBuilder('p')
            ->where('p.isPublic = 1')
            ->andWhere('p.isDeleted = 0')
            ->getQuery()
            ->execute();
        $projects = $this->arrayEntityGroup($projects);

        foreach($projects as &$project) {
            unset($project['user']);
            unset($project['blocks']);
            unset($project['team']);
            if (!empty($project['image'])) {
                unset($project['image']['user']);
            }
        }

        return $this->render('editor/index.html.twig', [
            'constants'    => $constants,
            'initialState' => [
                'editor'         => [],
                'project'        => [],
                'user'           => $user,
                'publicProjects' => $projects
            ]
        ]);
    }
}
