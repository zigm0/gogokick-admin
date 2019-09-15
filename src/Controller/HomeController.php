<?php
namespace App\Controller;

use App\Controller\Api\ApiController;
use App\Entity\Block;
use App\Entity\Project;
use App\Entity\ProjectUser;
use App\Repository\ProjectRepository;
use App\Repository\WatchRepository;
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
     * @param ProjectRepository $projectRepository
     * @param WatchRepository   $watchRepository
     *
     * @return Response
     */
    public function editorAction(ProjectRepository $projectRepository, WatchRepository $watchRepository)
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

        $projects = $projectRepository->createQueryBuilder('p')
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

        $watching = [];
        if ($user = $this->getUser()) {
            $watches = $watchRepository->findByUser($user);
            $watches = $this->arrayEntityGroup($watches);
            foreach ($watches as $watch) {
                $p = $watch['project'];
                unset($p['user']);
                unset($p['blocks']);
                unset($p['team']);
                $watching[] = $p;
            }
        }

        return $this->render('editor/index.html.twig', [
            'constants'    => $constants,
            'initialState' => [
                'editor'         => [],
                'project'        => [
                    'watching' => $watching
                ],
                'user'           => $user,
                'publicProjects' => $projects
            ]
        ]);
    }
}
