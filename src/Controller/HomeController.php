<?php
namespace App\Controller;

use App\Controller\Api\ApiController;
use App\Entity\Block;
use App\Entity\Project;
use App\Entity\ProjectUser;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class HomeController
 */
class HomeController extends ApiController
{
    /**
     * @Route("/", name="home")
     */
    public function indexAction()
    {
        return $this->render('home/index.html.twig');
    }

    /**
     * @Route("/editor", name="editor")
     */
    public function editorAction()
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

        return $this->render('editor/index.html.twig', [
            'constants'    => $constants,
            'initialState' => [
                'editor'  => [],
                'project' => [],
                'user'    => $user
            ]
        ]);
    }
}
