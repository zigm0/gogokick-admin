<?php
namespace App\Controller;

use App\Controller\Api\ApiController;
use App\Entity\Block;
use App\Entity\Invite;
use App\Entity\Project;
use App\Entity\ProjectUser;
use App\Repository\InviteRepository;
use Symfony\Component\HttpFoundation\RedirectResponse;
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

    /**
     * @Route("/invite/{id}/{hash}", name="invite_accept")
     *
     * @param int $id
     * @param string $hash
     * @param InviteRepository $repository
     */
    public function inviteAction($id, $hash, InviteRepository $repository)
    {
        $invite = $repository->findByID($id);
        if (!$invite || $invite->getHash() !== $hash || $invite->getStatus() !== Invite::STATUS_WAITING) {
            throw $this->createNotFoundException();
        }

        $user = $this->getUser();
        if (!$user) {
            return $this->redirectToRoute(
                'login',
                [
                    'back' => $this->generateUrl('invite_accept', ['id' => $id, 'hash' => $hash])
                ]
            );
        }

        $found = false;
        foreach($invite->getProject()->getTeam() as $projectUser) {
            if ($projectUser->getId() === $user->getId()) {
                $found = true;
                break;
            }
        }

        if (!$found) {
            $projectUser = (new ProjectUser())
                ->setProject($invite->getProject())
                ->setRoles($invite->getRoles())
                ->setUser($user);
            $this->em->persist($projectUser);
        }
        $invite->setStatus(Invite::STATUS_ACCEPTED);
        $this->em->flush();

        return new RedirectResponse('/editor/' . $invite->getProject()->getId());
    }
}
