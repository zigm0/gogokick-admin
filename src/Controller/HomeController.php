<?php
namespace App\Controller;

use App\Entity\Block;
use App\Entity\Project;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class HomeController
 */
class HomeController extends Controller
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
            'campaignTypes' => array_flip(Project::CAMPAIGN_TYPES)
        ];

        return $this->render('editor/index.html.twig', [
            'constants'    => $constants,
            'initialState' => [
                'editor'  => [],
                'project' => []
            ]
        ]);
    }
}
