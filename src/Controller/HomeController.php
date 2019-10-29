<?php
namespace App\Controller;

use App\Controller\Api\ApiController;
use App\Entity\Activity;
use App\Entity\Block;
use App\Entity\Content;
use App\Entity\Project;
use App\Entity\ProjectUser;
use App\Repository\ActivityRepository;
use App\Repository\ContentRepository;
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
     * @param ProjectRepository  $projectRepository
     * @param WatchRepository    $watchRepository
     * @param ActivityRepository $activityRepository
     * @param ContentRepository  $contentRepository
     *
     * @return Response
     */
    public function editorAction(
        ProjectRepository $projectRepository,
        WatchRepository $watchRepository,
        ActivityRepository $activityRepository,
        ContentRepository $contentRepository
    )
    {
        $constants = [
            'blockTypes'    => array_flip(Block::TYPES),
            'campaignTypes' => array_flip(Project::CAMPAIGN_TYPES),
            'projectRoles'  => array_flip(ProjectUser::ROLES),
            'activityTypes' => array_flip(Activity::TYPES)
        ];

        $user = [
            'id'              => 0,
            'name'            => 'Guest',
            'isAuthenticated' => false
        ];
        if ($u = $this->getUser()) {
            $user = $this->arrayEntityGroup($u);
            $user['isAuthenticated'] = true;
        }

        $projects = [];
        if ($u = $this->getUser()) {
            $projects = $projectRepository->findByTeamMember($u);
            $projects = $this->arrayEntityGroup($projects);
            foreach($projects as &$project) {
                $uid = $project['user']['id'];
                unset($project['user']);
                unset($project['blocks']);
                unset($project['team']);
                if (!empty($project['image'])) {
                    unset($project['image']['user']);
                }
                $project['user'] = ['id' => $uid];
            }
        }

        $watching = [];
        if ($u = $this->getUser()) {
            $watches = $watchRepository->findByUser($u);
            $watches = $this->arrayEntityGroup($watches);
            foreach ($watches as $watch) {
                $p = $watch['project'];
                unset($p['user']);
                unset($p['blocks']);
                unset($p['team']);
                $watching[] = $p;
            }
        }

        $activities = [];
        if ($u = $this->getUser()) {
            $activities = $activityRepository->findByRelatedUser($u);
            $activities = $this->arrayEntityGroup($activities);
            foreach ($activities as &$activity) {
                $activity = $this->sanitizeActivity($activity);
            }
        }

        $mission = $contentRepository->findByName('mission');
        if (!$mission) {
            $mission = new Content();
        }

        return $this->render('editor/index.html.twig', [
            'constants'    => $constants,
            'initialState' => [
                'editor'         => [],
                'project'        => [
                    'watching' => $watching
                ],
                'user'           => $user,
                'publicProjects' => $projects,
                'activity'       => [
                    'activities' => $activities
                ],
                'content' => [
                    'mission' => [
                        'html'  => $mission->getHtml(),
                        'title' => $mission->getTitle()
                    ]
                ]
            ]
        ]);
    }
}
